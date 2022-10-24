import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { createClient } from 'redis';

const REDIS_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_SAVED_KEY
    : `${process.env.REDIS_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const client: any = createClient({
  url: `rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_REGION}-humble-slug-38588.upstash.io:38588`,
});

client.on('error', function (err: any) {
  console.log(err);

  throw err;
});

client.on('connect', function () {
  console.log('Connected!');
});

const addNFT: APIGatewayProxyHandler = async (event) => {
  const nft = event.pathParameters.nft;

  await client.rPush(REDIS_KEY, nft);

  return MessageUtil.success({
    message: `NFT saved successfully!`,
  });
};

export const main = middyfy(addNFT);
