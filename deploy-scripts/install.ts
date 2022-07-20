import * as fs from 'fs';
import { config } from 'dotenv';
import { Keys, CLPublicKey } from 'casper-js-sdk';
import { resolve } from 'path';

import { cep47 } from './cep47';

import {
  parseTokenMeta,
  getDeploy,
  getAccountInfo,
  getAccountNamedKeyValue,
} from './utils';

config({ path: '.env' });

const {
  NODE_ADDRESS,
  ADMIN,
  WASM_PATH,
  CASPER_PRIVATE_KEY,
  TOKEN_NAME,
  CONTRACT_NAME,
  TOKEN_SYMBOL,
  INSTALL_PAYMENT_AMOUNT,
  PROFILE_CONTRACT_HASH,
} = process.env;

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const TOKEN_META = new Map(parseTokenMeta(process.env.TOKEN_META!));

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);
console.log(publicKey);

const KEYS = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

const installContract = async () => {
  const installDeployHash = await cep47.install(
    getBinary(resolve(WASM_PATH as string)!),
    {
      name: TOKEN_NAME!,
      contractName: CONTRACT_NAME!,
      symbol: TOKEN_SYMBOL!,
      meta: TOKEN_META,
      admin: CLPublicKey.fromHex(ADMIN!),
      profileContractHash: PROFILE_CONTRACT_HASH!,
    },
    INSTALL_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    [KEYS]
  );

  const hash = await installDeployHash.send(NODE_ADDRESS!);

  console.log(`... Contract installation deployHash: ${hash}`);

  await getDeploy(NODE_ADDRESS!, hash);

  console.log(`... Contract installed successfully.`);

  let accountInfo = await getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

  console.log(`... Account Info: `);
  console.log(JSON.stringify(accountInfo, null, 2));

  const contractHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_NAME!}_contract_hash`
  );

  console.log(`... Contract Hash: ${contractHash}`);
};

installContract();
