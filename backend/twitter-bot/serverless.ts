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
      TWITTER_DEV_API_KEY: '57FWoqGipnwc6T0Rrd2iblpCT',
      TWITTER_DEV_API_SECRET:
        'aB2LvyANGJUI8nAqiy1cvVOvmt4k7meJxFe5ItRDOy7xLxyjpo',
      TWITTER_DEV_ACCESS_TOKEN:
        '271113077-raK4AOs4nDCHJxuQ6Eo6H0oZdKa8yApydGfDdSpA',
      TWITTER_DEV_ACCESS_SECRET:
        'KrVzI33GhwzHwFgHwq1iadZzQxoKe44YzwTXPkopJCNYy',

      TWITTER_PROD_API_KEY: 'M0BzKefRS2dvmUwWmy5coH5qM',
      TWITTER_PROD_API_SECRET:
        '34Nsv7mhPDuGlaJ0TF6He9y0WRNi2bqI0Dmeh4KO8J0up4FdUl',
      TWITTER_PROD_ACCESS_TOKEN:
        '1532370513527459842-ylXX94U8u6ejIeLAZZHtt0MxcfUPZy',
      TWITTER_PROD_ACCESS_SECRET:
        'O5gxUUYghPWnS7gczXkqUPrVYvVHaua95me6NFXduiLR1',

      STAGE: '${opt:stage}',
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
