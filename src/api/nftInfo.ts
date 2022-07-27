import { CLPublicKey } from 'casper-js-sdk';

import { cep47 } from '../lib/cep47';
import { getRandomNumberBetween } from '../utils/calculations';
import { PAYMENT_AMOUNTS } from '../constants/paymentAmounts';
import { getDeployDetails } from '../api/universal';
import { getBeneficiariesList } from '../api/beneficiaryInfo';
import { getCampaignsList } from '../api/campaignInfo';
import { getCreatorsList } from '../api/creatorInfo';
import { getCollectionsList } from '../api/collectionInfo';
import { signDeploy } from '../utils/signer';
import { CONNECTION } from '../constants/blockchain';

export async function isIdOccupied(id: string): Promise<boolean> {
  id = String(Number(id));
  let owner = null;
  try {
    owner = await cep47.getOwnerOf(id);
    if (owner) {
      // console.log("owner of", id, "is", owner);
      // console.log("ID ", id, "is occupied");
      return true;
    }
  } catch (err) {
    // console.log("ID ", id, "is unoccupied");
    return false;
  }
  return owner ? true : false;
}

export async function generateUniqueID(): Promise<number> {
  let randID: number;
  do {
    randID = getRandomNumberBetween(1, 999999);
  } while (await isIdOccupied(String(randID)));
  console.log('Generated random unoccupied ID:', randID);
  console.log(await isIdOccupied(String(randID)));
  return randID;
}

export async function getNFTDetails(tokenId: string) {
  // console.log(tokenId);

  const nft_metadata = await cep47.getMappedTokenMeta(tokenId);
  console.log(`NFT ${tokenId} metadata: `, nft_metadata);
  return nft_metadata;
}

export async function getNFTsList() {
  const nftsCount: any = await cep47.totalSupply();
  // console.log(parseInt(nftsCount));

  const nftsList: any = [];
  for (let tokenId of [...(Array(parseInt(nftsCount)).keys() as any)]) {
    tokenId = tokenId + 1;

    const nft_metadata = await cep47.getMappedTokenMeta(tokenId.toString());
    const ownerAddress = await cep47.getOwnerOf(tokenId.toString());
    const isCreatorOwner =
      ownerAddress ===
      CLPublicKey.fromHex(nft_metadata.creator).toAccountHashStr();
    nftsList.push({ ...nft_metadata, isCreatorOwner, tokenId });
  }

  return nftsList;
}

export async function getCreatorNftList(address: string) {
  const creator = CLPublicKey.fromHex(address).toAccountHashStr();
  const nftList = await getNFTsList();

  for (const [index, nft] of nftList.entries()) {
    const owner = await cep47.getOwnerOf(nft.tokenId.toString());
    nftList[index].isOwner = owner === creator;
  }

  const creatorList = nftList.filter(
    (nft: any) => nft.creator === address
    // && nft.isOwner
  );

  return creatorList || [];
}

export async function setIsTokenForSale(
  isForSale: Boolean,
  tokenId: string,
  deploySender: CLPublicKey,
  price?: string
) {
  const nftDetails = await cep47.getMappedTokenMeta(tokenId);
  nftDetails['isForSale'] = isForSale.toString();
  isForSale && (nftDetails['price'] = price);

  const mappedNft = new Map(Object.entries(nftDetails));
  const updatedNftDeploy = await cep47.updateTokenMeta(
    tokenId,
    mappedNft,
    PAYMENT_AMOUNTS.MINT_ONE_PAYMENT_AMOUNT,
    deploySender
  );

  const signedUpdatedNftDeploy = await signDeploy(
    updatedNftDeploy,
    deploySender
  );
  console.log('Signed Updated NFT deploy:', signedUpdatedNftDeploy);

  const updatedNftDeployHash = await signedUpdatedNftDeploy.send(
    CONNECTION.NODE_ADDRESS
  );
  console.log('Deploy hash', updatedNftDeployHash);

  const deployUpdatedNftResult = await getDeployDetails(updatedNftDeployHash);
  console.log('...... NFT Updated successfully', deployUpdatedNftResult);

  return deployUpdatedNftResult;
}

export async function getMappedNfts() {
  const nftsList = await getNFTsList();
  nftsList.forEach((nft: any) => nft.isForSale === 'true');
  const beneficiariesList = await getBeneficiariesList();
  const campaignsList = await getCampaignsList();
  const creatorsList = await getCreatorsList();
  const collectionsList = await getCollectionsList();
  const uniqueCollections = collectionsList.filter(
    (collection: any, index: any, collections: any) =>
      index ===
      collections.findIndex((idx: any) => idx.name === collection.name)
  );

  const mappedNFTs = nftsList.map((nft: any) => ({
    ...nft,
    campaignName: campaignsList.find(({ id }: any) => nft.campaign === id).name,
    creatorName: creatorsList.find(
      ({ address }: any) => nft.creator === address
    ).name,
    beneficiaryName: beneficiariesList.find(
      ({ address }: any) => nft === address
    ).name,
    collectionName: collectionsList.find(({ id }: any) => nft.collection === id)
      .name,
  }));

  return {
    mappedNFTs,
    beneficiariesList,
    campaignsList,
    creatorsList,
    collectionsList,
    uniqueCollections,
  };
}

export function getMappedNftsByList(
  nftsList: any,
  beneficiariesList: any,
  campaignsList: any,
  creatorsList: any,
  collectionsList: any
) {
  const mappedList = nftsList.map((nft: any) => ({
    ...nft,
    campaignName: campaignsList.find(({ id }: any) => nft.campaign === id)
      ?.name,
    creatorName: creatorsList.find(
      ({ address }: any) => nft.creator === address
    )?.name,
    beneficiaryName: beneficiariesList.find(
      ({ address }: any) => nft.beneficiary === address
    )?.username,
    collectionName: collectionsList.find(({ id }: any) => nft.collection === id)
      ?.name,
  }));
  return mappedList;
}
