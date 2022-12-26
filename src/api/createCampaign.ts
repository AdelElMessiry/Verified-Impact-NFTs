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
  name: string,
  description: string,
  wallet_address: string, //hash
  wallet_pk: string, //pk
  url: string,
  requested_royalty: string,
  deploySender: CLPublicKey,
  sdgs_ids: number[],
  resale_prc: string,
  mode?: string,
  campaign_id?: string,
  beneficiary_address?: string //hash
) {
  if (mode && mode === 'ADD' && !beneficiary_address) {
    beneficiary_address = wallet_address;
  }
  const campaignDeploy = await cep47.createCampaign(
    campaign_id ? campaign_id : '0',
    mode ? mode : 'ADD',
    name,
    description,
    CLValueBuilder.byteArray(Buffer.from(wallet_address, 'hex')),
    wallet_pk,
    CLValueBuilder.byteArray(Buffer.from(beneficiary_address!, 'hex')),
    url,
    requested_royalty,
    sdgs_ids,
    resale_prc,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    deploySender
  );
  console.log('Campaign deploy:', campaignDeploy);

  const signedCampaignDeploy = await signDeploy(campaignDeploy, deploySender);
  console.log('Signed Campaign deploy:', signedCampaignDeploy);

  const campaignDeployHash = await signedCampaignDeploy.send(
    CONNECTION.NODE_ADDRESS!
  );
  console.log('Deploy hash', campaignDeployHash);
  return campaignDeployHash;
}
