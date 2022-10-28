import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_CAMPAIGN_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_CAMPAIGN_SAVED_KEY
    : `${process.env.REDIS_CAMPAIGN_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const updateCreator: APIGatewayProxyHandler = async (event) => {
  const { campaign }: any = event.body;

  try {
    await client.connect();
    let result = await client.lRange(REDIS_CAMPAIGN_KEY, 0, -1);

    let mappedResult = result.map((item) => JSON.parse(item));

    const campaignIndex: any = mappedResult.findIndex(
      ({ id }: any) => id === campaign.id
    );

    await client.lSet(
      REDIS_CAMPAIGN_KEY,
      campaignIndex,
      JSON.stringify(campaign)
    );

    mappedResult[campaignIndex] = campaign;

    client.quit();

    return MessageUtil.success({
      campaigns: mappedResult,
      message: 'Campaign updated Successfully',
    });
  } catch (err) {
    client.quit();
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }
};

export const main = middyfy(updateCreator);
