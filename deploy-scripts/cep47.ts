import {
  CLPublicKey,
  CLMap,
  RuntimeArgs,
  CasperClient,
  Contracts,
  Keys,
  CLKeyParameters,
  CLValueBuilder,
  CLValueParsers,
  decodeBase16,
  CLByteArray,
} from 'casper-js-sdk';
import { config } from 'dotenv';

config({ path: '.env' });

const { NODE_ADDRESS, CHAIN_NAME, PROFILE_CONTRACT_HASH } = process.env;
const { Contract, toCLMap } = Contracts;

export interface CEP47InstallArgs {
  name: string;
  contractName: string;
  symbol: string;
  meta: Map<string, string>;
  admin: CLKeyParameters;
  profileContractHash: string;
}
export interface ProfileInstallArgs {
  // contractName: string;
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

class CEP47Client {
  casperClient: CasperClient;
  contractClient: Contracts.Contract;
  networkName: string;
  isContractIHashSetup = false;

  constructor() {
    this.casperClient = new CasperClient(NODE_ADDRESS!);
    this.contractClient = new Contract(this.casperClient);
    this.networkName = CHAIN_NAME!;
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
      profile_contract_hash: CLValueBuilder.string(args.profileContractHash),
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
      // contract_name: CLValueBuilder.string(args.contractName),
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

  public async getBeneficiariesList() {
    const result: any = await this.contractClient.queryContractData([
      'beneficiaries_addresses',
    ]);

    const mappedAddresses = result.map((address: any) =>
      Buffer.from(address.data.value()).toString('hex')
    );
    return mappedAddresses;
  }

  public async addBeneficiary(
    name: string,
    description: string,
    address: string,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      mode: CLValueBuilder.string('ADD'),
      name: CLValueBuilder.string(name),
      description: CLValueBuilder.string(description),
      address: CLValueBuilder.string(address),
      profile_contract_hash: CLValueBuilder.key(
        CLValueBuilder.byteArray(
          decodeBase16(
            '4100c91e9e30b2307b5a097c7ee8c0a96d7f06eeddd5ee943934b563646c268b'
          )
        )
      ),
      // profile_contract_hash: CLValueBuilder.string(PROFILE_CONTRACT_HASH!),
    });

    return this.contractClient.callEntrypoint(
      'add_beneficiary',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

  public async approveBeneficiary(
    address: CLByteArray,
    status: boolean,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      address: CLValueBuilder.key(address),
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
      paymentAmount,
      keys
    );
  }

  public async addProfile(
    address: any,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      mode: CLValueBuilder.string('ADD'),
      address: CLValueBuilder.key(address),
      // address: CLValueBuilder.string(
      //   CLPublicKey.fromHex(address).toAccountHashStr()
      // ),
      username: CLValueBuilder.string(''),
      tagline: CLValueBuilder.string(''),
      imgUrl: CLValueBuilder.string(''),
      nftUrl: CLValueBuilder.string(''),
      firstName: CLValueBuilder.string(''),
      lastName: CLValueBuilder.string(''),
      bio: CLValueBuilder.string(''),
      externalLink: CLValueBuilder.string(''),
      phone: CLValueBuilder.string(''),
      twitter: CLValueBuilder.string(''),
      instagram: CLValueBuilder.string(''),
      facebook: CLValueBuilder.string(''),
      medium: CLValueBuilder.string(''),
      telegram: CLValueBuilder.string(''),
      mail: CLValueBuilder.string(''),
      profileType: CLValueBuilder.string('beneficiary'),
    });

    return this.contractClient.callEntrypoint(
      'create_profile',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );
  }
}

export const cep47 = new CEP47Client();
