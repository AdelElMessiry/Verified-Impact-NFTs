import type { AWS } from '@serverless/typescript';

import tweetImage from '@functions/tweetImage';
import tweet from '@functions/tweet';

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
      TWITTER_API_KEY: 'M0BzKefRS2dvmUwWmy5coH5qM',
      TWITTER_API_SECRET: '34Nsv7mhPDuGlaJ0TF6He9y0WRNi2bqI0Dmeh4KO8J0up4FdUl',
      TWITTER_ACCESS_TOKEN:
        '1532370513527459842-ylXX94U8u6ejIeLAZZHtt0MxcfUPZy',
      TWITTER_ACCESS_SECRET: 'O5gxUUYghPWnS7gczXkqUPrVYvVHaua95me6NFXduiLR1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    tweetImage,
    tweet,
  },
};

module.exports = serverlessConfiguration;
