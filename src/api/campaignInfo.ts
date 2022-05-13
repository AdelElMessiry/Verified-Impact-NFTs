import { cep47 } from '../lib/cep47';

export async function getCampaignDetails(campaignId: string) {
  console.log(campaignId);

  const campaignDetails = await cep47.getCampaign(campaignId);
  console.log(`NFT ${campaignId} campaign: `, campaignDetails);
  return campaignDetails;
}

export async function parseCampaign(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey, value);
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
        console.log(rawCampaign);
        const parsedCampaigns = await parseCampaign(rawCampaign);
        campaignsList.push(parsedCampaigns);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return campaignsList;
}
