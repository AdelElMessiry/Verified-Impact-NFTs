import {
  CLValue,
  CLPublicKey,
  CLMap,
  RuntimeArgs,
  CasperClient,
  Contracts,
  Keys,
  CLKeyParameters,
  CLValueBuilder,
  CLValueParsers,
} from 'casper-js-sdk';
import { concat } from '@ethersproject/bytes';
import blake from 'blakejs';
import BufferImported from 'buffer/';

import { CONNECTION, KEYS } from '../constants/blockchain';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import {
  getAccountInfo,
  getAccountNamedKeyValue,
} from '../utils/contract-utils';

const { NODE_ADDRESS, CHAIN_NAME, CONTRACT_NAME } = CONNECTION;

const Buffer = BufferImported.Buffer;
const { Contract, toCLMap, fromCLMap } = Contracts;

export interface CEP47InstallArgs {
  name: string;
  contractName: string;
  symbol: string;
  meta: Map<string, string>;
  admin: CLKeyParameters;
}

export enum CEP47Events {
  MintOne = 'cep47_mint_one',
  TransferToken = 'cep47_transfer_token',
  BurnOne = 'cep47_burn_one',
  MetadataUpdate = 'cep47_metadata_update',
  ApproveToken = 'cep47_approve_token',
}

export const CEP47EventParser = (
  {
    contractPackageHash,
    eventNames,
  }: { contractPackageHash: string; eventNames: CEP47Events[] },
  value: any
) => {
  if (value.body.DeployProcessed.execution_result.Success) {
    const { transforms } =
      value.body.DeployProcessed.execution_result.Success.effect;

    const cep47Events = transforms.reduce((acc: any, val: any) => {
      if (
        val.transform.hasOwnProperty('WriteCLValue') &&
        typeof val.transform.WriteCLValue.parsed === 'object' &&
        val.transform.WriteCLValue.parsed !== null
      ) {
        const maybeCLValue = CLValueParsers.fromJSON(
          val.transform.WriteCLValue
        );
        const clValue = maybeCLValue.unwrap();
        if (clValue && clValue instanceof CLMap) {
          const hash = clValue.get(
            CLValueBuilder.string('contract_package_hash')
          );
          const event = clValue.get(CLValueBuilder.string('event_type'));
          if (
            hash &&
            // NOTE: Calling toLowerCase() because current JS-SDK doesn't support checksumed hashes and returns all lower case value
            // Remove it after updating SDK
            hash.value() === contractPackageHash.slice(5).toLowerCase() &&
            event &&
            eventNames.includes(event.value())
          ) {
            acc = [...acc, { name: event.value(), clValue }];
          }
        }
      }
      return acc;
    }, []);

    return { error: null, success: !!cep47Events.length, data: cep47Events };
  }

  return null;
};

const keyAndValueToHex = (key: CLValue, value: CLValue) => {
  const aBytes = CLValueParsers.toBytes(key).unwrap();
  const bBytes = CLValueParsers.toBytes(value).unwrap();

  const blaked = blake.blake2b(concat([aBytes, bBytes]), undefined, 32);
  const hex = Buffer.from(blaked).toString('hex');

  return hex;
};
class CEP47Client {
  casperClient: CasperClient;
  contractClient: Contracts.Contract;
  isContractIHashSetup = false;

  constructor(
    public nodeAddress: string,
    public networkName: string,
    contractHash?: string,
    contractPackageHash?: string
  ) {
    this.casperClient = new CasperClient(nodeAddress);
    this.contractClient = new Contract(this.casperClient);
    // if (contractHash) {
    // this.contractClient.setContractHash(contractHash, contractPackageHash);
    this.contractClient.setContractHash(
      // 'hash-92ea9d1a263f50c18f3786dcd94f580a5cd0ba5ca089031669867f8beb7dc64d',
      // 'hash-9e0705f217ba1082851eaed4e6afa7b35052b58b555fcc092a80afe20c4f732a'
      'hash-b719909a345f675935a2b5ba15d783a152998e9a0d7754e787ece873845600fa',
      'hash-d01f56e224ef7a7dc7b78e4b24d788a17e40edb186b0cfa750af4f33b4d38a1d'
      // 'hash-b8d0904bcea32cc9ad7b3ea57e9bcb3c7c9ff587aed16a0d2d54515c8e3b7707',
      // 'hash-9b415c680433078b16531c4127093b03fc12024c10368ae39fe113839d3f0812'
    );
    this.isContractIHashSetup = true;
    // }
  }

  public install(
    wasm: Uint8Array,
    args: CEP47InstallArgs,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      name: CLValueBuilder.string(args.name),
      contract_name: CLValueBuilder.string(args.contractName),
      symbol: CLValueBuilder.string(args.symbol),
      admin: CLValueBuilder.key(args.admin),
      meta: toCLMap(args.meta),
    });

    return this.contractClient.install(
      wasm,
      runtimeArgs,
      paymentAmount,
      deploySender,
      this.networkName,
      keys || []
    );
  }

  public setContractHash(contractHash: string, contractPackageHash?: string) {
    this.contractClient.setContractHash(contractHash, contractPackageHash);
    this.isContractIHashSetup = true;
  }

  public async name() {
    return this.contractClient.queryContractData(['name']);
  }

  public async symbol() {
    return this.contractClient.queryContractData(['symbol']);
  }

  public async meta() {
    return this.contractClient.queryContractData(['meta']);
  }

  public async totalSupply() {
    return this.contractClient.queryContractData(['total_supply']);
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

  public async balanceOf(account: CLPublicKey) {
    const result = await this.contractClient.queryContractDictionary(
      'balances',
      account.toAccountHashStr().slice(13)
    );

    const maybeValue = result.value().unwrap();

    return maybeValue.value().toString();
  }

  public async getOwnerOf(tokenId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'owners',
      tokenId
    );

    const maybeValue = result.value().unwrap();

    // return Buffer.from(maybeValue.value().value()).toString('hex');

    return `account-hash-${Buffer.from(maybeValue.value().value()).toString(
      'hex'
    )}`;
  }

  public async getTokenMeta(tokenId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'metadata',
      tokenId
    );

    const maybeValue = result.value().unwrap().value();

    return fromCLMap(maybeValue);
  }

  public async getMappedTokenMeta(tokenId: string) {
    const maybeValue: any = await this.getTokenMeta(tokenId);
    console.log(maybeValue);

    const jsMap: any = new Map();

    for (const [innerKey, value] of maybeValue) {
      jsMap.set(innerKey, value);
    }
    let mapObj = Object.fromEntries(jsMap);

    return mapObj;
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

  public async getBeneficiary(beneficiaryId: string) {
    const result = await this.contractClient.queryContractDictionary(
      'beneficiaries_list',
      beneficiaryId
    );

    const maybeValue = result.value().unwrap().value();

    return fromCLMap(maybeValue);
  }

  public async getTokenByIndex(owner: CLPublicKey, index: string) {
    const hex = keyAndValueToHex(
      CLValueBuilder.key(owner),
      CLValueBuilder.u256(index)
    );
    const result = await this.contractClient.queryContractDictionary(
      'owned_tokens_by_index',
      hex
    );

    const maybeValue = result.value().unwrap();

    return maybeValue.value().toString();
  }

  public async getIndexByToken(owner: CLKeyParameters, tokenId: string) {
    const hex = keyAndValueToHex(
      CLValueBuilder.key(owner),
      CLValueBuilder.u256(tokenId)
    );
    const result = await this.contractClient.queryContractDictionary(
      'owned_indexes_by_token',
      hex
    );

    const maybeValue = result.value().unwrap();

    return maybeValue.value().toString();
  }

  public async getAllowance(owner: CLKeyParameters, tokenId: string) {
    const hex = keyAndValueToHex(
      CLValueBuilder.key(owner),
      CLValueBuilder.string(tokenId)
    );
    const result = await this.contractClient.queryContractDictionary(
      'allowances',
      hex
    );

    const maybeValue = result.value().unwrap();

    return `account-hash-${Buffer.from(maybeValue.value().value()).toString(
      'hex'
    )}`;
  }

  public async approve(
    spender: CLKeyParameters,
    ids: string[],
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      spender: CLValueBuilder.key(spender),
      token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
    });

    return this.contractClient.callEntrypoint(
      'approve',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  public async mint(
    recipient: CLPublicKey,
    creatorName: string,
    metas: any,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const {
      title,
      description,
      image,
      price,
      isForSale,
      currency,
      campaign,
      creator,
      creatorPercentage,
      collection,
      collectionName,
      beneficiary,
      beneficiaryPercentage,
    } = metas;

    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLValueBuilder.key(recipient),
      creatorName: CLValueBuilder.string(creatorName),
      title: CLValueBuilder.string(title),
      description: CLValueBuilder.string(description),
      image: CLValueBuilder.string(image),
      price: CLValueBuilder.string(price),
      isForSale: CLValueBuilder.bool(isForSale),
      currency: CLValueBuilder.string(currency),
      campaign: CLValueBuilder.string(campaign),
      creator: CLValueBuilder.string(creator),
      creatorPercentage: CLValueBuilder.string(creatorPercentage),
      // isCollectionExist: CLValueBuilder.bool(!!collection),
      collection: CLValueBuilder.u256(collection),
      collectionName: CLValueBuilder.string(collectionName || ''),
      beneficiary: CLValueBuilder.string(beneficiary),
      beneficiaryPercentage: CLValueBuilder.string(beneficiaryPercentage),
    });

    return this.contractClient.callEntrypoint(
      'mint',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  // public async grantMinter() {
  //   const runtimeArgs = RuntimeArgs.fromMap({
  //     minter: CLValueBuilder.key(
  //       '01d42f6319ecc1ff18bc1d898558a4d8cc51991a8220e7ff74b97d000d8965f61a' as any
  //     ),
  //   });

  //   return this.contractClient.callEntrypoint(
  //     'grant_minter',
  //     runtimeArgs,
  //     deploySender,
  //     this.networkName,
  //     paymentAmount,
  //     keys
  //   );
  // }

  public async mintCopies(
    recipient: CLKeyParameters,
    ids: string[],
    meta: Map<string, string>,
    count: number,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLValueBuilder.key(recipient),
      token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
      token_meta: toCLMap(meta),
      count: CLValueBuilder.u32(count),
    });

    return this.contractClient.callEntrypoint(
      'mint_copies',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  public async burn(
    owner: CLKeyParameters,
    ids: string[],
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      owner: CLValueBuilder.key(owner),
      token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
    });

    return this.contractClient.callEntrypoint(
      'burn',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  public async transferFrom(
    recipient: CLKeyParameters,
    owner: CLKeyParameters,
    ids: string[],
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLValueBuilder.key(recipient),
      sender: CLValueBuilder.key(owner),
      token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
    });

    return this.contractClient.callEntrypoint(
      'transfer_from',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  public async transfer(
    recipient: CLKeyParameters,
    ids: string[],
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLValueBuilder.key(recipient),
      token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
    });

    return this.contractClient.callEntrypoint(
      'transfer',
      runtimeArgs,
      deploySender,
      this.networkName,
      PAYMENT_AMOUNTS.TRANSFER_ONE_PAYMENT_AMOUNT,
      keys
    );
  }

  public async purchaseNft(
    recipient: CLPublicKey,
    id: string,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLValueBuilder.key(recipient),
      token_id: CLValueBuilder.u256(id),
    });

    return this.contractClient.callEntrypoint(
      'purchase_token',
      runtimeArgs,
      recipient,
      this.networkName,
      PAYMENT_AMOUNTS.TRANSFER_ONE_PAYMENT_AMOUNT,
      keys
    );
  }

  public async updateTokenMeta(
    id: string,
    meta: Map<string, string>,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      token_id: CLValueBuilder.u256(id),
      token_meta: toCLMap(meta),
    });

    return this.contractClient.callEntrypoint(
      'update_token_meta',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  public async createCampaign(
    // ids: string[],
    name: string,
    description: string,
    wallet_address: string,
    url: string,
    requested_royalty: string,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      collection_ids: CLValueBuilder.list([CLValueBuilder.u256(0)]),
      mode: CLValueBuilder.string('ADD'),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      wallet_address: CLValueBuilder.string(wallet_address),
      url: CLValueBuilder.string(url),
      // recipient: CLValueBuilder.key(CLPublicKey.fromHex(wallet_address)),
      requested_royalty: CLValueBuilder.string(requested_royalty),
    });

    return this.contractClient.callEntrypoint(
      'create_campaign',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  public async addBeneficiary(
    name: string,
    description: string,
    address: string,
    paymentAmount: string,
    deploySender: CLPublicKey
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      mode: CLValueBuilder.string('ADD'),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      address: CLValueBuilder.string(address),
    });

    return this.contractClient.callEntrypoint(
      'add_beneficiary',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount
    );
  }

  public async addCollection(
    name: string,
    description: string,
    creator: string,
    url: string,
    paymentAmount: string,
    deploySender: CLPublicKey
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      token_ids: CLValueBuilder.list([CLValueBuilder.u256(0)]),
      mode: CLValueBuilder.string('ADD'),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      creator: CLValueBuilder.string(creator),
      url: CLValueBuilder.string(url),
    });

    return this.contractClient.callEntrypoint(
      'add_collection',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount
    );
  }

  public async addCreator(
    name: string,
    description: string,
    address: string,
    url: string,
    paymentAmount: string,
    deploySender: CLPublicKey
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      mode: CLValueBuilder.string('ADD'),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      address: CLValueBuilder.string(address),
      url: CLValueBuilder.string(url),
    });

    return this.contractClient.callEntrypoint(
      'add_creator',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount
    );
  }
}

export const cep47 = new CEP47Client(NODE_ADDRESS!, CHAIN_NAME!);
export const isContractIHashSetup = () => cep47.isContractIHashSetup;

export async function setupContractHash() {
  let accountInfo = await getAccountInfo(NODE_ADDRESS!, KEYS.DEPLOYER_ACC_HASH);
  console.log(`NFT contract deployer account Info:\n`, accountInfo);

  const contractHash = await getAccountNamedKeyValue(
    accountInfo,
    `${CONTRACT_NAME!}_contract_hash`
  );
  if (!contractHash) throw new Error('contract not found in deployer account');
  console.log(`NFT Contract Hash: \n${contractHash}`);
  return contractHash;
}

// setupContractHash()
//   .then((contractHash) => {
//     cep47.setContractHash(contractHash);
//   })
//   .catch((err) => console.log(err));
