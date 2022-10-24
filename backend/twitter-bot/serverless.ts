import type { AWS } from '@serverless/typescript';

import tweetImage from '@functions/tweetImage';

const serverlessConfiguration: AWS = {
  service: 'twitter-bot-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TWITTER_API_KEY: 'QKROMDiLhTxpxFEabmmKZzVqa',
      TWITTER_API_SECRET: 'XajhDY2fPi1ALvLOFVFOJl7Fbp05118ORXjpsfBtb2cJq9mE5H',
      TWITTER_ACCESS_TOKEN:
        '1532370513527459842-tqnNwy0Zf9tzrPOIIkEbbb22kmI1zy',
      TWITTER_ACCESS_SECRET: '2EcG3IP1eU936ED6jLlYPoV9WqvgNryLpwMvwyGioB4vx',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    tweetImage,
  },
};

module.exports = serverlessConfiguration;
