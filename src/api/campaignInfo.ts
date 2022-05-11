import { cep47 } from '../lib/cep47';

export async function getCampaignDetails(campaignId: string) {
  console.log(campaignId);

  const campaignDetails = await cep47.getCampaign(campaignId);
  console.log(`NFT ${campaignId} metadata: `, campaignDetails);
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
  const campaignCount = await cep47.totalCampaigns();

  const campaignsList: any = [];
  for (const id of [...(Array(campaignCount).keys() as any)]) {
    await getCampaignDetails(id.toString())
      .then((rawCampaign: any) => {
        console.log(rawCampaign);
        campaignsList.push(parseCampaign(rawCampaign));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return campaignsList;
}
