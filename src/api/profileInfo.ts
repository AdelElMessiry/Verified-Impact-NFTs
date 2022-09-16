import {
  CLPublicKey,
  RuntimeArgs,
  CasperClient,
  Contracts,
  CLValueBuilder,
  CLAccountHash,
} from 'casper-js-sdk';

import { signDeploy } from '../utils/signer';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
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
      debugger;
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
          beneficiary: filteredBeneficiaryAccount.username.toLowerCase()==="usa for ukraine"?{ ...filteredBeneficiaryAccount, sdgs:["19"],"donationReceipt":true,"ein":"624230"}:{ ...filteredBeneficiaryAccount, sdgs:["19"],"donationReceipt":false,"ein":""},
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

  public async addUpdateProfile(
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
    deploySender: CLPublicKey,
    mode?: string
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      mode: CLValueBuilder.string(mode ? mode : 'ADD'),
      address: CLValueBuilder.key(
        CLValueBuilder.byteArray(address.toAccountHash())
      ),
      // address: CLValueBuilder.string(
      //   CLPublicKey.fromHex(address).toAccountHashStr()
      // ),
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

    const profileDeploy = this.contractClient.callEntrypoint(
      // 'add_profile',
      'create_profile',
      runtimeArgs,
      deploySender,
      this.networkName,
      PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT
    );

    const signedProfileDeploy = await signDeploy(profileDeploy, deploySender);
    console.log('Signed Profile deploy:', signedProfileDeploy);

    const profileDeployHash = await signedProfileDeploy.send(
      CONNECTION.NODE_ADDRESS
    );
    console.log('Deploy hash', profileDeployHash);
    return profileDeployHash;
  }

  public async getProfilesList() {
    const addresses: any = await this.profilesList();

    const mappedProfiles: any = [];
    for (const address of addresses) {
      const profile: any = await this.getProfile(address, true);
      mappedProfiles.push(profile);
    }

    return mappedProfiles;
  }
}

export const profileClient = new ProfileClient();
