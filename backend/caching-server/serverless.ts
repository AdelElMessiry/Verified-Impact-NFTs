import type { AWS } from '@serverless/typescript';

import getNFTs from '@functions/getNFTs';
import getBeneficiaries from '@functions/getBeneficiaries';
import getCampaigns from '@functions/getCampaigns';
import getCollections from '@functions/getCollections';
import getCreators from '@functions/getCreators';
import getProfiles from '@functions/getProfiles';

import updateNFT from '@functions/updateNFT';
import updateBeneficiary from '@functions/updateBeneficiary';
import updateCampaign from '@functions/updateCampaign';
import updateCollection from '@functions/updateCollection';
import updateCreator from '@functions/updateCreator';
import updateProfile from '@functions/updateProfile';

import addNFT from '@functions/addNFT';

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
        '7446c47d27e1c6fdb1bfd7e8902bd4744d7c8ab577ca5d0a4b3174c6d38a6e4a',
      NFT_PACKAGE_HASH_DEV:
        '756320792afb408d9695775a691f9e52f462951e977783f425a4ad0569fa3ae3',
      PROFILE_CONTRACT_HASH_DEV:
        'bf8d97daa5a2be66fd2196d35f7125e1d3f06b868a3895ecb6960a0e87c228f5',
      PROFILE_PACKAGE_HASH_DEV:
        '6fb4c20fb59edc63f5c201cbb0718a5c5119b3a07be6e65f7d46a305fc66e29d',

      NFT_CONTRACT_HASH_PROD:
        '2a1b76bd94b0fc0e68cceb504952294e3706a76ec191cd02960af825a0786a1e',
      NFT_PACKAGE_HASH_PROD:
        '656bd7e7c2c00aebbea182d63a15f49577e2a1d34d176ef83086cbe678b43963',
      PROFILE_CONTRACT_HASH_PROD:
        '51609eb410f1a6d1485968521ec125231ea99f752fbde32fc317ff412e139572',
      PROFILE_PACKAGE_HASH_PROD:
        '49c52cb907c89e984af930bae087decefe0484704e89e3f9924f0c6007fe5cd5',

      REDIS_NFT_SAVED_KEY: 'l_nfts_${opt:stage}',
      REDIS_BENEFICIARY_SAVED_KEY: 'l_beneficiaries_${opt:stage}',
      REDIS_COLLECTION_SAVED_KEY: 'l_collections_${opt:stage}',
      REDIS_CAMPAIGN_SAVED_KEY: 'l_campaigns_${opt:stage}',
      REDIS_CREATOR_SAVED_KEY: 'l_creators_${opt:stage}',
      REDIS_PROFILE_SAVED_KEY: 'l_profiles_${opt:stage}',
      STAGE: '${opt:stage}',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    addNFT,
    getNFTs,
    getBeneficiaries,
    getCampaigns,
    getCollections,
    getCreators,
    getProfiles,
    updateBeneficiary,
    updateCampaign,
    updateCollection,
    updateCreator,
    updateProfile,
    updateNFT,
  },
};

module.exports = serverlessConfiguration;
