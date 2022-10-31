import { TwitterClient } from 'twitter-api-client';

const TWITTER_API_KEY =
  process.env.STAGE === 'dev'
    ? process.env.TWITTER_DEV_API_KEY
    : process.env.TWITTER_PROD_API_KEY;

const TWITTER_API_SECRET =
  process.env.STAGE === 'dev'
    ? process.env.TWITTER_DEV_API_SECRET
    : process.env.TWITTER_PROD_API_SECRET;

const TWITTER_ACCESS_TOKEN =
  process.env.STAGE === 'dev'
    ? process.env.TWITTER_DEV_ACCESS_TOKEN
    : process.env.TWITTER_PROD_ACCESS_TOKEN;

const TWITTER_ACCESS_SECRET =
  process.env.STAGE === 'dev'
    ? process.env.TWITTER_DEV_ACCESS_SECRET
    : process.env.TWITTER_PROD_ACCESS_SECRET;

export const twitterClient = new TwitterClient({
  apiKey: TWITTER_API_KEY,
  apiSecret: TWITTER_API_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessTokenSecret: TWITTER_ACCESS_SECRET,
});
