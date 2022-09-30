import { CasperClient, Contracts } from 'casper-js-sdk';

const proxyServer = '';
const NODE_RPC_ADDRESS = 'https://node-clarity-testnet.make.services/rpc';

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
  const resp = await fetch(baseIPFS + tokenMetaUri);
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
    // console.log(maybeValue.entries());
    Array.from(maybeValue.entries()).map(([key, val]: any) =>
      jsMap.set(key, val)
    );
    // // for (const [innerKey, value] of maybeValue.entries()) {
    // //   console.log(innerKey);

    // //   jsMap.set(innerKey, value);
    // // }
    // console.log(jsMap);

    let mapObj = Object.fromEntries(jsMap);
    // console.log(mapObj);

    return mapObj;
  }
}

export const cep47 = new CEP47Client();
