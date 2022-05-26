import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import { VideoPopup2 } from './../Element/VideoPopup';
import NFTCard from '../Element/NFTCard';
//Images..
import bgimg from './../../images/main-slider/slide6.jpg';
import Lightbox from 'react-image-lightbox';
import Masonry from 'react-masonry-component';
import VINFTsTooltip from '../Element/Tooltip';
import Carousel from 'react-elastic-carousel';
import BuyNFTModal from '../Element/BuyNFT';
import {
  getBeneficiariesCampaignsList,
  getBeneficiariesList,
} from '../../api/beneficiaryInfo';
import { getCampaignsList } from '../../api/campaignInfo';
import { getCreatorsList } from '../../api/creatorInfo';
import {
  getUniqueCollectionsList,
  getCollectionsList,
} from '../../api/collectionInfo';

import { getNFTsList } from '../../api/nftInfo';
import { Spinner } from 'react-bootstrap';
import Layout from '../Layout';

//Light Gallery on icon click

const Index4 = () => {
  const [openSliderCamp, setOpenSliderCamp] = useState(false);
  const [photoIndex, setPhotoIndex] = useState();
  const [sliderCaptionsCamp, setSliderCaptionsCamp] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState();
  const [beneficiariesLength, setBeneficiariesLength] = useState();
  const [campaignsLength, setCampaignsLength] = useState();
  const [creatorsLength, setCreatorsLength] = useState();
  const [collectionsLength, setCollectionLength] = useState();
  const [csprSum, setCsprSum] = useState();
  const [allNfts, setAllNfts] = useState();
  const [beneficiaries, setbeneficiaries] = useState();
  const [allCreators, setCreators] = useState();
  const [allCollections, setCollections] = useState();
  const [displayedCampaigns, setDisplayedCampaigns] = useState();
  const [selectedCampaign, setSelectedCampaign] = useState();

  useEffect(() => {
    (async () => {
      let beneficiaryList =
        !beneficiariesLength && (await getBeneficiariesList());
      !beneficiariesLength && setBeneficiariesLength(beneficiaryList?.length);
      let campaignList = !campaignsLength && (await getCampaignsList());
      !campaignsLength && setCampaignsLength(campaignList?.length);
      let creatorsList = !creatorsLength && (await getCreatorsList());
      !creatorsLength && setCreatorsLength(creatorsList?.length);
      let collectionsList =
        !collectionsLength && (await getUniqueCollectionsList());
      !collectionsLength &&
        setCollectionLength(collectionsList?.uniqueCollections.length);
    })();
  }, [beneficiariesLength, campaignsLength, creatorsLength, collectionsLength]);

  //getting list of NFTs
  useEffect(() => {
    (async () => {
      if (!allNfts) {
        let newNFTList = await getNFTsList();
        let nftList = [];
        let beneficiaryList = !beneficiaries
          ? await getBeneficiariesCampaignsList()
          : [];
        !beneficiaries && setbeneficiaries(beneficiaryList);
        let creatorsList = !allCreators && (await getCreatorsList());
        !allCreators && setCreators(creatorsList);
        let collectionsList = !allCollections && (await getCollectionsList());
        !allCollections && setCollections(collectionsList);
        //mappign nft details addresses and ids to names
        if (
          creatorsList?.length > 0 &&
          beneficiaries?.length > 0 &&
          newNFTList?.length > 0 &&
          collectionsList?.length > 0
        ) {
          newNFTList
            .filter((n) => n.isForSale == 'true')
            .forEach(async (element) => {
              let selectedBene = beneficiaries.filter(
                (b) => b.address === element.beneficiary
              );
              let selectedCampaign = selectedBene[0]?.campaigns?.filter(
                (c) => c.id === element.campaign
              );
              let selectedCreator = creatorsList?.filter(
                (c) => c.address === element.creator
              );
              let selectedCollection = collectionsList?.filter(
                (c) => c.id === element.collection
              );
              element['beneficiaryName'] = selectedBene[0].name;
              element['campaignName'] = selectedCampaign[0].name;
              element['creatorName'] = selectedCreator[0].name;
              element['collectionName'] = selectedCollection[0].name;

              nftList.push(element);
            });
          !allNfts && setAllNfts(nftList);
          !allNfts && setSelectedNFT(nftList);
          console.log(newNFTList);

          setCsprSum(
            nftList
              .map((a) => Number(a.price))
              .reduce(function (a, b) {
                return a + b;
              })
          );
          var nftsBasedCampaigns = nftList.reduce((prev, t, index, arr) => {
            if (typeof prev[t.campaign] === 'undefined') {
              prev[t.campaign] = [];
            }
            prev[t.campaign].push(t);
            return prev;
          }, {});
          var arr = [];

          for (var prop in nftsBasedCampaigns) {
            if (nftsBasedCampaigns.hasOwnProperty(prop)) {
              var innerObj = {};
              innerObj[prop] = nftsBasedCampaigns[prop];
              arr.push(innerObj);
            }
          }
          console.log(arr);
          if (arr.length > 0) {
            setDisplayedCampaigns(arr);
          }
        } else {
          setAllNfts([]);
        }
      }
    })();
  }, [allNfts, beneficiaries, allCreators, allCollections]);

  const setCaptions = (data, camNumber) => {
    const captionsCamp = [];
    for (let item = 0; item < data?.length; item++) {
      captionsCamp.push(
        <div className='text-white text-left port-box'>
          <h5>{data[item].title}</h5>
          {/* <p>
          <b>Category: </b>
          {Camp4Data[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${data[item].beneficiaryName}" beneficiary`}
            >
              <Link
                to={`./BenefeiciaryNFTs?beneficiary=${data[item].beneficiaryName}`}
                className='dez-page text-white'
              >
                {data[item].beneficiaryName}
              </Link>
            </VINFTsTooltip>
            <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
              {data[item].beneficiaryPercentage}%
            </span>

            <b className='ml-4'>Campaign: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${data[item].campaignName}" campaign`}
            >
              {data[item].beneficiary ? (
                <Link
                  to={`./BenefeiciaryNFTs?beneficiary=${data[item].beneficiaryName}&campaign=${data[item].campaignName}`}
                  className='dez-page text-white'
                >
                  {data[item].campaignName}
                </Link>
              ) : (
                <Link
                  to={`./CreatorNFTs?creator=${data[item].creatorName}&collection=${data[item].collectionName}`}
                  className='dez-page text-white'
                >
                  {data[item].campaignName}
                </Link>
              )}
            </VINFTsTooltip>
            <b className='ml-4'>Creator: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs created by "${data[item].creatorName}"`}
            >
              <Link
                to={`./CreatorNFTs?creator=${data[item].creatorName}`}
                className='dez-page text-white'
              >
                {data[item].creatorName}
              </Link>
            </VINFTsTooltip>
            <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
              {data[item].creatorPercentage}%
            </span>

            <b className='ml-4'>Collection: </b>
            <Link
              to={`./CreatorNFTs?creator=${data[item].creatorName}&collection=${data[item].collectionName}`}
              className='dez-page text-white'
            >
              {' '}
              {data[item].collectionName}
            </Link>
          </p>

          <p className='d-flex align-content-center align-items-center'>
            <b>Price: </b>
            {data[item].price} {data[item].currency}
            &nbsp;&nbsp; <Iconimage nft={data[item]} />
          </p>
        </div>
      );
    }
    setSliderCaptionsCamp(captionsCamp);
  };

  //function returns button of buying NFT
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
  // Masonry section end

  return (
    <Layout>
      <div className='page-content bg-white rubik'>
        <div
          className='home-banner'
          style={{ backgroundImage: 'url(' + bgimg + ')' }}
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
            <div className="col">
              {allNfts && selectedNFT && displayedCampaigns  ? (
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
            <div className="col">
              {allNfts && selectedNFT && displayedCampaigns  ? (
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
            <div className="col">
              {allNfts && selectedNFT && displayedCampaigns  ? (
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
          displayedCampaigns.length > 0 ? (
            <>
              <h3 className='text-center mt-5'>Latest Campaigns</h3>

              {displayedCampaigns?.map((n, index) => {
                let campaignsName = Object.keys(n);
                let NFts = Object.values(n)[0];
                let camNumber = index + 1;
                return (
                  <div key={index}>
                    <h4 className='text-success text-center  d-flex align-items-center justify-content-center'>
                      <Link
                        to={`./BenefeiciaryNFTs?beneficiary=${'Ukraine Gov'}&campaign=${
                          NFts[0].campaignName
                        }`}
                        className='mr-1 text-success text-underline'
                      >
                        Top NFTs from the {NFts[0].campaignName} Campaign, click
                        to see all {NFts.length} NFTs
                      </Link>
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
                                {NFts?.slice(0, 5).map((item, index) => (
                                  <Fragment key={index}>
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
                                          setCaptions(
                                            NFts.slice(0, 5),
                                            index + 1
                                          );
                                        }}
                                        index={index}
                                      />
                                    </li>
                                    {openSliderCamp &&
                                      campaignsName == selectedCampaign && (
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
                                  </Fragment>
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

export default Index4;
