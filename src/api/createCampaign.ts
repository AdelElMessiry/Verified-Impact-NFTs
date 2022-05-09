import { cep47 } from '../lib/cep47';
import { CLPublicKey } from 'casper-js-sdk';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export interface ICampaignOptions {
  tokenId: string;
  name: string;
  description: string;
  wallet_address: string;
  url: string;
  requested_royalty: string;
  paymentAmount: string;
  deploySender: CLPublicKey;
}

export async function createCampaign(
  tokenId: string[],
  name: string,
  description: string,
  wallet_address: string,
  url: string,
  requested_royalty: string,
  paymentAmount: string,
  deploySender: CLPublicKey
) {
  const campaignDeploy = await cep47.createCampaign(
    tokenId,
    name,
    description,
    wallet_address,
    url,
    requested_royalty,
    paymentAmount,
    deploySender
  );
  console.log('Campaign Deploy deploy:', campaignDeploy);

  const signedCampaignDeploy = await signDeploy(campaignDeploy, deploySender);
  console.log('Signed Mint deploy:', signedCampaignDeploy);

  const campaignDeployHash = await signedCampaignDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', campaignDeployHash);
  return campaignDeployHash;
}
