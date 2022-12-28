import axios from 'axios';

import { cep47 } from '../lib/cep47';

// helper function get collection details 
export async function getCollectionDetails(collectionId: string) {
  const collectionDetails = await cep47.getCollection(collectionId);
  return collectionDetails;
}

export function parseCollection(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getUniqueCollectionsList() {
  const collectionCount: any = await cep47.totalCollections();

  const collectionsList: any = [];
  for (const id of [...(Array(parseInt(collectionCount)).keys() as any)]) {
    await getCollectionDetails((id + 1).toString())
      .then(async (rawCollection: any) => {
        const parsedCollection = parseCollection(rawCollection);
        parsedCollection.creator =
          parsedCollection.creator.includes('Account') ||
          parsedCollection.creator.includes('Key')
            ? parsedCollection.creator.includes('Account')
              ? parsedCollection.creator.slice(13).replace(')', '')
              : parsedCollection.creator.slice(10).replace(')', '')
            : parsedCollection.creator;
        collectionsList.push(parsedCollection);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const uniqueCollections = collectionsList.filter(
    (collection: any, index: any, collections: any) =>
      index ===
      collections.findIndex((idx: any) => idx.name === collection.name)
  );

  return { uniqueCollections, collectionsList };
}

export async function getCollectionsList() {
  const collectionCount: any = await cep47.totalCollections();

  const collectionsList: any = [];
  for (const id of [...(Array(parseInt(collectionCount)).keys() as any)]) {
    await getCollectionDetails((id + 1).toString())
      .then(async (rawCollection: any) => {
        const parsedCollection = parseCollection(rawCollection);
        parsedCollection.creator =
          parsedCollection.creator.includes('Account') ||
          parsedCollection.creator.includes('Key')
            ? parsedCollection.creator.includes('Account')
              ? parsedCollection.creator.slice(13).replace(')', '')
              : parsedCollection.creator.slice(10).replace(')', '')
            : parsedCollection.creator;
        collectionsList.push(parsedCollection);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return collectionsList;
}

export async function getCachedCollectionsList() {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'collections';
  const collections: any = await axios(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`
  );

  return collections?.data.list;
}

export async function updateCachedCollection(
  collection: any,
  collections: any
) {
  const { REACT_APP_NFT_API_BASE_URL, REACT_APP_NFT_API_ENV } = process.env;
  const apiName = 'updateCollection';

  await axios.patch(
    `${REACT_APP_NFT_API_BASE_URL}/${REACT_APP_NFT_API_ENV}/${apiName}`,
    { collection }
  );

  collections[
    collections.findIndex(({ creator }: any) => creator === collection.creator)
  ] = collection;

  return collections;
}
