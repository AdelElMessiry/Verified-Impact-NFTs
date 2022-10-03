import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { createClient } from 'redis';

var client: any = createClient({
  url: `rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_REGION}-humble-slug-38588.upstash.io:38588`,
});

client.on('error', function (err: any) {
  console.log(err);

  throw err;
});

client.on('connect', function () {
  console.log('Connected!');
});

const addNFT: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const nft = event.pathParameters.nft;

  await client.rPush('nfts', nft);

  return formatJSONResponse({
    message: `NFT saved successfully!`,
  });
};

export const main = middyfy(addNFT);
