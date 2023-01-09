import { cep47 } from '../lib/cep47';
import { CLPublicKey } from 'casper-js-sdk';

import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';
// add new collection api to the blockchain
export async function addCollection(
  name: string,
  description: string,
  url: string,
  creator: string,
  deploySender: CLPublicKey,
  mode?: string,
  collectionId?: string
) {
  const collectionDeploy = await cep47.addCollection(
    collectionId ? collectionId : '0',
    mode ? mode : 'ADD',
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
    CONNECTION.NODE_ADDRESS!
  );
  console.log('Deploy hash', collectionDeployHash);
  return collectionDeployHash;
}
// update specific collection details 
export async function updateCollection(
  collection_id: string,
  name: string,
  description: string,
  url: string,
  creator: string,
  deploySender: CLPublicKey
) {
  const updateCollectionDeployHash = await addCollection(
    name,
    description,
    url,
    creator,
    deploySender,
    'UPDATE',
    collection_id
  );

  return updateCollectionDeployHash;
}
