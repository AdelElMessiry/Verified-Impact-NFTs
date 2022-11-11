import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageUtil } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { profileClient } from '@libs/profile';
import { HttpStatusCode } from '@libs/HttpStatusCode';
import { client } from '@utils/redisClient';

const REDIS_PROFILE_KEY =
  process.env.STAGE === 'prod' || process.env.STAGE === 'dev'
    ? process.env.REDIS_PROFILE_SAVED_KEY
    : `${process.env.REDIS_PROFILE_SAVED_KEY.split(process.env.STAGE)[0]}dev`;

const getProfilesList = async (profilesAddList: string[]) => {
  const mappedProfiles: any = [];

  let uniqueProfilesAddList: string[] = [...new Set(profilesAddList)];

  for (const address of uniqueProfilesAddList) {
    try {
      const profile: any = await profileClient.getProfile(address, true);

      await client.rPush(REDIS_PROFILE_KEY, JSON.stringify(profile));
      mappedProfiles.push(profile);
    } catch (err) {
      return { err };
    }
  }

  return mappedProfiles;
};

const getProfiles: APIGatewayProxyHandler = async () => {
  await client.connect();
  await client.del(REDIS_PROFILE_KEY);
  let cachedProfile: any;
  try {
    cachedProfile = await client.lRange(REDIS_PROFILE_KEY, 0, -1);
  } catch (err) {
    return MessageUtil.error(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      err.message ? err.message : 'upstash Error'
    );
  }

  let profilesAddList = await profileClient.profilesAddList();
  const profilesCount: any = profilesAddList.length;

  const countFrom =
    cachedProfile &&
    parseInt(profilesCount) - cachedProfile?.length > 0 &&
    parseInt(profilesCount) - cachedProfile?.length;

  // let profilesAddList = await profileClient.profilesAddList();

  profilesAddList = profilesAddList.slice(cachedProfile?.length, profilesCount);

  const mappedResult = cachedProfile.map((item) => JSON.parse(item));
  if (!countFrom && cachedProfile?.length > 0) {
    client.quit();
    return MessageUtil.success({
      list: mappedResult,
    });
  } else {
    const list: any = await getProfilesList(profilesAddList);
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

export const main = middyfy(getProfiles);
