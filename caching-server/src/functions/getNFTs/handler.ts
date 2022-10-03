import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
// import * as AWS from 'aws-sdk';
import { createClient } from 'redis';

import { cep47 } from '@libs/cep47';

const client = createClient({
  url: `rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_REGION}-humble-slug-38588.upstash.io:38588`,
});

client.on('error', function (err: any) {
  console.log(err);

  throw err;
});

client.on('connect', function () {
  console.log('Connected!');
});

const getNFTsList = async (countFrom: number, count: number) => {
  const nftsList = [];
  for (let tokenId of Array.from(Array(count).keys())) {
    tokenId = tokenId + countFrom + 1;

    const nft_metadata = await cep47.getMappedTokenMeta(tokenId.toString());

    nftsList.push({ ...nft_metadata, tokenId });

    console.log(nftsList);
  }

  for (let token of nftsList) {
    await client.rPush('nfts', JSON.stringify(token));
  }

  return nftsList;
};

const getNFTs: APIGatewayProxyHandler = async () => {
  await client.connect();

  const result = await client.lRange('nfts', 0, -1);
  const nftsCount: any = await cep47.totalSupply();
  const countFrom =
    parseInt(nftsCount) - result.length > 0 &&
    parseInt(nftsCount) - result.length;

  if (!countFrom && result.length > 0) {
    return formatJSONResponse({
      list: result,
    });
  } else {
    const list = await getNFTsList(result.length, parseInt(nftsCount)).catch(
      (err) =>
        formatJSONResponse(
          {
            error: err.message ? err.message : 'RPC Error',
          },
          404
        )
    );
    return formatJSONResponse({
      list,
    });
  }
};

export const main = middyfy(getNFTs);
