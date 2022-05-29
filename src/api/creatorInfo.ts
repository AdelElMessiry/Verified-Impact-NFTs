import { cep47 } from '../lib/cep47';
import { getCollectionsList } from './collectionInfo';

export async function getCreatorDetails(creatorId: string) {
  const creatorDetails = await cep47.getCreator(creatorId);
  // console.log(`Creator ${creatorId} : `, creatorDetails);
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

export async function getCreatorsList() {
  const creatorCount: any = await cep47.totalCreators();

  const creatorsList: any = [];
  for (const id of [...(Array(parseInt(creatorCount)).keys() as any)]) {
    await getCreatorDetails((id + 1).toString())
      .then(async (rawCreator: any) => {
        const parsedCreator = parseCreator(rawCreator);
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
            // &&
            // index ===
            //   collections.findIndex(
            //     (idx: any) => idx.name === collection.name
            //   )
          ),
        })
      : mappedCreatorsList.push({
          ...creator,
          collections: [],
        })
  );

  return mappedCreatorsList;
}
export async function _getCreatorsCollectionsList(
  creatorsList: any,
  collectionsList: any
) {
  // const creatorsList = await getCreatorsList();
  // const collectionsList = await getCollectionsList();
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
