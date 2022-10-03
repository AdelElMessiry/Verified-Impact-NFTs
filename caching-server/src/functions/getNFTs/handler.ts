import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse, apiResponses } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createClient } from 'redis';

import { cep47 } from '@libs/cep47';

const client = createClient({
  url: `rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_REGION}-solid-husky-38167.upstash.io:38167`,
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
    await client.rPush('nfts', JSON.stringify({ ...nft_metadata, tokenId }));
    nftsList.push({ ...nft_metadata, tokenId });
  }

  return nftsList;
};

const getNFTs: APIGatewayProxyHandler = async () => {
  await client.connect();
  let result: any;
  try {
    result = await client.lRange('nfts', 0, -1);
  } catch (err) {
    return formatJSONResponse(
      {
        error: err.message ? err.message : 'upstash Error',
      },
      404
    );
  }

  const nftsCount: any = await cep47.totalSupply();
  const countFrom =
    result &&
    parseInt(nftsCount) - result?.length > 0 &&
    parseInt(nftsCount) - result?.length;

  if (!countFrom && result?.length > 0) {
    const mappedResult = result.map((item) => JSON.parse(item));
    return formatJSONResponse({
      list: mappedResult,
    });
  } else {
    const list = await getNFTsList(result.length, parseInt(nftsCount)).catch(
      (err) =>
        formatJSONResponse(
          {
            error: err.message ? err.message : 'RPC Error',
          },
          err.code
        )
    );
    return formatJSONResponse({
      list,
    });
  }
};

export const main = middyfy(getNFTs);
