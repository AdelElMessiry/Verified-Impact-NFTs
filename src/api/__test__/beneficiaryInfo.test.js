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
  expect(data).toStrictEqual([
    {
      address:
        '01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c',
      description:
        'The Ministry of Digital Transformation (Ukrainian: Міністерство цифрової трансформації України) is a government ministry in Ukraine that was established on 29 August 2019 when Mykhailo Fedorov was appointed as Minister of Digital Transformation in the Honcharuk Government. Its current and first minister is Mykhailo Fedorov.',
      id: '1',
      name: 'Ukraine Gov',
    },
    {
      address:
        '01aa837e4f212d197b00be3d93c5d5ca08df00d6016ce39f293f295bbcb850707d',
      description: 'From our kids to all the kids of Ukraine',
      id: '2',
      name: 'Kids 4 Ukraine',
    },
  ]);
});})
afterAll(() => jest.setTimeout(5 * 1000))

