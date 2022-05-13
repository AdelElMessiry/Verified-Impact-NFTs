import { cep47 } from '../lib/cep47';
import { getCampaignsList } from './campaignInfo';

export async function getCreatorDetails(creatorId: string) {
  console.log(creatorId);

  const creatorDetails = await cep47.getCreator(creatorId);
  console.log(`NFT ${creatorId} creator: `, creatorDetails);
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
  const collectionsList = await getCampaignsList();
  const mappedCreatorsList: any = [];

  creatorsList.find((creator: any) =>
    collectionsList.length
      ? collectionsList.some(
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
      : mappedCreatorsList.push({ ...creator, collections: [] })
  );

  return mappedCreatorsList;
}
