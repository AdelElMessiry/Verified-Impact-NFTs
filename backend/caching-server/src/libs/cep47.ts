import { CasperClient, Contracts } from 'casper-js-sdk';
import axios from 'axios';

const {
  STAGE,
  NODE_RPC_MAINNET_ADDRESS,
  NODE_RPC_TESTNET_ADDRESS,
  NFT_CONTRACT_HASH_DEV,
  NFT_CONTRACT_HASH_PROD,
  NFT_PACKAGE_HASH_PROD,
  NFT_PACKAGE_HASH_DEV,
} = process.env;

const proxyServer = '';

const NODE_RPC_ADDRESS =
  process.env.STAGE === 'prod'
    ? NODE_RPC_MAINNET_ADDRESS
    : NODE_RPC_TESTNET_ADDRESS;

const CONNECTION = {
  NODE_ADDRESS: proxyServer + NODE_RPC_ADDRESS,
  CHAIN_NAME: STAGE === 'prod' ? 'casper' : 'casper-test',
};

const CONTRACT_HASH =
  STAGE === 'prod' ? NFT_CONTRACT_HASH_PROD : NFT_CONTRACT_HASH_DEV;
const CONTRACT_PACKAGE_HASH =
  STAGE === 'prod' ? NFT_PACKAGE_HASH_PROD : NFT_PACKAGE_HASH_DEV;

function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

const getNFTImage = async (tokenMetaUri: string) => {
  const baseIPFS = 'https://vinfts.mypinata.cloud/ipfs/';
  if (tokenMetaUri.includes('/')) {
    const mappedUrl = tokenMetaUri.includes('ipfs/')
      ? tokenMetaUri.split('ipfs/').pop()
      : tokenMetaUri;
    return baseIPFS + mappedUrl;
  }
  const resp: any = await axios(baseIPFS + tokenMetaUri);
  // console.log(resp);

  const imgString = resp.data;
  return imgString;
};

const { NODE_ADDRESS, CHAIN_NAME } = CONNECTION;

const { Contract, fromCLMap } = Contracts;

class CEP47Client {
  casperClient: CasperClient;
  contractClient: Contracts.Contract;
  networkName: string;
  isContractIHashSetup = false;

  constructor() {
    this.casperClient = new CasperClient(NODE_ADDRESS!);
    this.contractClient = new Contract(this.casperClient);
    this.networkName = CHAIN_NAME;
    this.contractClient.setContractHash(
      `hash-${CONTRACT_HASH}`,
      `hash-${CONTRACT_PACKAGE_HASH}`
    );
    this.isContractIHashSetup = true;
  }

  public setContractHash(contractHash: string, contractPackageHash?: string) {
    this.contractClient.setContractHash(contractHash, contractPackageHash);
    this.isContractIHashSetup = true;
  }

  public async totalSupply() {
    return this.contractClient.queryContractData(['total_supply']);
  }

  public async getTokenMeta(tokenId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'metadata',
      tokenId
    );

    const maybeValue = result.value().unwrap().value();

    return fromCLMap(maybeValue);
  }

  public async getMappedTokenMeta(tokenId: string, isUpdate?: boolean) {
    const maybeValue: any = await this.getTokenMeta(tokenId);
    const jsMap: any = new Map();
    Array.from(maybeValue.entries()).map(([key, val]: any) =>
      jsMap.set(key, val)
    );

    let mapObj = Object.fromEntries(jsMap);

    mapObj.beneficiary =
      mapObj.beneficiary.includes('Account') ||
      mapObj.beneficiary.includes('Key')
        ? mapObj.beneficiary.includes('Account')
          ? mapObj.beneficiary.slice(13).replace(')', '')
          : mapObj.beneficiary.slice(10).replace(')', '')
        : mapObj.beneficiary;

    mapObj.creator =
      mapObj.creator.includes('Account') || mapObj.creator.includes('Key')
        ? mapObj.creator.includes('Account')
          ? mapObj.creator.slice(13).replace(')', '')
          : mapObj.creator.slice(10).replace(')', '')
        : mapObj.creator;
    mapObj.pureImageKey = mapObj.image;
    // mapObj.image = isUpdate
    //   ? mapObj.image
    //   : isValidHttpUrl(mapObj.image)
    //   ? mapObj.image
    //   : await getNFTImage(mapObj.image);

    return mapObj;
  }
}

export const cep47 = new CEP47Client();
