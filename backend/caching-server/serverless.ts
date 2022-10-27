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
        '344737ec7175f105ca6dcd5e9eaff886f5a684e5492c168d0fd418c9c754c3ab',
      NFT_PACKAGE_HASH_DEV:
        'fc4aca70bfc4fc084ecb22ef1c3602323e1b5fdb1bc3f409da8415c59fbbced7',
      NFT_CONTRACT_HASH_PROD:
        '2a1b76bd94b0fc0e68cceb504952294e3706a76ec191cd02960af825a0786a1e',
      NFT_PACKAGE_HASH_PROD:
        '656bd7e7c2c00aebbea182d63a15f49577e2a1d34d176ef83086cbe678b43963',
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
