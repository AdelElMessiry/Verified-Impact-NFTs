import * as fs from 'fs';
import { config } from 'dotenv';
import { CLPublicKey, Keys } from 'casper-js-sdk';

import { cep47 } from './cep47';
import { getDeploy } from './utils';

config({ path: '.env' });

const {
  NODE_ADDRESS,
  CASPER_PRIVATE_KEY,
  MINT_ONE_PAYMENT_AMOUNT,
  FACTORY_CONTRACT_HASH,
  FACTORY_CONTRACT_PACKAGE_HASH,
} = process.env;

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);
const KEYS: any = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

(async function deployBeneficiary() {
  cep47.setContractHash(FACTORY_CONTRACT_HASH!, FACTORY_CONTRACT_PACKAGE_HASH);

  const beneficiaryDeploy = await cep47.addProfile(
    CLPublicKey.fromHex(
      '02034d0c6b99a9b79c717cc8d9791fef7dae817e354c56d59bbf3c4781de88df6401'
    ),
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
