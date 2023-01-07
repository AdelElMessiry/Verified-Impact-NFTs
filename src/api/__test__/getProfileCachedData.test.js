import React from 'react';
import { profileClient } from '../profileInfo';
beforeAll(() => jest.setTimeout(90 * 1000))

    
describe('fetch cached profiles data  from redis ..', () => {
  jest.setTimeout(30000);
test('fetch cached profile data', async () => {
const data = await profileClient.getCachedProfilesList()

expect(data).toBeDefined();
expect(data).toStrictEqual(data);
});})
afterAll(() => jest.setTimeout(5 * 1000))