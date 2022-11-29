import axios from 'axios';

import { cep47 } from '../lib/cep47';

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

        parsedCampaigns.beneficiary_address =
          parsedCampaigns.beneficiary_address.includes('Account') ||
          parsedCampaigns.beneficiary_address.includes('Key')
            ? parsedCampaigns.beneficiary_address.includes('Account')
              ? parsedCampaigns.beneficiary_address.slice(13).replace(')', '')
              : parsedCampaigns.beneficiary_address.slice(10).replace(')', '')
            : parsedCampaigns.beneficiary_address;
        campaignsList.push(parsedCampaigns);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // console.log(campaignsList);

  return campaignsList;
}

export async function getCachedCampaignsList() {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'campaigns';
  const campaigns: any = await axios(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`
  );

  return campaigns?.data.list;
}

export async function updateCachedCampaign(campaign: any, campaigns: any) {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'updateCampaign';

  await axios.patch(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`,
    { campaign }
  );

  campaigns[
    campaigns.findIndex(({ address }: any) => address === campaign.address)
  ] = campaign;

  return campaigns;
}
