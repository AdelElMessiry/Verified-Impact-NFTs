import { CasperClient, Contracts, CLPublicKey } from 'casper-js-sdk';

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

    return mapObj;
  }

  public async totalCampaigns() {
    return this.contractClient.queryContractData(['total_campaigns']);
  }

  public async totalCollections() {
    return this.contractClient.queryContractData(['total_collections']);
  }

  public async totalCreators() {
    return this.contractClient.queryContractData(['total_creators']);
  }

  public async totalBeneficiaries() {
    return this.contractClient.queryContractData(['total_beneficiaries']);
  }

  public async getCampaign(campaignId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'campaigns',
      campaignId
    );

    const maybeValue = result.value().unwrap().value();

    return fromCLMap(maybeValue);
  }

  public async getCollection(collectionId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'collections_list',
      collectionId
    );

    const maybeValue = result.value().unwrap().value();

    return fromCLMap(maybeValue);
  }

  public async getCreator(creatorId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'creators_list',
      creatorId
    );

    const maybeValue = result.value().unwrap().value();

    return fromCLMap(maybeValue);
  }

  public async getBeneficiariesAddList() {
    const result: any = await this.contractClient.queryContractData([
      'beneficiaries_addresses',
    ]);

    const mappedAddresses = result.map((address: any) =>
      Buffer.from(address.data.value()).toString('hex')
    );
    return mappedAddresses;
  }

  public async getBeneficiary(beneficiaryId: string, isHash: boolean) {
    const result = await this.contractClient.queryContractDictionary(
      'beneficiaries_list',
      isHash
        ? beneficiaryId
        : CLPublicKey.fromHex(beneficiaryId).toAccountHashStr().slice(13)
    );

    const maybeValue = result.value().unwrap().value();

    return fromCLMap(maybeValue);
  }
}

export const cep47 = new CEP47Client();
