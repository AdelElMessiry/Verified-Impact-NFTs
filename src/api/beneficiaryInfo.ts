import { CLPublicKey } from 'casper-js-sdk';
import { cep47 } from '../lib/cep47';
import { getCampaignsList } from './campaignInfo';

export async function getBeneficiaryDetails(
  beneficiaryId: string,
  isHash: boolean
) {
  const beneficiaryDetails = await cep47.getBeneficiary(beneficiaryId, false);
  // console.log(`NFT ${beneficiaryId} beneficiary: `, beneficiaryDetails);
  return beneficiaryDetails;
}

export async function getBeneficiary(beneficiaryId: string, isHash: boolean) {
  const beneficiaryDetails = await cep47.getBeneficiary(beneficiaryId, isHash);
  return beneficiaryDetails;
}

export async function beneficiariesList() {
  const beneficiariesList = await cep47.getBeneficiariesList();
  return beneficiariesList;
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
  const list: any = await beneficiariesList();

  const _beneficiariesList: any = [];
  // for (const id of [...(Array(parseInt(beneficiaryCount)).keys() as any)]) {
  for (const address of list) {
    // console.log((id + 1).toString());

    await getBeneficiary(address.toString(), true)
      .then(async (rawBeneficiary: any) => {
        // console.log(rawBeneficiary);
        const parsedBeneficiary = parseBeneficiary(rawBeneficiary);
        parsedBeneficiary.address =
          parsedBeneficiary.address.includes('Account') ||
          parsedBeneficiary.address.includes('Key')
            ? parsedBeneficiary.address.includes('Account')
              ? parsedBeneficiary.address.slice(13).replace(')', '')
              : parsedBeneficiary.address.slice(10).replace(')', '')
            : parsedBeneficiary.address;
            //parsedBeneficiary["sdgs"]=["19"];
        _beneficiariesList.push(parsedBeneficiary);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return _beneficiariesList;
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
              campaign.wallet_address.includes('Key')
                ? campaign.wallet_address.slice(10).replace(')', '') ===
                  beneficiary.address
                : campaign.wallet_address === beneficiary.address
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
