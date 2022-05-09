import { NFTReference } from '../api/mint';
// import { INFT } from '../pages/dash';

export function parseNFT(rawData: Map<string, string>, id: string): any {
  const title = rawData.get('title');
  const description = rawData.get('description');
  const url = rawData.get('url');

  rawData.delete('title');
  rawData.delete('description');
  rawData.delete('url');

  return {
    id,
    title: title || 'Untitled',
    description: description || 'Description not available',
    url: url || 'invalid',
    // references: Array.from(
    //   rawData,
    //   ([key, value]) => new NFTReference(key, value)
    // ),
  };
}
