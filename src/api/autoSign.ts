import React from 'react'
import { Keys } from 'casper-js-sdk';

export default async function autoSign(runtimeArgs:any ,deploySender:any, networkName :any, paymentAmount:any , nodeAddress:any, contractClient:any) {
    
      const privateKey  = Keys.Ed25519.parsePrivateKey(Keys.Ed25519.readBase64WithPEM(`${process.env.REACT_APP_TEST_WALLET_PRIVATE_KEY}`));
      var PrK = new Uint8Array(privateKey);
      const publicKey = await Keys.Ed25519.privateToPublicKey(PrK)
      const KEYS = Keys.Ed25519.parseKeyPair(publicKey, privateKey);    
      
      const profileDeploy = contractClient.callEntrypoint(
        'create_profile',
        runtimeArgs,
        deploySender,
        networkName,
        paymentAmount,
        [KEYS]
      );
      const profileDeployHash = await profileDeploy.send(
        nodeAddress
      );
       return profileDeployHash
}
