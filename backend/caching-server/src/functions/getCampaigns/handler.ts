import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { cep47 } from '@libs/cep47';
import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_CAMPAIGN_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_CAMPAIGN_SAVED_KEY
    : `${process.env.REDIS_CAMPAIGN_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const parseCampaign = (maybeValue: any) => {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
};

const getCampaignsList = async (countFrom: number, count: number) => {
  // const campaignCount: any = await cep47.totalCampaigns();

  const campaignsList: any = [];
  for (let id of Array.from(Array(count - countFrom).keys())) {
    try {
      id = id + countFrom + 1;
      const rawCampaign = await cep47.getCampaign(id.toString());

      const parsedCampaigns = parseCampaign(rawCampaign);

      parsedCampaigns.wallet_address =
        parsedCampaigns.wallet_address.includes('Account') ||
        parsedCampaigns.wallet_address.includes('Key')
          ? parsedCampaigns.wallet_address.includes('Account')
            ? parsedCampaigns.wallet_address.slice(13).replace(')', '')
            : parsedCampaigns.wallet_address.slice(10).replace(')', '')
          : parsedCampaigns.wallet_address;

      parsedCampaigns.beneficiary_address =
        parsedCampaigns.beneficiary_address.includes('Account') ||
        parsedCampaigns.beneficiary_address.includes('Key')
          ? parsedCampaigns.beneficiary_address.includes('Account')
            ? parsedCampaigns.beneficiary_address.slice(13).replace(')', '')
            : parsedCampaigns.beneficiary_address.slice(10).replace(')', '')
          : parsedCampaigns.beneficiary_address;

      await client.rPush(REDIS_CAMPAIGN_KEY, JSON.stringify(parsedCampaigns));
      campaignsList.push(parsedCampaigns);
    } catch (err) {
      return { err };
    }
  }

  return campaignsList;
};

const getCampaigns: APIGatewayProxyHandler = async () => {
  await client.connect();
  let result: any;
  // await client.del(REDIS_CAMPAIGN_KEY);
  try {
    result = await client.lRange(REDIS_CAMPAIGN_KEY, 0, -1);
  } catch (err) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }

  const campaignCount: any = await cep47.totalCampaigns();
  const mappedResult = result.map((item) => JSON.parse(item));
  const countFrom =
    result &&
    parseInt(campaignCount) - result?.length > 0 &&
    parseInt(campaignCount) - result?.length;

  console.log(parseInt(campaignCount));
  console.log(result?.length);
  console.log(countFrom);

  if (!countFrom && result?.length > 0) {
    client.quit();
    return MessageUtil.success({
      list: mappedResult,
    });
  } else {
    const list: any = await getCampaignsList(
      result.length,
      parseInt(campaignCount)
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

export const main = middyfy(getCampaigns);
