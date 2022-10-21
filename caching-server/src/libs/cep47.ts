import { CasperClient, Contracts } from 'casper-js-sdk';
import axios from 'axios';

const proxyServer = '';
const NODE_RPC_ADDRESS = process.env.NODE_RPC_ADDRESS;

const CONNECTION = {
  NODE_ADDRESS: proxyServer + NODE_RPC_ADDRESS,
  CHAIN_NAME: 'casper-test',
};

const { NFT_CONTRACT_HASH, NFT_PACKAGE_HASH } = process.env;

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
      `hash-2d6842ba80bbc66bc88d1ccfa8c3a923bc5a786b5f2194ac74b47f4a4e3e5917`,
      `hash-fc4aca70bfc4fc084ecb22ef1c3602323e1b5fdb1bc3f409da8415c59fbbced7`
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
