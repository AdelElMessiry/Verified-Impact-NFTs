import { CLPublicKey } from 'casper-js-sdk';

import { cep47 } from '../lib/cep47';
import { createCampaign } from './createCampaign';

export async function getCampaignDetails(campaignId: string) {
  // console.log(campaignId);

  const campaignDetails = await cep47.getCampaign(campaignId);
  // console.log(`NFT ${campaignId} campaign: `, campaignDetails);
  return campaignDetails;
}

export function parseCampaign(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getCampaignsList() {
  const campaignCount: any = await cep47.totalCampaigns();

  const campaignsList: any = [];
  for (const id of [...(Array(parseInt(campaignCount)).keys() as any)]) {
    await getCampaignDetails((id + 1).toString())
      .then(async (rawCampaign: any) => {
        // console.log(rawCampaign);
        const parsedCampaigns = parseCampaign(rawCampaign);
        parsedCampaigns.wallet_address =
          parsedCampaigns.wallet_address.includes('Account') ||
          parsedCampaigns.wallet_address.includes('Key')
            ? parsedCampaigns.wallet_address.includes('Account')
              ? parsedCampaigns.wallet_address.slice(13).replace(')', '')
              : parsedCampaigns.wallet_address.slice(10).replace(')', '')
            : parsedCampaigns.wallet_address;
        // parsedCampaigns["sdgs"]=["19"]
        campaignsList.push(parsedCampaigns);
        // const {
        //   sdgs_ids,
        //   description,
        //   id,
        //   name,
        //   requested_royalty,
        //   url,
        //   wallet_address,
        // } = parsedCampaigns;

        // await createCampaign(
        //   name,
        //   description,
        //   wallet_address,
        //   url,
        //   requested_royalty,
        //   CLPublicKey.fromHex(
        //     '0131561311ded2e4c2bbb6d2497e231ae554afc86e7b6b9a083a84330830b8cfc5'
        //   ),
        //   sdgs_ids || ['19'],
        //   'UPDATE',
        //   id,
        //   wallet_address
        // );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // console.log(campaignsList);

  return campaignsList;
}
