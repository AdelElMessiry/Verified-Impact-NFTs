import {
  CasperClient,
  CLPublicKey,
  CLURef,
  Keys,
  CasperServiceByJsonRPC,
  DeployUtil,
  Signer,
  CLValueBuilder,
} from 'casper-js-sdk';

import { cep47 } from '../lib/cep47';
import { getCampaignDetails, parseCampaign } from '../api/campaignInfo';
import {
  CONNECTION,
  DEPLOYER_ACC,
  TREASURY_WALLET,
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
      `${pathToUsers}/user-${userID}/public_key.pem`,
      `${pathToUsers}/user-${userID}/secret_key.pem`
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

export const hashToURef: any = async (accountHash: string) => {
  const client = new CasperServiceByJsonRPC(CONNECTION.NODE_ADDRESS);
  const stateRootHash = await client.getStateRootHash();
  const blockState: any = await client.getBlockState(
    stateRootHash,
    accountHash,
    []
  );

  return CLURef.fromFormattedStr(blockState.Account.mainPurse);
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
  let balanceUref;
  try {
    balanceUref = await client.getAccountBalanceUrefByPublicKey(
      root,
      CLPublicKey.fromHex(publicKey)
    );
  } catch (err) {
    return 0;
  }

  //account balance from the last block

  const balance: any = await client.getAccountBalance(
    latestBlock.block.header.state_root_hash,
    balanceUref
  );

  console.log(balance / MOTE_RATE);

  return balance / MOTE_RATE;
};

const mapOwnerKeys = async () => {
  const privateKey = Keys.Ed25519.parsePrivateKey(
    Keys.Ed25519.readBase64WithPEM(
      process.env.REACT_APP_CASPER_PRIVATE_KEY as string
    )
  );

  const publicKey = Keys.Ed25519.privateToPublicKey(privateKey);
  const mappedKeys = Keys.Ed25519.parseKeyPair(publicKey, privateKey);

  return mappedKeys;
};

export const nativeTransfer = async (
  selectedAddress: string,
  toAddress: any,
  amount: any,
  isSignerTransfer: boolean,
  ifHash?: boolean
) => {
  const MOTE_RATE = 1000000000;
  console.log(selectedAddress);

  const fromAccount = CLPublicKey.fromHex(selectedAddress);
  const toAccount = ifHash ? toAddress : CLPublicKey.fromHex(toAddress);
  amount = parseInt(amount) * MOTE_RATE;
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
    signedDeployJson = await Signer.sign(
      deployJson,
      selectedAddress,
      toAddress
    );

    signedDeployJson = DeployUtil.deployFromJson(signedDeployJson).unwrap();
  } else {
    const client: any = new CasperClient(CONNECTION.NODE_ADDRESS);
    const KEYS_USER = await mapOwnerKeys();
    signedDeployJson = client.signDeploy(deploy, KEYS_USER);
  }

  const transferDeployHash = await signedDeployJson.send(
    CONNECTION.NODE_ADDRESS
  );

  return transferDeployHash;
};

export const transferFees = async (buyer: string, tokenId: string) => {
  // try {
  const tokenDetails = await cep47.getMappedTokenMeta(tokenId);
  let owner = await cep47.getOwnerOf(tokenId);
  owner = await hashToURef(owner);
  const deployer = DEPLOYER_ACC;
  const treasury = TREASURY_WALLET;

  let { beneficiary, price, campaign } = tokenDetails;
  beneficiary = await hashToURef(`account-hash-${beneficiary}`);

  const campaignDetails: any = await getCampaignDetails(campaign);
  const parsedCampaigns: any = parseCampaign(campaignDetails);

  const beneficiaryPercentage = parseInt(parsedCampaigns.requested_royalty);
  const creatorPercentage = 100 - beneficiaryPercentage;

  const portalFees = (price / 100) * 2;
  const finalPrice = price - portalFees;

  const beneficiaryAmount =
    beneficiaryPercentage && (finalPrice / 100) * beneficiaryPercentage;
  const ownerAmount =
    creatorPercentage && (finalPrice / 100) * creatorPercentage;

  await nativeTransfer(buyer, deployer, price, true);

  const treasuryTransfer =
    portalFees &&
    (await nativeTransfer(deployer, treasury, portalFees, false, false));

  const beneficiaryTransfer =
    beneficiaryAmount &&
    (await nativeTransfer(
      deployer,
      beneficiary,
      beneficiaryAmount,
      false,
      true
    ));

  const ownerTransfer =
    ownerAmount &&
    (await nativeTransfer(deployer, owner, ownerAmount, false, true));

  return ownerAmount ? ownerTransfer : beneficiaryTransfer;
  // } catch (e) {
  //   console.log(e);
  //   return e;
  // }
};

export const getNFTImage = async (tokenMetaUri: string) => {
  const resp = await fetch('https://dweb.link/ipfs/' + tokenMetaUri);
  const imgString = await resp.text();

  return imgString;
};

export function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
