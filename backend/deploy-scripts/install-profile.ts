import { config } from 'dotenv';
import { getDeploy, getAccountInfo, getAccountNamedKeyValue } from './utils';
import * as fs from 'fs';

import {
  RuntimeArgs,
  Contracts,
  CasperClient,
  CLValueBuilder,
  CLPublicKey,
  Keys,
} from 'casper-js-sdk';

config({ path: '.env' });
const {
  NODE_ADDRESS,
  CHAIN_NAME,
  ADMIN,
  WASM_PROFILE_PATH,
  CASPER_PRIVATE_KEY,
  CONTRACT_PROFILE_NAME,
  INSTALL_PROFILE_PAYMENT_AMOUNT,
} = process.env;

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);
const KEYS = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

const test = async () => {
  const client = new CasperClient(NODE_ADDRESS!);
  const contract = new Contracts.Contract(client);

  const runtimeArgs = RuntimeArgs.fromMap({
    contract_name: CLValueBuilder.string(CONTRACT_PROFILE_NAME!),
    admin: CLPublicKey.fromHex(ADMIN!),
  });

  const installDeployHash = await contract.install(
    getBinary(WASM_PROFILE_PATH!),
    runtimeArgs,
    INSTALL_PROFILE_PAYMENT_AMOUNT!,
    KEYS.publicKey,
    CHAIN_NAME!,
    [KEYS]
  );

  const hash = await installDeployHash.send(NODE_ADDRESS!);

  console.log(`... Contract installation deployHash: ${hash}`);

  await getDeploy(NODE_ADDRESS!, hash);

  console.log(`... Contract installed successfully.`);

  let accountInfo = await getAccountInfo(NODE_ADDRESS, KEYS.publicKey);

  console.log(`... Account Info: `);
  console.log(JSON.stringify(accountInfo, null, 2));

  const contractHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_PROFILE_NAME!}_contract_hash`
  );

  const contractPackageHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_PROFILE_NAME}_contract_package_hash`
  );

  console.log(`... Contract Hash: ${contractHash}`);
  console.log(`... Contract Package Hash: ${contractPackageHash}`);
};

test();
