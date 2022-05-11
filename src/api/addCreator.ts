import { cep47 } from '../lib/cep47';
import { CLPublicKey } from 'casper-js-sdk';

import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export async function addCreator(
  name: string,
  description: string,
  url: string,
  deploySender: CLPublicKey
) {
  const creatorDeploy = await cep47.addCreator(
    name,
    description,
    url,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    deploySender
  );
  console.log('Creator deploy:', creatorDeploy);

  const signedCreatorDeploy = await signDeploy(creatorDeploy, deploySender);
  console.log('Signed creator deploy:', signedCreatorDeploy);

  const creatorDeployHash = await signedCreatorDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', creatorDeployHash);
  return creatorDeployHash;
}
