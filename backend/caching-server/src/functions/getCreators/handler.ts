import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { cep47 } from '@libs/cep47';
import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_CREATOR_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_CREATOR_SAVED_KEY
    : `${process.env.REDIS_CREATOR_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const parseCreator = (maybeValue: any) => {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
};

const getCreatorsList = async (countFrom: number, count: number) => {
  const creatorsList: any = [];
  for (let id of Array.from(Array(count - countFrom).keys())) {
    try {
      id = id + countFrom + 1;

      const rawCreator = await cep47.getCreator(id.toString());

      const parsedCreator = parseCreator(rawCreator);
      parsedCreator.address =
        parsedCreator.address.includes('Account') ||
        parsedCreator.address.includes('Key')
          ? parsedCreator.address.includes('Account')
            ? parsedCreator.address.slice(13).replace(')', '')
            : parsedCreator.address.slice(10).replace(')', '')
          : parsedCreator.address;

      await client.rPush(REDIS_CREATOR_KEY, JSON.stringify(parsedCreator));
      creatorsList.push(parsedCreator);
    } catch (err) {
      return { err };
    }
  }

  return creatorsList;
};

const getCreators: APIGatewayProxyHandler = async () => {
  await client.connect();
  // await client.del(REDIS_CREATOR_KEY);
  let result: any;
  try {
    result = await client.lRange(REDIS_CREATOR_KEY, 0, -1);
  } catch (err) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }

  const creatorsCount: any = await cep47.totalCreators();
  const countFrom =
    result &&
    parseInt(creatorsCount) - result?.length > 0 &&
    parseInt(creatorsCount) - result?.length;

  const mappedResult = result.map((item) => JSON.parse(item));
  if (!countFrom && result?.length > 0) {
    client.quit();
    return MessageUtil.success({
      list: mappedResult,
    });
  } else {
    const list: any = await getCreatorsList(
      result.length,
      parseInt(creatorsCount)
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

export const main = middyfy(getCreators);
