import { CLPublicKey, DeployUtil, Signer } from 'casper-js-sdk';
import { Deploy } from 'casper-js-sdk/dist/lib/DeployUtil';
// open cspr extension 
export const signDeploy = async (deploy: Deploy, publicKey: CLPublicKey) => {
  const publicKeyHex = publicKey.toHex();
  return await signDeployHex(deploy, publicKeyHex);
};
// sign the deploy hash after get user signature
export const signDeployHex = async (deploy: Deploy, publicKeyHex: string) => {
  const deployJSON = DeployUtil.deployToJson(deploy);
  const signedDeployJSON = await Signer.sign(
    deployJSON,
    publicKeyHex,
    publicKeyHex
  ).catch((err) => console.log(err));
  const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

  return signedDeploy;
};
