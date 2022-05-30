import React from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import Lightbox from 'react-image-lightbox';
import Masonry from 'react-masonry-component';
import Carousel from 'react-elastic-carousel';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';

import { useNFTState } from '../../contexts/NFTContext';

import { VideoPopup2 } from '../Element/VideoPopup';
import { CaptionCampaign } from '../Element/CaptionCampaign';
import NFTCard from '../Element/NFTCard';
import BuyNFTModal from '../Element/BuyNFT';
import Layout from '../Layout';
import CampaignOrCollectionTwitterShare from '../Element/TwitterShare/CampaignOrCollectionTwitterShare';
//Light Gallery on icon click

//Images..
import bgImg from './../../images/main-slider/slide6.jpg';

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 992, itemsToShow: 4 },
  { width: 1200, itemsToShow: 4 },
];

const options = {
  buttons: { showDownloadButton: false },
};
// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };

const Dashboard = () => {
  const { beneficiaries, campaigns, creators, nfts, uniqueCollections } =
    useNFTState();
  const [openSliderCamp, setOpenSliderCamp] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState();
  const [sliderCaptionsCamp, setSliderCaptionsCamp] = React.useState([]);
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();
  const [beneficiariesLength, setBeneficiariesLength] = React.useState();
  const [campaignsLength, setCampaignsLength] = React.useState();
  const [creatorsLength, setCreatorsLength] = React.useState();
  const [collectionsLength, setCollectionLength] = React.useState();
  const [csprSum, setCsprSum] = React.useState();
  const [allNfts, setAllNfts] = React.useState();
  const [displayedCampaigns, setDisplayedCampaigns] = React.useState();
  const [selectedCampaign, setSelectedCampaign] = React.useState();

  const getNftsList = React.useCallback(async () => {
    let nftsList;
    if (!allNfts) {
      nftsList = nfts && nfts;
      nftsList && setAllNfts(nfts);
      nfts && setSelectedNFT(nfts);
      nfts &&
        setCsprSum(
          nfts.reduce((xPrice, { price }) => Number(xPrice) + Number(price), 0)
        );

      beneficiaries && setBeneficiariesLength(beneficiaries.length);
      campaigns && setCampaignsLength(campaigns.length);
      creators && setCreatorsLength(creators.length);
      uniqueCollections && setCollectionLength(uniqueCollections.length);
    }

    if (!displayedCampaigns && nftsList) {
      const pluckedCampaigns =
        nftsList &&
        nftsList
          .map(({ campaign }) => campaign)
          .filter((id, index, ids) => ids.indexOf(id) === index);
      const nftBasedCampaigns = [];
      nftsList &&
        nftsList.forEach((nft) =>
          pluckedCampaigns.includes(nft.campaign) &&
          !!nftBasedCampaigns[pluckedCampaigns.indexOf(nft.campaign)]
            ? nftBasedCampaigns[pluckedCampaigns.indexOf(nft.campaign)][
                nft.campaign
              ].push(nft)
            : nftBasedCampaigns.push({ [nft.campaign]: [nft] })
        );
      nftBasedCampaigns && setDisplayedCampaigns(nftBasedCampaigns);
    }
  }, [
    allNfts,
    displayedCampaigns,
    beneficiaries,
    campaigns,
    uniqueCollections,
    creators,
    nfts,
  ]);

  //getting list of NFTs
  React.useEffect(() => {
    (!allNfts || !displayedCampaigns) && getNftsList();
  }, [getNftsList, displayedCampaigns, allNfts]);

  const setCaptions = (data) => {
    const captionsCamp = [];
    for (let item = 0; item < data?.length; item++) {
      captionsCamp.push(CaptionCampaign(data, item, IconImage));
    }
    setSliderCaptionsCamp(captionsCamp);
  };

  //function returns button of buying NFT
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
    <Layout>
      <div className='page-content bg-white rubik'>
        <div
          className='home-banner'
          style={{ backgroundImage: 'url(' + bgImg + ')' }}
        >
          <div className='home-bnr-inner'>
            <div className='home-bnr-content'>
              <h4 className='dz-title'>Verified Impact NFTs</h4>
              <h2 className='sub-title'>Making a Verified Impact</h2>
              <div className='home-bnr-btns'>
                <Link to={'#'} className='site-button white btn-icon'>
                  Read more <i className='fa fa-angle-double-right'></i>
                </Link>
                <VideoPopup2 />
              </div>
            </div>
          </div>
          <div className='row stats-section'>
            <div className='col'>
              {allNfts ? (
                <>
                  {' '}
                  <span>{beneficiariesLength}</span> Beneficiaries
                </>
              ) : (
                <>
                  <Spinner
                    animation='border'
                    variant='success'
                    className='stats-spinner'
                  />
                  Beneficiaries
                </>
              )}
            </div>
            <div className='col'>
              {allNfts ? (
                <>
                  {' '}
                  <span>{campaignsLength}</span> Campaigns
                </>
              ) : (
                <>
                  <Spinner
                    animation='border'
                    variant='success'
                    className='stats-spinner'
                  />
                  Campaigns
                </>
              )}
            </div>
            <div className='col'>
              {allNfts ? (
                <>
                  {' '}
                  <span>{creatorsLength}</span> Creators
                </>
              ) : (
                <>
                  <Spinner
                    animation='border'
                    variant='success'
                    className='stats-spinner'
                  />
                  Creators
                </>
              )}
            </div>
            <div className='col'>
              {allNfts ? (
                <>
                  {' '}
                  <span>{collectionsLength ? collectionsLength : 0}</span>{' '}
                  Collections
                </>
              ) : (
                <>
                  <Spinner
                    animation='border'
                    variant='success'
                    className='stats-spinner'
                  />
                  Collections
                </>
              )}
            </div>
            <div className='col'>
              {allNfts ? (
                <>
                  {' '}
                  <span>{allNfts?.length}</span> NFTs
                </>
              ) : (
                <>
                  <Spinner
                    animation='border'
                    variant='success'
                    className='stats-spinner'
                  />
                  NFTs
                </>
              )}
            </div>
            <div className='col'>
              {allNfts ? (
                <>
                  {' '}
                  <span>{csprSum ? csprSum : 0}</span> CSPR
                </>
              ) : (
                <>
                  <Spinner
                    animation='border'
                    variant='success'
                    className='stats-spinner'
                  />
                  CSPR
                </>
              )}
            </div>
            <div className='col'>
              {allNfts ? (
                <>
                  {' '}
                  <span>{csprSum ? (csprSum / 13.68).toFixed(2) : 0}</span> $$
                </>
              ) : (
                <>
                  <Spinner
                    animation='border'
                    variant='success'
                    className='stats-spinner'
                  />
                  $$
                </>
              )}
            </div>
          </div>
        </div>
        {allNfts && selectedNFT && displayedCampaigns ? (
          displayedCampaigns.length ? (
            <>
              <h3 className='text-center mt-5'>Latest Campaigns</h3>
              {displayedCampaigns.map((n, index) => {
                let campaignsName = Object.keys(n);
                let NFts = Object.values(n)[0];
                return (
                  <div key={index}>
                    <h4 className='text-success text-center  d-flex align-items-center justify-content-center'>
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${NFts[0].beneficiaryName}&campaign=${NFts[0].campaignName}`}
                        className='mr-1 text-success text-underline'
                      >
                        Top NFTs from the {NFts[0].campaignName} Campaign, click
                        to see all {NFts.length} NFTs
                      </Link>
                      {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                        <CampaignOrCollectionTwitterShare
                          campaign={NFts[0].campaignName}
                          beneficiary={NFts[0].beneficiaryName}
                        />
                      )}
                    </h4>
                    <SimpleReactLightbox>
                      <SRLWrapper options={options}>
                        <div className='clearfix portfolio nfts-slider'>
                          <ul
                            id='masonry'
                            className='dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1'
                          >
                            <Masonry
                              className={'my-gallery-class'} // default ''
                              options={masonryOptions} // default {}
                              disableImagesLoaded={false} // default false
                              updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                              imagesLoadedOptions={imagesLoadedOptions} // default {}
                            >
                              <Carousel
                                itemsToShow={4}
                                breakPoints={breakPoints}
                              >
                                {NFts.slice(0, 5).map((item, index) => (
                                  <React.Fragment
                                    key={`${index}${item.tokenId}`}
                                  >
                                    <li className='web design card-container p-a0'>
                                      <NFTCard
                                        item={item}
                                        openSlider={(
                                          newIndex,
                                          itemCampaign
                                        ) => {
                                          setPhotoIndex(newIndex);
                                          setOpenSliderCamp(true);
                                          setSelectedCampaign(itemCampaign);
                                          setCaptions(NFts.slice(0, 5));
                                        }}
                                        index={index}
                                      />
                                    </li>
                                    {openSliderCamp &&
                                      campaignsName === selectedCampaign && (
                                        <Lightbox
                                          mainSrc={NFts[photoIndex].image}
                                          nextSrc={
                                            NFts[(photoIndex + 1) % NFts.length]
                                              .image
                                          }
                                          prevSrc={
                                            NFts[
                                              (photoIndex + NFts.length - 1) %
                                                NFts.length
                                            ].image
                                          }
                                          onCloseRequest={() =>
                                            setOpenSliderCamp(false)
                                          }
                                          onMovePrevRequest={() =>
                                            setPhotoIndex(
                                              (photoIndex + NFts.length - 1) %
                                                NFts.length
                                            )
                                          }
                                          onMoveNextRequest={() =>
                                            setPhotoIndex(
                                              (photoIndex + 1) % NFts.length
                                            )
                                          }
                                          imageCaption={
                                            sliderCaptionsCamp[photoIndex]
                                          }
                                        />
                                      )}
                                  </React.Fragment>
                                ))}
                              </Carousel>
                            </Masonry>
                          </ul>
                        </div>
                      </SRLWrapper>
                    </SimpleReactLightbox>
                  </div>
                );
              })}
            </>
          ) : (
            <h4 className='text-muted text-center my-5'>
              We are working hard to add more NFTs
            </h4>
          )
        ) : (
          <div className='vinft-section-loader'>
            <div className='vinft-spinner-body'>
              <Spinner animation='border' variant='success' />
              <p>Fetching NFTs Please wait...</p>
            </div>
          </div>
        )}
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

export default Dashboard;
