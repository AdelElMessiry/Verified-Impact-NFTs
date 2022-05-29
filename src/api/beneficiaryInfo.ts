import { cep47 } from '../lib/cep47';
import { getCampaignsList } from './campaignInfo';

export async function getBeneficiaryDetails(beneficiaryId: string) {
  const beneficiaryDetails = await cep47.getBeneficiary(beneficiaryId);
  // console.log(`NFT ${beneficiaryId} beneficiary: `, beneficiaryDetails);
  return beneficiaryDetails;
}

export function parseBeneficiary(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getBeneficiariesList() {
  const beneficiaryCount: any = await cep47.totalBeneficiaries();

  const beneficiariesList: any = [];
  for (const id of [...(Array(parseInt(beneficiaryCount)).keys() as any)]) {
    // console.log((id + 1).toString());

    await getBeneficiaryDetails((id + 1).toString())
      .then(async (rawBeneficiary: any) => {
        // console.log(rawBeneficiary);
        const parsedBeneficiary = parseBeneficiary(rawBeneficiary);
        beneficiariesList.push(parsedBeneficiary);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return beneficiariesList;
}

export async function getBeneficiariesCampaignsList() {
  const beneficiariesList = await getBeneficiariesList();
  const campaignsList = await getCampaignsList();
  const mappedBeneficiariesList: any = [];

  const pluckedCampaigns = campaignsList
    .map(({ wallet_address }: any) => wallet_address)
    .filter(
      (creator: any, index: any, creators: any) =>
        creators.indexOf(creator) === index
    );

  beneficiariesList.forEach((beneficiary: any) =>
    pluckedCampaigns.includes(beneficiary.address)
      ? mappedBeneficiariesList.push({
          ...beneficiary,
          campaigns: campaignsList.filter(
            (campaign: any, index: any, campaigns: any) =>
              campaign.wallet_address === beneficiary.address
            // &&
            // index ===
            //   collections.findIndex(
            //     (idx: any) => idx.name === collection.name
            //   )
          ),
        })
      : mappedBeneficiariesList.push({
          ...beneficiary,
          campaigns: [],
        })
  );

  // console.log(mappedBeneficiariesList);

  return mappedBeneficiariesList;
}

export async function _getBeneficiariesCampaignsList(
  beneficiariesList: any,
  campaignsList: any
) {
  // const beneficiariesList = await getBeneficiariesList();
  // const campaignsList = await getCampaignsList();
  const mappedBeneficiariesList: any = [];

  const pluckedCampaigns = campaignsList
    .map(({ wallet_address }: any) => wallet_address)
    .filter(
      (creator: any, index: any, creators: any) =>
        creators.indexOf(creator) === index
    );

  beneficiariesList.forEach((beneficiary: any) =>
    pluckedCampaigns.includes(beneficiary.address)
      ? mappedBeneficiariesList.push({
          ...beneficiary,
          campaigns: campaignsList.filter(
            (campaign: any, index: any, campaigns: any) =>
              campaign.wallet_address === beneficiary.address
            // &&
            // index ===
            //   collections.findIndex(
            //     (idx: any) => idx.name === collection.name
            //   )
          ),
        })
      : mappedBeneficiariesList.push({
          ...beneficiary,
          campaigns: [],
        })
  );

  // console.log(mappedBeneficiariesList);

  return mappedBeneficiariesList;
}
