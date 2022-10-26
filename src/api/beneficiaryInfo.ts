import axios from 'axios';
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
    .map(({ beneficiary_address }: any) => beneficiary_address)
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
              campaign.beneficiary_address === beneficiary.address
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
    .map(({ beneficiary_address }: any) => beneficiary_address)
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
              campaign.beneficiary_address.includes('Key')
                ? campaign.beneficiary_address.slice(10).replace(')', '') ===
                  beneficiary.address
                : campaign.beneficiary_address === beneficiary.address
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

export async function getCachedBeneficiariesList() {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'beneficiaries';
  const beneficiaries: any = await axios(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`
  );

  return beneficiaries?.data.list;
}

export async function updateCachedBeneficiary(
  beneficiary: any,
  beneficiaries: any
) {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'updateBeneficiary';

  await axios.patch(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`,
    { beneficiary }
  );

  beneficiaries[
    beneficiaries.findIndex(
      ({ address }: any) => address === beneficiary.address
    )
  ] = beneficiary;

  return beneficiaries;
}
