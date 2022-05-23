import {
  CasperClient,
  CLPublicKey,
  Keys,
  CasperServiceByJsonRPC,
  DeployUtil,
  Signer,
} from 'casper-js-sdk';

import { cep47 } from '../lib/cep47';
import {
  CONNECTION,
  DEPLOYER_ACC,
  USER_KEY_PAIR_PATH,
} from '../constants/blockchain';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';

export function HexToCLPublicKey(publicKey: string) {
  console.log('Parsing public key string: ', publicKey);
  return CLPublicKey.fromHex(publicKey);
}

export const contractHashToByteArray = (contractHash: string) =>
  Uint8Array.from(Buffer.from(contractHash, 'hex'));

export const parseTokenMeta = (str: string): Array<[string, string]> =>
  str.split(',').map((s) => {
    const map = s.split(' ');
    return [map[0], map[1]];
  });

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Returns a set ECC key pairs - one for each NCTL user account.
 * @param {String} pathToUsers - Path to NCTL user directories.
 * @return {Array} An array of assymmetric keys.
 */
export const getKeyPairOfUserSet = (pathToUsers: string) => {
  return [1, 2, 3, 4, 5].map((userID) => {
    return Keys.Ed25519.parseKeyFiles(
      `${pathToUsers}/user-${userID}/NFT_Deploy_public_key.pem`,
      `${pathToUsers}/user-${userID}/NFT_Deploy_secret_key.pem`
    );
  });
};

export const getDeploy = async (NODE_URL: string, deployHash: string) => {
  const client = new CasperClient(NODE_URL);
  let i = 300;
  while (i !== 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      // @ts-ignore
      if (raw.execution_results[0].result.Success) {
        return deploy;
      } else {
        // @ts-ignore
        throw Error(
          'Contract execution: ' +
            // @ts-ignore
            raw.execution_results[0].result.Failure.error_message
        );
      }
    } else {
      i--;
      await sleep(1000);
      continue;
    }
  }
  throw Error('Timeout after ' + i + "s. Something's wrong");
};

export const getAccountInfo: any = async (
  nodeAddress: string,
  accountHash: string
) => {
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const stateRootHash = await client.getStateRootHash();
  const blockState = await client.getBlockState(stateRootHash, accountHash, []);
  return blockState.Account;
};

export const getAccountInfoFromCLPub: any = async (
  nodeAddress: string,
  publicKey: CLPublicKey
) => {
  const accountHash = publicKey.toAccountHashStr();
  return await getAccountInfo(nodeAddress, accountHash);
};

/**
 * Returns a value under an on-chain account's storage.
 * @param accountInfo - On-chain account's info.
 * @param namedKey - A named key associated with an on-chain account.
 */
export const getAccountNamedKeyValue = (accountInfo: any, namedKey: string) => {
  const found = accountInfo.namedKeys.find((i: any) => i.name === namedKey);
  if (found) {
    return found.key;
  }
  return undefined;
};

export const getAccountBalance: any = async (publicKey: string) => {
  const client = new CasperServiceByJsonRPC(CONNECTION.NODE_ADDRESS);
  const latestBlock: any = await client.getLatestBlockInfo();
  const root = await client.getStateRootHash(latestBlock.block.hash);
  const MOTE_RATE = 1000000000;
  const balanceUref = await client.getAccountBalanceUrefByPublicKey(
    root,
    CLPublicKey.fromHex(publicKey)
  );

  //account balance from the last block
  const balance: any = await client.getAccountBalance(
    latestBlock.block.header.state_root_hash,
    balanceUref
  );

  console.log(balance / MOTE_RATE);

  return balance / MOTE_RATE;
};

export const nativeTransfer = async (
  selectedAddress: string,
  toAddress: string,
  amount: any,
  isSignerTransfer: boolean
) => {
  const MOTE_RATE = 1000000000;
  console.log(selectedAddress);

  const fromAccount = CLPublicKey.fromHex(selectedAddress);
  const toAccount = CLPublicKey.fromHex(toAddress);
  amount = amount * MOTE_RATE;
  const ttl = 1800000;

  const PAYMENT_AMOUNT = PAYMENT_AMOUNTS.NATIVE_TRANSFER_PAYMENT_AMOUNT;
  const deployParams = new DeployUtil.DeployParams(
    fromAccount,
    CONNECTION.CHAIN_NAME,
    ttl
  );

  const transferParams = DeployUtil.ExecutableDeployItem.newTransfer(
    amount,
    toAccount,
    null,
    1
  );
  const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
  const deploy = DeployUtil.makeDeploy(deployParams, transferParams, payment);

  const deployJson = DeployUtil.deployToJson(deploy);

  let signedDeployJson;

  if (isSignerTransfer) {
    try {
      signedDeployJson = await Signer.sign(
        deployJson,
        selectedAddress,
        toAddress
      );
    } catch (e) {
      console.log(e);

      return;
    }
    signedDeployJson = DeployUtil.deployFromJson(signedDeployJson).unwrap();
  } else {
    const client: any = new CasperServiceByJsonRPC(CONNECTION.NODE_ADDRESS);
    const KEYS_USER: any = Keys.Ed25519.parseKeyFiles(
      `${USER_KEY_PAIR_PATH}/NFT_Deploy_public_key.pem`,
      `${USER_KEY_PAIR_PATH}/NFT_Deploy_secret_key.pem`
    );
    signedDeployJson = client.signDeploy(deploy, KEYS_USER);
  }

  try {
    const transferDeployHash = await signedDeployJson.send(
      CONNECTION.NODE_ADDRESS
    );
    console.log('Transfer Deploy hash', transferDeployHash);

    return transferDeployHash;
  } catch (e) {
    console.log(e);

    return;
  }
};

export const transferFees = async (buyer: string, tokenId: string) => {
  try {
    console.log(buyer);

    const tokenDetails = await cep47.getMappedTokenMeta(tokenId);
    const owner = await cep47.getOwnerOf(tokenId);
    const deployer = DEPLOYER_ACC;

    let { beneficiary, price } = tokenDetails;
    price = parseInt(price);

    const portalFees = (price / 100) * 2;
    const finalPrice = price - portalFees;

    const beneficiaryAmount = (finalPrice / 100) * 20;
    const ownerAmount = (finalPrice / 100) * 80;

    console.log(tokenDetails);

    const deployerTransfer = await nativeTransfer(
      buyer,
      deployer,
      price,
      false
    );

    const beneficiaryTransfer = await nativeTransfer(
      deployer,
      beneficiary,
      beneficiaryAmount,
      true
    );

    const ownerTransfer = await nativeTransfer(
      deployer,
      owner,
      ownerAmount,
      true
    );

    return ownerTransfer;
  } catch (e) {
    console.log(e);

    return;
  }
};
