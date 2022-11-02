import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_CREATOR_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_CREATOR_SAVED_KEY
    : `${process.env.REDIS_CREATOR_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const updateCreator: APIGatewayProxyHandler = async (event) => {
  const { creator }: any = event.body;

  try {
    await client.connect();
    let result = await client.lRange(REDIS_CREATOR_KEY, 0, -1);

    let mappedResult = result.map((item) => JSON.parse(item));

    const creatorIndex: any = mappedResult.findIndex(
      ({ address }: any) => address === creator.address
    );
    await client.lSet(REDIS_CREATOR_KEY, creatorIndex, JSON.stringify(creator));
    mappedResult[creatorIndex] = creator;

    client.quit();

    return MessageUtil.success({
      creators: mappedResult,
      message: 'Creator updated Successfully',
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
