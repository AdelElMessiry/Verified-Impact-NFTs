import { cep47 } from '../lib/cep47';

export async function getCollectionDetails(collectionId: string) {
  console.log(collectionId);

  const collectionDetails = await cep47.getCollection(collectionId);
  console.log(`NFT ${collectionId} metadata: `, collectionDetails);
  return collectionDetails;
}

export async function parseCollection(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey, value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getCollectionsList() {
  const collectionCount = await cep47.totalCollections();

  const collectionsList: any = [];
  for (const id of [...(Array(collectionCount).keys() as any)]) {
    await getCollectionDetails(id.toString())
      .then((rawCollection: any) => {
        console.log(rawCollection);
        collectionsList.push(parseCollection(rawCollection));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return collectionsList;
}
