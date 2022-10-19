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
  CLByteArray,
  CLAccountHash,
  decodeBase16,
} from 'casper-js-sdk';
import { concat } from '@ethersproject/bytes';
import blake from 'blakejs';
import BufferImported from 'buffer/';

import {
  CONNECTION,
  KEYS,
  PROFILE_CONTRACT_HASH,
  NFT_CONTRACT_HASH,
  NFT_PACKAGE_HASH,
} from '../constants/blockchain';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import {
  getAccountInfo,
  getAccountNamedKeyValue,
  getNFTImage,
  isValidHttpUrl,
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
export interface ProfileInstallArgs {
  contractName: string;
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

  public installProfile(
    wasm: Uint8Array,
    args: ProfileInstallArgs,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      contract_name: CLValueBuilder.string(args.contractName),
      admin: CLValueBuilder.key(args.admin),
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

  public async _balanceOf(account: string, isHash?: boolean) {
    const result = await this.contractClient.queryContractDictionary(
      'balances',
      isHash
        ? account
        : CLPublicKey.fromHex(account).toAccountHashStr().slice(13)
    );

    const maybeValue = result.value().unwrap();

    return maybeValue.value().toString();
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

  public async getMappedTokenMeta(tokenId: string, isUpdate?: boolean) {
    const maybeValue: any = await this.getTokenMeta(tokenId);
    const jsMap: any = new Map();

    for (const [innerKey, value] of maybeValue) {
      jsMap.set(innerKey, value);
    }
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

  public async getBeneficiariesList() {
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

  public async _getTokenByIndex(
    owner: string,
    index: string,
    isHash?: boolean
  ) {
    const mappedOwner = isHash
      ? new CLAccountHash(decodeBase16(owner))
      : CLPublicKey.fromHex(owner);

    const hex = keyAndValueToHex(
      CLValueBuilder.key(mappedOwner),
      CLValueBuilder.u256(index)
    );
    const result = await this.contractClient.queryContractDictionary(
      'owned_tokens_by_index',
      hex
    );

    const maybeValue = result.value().unwrap();

    return maybeValue.value().toString();
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
      sdgs_ids,
      hasReceipt,
    } = metas;

    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLValueBuilder.key(recipient),
      creatorName: CLValueBuilder.string(creatorName),
      title: CLValueBuilder.string(title),
      description: CLValueBuilder.string(description),
      image: CLValueBuilder.string(image),
      price: CLValueBuilder.string(price),
      isForSale: CLValueBuilder.bool(isForSale),
      hasReceipt: CLValueBuilder.bool(hasReceipt),
      currency: CLValueBuilder.string(currency),
      campaign: CLValueBuilder.string(campaign),
      creator: CLValueBuilder.key(
        CLValueBuilder.byteArray(CLPublicKey.fromHex(creator).toAccountHash())
      ),
      creatorPercentage: CLValueBuilder.string(creatorPercentage),
      collection: CLValueBuilder.u256(collection),
      collectionName: CLValueBuilder.string(collectionName || ''),
      beneficiary: CLValueBuilder.key(
        CLValueBuilder.byteArray(Buffer.from(beneficiary, 'hex'))
      ),
      beneficiaryPercentage: CLValueBuilder.string(beneficiaryPercentage),
      profile_contract_hash: CLValueBuilder.string(
        `contract-${PROFILE_CONTRACT_HASH!}`
      ),
      sdgs_ids: CLValueBuilder.list(
        sdgs_ids?.length
          ? sdgs_ids.map((id: number) => CLValueBuilder.u256(id))
          : [CLValueBuilder.u256(0)]
      ),
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
    campaign_id: string,
    mode: string,
    name: string,
    description: string,
    wallet_address: CLAccountHash,
    beneficiary_address: CLAccountHash,
    url: string,
    requested_royalty: string,
    sdgs_ids: number[],
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      campaign_id: CLValueBuilder.u256(campaign_id),
      collection_ids: CLValueBuilder.list([CLValueBuilder.u256(0)]),
      mode: CLValueBuilder.string(mode),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      wallet_address: CLValueBuilder.key(wallet_address),
      beneficiary_address: CLValueBuilder.key(beneficiary_address),
      url: CLValueBuilder.string(url),
      // recipient: CLValueBuilder.key(CLPublicKey.fromHex(wallet_address)),
      requested_royalty: CLValueBuilder.string(requested_royalty),
      sdgs_ids: CLValueBuilder.list(
        sdgs_ids?.length
          ? sdgs_ids.map((id) => CLValueBuilder.u256(id))
          : [CLValueBuilder.u256(0)]
      ),
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
    beneficiaryId: string,
    name: string,
    description: string,
    address: CLByteArray,
    mode: string,
    sdgs_ids: number[],
    paymentAmount: string,
    deploySender: CLPublicKey
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      beneficiary_id: CLValueBuilder.u256(beneficiaryId),
      mode: CLValueBuilder.string(mode),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      address: CLValueBuilder.key(address),
      profile_contract_hash: CLValueBuilder.string(
        `contract-${PROFILE_CONTRACT_HASH!}`
      ),
      sdgs_ids: CLValueBuilder.list(
        sdgs_ids?.length
          ? sdgs_ids.map((id) => CLValueBuilder.u256(id))
          : [CLValueBuilder.u256(0)]
      ),
    });

    return this.contractClient.callEntrypoint(
      'add_beneficiary',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount
    );
  }

  public async approveBeneficiary(
    address: CLByteArray,
    address_pk: string,
    status: boolean,
    paymentAmount: string,
    deploySender: CLPublicKey
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      address: CLValueBuilder.key(address),
      address_pk: CLValueBuilder.string(address_pk),
      status: CLValueBuilder.bool(status),
      profile_contract_hash: CLValueBuilder.string(
        `contract-${PROFILE_CONTRACT_HASH!}`
      ),
    });

    return this.contractClient.callEntrypoint(
      'approve_beneficiary',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount
    );
  }

  public async addCollection(
    collection_id: string,
    mode: string,
    name: string,
    description: string,
    creator: string,
    url: string,
    paymentAmount: string,
    deploySender: CLPublicKey
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      collection_id: CLValueBuilder.u256(collection_id),
      token_ids: CLValueBuilder.list([CLValueBuilder.u256(0)]),
      mode: CLValueBuilder.string(mode),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      creator: CLValueBuilder.key(
        CLValueBuilder.byteArray(CLPublicKey.fromHex(creator).toAccountHash())
      ),
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
      address: CLValueBuilder.key(
        CLValueBuilder.byteArray(CLPublicKey.fromHex(address).toAccountHash())
      ),
      url: CLValueBuilder.string(url),
      profile_contract_hash: CLValueBuilder.string(
        `contract-${PROFILE_CONTRACT_HASH!}`
      ),
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

export const cep47 = new CEP47Client();
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
