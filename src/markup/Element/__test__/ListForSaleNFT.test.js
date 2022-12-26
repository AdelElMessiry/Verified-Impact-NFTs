import ListForSaleNFTModal from '../ListForSaleNFT'
import ReactDom from 'react-dom';
import { NFTProvider } from '../../../contexts/NFTContext';
test('should render buynft component', ()=>{
   const div = document.createElement('div')
    ReactDom.render(
        <NFTProvider>
    <ListForSaleNFTModal show ={true} handleCloseParent={()=>{}} data= {{beneficiary: "01501b4037bdeffd70849a86698922f6f3ed2ff52dad5235b2472b09ae66e48e8c",
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
    tokenId: 3}} /> 
    </NFTProvider>
    , div)
})