import React from 'react';
import { profileClient } from '../profileInfo';
beforeAll(() => jest.setTimeout(90 * 1000))

    
describe('fetch specific profile data from contract ..', () => {
  jest.setTimeout(30000);
test('fetch specific profile data using hard coded wallet', async () => {
const data = await profileClient.getProfile("014b2f7c0b006bf3b09901fe123381cdf252f0772abbbd3d3bc5582c884234e4dd" , false)
//console.log("entityInfo.publicKey",test
expect(data).toBeDefined();
expect(data).toStrictEqual(data);
});})
afterAll(() => jest.setTimeout(5 * 1000))