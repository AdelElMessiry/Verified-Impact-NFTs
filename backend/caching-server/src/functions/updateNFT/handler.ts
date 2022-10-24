import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createClient } from 'redis';

import { HttpStatusCode } from '@libs/HttpStatusCode';

const client = createClient({
  url: `rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_REGION}-solid-husky-38167.upstash.io:38167`,
});

client.on('connect', function () {
  console.log('Connected!');
});

const updateNFT: APIGatewayProxyHandler = async (event) => {
  const { nft }: any = event.body;

  try {
    await client.connect();
    let result = await client.lRange('l_nfts_dev', 0, -1);

    let mappedResult = result.map((item) => JSON.parse(item));

    const toBeDeleted = mappedResult.find(
      ({ tokenId }) => tokenId === nft.tokenId
    );

    mappedResult = mappedResult.filter(
      ({ tokenId }) => tokenId !== nft.tokenId
    );
    mappedResult.push(nft);

    await client.lRem('l_nfts_dev', 0, JSON.stringify(toBeDeleted));
    await client.rPush('l_nfts_dev', JSON.stringify(nft));

    client.quit();

    return MessageUtil.success({
      nfts: mappedResult,
      message: 'NFT updated Successfully',
    });
  } catch (err) {
    client.quit();
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }
};

export const main = middyfy(updateNFT);
