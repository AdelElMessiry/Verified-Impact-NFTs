import { cep47 } from '../lib/cep47';

export async function getCollectionDetails(collectionId: string) {
  // console.log(collectionId);

  const collectionDetails = await cep47.getCollection(collectionId);
  // console.log(`Collection ${collectionId} details: `, collectionDetails);
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
