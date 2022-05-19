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

export async function mint(
  creatorAddress: string,
  creatorName: string,
  mintOptions: IMintOptions
) {
  const publicKeyCLValue = CLPublicKey.fromHex(creatorAddress);
  const oldBalance = await numberOfNFTsOfPubCLvalue(publicKeyCLValue);
  console.log('...... No. of NFTs in your account before mint: ', oldBalance);

  const metas = [new Map()];

  metas[0].set('title', mintOptions.title);
  metas[0].set('description', mintOptions.description);
  metas[0].set('image', mintOptions.image);
  metas[0].set('price', mintOptions.price);
  metas[0].set('isForSale', String(mintOptions.isForSale));
  metas[0].set('currency', mintOptions.currency);
  metas[0].set('campaign', mintOptions.campaign);
  metas[0].set('creator', mintOptions.creator);
  metas[0].set('creatorPercentage', mintOptions.creatorPercentage || '');
  metas[0].set('collectionName', mintOptions.collectionName);
  metas[0].set('beneficiary', mintOptions.beneficiary);
  metas[0].set('beneficiaryPercentage', mintOptions.beneficiaryPercentage);
  console.log(metas);

  console.log('Final nft info:', {
    publicKeyCLValue,
    metas,
    payments: PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
  });

  const mintDeploy = await cep47.mint(
    publicKeyCLValue,
    creatorName,
    creatorAddress,
    metas,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    publicKeyCLValue
  );
  console.log('Mint deploy:', mintDeploy);

  const signedMintDeploy = await signDeploy(mintDeploy, publicKeyCLValue);
  console.log('Signed Mint deploy:', signedMintDeploy);

  const mintDeployHash = await signedMintDeploy.send(CONNECTION.NODE_ADDRESS);
  console.log('Deploy hash', mintDeployHash);
  return mintDeployHash;
}
