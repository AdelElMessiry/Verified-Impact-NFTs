import { cep47 } from '../lib/cep47';
import { CLPublicKey } from 'casper-js-sdk';

import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export async function addBeneficiary(
  name: string,
  description: string,
  address: string,
  deploySender: CLPublicKey
) {
  const beneficiaryDeploy = await cep47.addBeneficiary(
    name,
    description,
    address,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    deploySender
  );
  console.log('Beneficiary deploy:', beneficiaryDeploy);

  const signedBeneficiaryDeploy = await signDeploy(
    beneficiaryDeploy,
    deploySender
  );
  console.log('Signed Beneficiary deploy:', signedBeneficiaryDeploy);

  const beneficiaryDeployHash = await signedBeneficiaryDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', beneficiaryDeployHash);
  return beneficiaryDeployHash;
}
