import { cep47 } from '../lib/cep47';

export async function getCollectionDetails(collectionId: string) {
  console.log(collectionId);

  const collectionDetails = await cep47.getCollection(collectionId);
  console.log(`Collection ${collectionId} details: `, collectionDetails);
  return collectionDetails;
}

export async function parseCollection(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getCollectionsList() {
  const collectionCount: any = await cep47.totalCollections();

  const collectionsList: any = [];
  for (const id of [...(Array(parseInt(collectionCount)).keys() as any)]) {
    await getCollectionDetails((id + 1).toString())
      .then(async (rawCollection: any) => {
        const parsedCollection = await parseCollection(rawCollection);
        collectionsList.push(parsedCollection);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return collectionsList;
}
