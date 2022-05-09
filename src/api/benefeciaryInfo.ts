import { cep47 } from '../lib/cep47';

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
  const campaignCount = await cep47.totalBeneficiaries();

  const beneficiariesList: any = [];
  for (const id of [...(Array(campaignCount).keys() as any)]) {
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
