import { CasperClient, Contracts } from 'casper-js-sdk';
import axios from 'axios';

const proxyServer = '';
const NODE_RPC_ADDRESS = process.env.NODE_RPC_ADDRESS;

const CONNECTION = {
  NODE_ADDRESS: proxyServer + NODE_RPC_ADDRESS,
  CHAIN_NAME: 'casper-test',
};

const NFT_CONTRACT_HASH =
  '2f99efaae119d1c6dbb7c8fe79267c6b829eba24ecd2d974569088df4f8ef2f3';
const NFT_PACKAGE_HASH =
  'd980bdc4634cc8724233fa85f2d04807d818a5c32448d1c76db6006c009e4220';

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
  const imgString = await resp.text();
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
      `hash-${NFT_CONTRACT_HASH as string}`,
      `hash-${NFT_PACKAGE_HASH}`
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
    mapObj.image = isUpdate
      ? mapObj.image
      : isValidHttpUrl(mapObj.image)
      ? mapObj.image
      : await getNFTImage(mapObj.image);

    return mapObj;
  }
}

export const cep47 = new CEP47Client();
