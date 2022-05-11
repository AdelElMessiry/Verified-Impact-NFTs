import { cep47 } from '../lib/cep47';
import { getCampaignsList } from './campaignInfo';

export async function getCreatorDetails(creatorId: string) {
  console.log(creatorId);

  const creatorDetails = await cep47.getCreator(creatorId);
  console.log(`NFT ${creatorId} metadata: `, creatorDetails);
  return creatorDetails;
}

export async function parseCreator(maybeValue: any) {
  const jsMap: any = new Map();

  for (const [innerKey, value] of maybeValue) {
    jsMap.set(innerKey, value);
  }
  let mapObj = Object.fromEntries(jsMap);

  return mapObj;
}

export async function getCreatorsList() {
  const creatorCount = await cep47.totalCreators();

  const creatorsList: any = [];
  for (const id of [...(Array(creatorCount).keys() as any)]) {
    await getCreatorDetails(id.toString())
      .then((rawCreator: any) => {
        console.log(rawCreator);
        creatorsList.push(parseCreator(rawCreator));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return creatorsList;
}

export async function getCreatorsCollectionsList() {
  const creatorsList = await getCreatorsList();
  const collectionsList = await getCampaignsList();
  const mappedCreatorsList: any = [];

  creatorsList.find((creator: any) =>
    collectionsList.some(
      (collection: any) =>
        creator.address === collection.creator &&
        mappedCreatorsList.find((newCreator: any) =>
          creator.address === newCreator.address
            ? newCreator.collections.push(creator)
            : mappedCreatorsList.push({
                ...creator,
                collections: [collection],
              })
        )
    )
  );

  return mappedCreatorsList;
}
