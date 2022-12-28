import {
  Keys,
  CLPublicKey,
  CasperClient,
  RuntimeArgs,
  CLValueBuilder,
  DeployUtil,
} from 'casper-js-sdk';

import {
  CONNECTION,
  DEPLOYER_ACC,
  USER_KEY_PAIR_PATH,
} from '../constants/blockchain';
import { setupContractHash } from '../lib/cep47';
import { contractHashToByteArray } from '../utils/contract-utils';
// api allow the beneficiary approve the nft under the campaigns
export async function approve(recipient: CLPublicKey, nftId: string) {
  const spender = DEPLOYER_ACC;
  const client = new CasperClient(CONNECTION.NODE_ADDRESS!);
  const KEYS_USER: any = Keys.Ed25519.parseKeyFiles(
    `${USER_KEY_PAIR_PATH}/NFT_Deploy_public_key.pem`,
    `${USER_KEY_PAIR_PATH}/NFT_Deploy_secret_key.pem`
  );

  const contractHash: string = await setupContractHash();
  const runtimeArgs = RuntimeArgs.fromMap({
    spender: CLValueBuilder.key(recipient),
    token_ids: CLValueBuilder.list([CLValueBuilder.u256(nftId)]),
  });

  let deploy: any = await DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      CLPublicKey.fromHex(spender),
      CONNECTION.CHAIN_NAME,
      1,
      1800000
    ),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      contractHashToByteArray(contractHash),
      'approve',
      runtimeArgs
    ),
    DeployUtil.standardPayment(3000000000)
  );

  let signedDeploy = client.signDeploy(deploy, KEYS_USER);

  const deployHash = await client.putDeploy(signedDeploy);

  if (deployHash !== null) {
    return deployHash;
  } else {
    throw Error('Approve Transfer: Invalid Deploy');
  }
}
