import {
  CLPublicKey,
  RuntimeArgs,
  CasperClient,
  Contracts,
  CLValueBuilder,
} from 'casper-js-sdk';

import {
  CONNECTION,
  PROFILE_CONTRACT_HASH,
  PROFILE_PACKAGE_HASH,
} from '../constants/blockchain';

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
      `hash-${PROFILE_CONTRACT_HASH as string}`,
      `hash-${PROFILE_PACKAGE_HASH}`
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

  public async profilesList() {
    return this.contractClient.queryContractData(['profiles']);
  }

  public async getProfile(address: string) {
    const result = await this.contractClient.queryContractDictionary(
      'profiles_list',
      CLPublicKey.fromHex(address).toAccountHashStr().slice(13)
    );

    const maybeValue = result.value().unwrap().value();

    const jsMap: any = new Map();

    for (const [innerKey, value] of maybeValue) {
      jsMap.set(innerKey, value);
    }
    let mapObj = Object.fromEntries(jsMap);

    const isNormalProfile = Object.keys(mapObj).join('-').includes('normal');
    const isBeneficiaryProfile = Object.keys(mapObj).includes('beneficiary');
    const isCreatorProfile = Object.keys(mapObj).includes('creator');

    const filteredNormalAccount: any =
      isNormalProfile &&
      Object.fromEntries(
        Object.entries(mapObj).filter(([key]) => key.includes('normal'))
      );
    const filteredBeneficiaryAccount: any =
      isBeneficiaryProfile &&
      Object.fromEntries(
        Object.entries(mapObj).filter(([key]) => key.includes('beneficiary'))
      );
    const filteredCreatorAccount: any =
      isCreatorProfile &&
      Object.fromEntries(
        Object.entries(mapObj).filter(([key]) => key.includes('creator'))
      );

    return {
      [address]: {
        normal: { ...filteredNormalAccount },
        beneficiary: { ...filteredBeneficiaryAccount },
        creator: { ...filteredCreatorAccount },
      },
    };
  }

  public async addProfile(
    address: CLPublicKey,
    username: string,
    tagline: string,
    imgUrl: string,
    nftUrl: string,
    firstName: string,
    lastName: string,
    bio: string,
    externalLink: string,
    phone: string,
    twitter: string,
    instagram: string,
    facebook: string,
    medium: string,
    telegram: string,
    mail: string,
    profileType: string,
    paymentAmount: string,
    deploySender: CLPublicKey,
    mode?: string
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      mode: CLValueBuilder.string(mode ? mode : 'ADD'),
      address: CLValueBuilder.key(address),
      username: CLValueBuilder.string(username),
      tagline: CLValueBuilder.string(tagline),
      imgUrl: CLValueBuilder.string(imgUrl),
      nftUrl: CLValueBuilder.string(nftUrl),
      firstName: CLValueBuilder.string(firstName),
      lastName: CLValueBuilder.string(lastName),
      bio: CLValueBuilder.string(bio),
      externalLink: CLValueBuilder.string(externalLink),
      phone: CLValueBuilder.string(phone),
      twitter: CLValueBuilder.string(twitter),
      instagram: CLValueBuilder.string(instagram),
      facebook: CLValueBuilder.string(facebook),
      medium: CLValueBuilder.string(medium),
      telegram: CLValueBuilder.string(telegram),
      mail: CLValueBuilder.string(mail),
      profileType: CLValueBuilder.string(profileType),
    });

    return this.contractClient.callEntrypoint(
      'add_profile',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount
    );
  }

  public async getProfilesList() {
    const addresses: any = await this.profilesList();

    const mappedProfiles: any = [];
    for (const address of addresses) {
      console.log(address);
      const profile = await this.getProfile(address);
      mappedProfiles.push(profile);
    }

    return mappedProfiles;
  }
}

export const profileClient = new ProfileClient();
