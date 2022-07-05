import BuyNFTModal from '../BuyNFT'
import ReactDom from 'react-dom'
test('should render buynft component', ()=>{
   const div = document.createElement('div')
    ReactDom.render(<BuyNFTModal/> , div)
})