import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_PROFILE_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_PROFILE_SAVED_KEY
    : `${process.env.REDIS_PROFILE_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const updateProfile: APIGatewayProxyHandler = async (event) => {
  const { profile }: any = event.body;

  try {
    await client.connect();
    let result = await client.lRange(REDIS_PROFILE_KEY, 0, -1);

    let mappedResult = result.map((item) => JSON.parse(item));

    const profileIndex: any = mappedResult.findIndex(
      ({ address }: any) => address === profile.address
    );

    await client.lSet(REDIS_PROFILE_KEY, profileIndex, JSON.stringify(profile));
    mappedResult[profileIndex] = profile;
    client.quit();

    return MessageUtil.success({
      profiles: mappedResult,
      message: 'Profile updated Successfully',
    });
  } catch (err) {
    client.quit();
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }
};

export const main = middyfy(updateProfile);
