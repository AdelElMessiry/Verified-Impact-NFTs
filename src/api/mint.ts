import { cep47 } from '../lib/cep47';
import { CLPublicKey } from 'casper-js-sdk';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';
import { numberOfNFTsOfPubCLvalue } from './userInfo';

export class NFTReference {
  key: string;
  value: string;
  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}
// interface to explain the mint object props
export interface IMintOptions {
  title: string;
  description: string;
  image: string;
  category: string;
  price: string;
  isForSale: boolean;
  currency: string;
  campaign: string;
  creator: string;
  creatorPercentage: string;
  collectionName: string;
  beneficiary: string;
  beneficiaryPercentage: string;
}

/**
 * Represents nft func props .
 * @constructor
 * @param {string} creatorAddress - The nft creator address.
 * @param {string} creatorName - The nft creator name.
 * @param {any} mintOptions - mintOption is an objet contains all nft details like the title, desc, imageUrl etc.
 */
// mint new  nft function
export async function mint(
  creatorAddress: string,
  creatorName: string,
  mintOptions: any
) {
  const publicKeyCLValue = CLPublicKey.fromHex(creatorAddress);
  // fetch user nfts
  const oldBalance = await numberOfNFTsOfPubCLvalue(publicKeyCLValue);
  console.log('...... No. of NFTs in your account before mint: ', oldBalance);

  console.log('Final nft info:', {
    publicKeyCLValue,
    mintOptions,
    payments: PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
  });
  //hasReceipt prop is a confirmation from the deployer if he could give the nft buyer a receipt
  mintOptions['hasReceipt'] = !!mintOptions.hasReceipt;

  const mintDeploy = await cep47.mint(
    publicKeyCLValue,
    creatorName,
    mintOptions,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    publicKeyCLValue
  );
  console.log('Mint deploy:', mintDeploy);

  const signedMintDeploy = await signDeploy(mintDeploy, publicKeyCLValue);
  console.log('Signed Mint deploy:', signedMintDeploy);

  const mintDeployHash = await signedMintDeploy.send(CONNECTION.NODE_ADDRESS!);
  console.log('Deploy hash', mintDeployHash);
  return mintDeployHash;
}
