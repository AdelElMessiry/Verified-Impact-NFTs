import React from 'react';
import { profileClient } from '../profileInfo';
beforeAll(() => jest.setTimeout(90 * 1000))

    
describe('fetch all profiles list from contract ..', () => {
  jest.setTimeout(30000);
test('fetch profile  data', async () => {
const data = await profileClient.getProfilesList()
expect(data).toBeDefined();
expect(data).toStrictEqual(data);
});})
afterAll(() => jest.setTimeout(5 * 1000))
