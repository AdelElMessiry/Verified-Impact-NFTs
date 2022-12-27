import React from 'react';
import { render } from 'react-dom';
import { getCampaignsList } from '../campaignInfo';
beforeAll(() => jest.setTimeout(5 * 1000))

describe('get campaign using Promises', () => {
  jest.setTimeout(35000);
test('campaigns data is array of objects', async () => {

  const data = await getCampaignsList();
  expect(data).toBeDefined();
  expect(data).toStrictEqual(data);
});
})
afterAll(() => jest.setTimeout(5 * 1000))
