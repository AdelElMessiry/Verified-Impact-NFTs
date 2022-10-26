import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_COLLECTION_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_COLLECTION_SAVED_KEY
    : `${
        process.env.REDIS_COLLECTION_SAVED_KEY.split(process.env.STAGE)[0]
      }dev`;

const updateCollection: APIGatewayProxyHandler = async (event) => {
  const { collection }: any = event.body;

  try {
    await client.connect();
    let result = await client.lRange(REDIS_COLLECTION_KEY, 0, -1);

    let mappedResult = result.map((item) => JSON.parse(item));

    const collectionIndex: any = mappedResult.findIndex(
      ({ creator }: any) => creator === collection.creator
    );

    await client.lRem(REDIS_COLLECTION_KEY, 0, JSON.stringify(collection));
    await client.lSet(
      REDIS_COLLECTION_KEY,
      collectionIndex,
      JSON.stringify(collection)
    );

    client.quit();

    return MessageUtil.success({
      collections: mappedResult,
      message: 'Profile updated Successfully',
    });
  } catch (err) {
    client.quit();
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }
};

export const main = middyfy(updateCollection);
