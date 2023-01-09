import axios from 'axios';

import { cep47 } from '../lib/cep47';
import { getCollectionsList } from './collectionInfo';
// fetch creator details from  the blockchain
export async function getCreatorDetails(creatorId: string) {
  const creatorDetails = await cep47.getCreator(creatorId);
  return creatorDetails;
}

export function parseCreator(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}
// fetch creators as a list 
export async function getCreatorsList() {
  const creatorCount: any = await cep47.totalCreators();

  const creatorsList: any = [];
  for (const id of [...(Array(parseInt(creatorCount)).keys() as any)]) {
    await getCreatorDetails((id + 1).toString())
      .then(async (rawCreator: any) => {
        const parsedCreator = parseCreator(rawCreator);
        parsedCreator.address =
          parsedCreator.address.includes('Account') ||
          parsedCreator.address.includes('Key')
            ? parsedCreator.address.includes('Account')
              ? parsedCreator.address.slice(13).replace(')', '')
              : parsedCreator.address.slice(10).replace(')', '')
            : parsedCreator.address;

        creatorsList.push(parsedCreator);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return creatorsList;
}
// map the  creators objects and parse the creators collections
export async function getCreatorsCollectionsList() {
  const creatorsList = await getCreatorsList();
  const collectionsList = await getCollectionsList();
  const mappedCreatorsList: any = [];

  const pluckedCollections = collectionsList
    .map(({ creator }: any) => creator)
    .filter(
      (creator: any, index: any, creators: any) =>
        creators.indexOf(creator) === index
    );

  creatorsList.forEach((creator: any) =>
    pluckedCollections.includes(creator.address)
      ? mappedCreatorsList.push({
          ...creator,
          collections: collectionsList.filter(
            (collection: any, index: any, collections: any) =>
              collection.creator === creator.address
          ),
        })
      : mappedCreatorsList.push({
          ...creator,
          collections: [],
        })
  );

  return mappedCreatorsList;
}
// map creators and push the collections as a prop on the creator object 
export async function _getCreatorsCollectionsList(
  creatorsList: any,
  collectionsList: any
) {
  const mappedCreatorsList: any = [];

  const pluckedCollections = collectionsList
    .map(({ creator }: any) => creator)
    .filter(
      (creator: any, index: any, creators: any) =>
        creators.indexOf(creator) === index
    );

  creatorsList.forEach((creator: any) =>
    pluckedCollections.includes(creator.address)
      ? mappedCreatorsList.push({
          ...creator,
          collections: collectionsList.filter(
            (collection: any, index: any, collections: any) =>
              collection.creator === creator.address &&
              index ===
                collections.findIndex(
                  (idx: any) => idx.name === collection.name
                )
          ),
        })
      : mappedCreatorsList.push({
          ...creator,
          collections: [],
        })
  );

  return mappedCreatorsList;
}

export async function getCachedCreatorsList() {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'creators';
  const creators: any = await axios(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`
  );

  return creators?.data.list;
}

export async function updateCachedCreator(creator: any, creators: any) {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'updateCreator';

  await axios.patch(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`,
    { creator }
  );

  creators[
    creators.findIndex(({ address }: any) => address === creator.address)
  ] = creator;

  return creators;
}
