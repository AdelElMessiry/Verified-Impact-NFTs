import { cep47 } from '../lib/cep47';
import { getCampaignsList } from './campaignInfo';

export async function getBeneficiaryDetails(beneficiaryId: string) {
  console.log(beneficiaryId);

  const beneficiaryDetails = await cep47.getBeneficiary(beneficiaryId);
  console.log(`NFT ${beneficiaryId} metadata: `, beneficiaryDetails);
  return beneficiaryDetails;
}

export async function parseBeneficiary(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey, value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getBeneficiariesList() {
  const beneficiaryCount = await cep47.totalBeneficiaries();

  const beneficiariesList: any = [];
  for (const id of [...(Array(beneficiaryCount).keys() as any)]) {
    await getBeneficiaryDetails(id.toString())
      .then((rawBeneficiary: any) => {
        console.log(rawBeneficiary);
        beneficiariesList.push(parseBeneficiary(rawBeneficiary));
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

  beneficiariesList.find(
    (beneficiary: any, index: number) =>
      campaignsList.some(
        (campaign: any) =>
          beneficiary.address === campaign.wallet_address &&
          mappedBeneficiariesList.find((newBeneficiary: any) =>
            beneficiary.id === newBeneficiary.id
              ? newBeneficiary.campaigns.push(campaign)
              : mappedBeneficiariesList.push({
                  ...beneficiary,
                  campaigns: [campaign],
                })
          )
      )
    // mappedBeneficiariesList.reduce((a: any, b: any) => {
    //   const found = a.find((e: any) => e.id == b.id);
    //   return (
    //     found
    //       ? mappedBeneficiariesList.campaigns.push(b)
    //       : a.push({ ...newBeneficiary, campaigns: [campaign] }),
    //     a
    //   );
    // }, [])
  );
  return mappedBeneficiariesList;
}
