import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import Header from '../Layout/Header1';
import Footer from '../Layout/Footer1';
import VINFTsTooltip from '../Element/Tooltip';

import { getNFTsList } from '../../api/nftInfo';
import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import BuyNFTModal from '../Element/BuyNFT';

//nft details component
const NFTDetail = () => {
  const Iconimage = ({ nft }) => {
    return (
      <>
        <i
          className='ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen'
          onClick={() => {
            setSelectedNFT(nft);
            setShowBuyModal(true);
          }}
        ></i>
      </>
    );
  };
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [item, setItem] = useState();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState();

  useEffect(() => {
    (async () => {
      const newNFTList = await getNFTsList();
      let nft = newNFTList.filter((nft) => nft.tokenId == id);
      setItem(nft);
    })();
  }, [id]);

  return (
    <>
      <Header isNFTDetails={true} />
      <div className='page-content pb-0 bg-white pt-5'>
        <div className='content-block position-relative h-100vh'>
          {/* <!-- Project Details --> */}
          <div className='section-full content-inner-2 h-100vh'>
            <div className='container h-100'>
              <div className='row h-100'>
                <div className='col text-center align-items-center align-content-center d-flex justify-content-center h-100'>
                  <img
                    src={item[0].image}
                    alt=''
                    className='img img-fluid fit-img'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='detail-page-caption p-3'>
            <div className='align-b text-white text-left'>
              <div className='text-white text-left port-box'>
                <h5>{item[0].title}</h5>
                <p>Description: {item[0].description}</p>
                <p>
                  <b>Category: </b>
                  {item[0].category}
                  &nbsp;&nbsp;
                  <b>Beneficiary: </b>
                  <VINFTsTooltip
                    title={`Click to see all NFTs for "${item[0].beneficiaryName}" beneficiary`}
                  >
                    <Link
                      to={`./BenefeiciaryNFTs?beneficiary=${item[0].beneficiaryName}`}
                      className='dez-page text-white'
                    >
                      {item[0].beneficiaryName}
                    </Link>
                  </VINFTsTooltip>
                  <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
                    {item[0].beneficiaryPercentage}%
                  </span>
                  &nbsp;&nbsp;
                  <b>Campaign: </b>
                  <VINFTsTooltip
                    title={`Click to see all NFTs for "${item[0].campaignName}" campaign`}
                  >
                    {item[0].beneficiary ? (
                      <Link
                        to={`./BenefeiciaryNFTs?beneficiary=${item[0].beneficiaryName}&campaign=${item[0].campaignName}`}
                        className='dez-page text-white'
                      >
                        {item[0].campaign}
                      </Link>
                    ) : (
                      <Link
                        to={`./CreatorNFTs?creator=${item[0].creator}&collection=${item[0].collectionName}`}
                        className='dez-page text-white'
                      >
                        {item[0].campaignName}
                      </Link>
                    )}
                  </VINFTsTooltip>
                  &nbsp;&nbsp;
                  <b>Creator: </b>
                  <VINFTsTooltip
                    title={`Click to see all NFTs created by "${item[0].creator}"`}
                  >
                    <Link
                      to={`./CreatorNFTs?creator=${item[0].creator}`}
                      className='dez-page text-white'
                    >
                      {item[0].creator}
                    </Link>
                  </VINFTsTooltip>
                  <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
                    {item[0].creatorPercentage}%
                  </span>
                  &nbsp;&nbsp;
                  <b>Collection: </b>
                  {item[0].collectionName}
                </p>
                <p className='d-flex align-content-center align-items-center'>
                  <b>Price: </b>
                  {item[0].price} {item[0].currency} &nbsp;&nbsp;
                  <Iconimage nft={item[0]} />
                  &nbsp;&nbsp;
                  <NFTTwitterShare item={item[0]} />
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- contact area END --> */}
      </div>
      {showBuyModal && (
        <BuyNFTModal
          show={showBuyModal}
          handleCloseParent={() => {
            setShowBuyModal(false);
          }}
          data={selectedNFT}
          isTransfer={false}
        />
      )}
      <Footer />
    </>
  );
};
export default NFTDetail;
