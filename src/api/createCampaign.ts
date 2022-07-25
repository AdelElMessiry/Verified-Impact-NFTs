import { CLPublicKey, CLValueBuilder } from 'casper-js-sdk';

import { cep47 } from '../lib/cep47';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export interface ICampaignOptions {
  // tokenId: string;
  name: string;
  description: string;
  wallet_address: string;
  url: string;
  requested_royalty: string;
  paymentAmount: string;
  deploySender: CLPublicKey;
}

export async function createCampaign(
  // tokenId: string[],
  name: string,
  description: string,
  wallet_address: string,
  url: string,
  requested_royalty: string,
  // paymentAmount: string,
  deploySender: CLPublicKey,
  mode?: string
) {
  const campaignDeploy = await cep47.createCampaign(
    mode ? mode : 'ADD',
    name,
    description,
    CLValueBuilder.byteArray(Buffer.from(wallet_address, 'hex')),
    url,
    requested_royalty,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    deploySender
  );
  console.log('Campaign deploy:', campaignDeploy);

  const signedCampaignDeploy = await signDeploy(campaignDeploy, deploySender);
  console.log('Signed Campaign deploy:', signedCampaignDeploy);

  const campaignDeployHash = await signedCampaignDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', campaignDeployHash);
  return campaignDeployHash;
}
