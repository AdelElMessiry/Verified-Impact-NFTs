import { config } from 'dotenv';
import { Keys } from 'casper-js-sdk';

import { getAccountInfo, getAccountNamedKeyValue } from './utils';

config({ path: '.env' });

const { RPC_API, CONTRACT_NAME, CASPER_PRIVATE_KEY } = process.env;

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);

console.log('User key:');
console.log('Pub key to hex: ', publicKey.toHex());
console.log('Pub key to acc hash string: ', publicKey.toAccountHashStr());

const fetchDetails = async () => {
  let accountInfo = await getAccountInfo(RPC_API!, publicKey);

  console.log(`... Account Info: `);
  console.log(JSON.stringify(accountInfo, null, 2));

  const contractHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_NAME!}_contract_hash`
  );

  console.log(`... Contract Hash: ${contractHash}`);
};
fetchDetails();
