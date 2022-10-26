import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { cep47 } from '@libs/cep47';
import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_COLLECTION_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_COLLECTION_SAVED_KEY
    : `${
        process.env.REDIS_COLLECTION_SAVED_KEY.split(process.env.STAGE)[0]
      }dev`;

const parseCollection = (maybeValue: any) => {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
};

const getCollectionsList = async (countFrom: number, count: number) => {
  const collectionsList: any = [];

  for (let id of Array.from(Array(count - countFrom).keys())) {
    try {
      id = id + countFrom + 1;

      const rawCollection = await cep47.getCollection(id.toString());

      const parsedCollection = parseCollection(rawCollection);
      parsedCollection.creator =
        parsedCollection.creator.includes('Account') ||
        parsedCollection.creator.includes('Key')
          ? parsedCollection.creator.includes('Account')
            ? parsedCollection.creator.slice(13).replace(')', '')
            : parsedCollection.creator.slice(10).replace(')', '')
          : parsedCollection.creator;

      await client.rPush(
        REDIS_COLLECTION_KEY,
        JSON.stringify(parsedCollection)
      );
      collectionsList.push(parsedCollection);
    } catch (err) {
      return { err };
    }
  }

  return collectionsList;
};

const getCollections: APIGatewayProxyHandler = async () => {
  await client.connect();
  let result: any;
  try {
    result = await client.lRange(REDIS_COLLECTION_KEY, 0, -1);
  } catch (err) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }

  const collectionsCount: any = await cep47.totalCollections();
  const mappedResult = result.map((item) => JSON.parse(item));
  const countFrom =
    result &&
    parseInt(collectionsCount) - result?.length > 0 &&
    parseInt(collectionsCount) - result?.length;

  if (!countFrom && result?.length > 0) {
    client.quit();
    return MessageUtil.success({
      list: mappedResult,
    });
  } else {
    const list: any = await getCollectionsList(
      result.length,
      parseInt(collectionsCount)
    );
    if (list.err) {
      client.quit();
      return MessageUtil.error(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        list.err.message ? list.err.message : 'upstash Error'
      );
    }

    client.quit();
    return MessageUtil.success({
      list: [...mappedResult, ...list],
    });
  }
};

export const main = middyfy(getCollections);
