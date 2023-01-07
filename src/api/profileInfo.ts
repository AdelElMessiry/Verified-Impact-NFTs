import {
  CLPublicKey,
  RuntimeArgs,
  CasperClient,
  Contracts,
  CLValueBuilder,
} from 'casper-js-sdk';
import axios from 'axios';

import { signDeploy } from '../utils/signer';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import {
  CONNECTION,
  PROFILE_CONTRACT_HASH,
  PROFILE_PACKAGE_HASH,
} from '../constants/blockchain';
import autoSign from './autoSign';
const { NODE_ADDRESS, CHAIN_NAME } = CONNECTION;

const { Contract } = Contracts;
// class to manage All profile contract functions
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
      address = isAccountHash
        ? address
        : CLPublicKey.fromHex(address).toAccountHashStr().slice(13);

      const result = await this.contractClient.queryContractDictionary(
        'profiles',
        address
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
  /**
   *
   * @param address 
   * @param address_pk 
   * @param username 
   * @param tagline 
   * @param imgUrl 
   * @param nftUrl 
   * @param firstName 
   * @param lastName 
   * @param externalLink 
   * @param phone 
   * @param twitter 
   * @param instagram 
   * @param facebook 
   * @param medium 
   * @param telegram 
   * @param mail 
   * @param profileType 
   * @param deploySender 
   * @param mode 
   * @param sdgs_ids 
   * @param has_receipt 
   * @param ein 
   * @param isUnitTest This param is responsible to detect if this call is to run the unit test or normal call
   * @returns 
   */

  public async addUpdateProfile(
    address: CLPublicKey,
    address_pk: string,
    username: string,
    tagline: string,
    imgUrl: string,
    nftUrl: string,
    firstName: string,
    lastName: string,
    // bio: string,
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
    mode?: string,
    sdgs_ids?: number[],
    has_receipt?: boolean,
    ein?: string,
    isUnitTest = false
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      mode: CLValueBuilder.string(mode ? mode : 'ADD'),
      address: CLValueBuilder.key(
        CLValueBuilder.byteArray(address.toAccountHash())
      ),
      address_pk: CLValueBuilder.string(address_pk),
      username: CLValueBuilder.string(username),
      tagline: CLValueBuilder.string(tagline),
      imgUrl: CLValueBuilder.string(imgUrl),
      nftUrl: CLValueBuilder.string(nftUrl),
      firstName: CLValueBuilder.string(firstName),
      lastName: CLValueBuilder.string(lastName),
      // bio: CLValueBuilder.string(bio),
      externalLink: CLValueBuilder.string(externalLink),
      phone: CLValueBuilder.string(phone),
      twitter: CLValueBuilder.string(twitter),
      instagram: CLValueBuilder.string(instagram),
      facebook: CLValueBuilder.string(facebook),
      medium: CLValueBuilder.string(medium),
      telegram: CLValueBuilder.string(telegram),
      mail: CLValueBuilder.string(mail),
      profileType: CLValueBuilder.string(profileType),
      sdgs_ids: sdgs_ids?.length
        ? CLValueBuilder.list(sdgs_ids.map((id) => CLValueBuilder.u256(id)))
        : CLValueBuilder.list([CLValueBuilder.u256(0)]),
      has_receipt: CLValueBuilder.bool(!!has_receipt),
      ein: CLValueBuilder.string(ein || ''),
    });
    const profileDeploy = this.contractClient.callEntrypoint(
      // 'add_profile',
      'create_profile',
      runtimeArgs,
      deploySender,
      this.networkName,
      PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT
    );
    
    let signedProfileDeploy :any;
    if(!isUnitTest){
      signedProfileDeploy = await signDeploy(profileDeploy, deploySender)
      console.log('Signed Profile deploy:', signedProfileDeploy);

      const profileDeployHash = await signedProfileDeploy.send(
        CONNECTION.NODE_ADDRESS!
      );
      console.log('Deploy hash', profileDeployHash);
      return profileDeployHash;
    }else{
      let profileDeployHash = await autoSign(runtimeArgs , deploySender , this.networkName ,PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,CONNECTION.NODE_ADDRESS! ,  this.contractClient)
      return profileDeployHash
    }
  }
  

  public async updateProfileBio(
    address: CLPublicKey,
    bio: string,
    profileType: string,
    deploySender: CLPublicKey
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      address: CLValueBuilder.key(
        CLValueBuilder.byteArray(address.toAccountHash())
      ),
      bio: CLValueBuilder.string(bio),
      profileType: CLValueBuilder.string(profileType),
    });

    const profileDeploy = this.contractClient.callEntrypoint(
      'update_profile_bio',
      runtimeArgs,
      deploySender,
      this.networkName,
      PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT
    );

    const signedProfileDeploy = await signDeploy(profileDeploy, deploySender);
    console.log('Signed Profile deploy:', signedProfileDeploy);

    const profileDeployHash = await signedProfileDeploy.send(
      CONNECTION.NODE_ADDRESS!
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

  public async getCachedProfilesList() {
    const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
    const apiName = 'profiles';

    const profiles: any = await axios(
      `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`
    );

    return profiles?.data.list;
  }

  public async updateCachedProfile(profile: any) {
    const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
    const apiName = 'updateProfile';

    const updatedProfiles: any = await axios.patch(
      `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`,
      { profile }
    );

    // profiles[
    //   profiles.findIndex(({ address }: any) => address === profile.address)
    // ] = profile;

    return updatedProfiles.data.profiles;
  }
}

export const profileClient = new ProfileClient();
