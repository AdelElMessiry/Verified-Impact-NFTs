import * as fs from 'fs';
import { config } from 'dotenv';
import { Keys } from 'casper-js-sdk';
import { CEP47Client } from 'casper-cep47-js-client';

import { getDeploy, getAccountInfo, getAccountNamedKeyValue } from './utils';

config({ path: '.env' });

const {
  NODE_ADDRESS,
  CHAIN_NAME,
  CONTRACT_NAME,
  CASPER_PRIVATE_KEY,
  MINT_ONE_PAYMENT_AMOUNT,
} = process.env;

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);
const KEYS = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

export class NFTReference {
  key: string;
  value: string;
  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

const nft1Info = {
  id: 1,
  about: 'Very first NFT bro',
  url: 'https://avatars.githubusercontent.com/u/48476025?v=4',
  title: '1st of its kind',
  references: [],
};

async function deployFirstNFT() {
  const cep47 = new CEP47Client(NODE_ADDRESS!, CHAIN_NAME!);

  let accountInfo = await getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);
  const contractHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_NAME!}_contract_hash`
  );
  console.log('setting up contract hash: ', contractHash);
  cep47.setContractHash(contractHash);

  console.log('... Minting 1st NFT \n');
  const metas = [new Map()];
  nft1Info.references.forEach((ref: any) => metas[0].set(ref.key, ref.value));
  metas[0].set('title', nft1Info.title);
  metas[0].set('about', nft1Info.about);
  metas[0].set('url', nft1Info.url);

  const mintDeploy = await cep47.mint(
    KEYS.publicKey,
    [String(nft1Info.id)],
    metas,
    MINT_ONE_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS]
  );
  const mintDeployHash = await mintDeploy.send(NODE_ADDRESS!);

  console.log('...... NfT 1 Mint deploy hash: ', mintDeployHash);

  await getDeploy(NODE_ADDRESS!, mintDeployHash);
  console.log('...... NFT 1 minted successfully');
}
deployFirstNFT();
