import type { AWS } from '@serverless/typescript';

import getNFTs from '@functions/getNFTs';
import addNFT from '@functions/addNFT';
import updateNFT from '@functions/updateNFT';

const serverlessConfiguration: AWS = {
  service: 'caching-api',
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
      UPSTASH_PASSWORD: 'a5502b15d64d42e4b08c29d81e5b0a44',
      UPSTASH_REGION: 'us1',
      NODE_RPC_ADDRESS: 'https://node-clarity-testnet.make.services/rpc',
      NFT_CONTRACT_HASH:
        '2d6842ba80bbc66bc88d1ccfa8c3a923bc5a786b5f2194ac74b47f4a4e3e5917',
      NFT_PACKAGE_HASH:
        'fc4aca70bfc4fc084ecb22ef1c3602323e1b5fdb1bc3f409da8415c59fbbced7',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    addNFT,
    getNFTs,
    updateNFT,
  },
};

module.exports = serverlessConfiguration;
