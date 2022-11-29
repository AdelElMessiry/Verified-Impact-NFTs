import { cep47 } from '../lib/cep47';
import { CLPublicKey } from 'casper-js-sdk';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export async function transfer(
  signer: CLPublicKey,
  recipient: CLPublicKey,
  nftId: string
) {
  const transferDeploy = await cep47.transfer(recipient, nftId, signer);
  console.log('Transfer deploy:', transferDeploy);

  const signedTransferDeploy = await signDeploy(transferDeploy, signer);
  console.log('Signed Transfer deploy:', signedTransferDeploy);

  const transferDeployHash = await signedTransferDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', transferDeployHash);
  return transferDeployHash;
}

export async function purchaseNFT(recipient: CLPublicKey, nftId: string) {
  const purchaseDeploy = await cep47.purchaseNft(recipient, nftId);
  console.log('Purchase deploy:', purchaseDeploy);

  const signedPurchaseDeploy = await signDeploy(purchaseDeploy, recipient);
  console.log('Signed Purchase deploy:', signedPurchaseDeploy);

  const purchaseDeployHash = await signedPurchaseDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Purchase deploy hash', purchaseDeployHash);
  return purchaseDeployHash;
}
