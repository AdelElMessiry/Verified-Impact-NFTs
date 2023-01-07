import React from 'react';
import UpdateProfile from '../updateProfile';
beforeAll(() => jest.setTimeout(90 * 1000))

    
describe('update profile api ..', () => {
  jest.setTimeout(70000);
test('update profile', async () => {
console.log("entityInfo.publicKey", process.env.REACT_APP_TEST_WALLET_PUBLIC_KEY )

let test = await UpdateProfile(
  process.env.REACT_APP_TEST_WALLET_PUBLIC_KEY,
  "test from  test api",
  "https://images.pexels.com/photos/14524982/pexels-photo-14524982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "test@test.com",
  "0000000000000"
  )
console.log(test)
expect(test).toBeDefined();
expect(test).toStrictEqual(test);
});})
afterAll(() => jest.setTimeout(5 * 1000))
