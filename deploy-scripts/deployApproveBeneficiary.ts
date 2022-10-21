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
  // cep47.setContractHash(FACTORY_CONTRACT_HASH!, FACTORY_CONTRACT_PACKAGE_HASH);
  cep47.setContractHash(
    process.env.NFT_CONTRACT_HASH!,
    process.env.NFT_CONTRACT_PACKAGE_HASH
  );

  const beneficiary_address =
    '01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c';
  const campaignDeploy = await cep47.createCampaign(
    '1',
    'UPDATE',
    'Stand With Ukraine',
    'Stand with Ukraine people in their time of need',
    CLValueBuilder.byteArray(
      Buffer.from(
        '01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c',
        'hex'
      )
    ),
    '01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c',
    CLValueBuilder.byteArray(Buffer.from(beneficiary_address!, 'hex')),
    'https://thedigital.gov.ua/',
    '100',
    [1, 2, 19],
    MINT_ONE_PAYMENT_AMOUNT!,
    CLPublicKey.fromHex(FACTORY_ADMIN!)
  );
  console.log(campaignDeploy);

  // const beneficiaryDeployHash = await campaignDeploy.send(NODE_ADDRESS!);

  // console.log('...... beneficiary deploy hash: ', beneficiaryDeployHash);

  // await getDeploy(NODE_ADDRESS!, beneficiaryDeployHash);
  // console.log('...... Beneficiary saved successfully');

  // const beneficiariesList = await cep47.getBeneficiariesList();
  // for (const address of beneficiariesList) {
  //   const beneficiaryDeploy = await cep47.approveBeneficiary(
  //     CLValueBuilder.byteArray(Buffer.from(address, 'hex')),
  //     true,
  //     MINT_ONE_PAYMENT_AMOUNT!,
  //     CLPublicKey.fromHex(FACTORY_ADMIN!),
  //     [KEYS]
  //   );

  //   const beneficiaryDeployHash = await beneficiaryDeploy.send(NODE_ADDRESS!);

  //   console.log('...... beneficiary deploy hash: ', beneficiaryDeployHash);

  //   await getDeploy(NODE_ADDRESS!, beneficiaryDeployHash);
  //   console.log('...... Beneficiary saved successfully');
  // }
})();
