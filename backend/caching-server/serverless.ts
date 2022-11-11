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
        '27d3e7ce6428678a29e10e29d770d58cb2321a6b7ddede4a9170356f482d3953',
      NFT_PACKAGE_HASH_DEV:
        'b0b0887c55923fba6ba81e187c85d94982f1f3473cc9b96df41aa43c946d8651',
      PROFILE_CONTRACT_HASH_DEV:
        '6b2f8995932ac20cb7cf10f569c450281086a7ccca64a881e219d8b67204e524',
      PROFILE_PACKAGE_HASH_DEV:
        '06940afb3f39d129865de8b885ec96e0f33de6eafa34e6b5bad67d99dd6b0c7d',

      NFT_CONTRACT_HASH_PROD:
        '43d9e895f62bc6aba7cd3e2b93cc7b1236707a7d15d756c962b20783217d913c',
      NFT_PACKAGE_HASH_PROD:
        '656bd7e7c2c00aebbea182d63a15f49577e2a1d34d176ef83086cbe678b43963',
      PROFILE_CONTRACT_HASH_PROD:
        '81f1e6583eca92d2ffb3d48a7fff0ccfa7d36435e41b70e200f6db7c8b1e5d51',
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
