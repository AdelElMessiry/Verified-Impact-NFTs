import * as fs from 'fs';
import { config } from 'dotenv';
import { CLPublicKey, Keys, CLValueBuilder } from 'casper-js-sdk';

import { cep47 } from './cep47';
import { getDeploy } from './utils';

config({ path: '.env' });

const {
  NODE_ADDRESS,
  CASPER_FACTORY_PRIVATE_KEY,
  MINT_ONE_PAYMENT_AMOUNT,
  FACTORY_CONTRACT_HASH,
  FACTORY_CONTRACT_PACKAGE_HASH,
  FACTORY_ADMIN,
} = process.env;

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const privateKey = Keys.Ed25519.parsePrivateKey(
  Keys.Ed25519.readBase64WithPEM(CASPER_FACTORY_PRIVATE_KEY as string)
);

const publicKey: any = Keys.Ed25519.privateToPublicKey(privateKey);
const KEYS: any = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

(async function deployBeneficiary() {
  cep47.setContractHash(FACTORY_CONTRACT_HASH!, FACTORY_CONTRACT_PACKAGE_HASH);

  const beneficiariesList = await cep47.getBeneficiariesList();
  for (const address of beneficiariesList) {
    const beneficiaryDeploy = await cep47.approveBeneficiary(
      CLValueBuilder.byteArray(Buffer.from(address, 'hex')),
      true,
      MINT_ONE_PAYMENT_AMOUNT!,
      CLPublicKey.fromHex(FACTORY_ADMIN!),
      [KEYS]
    );

    const beneficiaryDeployHash = await beneficiaryDeploy.send(NODE_ADDRESS!);

    console.log('...... beneficiary deploy hash: ', beneficiaryDeployHash);

    await getDeploy(NODE_ADDRESS!, beneficiaryDeployHash);
    console.log('...... Beneficiary saved successfully');
  }
})();
