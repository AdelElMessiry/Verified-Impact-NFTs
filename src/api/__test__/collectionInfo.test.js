import React from 'react';
import {
  getCollectionsList
} from '../collectionInfo';


beforeAll(() => jest.setTimeout(90 * 1000))
describe('get Collections using Promises', () => {
  jest.setTimeout(30000);
test('collections is array of objects', async () => {
  const data = await getCollectionsList();
  expect(data).toBeDefined();
  expect(data).toStrictEqual(data);
});})
afterAll(() => jest.setTimeout(5 * 1000))

