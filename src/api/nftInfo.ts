import { CLPublicKey } from 'casper-js-sdk';
import axios from 'axios';

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
import { getNFTImage, isValidHttpUrl } from '../utils/contract-utils';

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

export async function mapCachedNFTs(list: any) {
  const pluckedCreators = list
    .map(({ creator }: { creator: string }): string => creator)
    .filter(
      (creator: any, index: any, creators: any) =>
        creators.indexOf(creator) === index
    );

  const idsCreatorsOwn: any = {};

  for (let [i, creator] of pluckedCreators.entries()) {
    const balance = await cep47._balanceOf(creator, true);
    idsCreatorsOwn[creator] = [];
    for (let ownerIndex of [...(Array(parseInt(balance)).keys() as any)]) {
      const tokenId = await cep47._getTokenByIndex(creator, ownerIndex, true);

      idsCreatorsOwn[creator].push(tokenId);
    }
  }

  const nftsList: any = [];

  for (let nft of list) {
    const isCreatorOwner = idsCreatorsOwn[nft.creator].includes(
      nft.tokenId.toString()
    );

    nft.image = isValidHttpUrl(nft.image)
      ? nft.image
      : await getNFTImage(nft.image);

    nftsList.push({ ...nft, isCreatorOwner });
  }

  return nftsList;
}

export async function getNFTsList() {
  const nftsCount: any = await cep47.totalSupply();
  // console.log(parseInt(nftsCount));

  const nftsList: any = [];
  for (let tokenId of [...(Array(parseInt(nftsCount)).keys() as any)]) {
    tokenId = tokenId + 1;

    const nft_metadata = await cep47.getMappedTokenMeta(tokenId.toString());
    const ownerAddress = await cep47.getOwnerOf(tokenId.toString());

    // const isCreatorOwner = nft_metadata.creator.includes('Key')
    //   ? ownerAddress.slice(13) ===
    //     nft_metadata.creator.slice(10).replace(')', '')
    //   : ownerAddress === nft_metadata.creator;

    const isCreatorOwner =
      nft_metadata.creator.includes('Key') ||
      nft_metadata.creator.includes('Account')
        ? nft_metadata.creator.includes('Account')
          ? nft_metadata.creator.slice(13).replace(')', '') ===
            ownerAddress.slice(13)
          : nft_metadata.creator.slice(10).replace(')', '') ===
            ownerAddress.slice(13)
        : ownerAddress.slice(13) === nft_metadata.creator;

    nft_metadata.creator =
      nft_metadata.creator.includes('Account') ||
      nft_metadata.creator.includes('Key')
        ? nft_metadata.creator.includes('Account')
          ? nft_metadata.creator.slice(13).replace(')', '')
          : nft_metadata.creator.slice(10).replace(')', '')
        : nft_metadata.creator;
    // nft_metadata['sdgs'] = ['19'];
    nftsList.push({ ...nft_metadata, isCreatorOwner, tokenId });
  }

  return nftsList;
}

export async function getCachedNFTsList(oldNFTsState?: any) {
  const { REACT_APP_API_BASE_URL, REACT_APP_API_ENV } = process.env;
  const apiName = 'nfts';
  const nfts: any = await axios(
    `${REACT_APP_API_BASE_URL}/${REACT_APP_API_ENV}/${apiName}`
  );

  const newNFTs =
    oldNFTsState &&
    nfts?.data.list.filter(
      (newNFT: any) =>
        !oldNFTsState.some((oldNFT: any) => newNFT.tokenId === oldNFT.tokenId)
    );

  let mappedNFTs;
  if (newNFTs?.length > 0) {
    const newMappedNFTs = await mapCachedNFTs(newNFTs);
    mappedNFTs = oldNFTsState.concat(newMappedNFTs);
  } else if (oldNFTsState?.length) {
    mappedNFTs = oldNFTsState;
  } else {
    mappedNFTs = await mapCachedNFTs(nfts?.data.list);
  }

  return mappedNFTs;
}

export async function updateCachedNFT(nft: any, nfts: any) {
  const { REACT_APP_API_BASE_URL, REACT_APP_API_ENV } = process.env;
  const apiName = 'updatenft';

  await axios.patch(
    `${REACT_APP_API_BASE_URL}/${REACT_APP_API_ENV}/${apiName}`,
    { nft }
  );

  nfts[nfts.findIndex(({ tokenId }: any) => tokenId === nft.tokenId)] = nft;

  // const mappedNFTs = await mapCachedNFTs(updatedNFTs?.data.nfts);
  return nfts;
}

export async function getCreatorNftList(address: string) {
  const creator = CLPublicKey.fromHex(address).toAccountHashStr();

  const nftList = await getNFTsList();

  for (const [index, nft] of nftList.entries()) {
    const owner = await cep47.getOwnerOf(nft.tokenId.toString());
    nftList[index].isOwner = owner === creator;
  }

  const creatorList = nftList.filter(
    (nft: any) =>
      creator.includes('hash')
        ? nft.creator === creator.slice(13)
        : nft.creator === address

    // && nft.isOwner
  );

  return creatorList || [];
}

export async function getCachedCreatorNftList(address: string) {
  const creator = CLPublicKey.fromHex(address).toAccountHashStr();

  const nftList = await getCachedNFTsList();

  for (const [index, nft] of nftList.entries()) {
    const owner = await cep47.getOwnerOf(nft.tokenId.toString());
    nftList[index].isOwner = owner === creator;
  }

  const creatorList = nftList.filter(
    (nft: any) =>
      creator.includes('hash')
        ? nft.creator === creator.slice(13)
        : nft.creator === address

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
  const nftDetails = await cep47.getMappedTokenMeta(tokenId, true);
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

export async function setIsTokenHasReceipt(
  hasReceipt: Boolean,
  tokenId: string,
  deploySender: CLPublicKey
) {
  const nftDetails = await cep47.getMappedTokenMeta(tokenId, true);
  nftDetails['hasReceipt'] = hasReceipt.toString();

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
      ({ address }: any) => nft.beneficiary === address
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
