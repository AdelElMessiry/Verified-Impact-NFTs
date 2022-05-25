import { cep47 } from '../lib/cep47';
import { getCollectionsList } from './collectionInfo';

export async function getCreatorDetails(creatorId: string) {
  console.log(creatorId);

  const creatorDetails = await cep47.getCreator(creatorId);
  console.log(`NFT ${creatorId} creator: `, creatorDetails);
  return creatorDetails;
}

export async function parseCreator(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey.replace(/\s/g, '').replace(/[':]+/g, ''), value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getCreatorsList() {
  const creatorCount: any = await cep47.totalCreators();

  const creatorsList: any = [];
  for (const id of [...(Array(parseInt(creatorCount)).keys() as any)]) {
    await getCreatorDetails((id + 1).toString())
      .then(async (rawCreator: any) => {
        console.log(rawCreator);
        const parsedCreator = await parseCreator(rawCreator);
        creatorsList.push(parsedCreator);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return creatorsList;
}

export async function getCreatorsCollectionsList() {
  const creatorsList = await getCreatorsList();
  const collectionsList = await getCollectionsList();
  const mappedCreatorsList: any = [];

  creatorsList.filter((creator: any, index: any) =>
    collectionsList.length
      ? collectionsList.map((collection: any) => {
          !mappedCreatorsList.length &&
            mappedCreatorsList.push({ ...creator, collections: [] });
          return (
            creator.address === collection.creator &&
            mappedCreatorsList.find(
              (newCreator: any, index: any, creators: any) => {
                return creators.indexOf(newCreator) === index
                ? mappedCreatorsList[index].collections.push(collection)
                : mappedCreatorsList.push({
                    ...creator,
                    collections: [collection],
                  });
            })
          );
        })
      : mappedCreatorsList.push({ ...creator, collections: [] })
  );
  console.log(mappedCreatorsList);

  return mappedCreatorsList;
}
