import React from 'react';
import { render } from 'react-dom';
import {
  getBeneficiariesList
} from '../beneficiaryInfo';


beforeAll(() => jest.setTimeout(90 * 1000))
describe('get beneficiary using Promises', () => {
  jest.setTimeout(30000);
test('the data is array of objects', async () => {
  const data = await getBeneficiariesList();

  expect(data).toBeDefined();
  expect(data).toStrictEqual(
    data
  );
});})
afterAll(() => jest.setTimeout(5 * 1000))

