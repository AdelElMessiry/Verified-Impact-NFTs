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
  expect(data).toStrictEqual([{
creator: "0127271ea03f8cb24e0e3100d18e4d29fc860b35a2c9eb86ae4cca280a8fc40e1f",
description: "",
id: "1",
name: "A Hero's Stand",
token_ids: "0",
url: ""},{
creator: "0127271ea03f8cb24e0e3100d18e4d29fc860b35a2c9eb86ae4cca280a8fc40e1f",
description: "",
id: "2",
name: "Never Forget",
token_ids: "0",
url: ""
},{
creator: "0127271ea03f8cb24e0e3100d18e4d29fc860b35a2c9eb86ae4cca280a8fc40e1f",
description: "",
id: "3",
name: "Forever Keys",
token_ids: "0",
url: ""
},{

creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "4",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{

creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "5",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{

creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "6",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{

creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "7",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{
creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "8",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{
creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "9",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{
creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "10",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{
creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "11",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{
creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "12",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{
creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "13",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""
},{
creator: "01c82663493f5042af3b4247b07d3785978fb0491f75508a8da19b2b8792cee866",
description: "",
id: "14",
name: "Impact Cars",
token_ids: "0",
url: ""
},{
creator: "013171ea0c93f82b0d2b680e9f1ecdfbccb2cd79c17a06094d7e43be1274568c52",
description: "",
id: "15",
name: "Freedom for Ukraine",
token_ids: "0",
url: ""}
  ]
);
});})
afterAll(() => jest.setTimeout(5 * 1000))

