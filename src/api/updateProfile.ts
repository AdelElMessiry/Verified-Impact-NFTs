import React from 'react';
import { CLPublicKey } from 'casper-js-sdk';
import { profileClient } from './profileInfo';
import { getDeployDetails } from './universal';
// api update profile using for automation test only 
export default async function UpdateProfile(wallet: string, userName: string, nftUrl: string, mail:string, phone: string) {
    let walletCl = CLPublicKey.fromHex(wallet);
    let update = await profileClient.addUpdateProfile(
        walletCl,
        wallet,
        userName,
        "shortTagLine",
        "ProfileImgURL",
        "NFTImgURL",
        "firstName",
        "lastName",
        "externalSiteLink",
        mail,
        phone,
        "hht",
        "",
        "",
        "",
        "",
        'normal',
        walletCl,
        'ADD',
        [0],
        true,
        "",
        true //this parameter is responsible to pass if call for the test or normal call
    )
    let changedData = {};
    try {
        console.log(update , "     =================saveDeployHash")
        const deployResult = await getDeployDetails(update);
        console.log('...... Profile Saved successfully', deployResult);
        const pk = CLPublicKey.fromHex(wallet).toAccountHashStr()
        .slice(13);
        
        ;
          changedData = {
            [pk]: {
              normal: {
                address: CLPublicKey.fromHex(wallet)
                  .toAccountHashStr()
                  .slice(13),
                username: userName,
                address_pk: wallet,
                ein: '',
                externalLink: "",
                facebook: "",
                firstName: "",
                has_receipt: false,
                imgUrl: "",
                instagram: "",
                isApproved: "false",
                lastName: "",
                mail: "",
                medium: "",
                nftUrl: nftUrl,
                phone: "",
                tagline: "",
                telegram: "",
                twitter: "",                
                bio: '',
              },
              beneficiary: {},
              creator: {},
            },
          };

        console.log("chnaged Data",changedData)
        const updatedProfiles = await profileClient.updateCachedProfile(changedData);               

      } catch (err) {
        console.log(err , "error from ttest api ")
      }
    return changedData
}
