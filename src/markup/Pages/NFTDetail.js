import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import { useNFTState } from '../../contexts/NFTContext';

import VINftsTooltip from '../Element/Tooltip';

import BuyNFTModal from '../Element/BuyNFT';
import Layout from '../Layout';

//nft details component
const NFTDetail = () => {
  const search = useLocation().search;
  const { nfts } = useNFTState();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [item, setItem] = React.useState();
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();
  const [allNFTs, setAllNFTs] = React.useState();

  React.useEffect(() => {
    if (!allNFTs) {
      nfts && setAllNFTs(nfts);
      let nft = nfts && nfts.find(({ tokenId }) => tokenId === id);
      nft && setItem(nft);
    }
  }, [nfts, allNFTs, id]);

  const IconImage = ({ nft }) => {
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

  return (
    <Layout isNFTDetails={true}>
      <div className='page-content pb-0 bg-black-light pt-5'>
        {item?.length > 0 ? (
          <div className='content-block position-relative h-100vh'>
            {/* <!-- Project Details --> */}
            <div className='section-full content-inner-2 h-100vh'>
              <div className='container h-100'>
                <div className='row h-100'>
                  <div className='col text-center align-items-center align-content-center d-flex justify-content-center h-100'>
                    <img
                      src={item[0]?.image}
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
                  <h5>{item[0]?.title}</h5>
                  <p>Description: {item[0]?.description}</p>
                  <p>
                    <b>Category: </b>
                    {item[0]?.category}
                    &nbsp;&nbsp;
                    <b>Beneficiary: </b>
                    <VINftsTooltip
                      title={`Click to see all NFTs for "${item[0]?.beneficiaryName}" beneficiary`}
                    >
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${item[0]?.beneficiaryName}`}
                        className='dez-page text-white'
                      >
                        {item[0]?.beneficiaryName}
                      </Link>
                    </VINftsTooltip>
                    <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
                      {item[0]?.beneficiaryPercentage}%
                    </span>
                    &nbsp;&nbsp;
                    <b>Campaign: </b>
                    <VINftsTooltip
                      title={`Click to see all NFTs for "${item[0]?.campaignName}" campaign`}
                    >
                      {item[0]?.beneficiary ? (
                        <Link
                          to={`./BeneficiaryNFTs?beneficiary=${item[0]?.beneficiaryName}&campaign=${item[0]?.campaignName}`}
                          className='dez-page text-white'
                        >
                          {item[0]?.campaign}
                        </Link>
                      ) : (
                        <Link
                          to={`./CreatorNFTs?creator=${item[0]?.creator}&collection=${item[0]?.collectionName}`}
                          className='dez-page text-white'
                        >
                          {item[0]?.campaignName}
                        </Link>
                      )}
                    </VINftsTooltip>
                    &nbsp;&nbsp;
                    <b>Creator: </b>
                    <VINftsTooltip
                      title={`Click to see all NFTs created by "${item[0]?.creator}"`}
                    >
                      <Link
                        to={`./CreatorNFTs?creator=${item[0]?.creator}`}
                        className='dez-page text-white'
                      >
                        {item[0]?.creator}
                      </Link>
                    </VINftsTooltip>
                    <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
                      {item[0]?.creatorPercentage}%
                    </span>
                    &nbsp;&nbsp;
                    <b>Collection: </b>
                    {item[0]?.collectionName}
                  </p>
                  <p className='d-flex align-content-center align-items-center'>
                    <b>Price: </b>
                    {item[0]?.price} {item[0]?.currency} &nbsp;&nbsp;
                    <IconImage nft={item[0]} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='vinft-page-loader'>
            <div className='vinft-spinner-body'>
              <Spinner animation='border' variant='success' />
              <p>Fetching NFT Details Please wait...</p>
            </div>
          </div>
        )}
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
    </Layout>
  );
};
export default NFTDetail;
