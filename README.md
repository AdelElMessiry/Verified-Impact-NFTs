# Verified-Impact-NFTs
An NFTs platform dedicated to impact causes with verification of the benificiaries. 

## Introduction
Welcome to the official Verified Impact NFTs docs. This manual aims to familiarize new and current users with Verified Impact NFTs, its products, and its services.
Two major issues remain unaddressed: 
1. The verification of the beneficiary and the sales proceeds split. 
2. The second objective is to apply the contract for the benefit of Ukraine, with artists ready to add their work.
### What is the Verified Impact NFTs website?
Verified Impact NFTs is an open-source platform created by the community for the community with a mission to launch an open financial network to donate to different causes and guarantees that beneficiaries can control the revenue splits through Verified Impact NFTs smart contract.

In any conventional donations platform, many bad actors pose as legitimate impact projects while depriving the actual projects of revenue. In the baes case, the impact project would only receive a fraction of the proceeds because the creator of the NFT controls the contract.

### Mission Statement
This project has two main objectives:
Creating a new type of NFT contract that will allow the beneficiary to issue a verified contract and the supporter of minting using this contract. The main benefit is that the funds will go directly to the verified beneficiary, who will control the percentage that goes to the support.
The second objective is to apply the contract for the benefit of Ukraine, with artists ready to add their work.


The steps below are a quick start if you have already set up your [develoment environment](https://docs.casperlabs.io/en/latest/dapp-dev-guide/setup-of-rust-contract-sdk.html), the [casper node](https://github.com/CasperLabs/casper-node), and the [nctl](https://github.com/CasperLabs/casper-node/tree/master/utils/nctl) testing tool. 


### Set up the Rust toolchain

You need the Rust toolchain to run the keys manager (or any other Casper smart contracts).

```bash
 rustup install $(cat rust-toolchain)
 rustup target add --toolchain $(cat rust-toolchain) wasm32-unknown-unknown
```

### Compile the Smart Contracts

To compile the WASM file, use these commands:

```bash
 cd contracts
 make prepare
 make build-contract
```

### Client installation

- Add your casper private key to ```.env.sample```
- Rename ```.env.sample``` file to ```.env```

- To install the client, run `yarn install`.

### Running prepared scenarios

```bash
yarn start
```
### Important Links
- Landing page: https://verifiedimpactnfts.com/#/
- Dev site: https://dev.verifiedimpactnfts.com/
- Casper Testnet: https://testnet.cspr.live/
- Staging: https://staging.verifiedimpactnfts.com/#/
- GitHub Repo: https://github.com/AdelElMessiry/Verified-Impact-NFTs
- GitHub Contract: https://github.com/AdelElMessiry/Verified-Impact-NFTs/tree/main/contracts 

### Essential Definitions and abbreviations:
- Beneficiary: The organization that will receive the sales proceeds.
- Creator: The person/ORG that will be minting NFTs on the platform to be bought for collecting donations for a specific campaign.
- Buyer/Donor: The person who will buy the NFTs to donate tokens.
- Campaign: A group of NFTs from one or more than one collection to be added together to serve a specific cause for a specific beneficiary.
- Collection: A group of NFTs owned by only one creator/artist.
- CSPR: The token used from Casper Labs.
- Requested Royality : The beneficiary defines it as the specific share for the organization to support its cause from the sales of any NFT minted for any campaign of this beneficiary 

## Prerequisites 
### Casper wallet extension.
**Manually add the site to the permitted list**
1. Download customed extension signer through this link. https://drive.google.com/drive/folders/1in3IHpGP7fp_V6AiHrYAgiTna5PHfKRP?usp=sharing 
2. Go To Google Extensions settings Chrome Settings -> Extensions.
3. Turn on the developer mode.
4. Click on “ Load unpacked “ and select the downloaded folder signer.

5. Click on the extension icon to open and create a new wallet.
6. Download the recover phrase to a safe place and don’t share it with anyone.
7. Open URL: https://verifiedimpactnfts.com/#/
8. Click on the Casper signer logo on the top right corner of the page and connect your wallet.

### Get CSPR tokens on the testnet.
1. Open Casper website “Faucet” page https://testnet.cspr.live/tools/faucet 
2. Connect your signer.
3. Click on the reCAPTCHA then click on “Request tokens”.
4. Wait for 2 min so that your transaction is confirmed.
5. Open the account page to check your CSPR tokens.

## Who are the primary users? 
### We have 3 user roles:
1. The Buyer/Donor User :

    While the NFTs could be bought for their actual artistic value, in most cases, the buyer/Donor would buy an NFT to contribute to a campaign in a non-direct way.
- The first step toward using the site is to Connect with Casper Signer.
- The Donor can find his purchased NFTs on the "My NFTs" page.
- The Donor can surf the website to see Creators, collections, campaigns, and the NFTs inside each one of the previous sections. 
- The Donor can see and read about the beneficiary.
- The Donor can have/own any NFT he desires after paying its price.
- The Donor should know that part of the price will go to the Beneficiary and the other part will be paid to the artist.
- The Donor can share the NFTs/Collections/Campaigns using Twitter.

2. The Creator User :

    The creator is the one who adds new NFTs based on an existing contract. Besides the buyer's abilities, the creator can also do the following:
- Display the current verified NFTs contracts.
- Select a verified NFT contract to use.
- Set the NFT properties including:
  - Title.
  - Description.
  - Price in CSPR.
- Ability to mint the NFT based on the contract.
- Ability to List the NFT for sale.

3. The Admin User : 

    The admin user will be in control of the deployer wallet and thus will be able to add new beneficiaries to the system. Although this is a centralized point, it will be updated in the next version.
    The admin user will be able to perform the following:
- Setting the beneficiary of the NFT sale (only by the deployer wallet).
- Set the wallet address for the beneficiary.
- Set the % of the initial sale to the creator.
- Set the royalties for subsequent sales.
- Allow the creator of minting based on the beneficiary contract.
- The admin has the ability to add a new campaign.

4. The Beneficiary User :
- The beneficiary should provide his paperwork for the admin so that the admin can proceed with the KYC and add the beneficiary and his campaigns to the system.
- The Beneficiary should contact the admin to add a new campaign and provide the admin with the campaign’s data.
- The beneficiary will collect his approved royalty from each sale. 
Ex: Beneficiary will collect 80% of the NFT price.


## Website Pages
### Home Page
 The home page is the main page and will contain the following data:
- KPIs which are numbers of beneficiaries, campaigns, collections, creators, NFTs, CSPR, and amount of donations in USD
- Connect to Casper.
- Wallet public key and CSPR amount.
- Beneficiaries, Creators, and My collection dropdowns.
- Latest campaigns and NFTs.
- Share Campaigns/NFTs on Twitter 
### Beneficiary Page
- Users can easily navigate between beneficiaries and their campaigns through the dropdown menu on the header.
- Users can view NFTs of any campaign and filter the NFTs regarding their choice from the dropdown menu or responsive filters which are found under the header.
- The Beneficiary page will include the Beneficiary’s name and description.
- The user can use an advanced filter to find a specific NFT
### My Creation page
The minted NFTs that are owned by the wallet holder will be visible on this page.
Creators will see their Minted NFTs.
### My NFTs page
The user will see the NFTs that he bought on this page.
### Creators page
The user can view the NFTs and campaigns of every creator from the dropdown on the header.
Users can view the NFTs of any creator and filter the NFTs regarding his choice from the dropdown menu or responsive filters which are found under the header.
Creators will be added automatically when minting a new NFT.

## Website Features 
### Adding a new Beneficiary (Admin only)
 After manual verification of the beneficiary’s cause and purpose, the admin user will add the beneficiary and its campaigns as the beneficiary wishes according to the data the beneficiary provides.
 Only the admin can use this feature as the admin is the holder of the deployer wallet that is responsible for adding the beneficiaries.
 Via a special page for the admin, you can - as admin with a deployer wallet connection - add the beneficiary name, description, and the wallet address to collect donations on it then Click on “ Create “ 
 Wait for the notification telling “ A beneficiary has been added successfully “.
 Refresh the page and hover over the header to verify that the beneficiary name is added to the beneficiary tab dropdown.
### Adding a new Campaign
1. Via a special window of the admin, you can fill in the details of the campaign 
2. Select the Beneficiary name correctly that is owning this campaign 
3. Fill in the Name, URL, and Description of the campaign 
4. Add the requested royalty for this campaign so that we can control the royalties shares as the beneficiary wishes and guarantee the impact on its cause 
5. Click on “ Create “ and Refresh the page 
6. hover over the header to verify that the campaign name is added to the beneficiary tab dropdown nested list under the beneficiary name
### Adding a new Creator
The creator will be automatically added from the Mint NFT page.
### Adding/Minting a new NFT
Creator has the ability to Mint a new NFT.
#### Minting “Not for Sale” NFT:
1. Click on the “ My Collection “ tab on the header.
2. Choose the “ My Creations “ option from the drop-down list.
3. Click on the “+” sign beside “ My Creations “ on the My Creations page.
4. On the minting page choose the beneficiary that you support their cause.
5. Choose the campaign name that best fits your NFTs.
6. If this is the first time for you to mint you should create the collection name by typing its name and clicking on ( Click here to create “ [Collection name] “ Collection ) and note that this collection will be saved and appear as a choice to mint under it again ( in future ) and on the header drop-down as well.
7. Also, you should type your name in the field of Creator name and be careful after minting that name can’t be changed.
8. Enter also the NFT name and upload the image by pasting the URL directly by clicking on the checkbox titled “Already hosted image, enter direct URL? “ or browsing your computer (default choice).
9. Add a description of the NFT to impress Donors.
10. Click on “ Mint “ and wait until the transaction is recorded to the Casper chain a notification will appear and the page will refresh.
- Note that: After minting a Not for Sale NFT it will appear only under the “My NFTs“ & “My Creations” tabs.

#### Minting a “ for Sale “ NFT:
1. Repeat all steps from the previous section 1:9.
Before minting click on the “ Is For Sale “ Checkbox. 
2. Add the price of your NFT and select the currency type.
3. Click on “ Mint “ and wait until the transaction is recorded to the Casper chain a notification will appear and the page will refresh.
- Note that: After minting a Not for Sale NFT it will appear under  “My NFTs “,“ My Creations” and the Homepage.

### Listing and unlisting the NFT for sale 
#### Listing - Not for Sale NFTs - For Sale 
- After the user mint A not for sale NFT it appears for the user only under “ My collections “ -> “ My Creations “ page 
- The user can hover over the NFT or click on it to see its details and action bar
- Inside that action bar the user can find the List for Sale icon 
- After he clicks a pop-up will appear to  enter the pice amount in CSPR to confirm the action and the user will sign on the Casper extension as well 
- The NFT will appear on the home page so any user can view it and buy
 

#### Unlisting - For Sale NFTs - For Sale
- After the user mint A for sale NFT it appears for all users on the home page and for the creator in  “ My collections “ -> “ My Creations “ page 
- The user can hover over the NFT or click on it to see its details and action bar
- Inside that action bar the user can find the Unlist for Sale icon 
- After he clicks a pop-up will appear to confirm the action and the user will sign on the Casper extension as well 
- The NFT will appear only in  “ My collections “ -> “ My Creations “ page 


### Buying an NFT
The creator user is a normal user who minted NFTs which means you still can buy NFTs from other creators also to support other causes as a donor.
1. Hover over any NFT from the home page to preview its details.
2. Click on the Shopping Cart icon on the right down of the NFT preview.
3. A pop-up will appear to click on the “Buy “ Button.
4. Casper extension will pop up twice so click on “ Sign “ to transfer the amount and wait for the notification of transfer success, then click on “ Sign “ again to deploy the transaction on the chain and wait for the notification of the deployment.
5. After the transaction is done you will see the bought NFT under the “My NFTs“ tab only.

## Workflow Example 
### Beneficiary Registration 
1. A Beneficiary, which is the organization that supports a special cause and needs to collect donations to continue its support, will contact the Verified Impact NFTs platform admin to add its’ campaigns on the platform and publish its cause.
2. The admin will do some investigation to verify whether this beneficiary is a real organization and comply with VINFT criteria or not 
3. After this verification, the beneficiary will get an answer whether its name and its’ campaigns are approved or not 
4. After the approval, the Beneficiary will send specific details about the organization and its’ campaigns to be published on the platform ( Most important detail is the Requested Royalty )
 The name of the beneficiary will appear in the drop-down list  of the header and its campaigns will be nested in it 
### Creator Registration 
1. The Creator is a normal Donor except that he will donate with his art or NFTs 
2. Any user can see the beneficiaries and read about their cause and campaigns. The creator can choose to mint NFTs to support any campaign and will receive sale share according to the Requested Royality which is defined by the beneficiary to guarantee the impact of donations 
3. During minting the Creator fill in his and the collection names which will be published also on the drop-down list of the platform header 
4. After minting this normal user/donor will turn into a creator user and will receive sales shares on his wallet 
5. The creator also can mint Not for Sale NFTs and offer them for sale later


### Donor 
1. The normal user is a donor who donates by buying the NFTs to support a campaign, the VINFT platform is made to verify the impact of this user donations 
2. This user can just hover over any NFT and read about its details and click to buy it 
3. The NFT will appear late under the “ My NFTs “ tab of this user and will be recorded on the chain 
4. After buying the NFT the amount of CSPR will be divided according to the Requested Royality between the Beneficiary and the Creator 

## Site Unit Tests
To run the unit tests, please do the following steps: 

```bash
yarn test 
```
### BuyNFTModal test
```bash

import BuyNFTModal from '../BuyNFT'
import ReactDom from 'react-dom'
test('should render buynft component', ()=>{
   const div = document.createElement('div')
    ReactDom.render(<BuyNFTModal/> , div)
})
```
### ListForSaleNFTModal test
```bash
import ListForSaleNFTModal from '../ListForSaleNFT'
import ReactDom from 'react-dom'
test('should render buynft component', ()=>{
   const div = document.createElement('div')
    ReactDom.render(<ListForSaleNFTModal show ={true} handleCloseParent={()=>{}} data= {{beneficiary: "01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c",
    beneficiaryName: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "1",
    campaignName: "Stand With Ukraine",
    collection: "1",
    collectionName: "A Hero's Stand",
    creator: "0127271ea03f8cb24e0e3100d18e4d29fc860b35a2c9eb86ae4cca280a8fc40e1f",
    creatorName: "NFT Punks",
    creatorPercentage: "20",
    currency: "CSPR",
    description: "Got bitten by the snake island and sank",
    image: "https://vi-nfts-storage.s3.us-east-2.amazonaws.com/NFT+Punks/A+Hero_s+Stand/Stamp_7.png",
    isForSale: "true",
    price: "100",
    title: "Snake Sunk ",
    tokenId: 3}} /> , div)
})
```
### NFTCard test
```bash
import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import NFTCard from "../NFTCard";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><NFTCard index={0} item={{beneficiary: "01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c",
    beneficiaryName: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "1",
    campaignName: "Stand With Ukraine",
    collection: "1",
    collectionName: "A Hero's Stand",
    creator: "0127271ea03f8cb24e0e3100d18e4d29fc860b35a2c9eb86ae4cca280a8fc40e1f",
    creatorName: "NFT Punks",
    creatorPercentage: "20",
    currency: "CSPR",
    description: "Got bitten by the snake island and sank",
    image: "https://vi-nfts-storage.s3.us-east-2.amazonaws.com/NFT+Punks/A+Hero_s+Stand/Stamp_7.png",
    isForSale: "true",
    price: "100",
    title: "Snake Sunk ",
    tokenId: 3}}/></BrowserRouter>,div)
})
```
### VideoPopup test
```bash
import VideoPopup from '../VideoPopup'
import ReactDom from 'react-dom'
test('should render buynft component', ()=>{
   const div = document.createElement('div')
    ReactDom.render(<VideoPopup/> , div)
})
```
### Header test 
```bash
import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Footer1 from '../Footer1'

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Footer1/></BrowserRouter>,div)
})
```
### Footer test
``` bash
import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Header1 from "../Header1";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Header1/></BrowserRouter>,div)
})
```
### Beneficiary info test 
```bash
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
```
### Campaign info test 
```bash
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
```
### Collection info test 
```bash
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

```