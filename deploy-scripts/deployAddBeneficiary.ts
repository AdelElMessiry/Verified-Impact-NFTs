import * as fs from 'fs';
import { config } from 'dotenv';
import { CLPublicKey, Keys } from 'casper-js-sdk';

import { cep47 } from './cep47';
import { getDeploy } from './utils';

config({ path: '.env' });

const { NODE_ADDRESS, CASPER_PRIVATE_KEY, MINT_ONE_PAYMENT_AMOUNT } =
  process.env;

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);
const KEYS: any = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

(async function deployBeneficiary() {
  cep47.setContractHash(
    'hash-44d618a49dd4e47b9a57edebac223c36d300a63747559c856529c02fd58fc8ca',
    'hash-89c03c2a8c9be743769ff0f67cd3c3d10af8331c458e1c5d9c8481a1db428527'
  );

  const beneficiaryDeploy = await cep47.addBeneficiary(
    'Ebra',
    "Ebra's Beneficiary Test",
    '01e23d200eb0f3c8a3dacc8453644e6fcf4462585a68234ebb1c3d6cc8971148c2',
    MINT_ONE_PAYMENT_AMOUNT!,
    CLPublicKey.fromHex(
      '01e23d200eb0f3c8a3dacc8453644e6fcf4462585a68234ebb1c3d6cc8971148c2'
    ),
    [KEYS]
  );

  const beneficiaryDeployHash = await beneficiaryDeploy.send(NODE_ADDRESS!);

  console.log('...... beneficiary deploy hash: ', beneficiaryDeployHash);

  await getDeploy(NODE_ADDRESS!, beneficiaryDeployHash);
  console.log('...... Beneficiary saved successfully');
})();
