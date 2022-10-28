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
      NODE_RPC_TESTNET_ADDRESS:
        'https://node-clarity-testnet.make.services/rpc',
      NODE_RPC_MAINNET_ADDRESS:
        'https://gstiugzrmk.execute-api.us-east-1.amazonaws.com/dev/?url=https://node-clarity-mainnet.make.services/rpc',
      NFT_CONTRACT_HASH_DEV:
        '2d6842ba80bbc66bc88d1ccfa8c3a923bc5a786b5f2194ac74b47f4a4e3e5917',
      NFT_PACKAGE_HASH_DEV:
        'fc4aca70bfc4fc084ecb22ef1c3602323e1b5fdb1bc3f409da8415c59fbbced7',
      NFT_CONTRACT_HASH_PROD:
        'ca3b53caee78e6e2021218079cfe10972b6f74b00d6f97f13bf03014aceffe3f',
      NFT_PACKAGE_HASH_PROD:
        '656bd7e7c2c00aebbea182d63a15f49577e2a1d34d176ef83086cbe678b43963',
      REDIS_SAVED_KEY: 'l_nfts_${opt:stage}_',
      STAGE: '${opt:stage}',
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
