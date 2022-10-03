import type { AWS } from '@serverless/typescript';

import addNFT from '@functions/addNFT';
import getNFTs from '@functions/getNFTs';

const serverlessConfiguration: AWS = {
  service: 'caching-server-api',
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
      UPSTASH_PASSWORD: 'ba50e22dbca849bcbd2cae68bdb2f6a8',
      UPSTASH_REGION: 'us1',
      NODE_RPC_ADDRESS: 'https://node-clarity-testnet.make.services/rpc',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    addNFT,
    getNFTs,
  },
};

module.exports = serverlessConfiguration;
