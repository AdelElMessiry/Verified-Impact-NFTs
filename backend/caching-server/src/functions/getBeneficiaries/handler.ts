import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { cep47 } from '@libs/cep47';
import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_BENEFICIARY_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_BENEFICIARY_SAVED_KEY
    : `${
        process.env.REDIS_BENEFICIARY_SAVED_KEY.split(process.env.STAGE)[0]
      }dev`;

const parseBeneficiary = (maybeValue: any) => {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
};

const getBeneficiariesList = async (beneficiariesAddList) => {
  // const list: any = await cep47.getBeneficiariesList();

  const _beneficiariesList: any = [];
  for (const address of beneficiariesAddList) {
    await cep47
      .getBeneficiary(address.toString(), true)
      .then(async (rawBeneficiary: any) => {
        const parsedBeneficiary = parseBeneficiary(rawBeneficiary);
        parsedBeneficiary.address =
          parsedBeneficiary.address.includes('Account') ||
          parsedBeneficiary.address.includes('Key')
            ? parsedBeneficiary.address.includes('Account')
              ? parsedBeneficiary.address.slice(13).replace(')', '')
              : parsedBeneficiary.address.slice(10).replace(')', '')
            : parsedBeneficiary.address;

        await client.rPush(
          REDIS_BENEFICIARY_KEY,
          JSON.stringify(parsedBeneficiary)
        );
        _beneficiariesList.push(parsedBeneficiary);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return _beneficiariesList;
};

const getBeneficiaries: APIGatewayProxyHandler = async () => {
  await client.connect();
  let cachedBeneficiary: any;
  try {
    cachedBeneficiary = await client.lRange(REDIS_BENEFICIARY_KEY, 0, -1);
  } catch (err) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }

  const beneficiariesCount: any = await cep47.totalBeneficiaries();

  const countFrom =
    cachedBeneficiary &&
    parseInt(beneficiariesCount) - cachedBeneficiary?.length > 0 &&
    parseInt(beneficiariesCount) - cachedBeneficiary?.length;

  let beneficiariesAddList = await cep47.getBeneficiariesAddList();
  beneficiariesAddList = beneficiariesAddList[countFrom];

  const mappedResult = cachedBeneficiary.map((item) => JSON.parse(item));
  if (!countFrom && cachedBeneficiary?.length > 0) {
    client.quit();
    return MessageUtil.success({
      list: mappedResult,
    });
  } else {
    const list: any = await getBeneficiariesList(beneficiariesAddList).catch(
      (err) => {
        client.quit();
        return MessageUtil.error(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          err.message ? err.message : 'upstash Error'
        );
      }
    );

    client.quit();
    return MessageUtil.success({
      list: [...mappedResult, ...list],
    });
  }
};

export const main = middyfy(getBeneficiaries);
