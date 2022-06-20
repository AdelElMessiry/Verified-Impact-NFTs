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
} from 'casper-js-sdk';
import { config } from 'dotenv';

config({ path: '.env' });

const { NODE_ADDRESS, CHAIN_NAME } = process.env;
const { Contract, toCLMap } = Contracts;

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
    console.log(wasm);
    console.log(args);
    console.log(paymentAmount);
    console.log(deploySender);
    console.log(keys);

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
}

export const cep47 = new CEP47Client();
