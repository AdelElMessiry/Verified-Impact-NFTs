import { cep47 } from '../lib/cep47';
import { CLPublicKey } from 'casper-js-sdk';

import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export async function addCollection(
  name: string,
  description: string,
  url: string,
  creator: string,
  deploySender: CLPublicKey
) {
  const collectionDeploy = await cep47.addCollection(
    name,
    description,
    creator,
    url,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    deploySender
  );
  console.log('Collection deploy:', collectionDeploy);

  const signedCollectionDeploy = await signDeploy(
    collectionDeploy,
    deploySender
  );
  console.log('Signed collection deploy:', signedCollectionDeploy);

  const collectionDeployHash = await signedCollectionDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', collectionDeployHash);
  return collectionDeployHash;
}
