import { cep47 } from '../lib/cep47';
import { getCampaignsList } from './campaignInfo';

export async function getBeneficiaryDetails(beneficiaryId: string) {
  const beneficiaryDetails = await cep47.getBeneficiary('1');
  // console.log(`NFT ${beneficiaryId} beneficiary: `, beneficiaryDetails);
  return beneficiaryDetails;
}

export async function parseBeneficiary(maybeValue: any) {
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
        const parsedBeneficiary = await parseBeneficiary(rawBeneficiary);
        beneficiariesList.push(parsedBeneficiary);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  console.log(beneficiariesList);

  return beneficiariesList;
}

export async function getBeneficiariesCampaignsList() {
  const beneficiariesList = await getBeneficiariesList();
  const campaignsList = await getCampaignsList();
  const mappedBeneficiariesList: any = [];

  beneficiariesList.find((beneficiary: any, index: any) =>
    campaignsList.length
      ? campaignsList.map((campaign: any) => {
          !mappedBeneficiariesList.length &&
            mappedBeneficiariesList.push({ ...beneficiary, campaigns: [] });
          return (
            beneficiary.address === campaign.wallet_address &&
            mappedBeneficiariesList.find((newBeneficiary: any) => {
              return beneficiary.id === newBeneficiary.id
                ? mappedBeneficiariesList[index].campaigns.push(campaign)
                : mappedBeneficiariesList.push({
                    ...beneficiary,
                    campaigns: [campaign],
                  });
            })
          );
        })
      : mappedBeneficiariesList.push({ ...beneficiary, campaigns: [] })
  );
  console.log(mappedBeneficiariesList);

  return mappedBeneficiariesList;
}

// mappedBeneficiariesList.reduce((a: any, b: any) => {
//   const found = a.find((e: any) => e.id == b.id);
//   return (
//     found
//       ? mappedBeneficiariesList.campaigns.push(b)
//       : a.push({ ...newBeneficiary, campaigns: [campaign] }),
//     a
//   );
// }, [])
