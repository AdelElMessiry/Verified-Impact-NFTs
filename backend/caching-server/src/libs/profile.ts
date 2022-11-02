import { CLPublicKey, CasperClient, Contracts } from 'casper-js-sdk';

const {
  STAGE,
  NODE_RPC_MAINNET_ADDRESS,
  NODE_RPC_TESTNET_ADDRESS,
  PROFILE_CONTRACT_HASH_DEV,
  PROFILE_CONTRACT_HASH_PROD,
  PROFILE_PACKAGE_HASH_PROD,
  PROFILE_PACKAGE_HASH_DEV,
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
  STAGE === 'prod' ? PROFILE_CONTRACT_HASH_PROD : PROFILE_CONTRACT_HASH_DEV;
const CONTRACT_PACKAGE_HASH =
  STAGE === 'prod' ? PROFILE_PACKAGE_HASH_PROD : PROFILE_PACKAGE_HASH_DEV;

const { NODE_ADDRESS, CHAIN_NAME } = CONNECTION;

const { Contract } = Contracts;

class ProfileClient {
  casperClient: CasperClient;
  contractClient: Contracts.Contract;
  networkName: string;
  isContractIHashSetup = false;

  constructor() {
    this.casperClient = new CasperClient(NODE_ADDRESS!);
    this.contractClient = new Contract(this.casperClient);
    this.networkName = CHAIN_NAME;
    this.contractClient.setContractHash(
      `hash-${CONTRACT_HASH as string}`,
      `hash-${CONTRACT_PACKAGE_HASH}`
    );
    this.isContractIHashSetup = true;
  }

  public setContractHash(contractHash: string, contractPackageHash?: string) {
    this.contractClient.setContractHash(contractHash, contractPackageHash);
    this.isContractIHashSetup = true;
  }

  public async totalProfiles() {
    return this.contractClient.queryContractData(['total_profiles']);
  }

  public async profilesAddList() {
    const addresses: any = await this.contractClient.queryContractData([
      'all_profiles',
    ]);

    const mappedAddresses = addresses.map((address: any) =>
      Buffer.from(address.data.value()).toString('hex')
    );
    return mappedAddresses;
  }

  public async getProfile(address: string, isAccountHash?: Boolean) {
    try {
      const result = await this.contractClient.queryContractDictionary(
        'profiles',
        isAccountHash
          ? address
          : CLPublicKey.fromHex(address).toAccountHashStr().slice(13)
      );

      const maybeValue = result.value().unwrap().value();

      const jsMap: any = new Map();

      for (const [innerKey, value] of maybeValue) {
        jsMap.set(innerKey.data, value.data);
      }
      let mapObj = Object.fromEntries(jsMap);

      const filteredNormalAccount: any = Object.fromEntries(
        Object.entries(mapObj)
          .filter(([key]) => key.includes('normal'))
          ?.map((profileKey: any) => [
            profileKey[0].split('_').pop(),
            profileKey[0].split('_').pop() === 'address'
              ? profileKey[1].slice(10).replace(')', '')
              : profileKey[1],
          ])
      );
      const filteredBeneficiaryAccount: any = Object.fromEntries(
        Object.entries(mapObj)
          .filter(([key]) => key.includes('beneficiary'))
          ?.map((profileKey: any) => [
            profileKey[0].split('_').slice(1).join('_'),
            profileKey[0].split('_').pop() === 'address'
              ? profileKey[1].slice(10).replace(')', '')
              : profileKey[1],
          ])
      );
      const filteredCreatorAccount: any = Object.fromEntries(
        Object.entries(mapObj)
          .filter(([key]) => key.includes('creator'))
          ?.map((profileKey: any) => [
            profileKey[0].split('_').pop(),
            profileKey[0].split('_').pop() === 'address'
              ? profileKey[1].slice(10).replace(')', '')
              : profileKey[1],
          ])
      );

      return {
        [address]: {
          normal: { ...filteredNormalAccount },
          beneficiary:
            // Object.keys(filteredBeneficiaryAccount).length !== 0?(  filteredBeneficiaryAccount?.username?.toLowerCase() ===
            //   'usa for ukraine'
            //     ? {
            //         ...filteredBeneficiaryAccount,
            //         sdgs: ['19'],
            //         donationReceipt: true,
            //         ein: '624230',
            //       }
            //     : {
            //         ...filteredBeneficiaryAccount,
            //         sdgs: ['19'],
            //         donationReceipt: false,
            //         ein: '',
            //       }):
            { ...filteredBeneficiaryAccount },
          creator: { ...filteredCreatorAccount },
        },
      };
    } catch (err: any) {
      if (err.message.includes('ValueNotFound')) {
        return { err: 'Address Not Found' };
      }
      return { err };
    }
  }
}

export const profileClient = new ProfileClient();
