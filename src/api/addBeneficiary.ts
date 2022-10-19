import { cep47 } from '../lib/cep47';
import { CLPublicKey, CLValueBuilder, CLAccountHash } from 'casper-js-sdk';

import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export async function addBeneficiary(
  name: string,
  description: string,
  address: string,
  sdgs_ids: number[],
  deploySender: CLPublicKey,
  mode?: string,
  beneficiaryId?: string
) {
  const beneficiaryDeploy = await cep47.addBeneficiary(
    beneficiaryId ? beneficiaryId : '0',
    name,
    description,
    CLValueBuilder.byteArray(CLPublicKey.fromHex(address).toAccountHash()),
    address,
    mode ? mode : 'ADD',
    sdgs_ids,
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

export async function approveBeneficiary(
  address: string,
  status: boolean,
  deploySender: CLPublicKey
) {
  const beneficiaryDeploy = await cep47.approveBeneficiary(
    CLValueBuilder.byteArray(Buffer.from(address, 'hex')),
    address,
    status,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    deploySender
  );
  console.log('Beneficiary Approval deploy:', beneficiaryDeploy);

  const signedBeneficiaryDeploy = await signDeploy(
    beneficiaryDeploy,
    deploySender
  );
  console.log('Signed Beneficiary Approval deploy:', signedBeneficiaryDeploy);

  const beneficiaryDeployHash = await signedBeneficiaryDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', beneficiaryDeployHash);
  return beneficiaryDeployHash;
}
