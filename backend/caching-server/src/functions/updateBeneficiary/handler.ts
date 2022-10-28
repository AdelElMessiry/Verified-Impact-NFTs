import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_BENEFICIARY_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_BENEFICIARY_SAVED_KEY
    : `${
        process.env.REDIS_BENEFICIARY_SAVED_KEY.split(process.env.STAGE)[0]
      }dev`;

const updateBeneficiary: APIGatewayProxyHandler = async (event) => {
  const { beneficiary }: any = event.body;

  try {
    await client.connect();
    let result = await client.lRange(REDIS_BENEFICIARY_KEY, 0, -1);

    let mappedResult = result.map((item) => JSON.parse(item));

    const beneficiaryIndex: any = mappedResult.findIndex(
      ({ address }: any) => address === beneficiary.address
    );
    // const toBeDeleted = mappedResult.find(
    //   ({ address }: any) => address === beneficiary.address
    // );

    await client.lSet(
      REDIS_BENEFICIARY_KEY,
      beneficiaryIndex,
      JSON.stringify(beneficiary)
    );

    mappedResult[beneficiaryIndex] = beneficiary;

    client.quit();

    return MessageUtil.success({
      beneficiaries: mappedResult,
      message: 'Beneficiary updated Successfully',
    });
  } catch (err) {
    client.quit();
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }
};

export const main = middyfy(updateBeneficiary);
