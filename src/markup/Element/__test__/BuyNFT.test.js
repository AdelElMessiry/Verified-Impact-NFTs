import BuyNFTModal from '../BuyNFT'
import ReactDom from 'react-dom';
import { NFTProvider } from '../../../contexts/NFTContext';
test('should render buynft component', ()=>{
   const div = document.createElement('div')
    ReactDom.render(
    <NFTProvider>
        <BuyNFTModal/> 
    </NFTProvider>
    , div)
})