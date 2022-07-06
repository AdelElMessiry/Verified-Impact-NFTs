import React from 'react';
import { render } from 'react-dom';
import { getCampaignsList } from '../campaignInfo';
beforeAll(() => jest.setTimeout(300 * 1000))

describe('get campaign using Promises', () => {
  jest.setTimeout(30000);
test('campaigns data is array of objects', async () => {

  const data = await getCampaignsList();
  expect(data).toBeDefined();
  expect(data).toStrictEqual([
    {
      collection_ids: '0',
      description: 'Stand with Ukraine people in their time of need!',
      id: '1',
      name: 'Stand With Ukraine',
      requested_royalty: '80',
      url: 'https://thedigital.gov.ua/',
      wallet_address:
        '01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c',
    },
    {
      collection_ids: '0',
      description:
        'Supporting more than 6 million Ukrainian refugees through a rough time!',
      id: '2',
      name: 'Refugees',
      requested_royalty: '80',
      url: 'https://thedigital.gov.ua/',
      wallet_address:
        '01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c',
    },
    {
      collection_ids: '0',
      description: "Let's build Ukraine better than ever!",
      id: '3',
      name: 'Reconstruction',
      requested_royalty: '80',
      url: 'https://thedigital.gov.ua/',
      wallet_address:
        '01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c',
    },
  ]);
});
})
afterAll(() => jest.setTimeout(5 * 1000))
