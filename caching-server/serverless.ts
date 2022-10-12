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
        '188d500514e1098514e28b00ce5bd1bba33d0a41561d9bd16e3f483e407ec27f',
      NFT_PACKAGE_HASH:
        '8b3ca965ef2632a08a44a5ec326c79e8e7b333464974f242bd0f65e060e2842e',
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
