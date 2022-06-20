import * as fs from 'fs';
import { config } from 'dotenv';
import { Keys, CLPublicKey } from 'casper-js-sdk';
import { resolve } from 'path';

import { cep47 } from '../src/lib/cep47';

import { getDeploy, getAccountInfo, getAccountNamedKeyValue } from './utils';
config({ path: '.env' });

const {
  NODE_ADDRESS,
  ADMIN,
  WASM_PROFILE_PATH,
  CASPER_PRIVATE_KEY,
  CONTRACT_PROFILE_NAME,
  INSTALL_PAYMENT_AMOUNT,
} = process.env;
console.log(ADMIN);

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);
const KEYS = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

const installProfileContract = async () => {
  const installDeployHash = await cep47.installProfile(
    getBinary(resolve(WASM_PROFILE_PATH as string)!),
    {
      contractName: CONTRACT_PROFILE_NAME!,
      admin: CLPublicKey.fromHex(ADMIN!),
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
    `${CONTRACT_PROFILE_NAME!}_contract_hash`
  );

  console.log(`... Contract Hash: ${contractHash}`);
};

installProfileContract();
