import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createClient } from 'redis';

import { cep47 } from '@libs/cep47';
import { HttpStatusCode } from '@libs/HttpStatusCode';

const REDIS_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_SAVED_KEY
    : `${process.env.REDIS_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const client = createClient({
  url: `rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_REGION}-solid-husky-38167.upstash.io:38167`,
});

client.on('connect', function () {
  console.log('Connected!');
});

const getNFTsList = async (countFrom: number, count: number) => {
  const nftsList: any = [];

  for (let tokenId of Array.from(Array(count - countFrom).keys())) {
    tokenId = tokenId + countFrom + 1;

    const nft_metadata = await cep47.getMappedTokenMeta(tokenId.toString());
    await client.rPush(REDIS_KEY, JSON.stringify({ ...nft_metadata, tokenId }));
    nftsList.push({ ...nft_metadata, tokenId });
  }

  return nftsList;
};

const getNFTs: APIGatewayProxyHandler = async (event) => {
  await client.connect();
  let result: any;
  try {
    result = await client.lRange(REDIS_KEY, 0, -1);
  } catch (err) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }

  const nftsCount: any = await cep47.totalSupply();
  const countFrom =
    result &&
    parseInt(nftsCount) - result?.length > 0 &&
    parseInt(nftsCount) - result?.length;

  const mappedResult = result.map((item) => JSON.parse(item));
  if (!countFrom && result?.length > 0) {
    client.quit();
    return MessageUtil.success({
      list: mappedResult,
    });
  } else {
    const list: any = await getNFTsList(
      result.length,
      parseInt(nftsCount)
    ).catch((err) => {
      client.quit();
      return MessageUtil.error(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        err.message ? err.message : 'upstash Error'
      );
    });

    client.quit();
    return MessageUtil.success({
      list: [...mappedResult, ...list],
    });
  }
};

export const main = middyfy(getNFTs);
