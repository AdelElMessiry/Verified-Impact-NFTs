import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import Header6 from './../Layout/Header6';
import Footer3 from './../Layout/footer3';
import { VideoPopup2 } from './../Element/VideoPopup';
import NFTCard from '../Element/NFTCard';
//Images..
import bgimg from './../../images/main-slider/slide6.jpg';
import Lightbox from 'react-image-lightbox';
import { imageBlog } from '../NFTData';
import Masonry from 'react-masonry-component';
import VINFTsTooltip from '../Element/Tooltip';
import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import CampaignOrCollectionTwitterShare from '../Element/TwitterShare/CampaignOrCollectionTwitterShare';
import Carousel from 'react-elastic-carousel';
import BuyNFTModal from '../Element/BuyNFT';
import {
  getBeneficiariesCampaignsList,
  getBeneficiariesList,
} from '../../api/beneficiaryInfo';
import { getCampaignsList } from '../../api/campaignInfo';
import { getCreatorsList } from '../../api/creatorInfo';
import { getNFTsList } from '../../api/nftInfo';
import { Spinner } from 'react-bootstrap';

//Light Gallery on icon click

const Index4 = () => {
  const [openSliderCamp1, setOpenSliderCamp1] = useState(false);
  const [openSliderCamp2, setOpenSliderCamp2] = useState(false);
  const [openSliderCamp3, setOpenSliderCamp3] = useState(false);
  const [openSliderCamp4, setOpenSliderCamp4] = useState(false);
  const [photoIndex, setPhotoIndex] = useState();
  const [sliderCaptionsCamp1, setSliderCaptionsCamp1] = useState([]);
  const [sliderCaptionsCamp2, setSliderCaptionsCamp2] = useState([]);
  const [sliderCaptionsCamp3, setSliderCaptionsCamp3] = useState([]);
  const [sliderCaptionsCamp4, setSliderCaptionsCamp4] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState();
  const [beneficiariesLength, setBeneficiariesLength] = useState();
  const [campaignsLength, setCampaignsLength] = useState();
  const [creatorsLength, setCreatorsLength] = useState();
  const [collectionsLength, setCollectionLength] = useState();
  const [csprSum, setCsprSum] = useState();
  const [allNfts, setAllNfts] = useState();
  const [beneficiaries, setbeneficiaries] = useState();

  useEffect(() => {
    (async () => {
      let beneficiaryList =
        !beneficiariesLength && (await getBeneficiariesList());
      !beneficiariesLength && setBeneficiariesLength(beneficiaryList?.length);
      let campaignList = !campaignsLength && (await getCampaignsList());
      !campaignsLength && setCampaignsLength(campaignList?.length);
      let creatorsList = !creatorsLength && (await getCreatorsList());
      !creatorsLength && setCreatorsLength(creatorsList?.length);
    })();
  }, [beneficiariesLength, campaignsLength, creatorsLength]);

  useEffect(() => {
    (async () => {
      if (!allNfts) {
        let newNFTList = await getNFTsList();
        let nftList = [];
        let beneficiaryList = !beneficiaries
          ? await getBeneficiariesCampaignsList()
          : [];
        !beneficiaries && setbeneficiaries(beneficiaryList);
        if (
          beneficiaries?.length > 0 &&
          (newNFTList?.length > 0 || allNfts?.length > 0)
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
              element['beneficiaryName'] = selectedBene[0].name;
              element['campaignName'] = selectedCampaign[0].name;
              nftList.push(element);
            });
          !allNfts && setAllNfts(nftList);
          console.log(newNFTList);
          setCollectionLength(
            nftList
              .map((data) => ({ name: data.collection }))
              .filter(
                (value, index, self) =>
                  index === self.findIndex((t) => t.name === value.name)
              ).length
          );

          setCsprSum(
            nftList
              .map((a) => Number(a.price))
              .reduce(function (a, b) {
                return a + b;
              })
          );
          const Camp1Data = nftList
            ?.filter((nft) => nft.campaignName === 'Stand With Ukraine')
            .slice(0, 4);
          setCaptions(Camp1Data, 1);
          const Camp2Data = nftList
            ?.filter((nft) => nft.campaignName === 'Refugees')
            .slice(0, 4);
          setCaptions(Camp2Data, 2);

          const Camp3Data = nftList
            ?.filter((nft) => nft.campaignName === 'Reconstruction')
            .slice(0, 4);
          setCaptions(Camp3Data, 3);

          const Camp4Data = nftList
            ?.filter((nft) => nft.campaignName === 'Forever Keys')
            .slice(0, 4);
          setCaptions(Camp4Data, 4);
        }
      }
    })();
  }, [allNfts, beneficiaries]);

  const setCaptions = (data, camNumber) => {
    const captionsCamp = [];
    for (let item = 0; item < data?.length; item++) {
      captionsCamp.push(
        <div className="text-white text-left port-box">
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
                className="dez-page text-white"
              >
                {data[item].beneficiaryName}
              </Link>
            </VINFTsTooltip>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {data[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${data[item].campaignName}" campaign`}
            >
              {data[item].beneficiary ? (
                <Link
                  to={`./BenefeiciaryNFTs?beneficiary=${data[item].beneficiaryName}&campaign=${data[item].campaignName}`}
                  className="dez-page text-white"
                >
                  {data[item].campaignName}
                </Link>
              ) : (
                <Link
                  to={`./CreatorNFTs?creator=${data[item].creator}&collection=${data[item].collectionName}`}
                  className="dez-page text-white"
                >
                  {data[item].campaignName}
                </Link>
              )}
            </VINFTsTooltip>
            <b className="ml-4">Creator: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs created by "${data[item].creator}"`}
            >
              <Link
                to={`./CreatorNFTs?creator=${data[item].creator}`}
                className="dez-page text-white"
              >
                {data[item].creator}
              </Link>
            </VINFTsTooltip>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {data[item].creatorPercentage}%
            </span>

            <b className="ml-4">Collection: </b>
            <Link
              to={`./collection?collection=${data[item].collectionName}`}
              className="dez-page text-white"
            >
              {' '}
              {data[item].collectionName}
            </Link>
          </p>

          <p className="d-flex align-content-center align-items-center">
            <b>Price: </b>
            {data[item].price} {data[item].currency}
            &nbsp;&nbsp; <Iconimage nft={data[item]} /> &nbsp;&nbsp;{' '}
            {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
              <NFTTwitterShare item={data[item]} />
            )}
          </p>
        </div>
      );
    }
    camNumber == 1
      ? setSliderCaptionsCamp1(captionsCamp)
      : camNumber == 2
      ? setSliderCaptionsCamp2(captionsCamp)
      : camNumber == 3
      ? setSliderCaptionsCamp3(captionsCamp)
      : setSliderCaptionsCamp4(captionsCamp);
  };

  //function returns button of buying NFT
  const Iconimage = ({ nft }) => {
    return (
      <>
        <i
          className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"
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

  const LightBoxComponent = ({ Data, camNumber }) => {
    //let Data = arr.Data;
    return (
      <Lightbox
        mainSrc={Data[photoIndex].image}
        nextSrc={Data[(photoIndex + 1) % Data.length].image}
        prevSrc={Data[(photoIndex + Data.length - 1) % Data.length].image}
        onCloseRequest={() =>
          camNumber == 1
            ? setOpenSliderCamp1(false)
            : camNumber == 2
            ? setOpenSliderCamp2(false)
            : camNumber == 3
            ? setOpenSliderCamp3(false)
            : setOpenSliderCamp4(false)
        }
        onMovePrevRequest={() =>
          setPhotoIndex((photoIndex + Data.length - 1) % Data.length)
        }
        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % Data.length)}
        imageCaption={
          camNumber == 1
            ? sliderCaptionsCamp1[photoIndex]
            : camNumber == 2
            ? sliderCaptionsCamp2[photoIndex]
            : camNumber == 3
            ? sliderCaptionsCamp3[photoIndex]
            : sliderCaptionsCamp4[photoIndex]
        }
      />
    );
  };

  return (
    <>
      <Header6 />
      <div className="page-content bg-white rubik">
        <div
          className="home-banner"
          style={{ backgroundImage: 'url(' + bgimg + ')' }}
        >
          <div className="home-bnr-inner">
            <div className="home-bnr-content">
              <h4 className="dz-title">Verified Impact NFTs</h4>
              <h2 className="sub-title">Making a Verified Impact</h2>
              <div className="home-bnr-btns">
                <Link to={'#'} className="site-button white btn-icon">
                  Read more <i className="fa fa-angle-double-right"></i>
                </Link>
                <VideoPopup2 />
              </div>
            </div>
          </div>
          <div className="row stats-section">
            <div className="col">
              {allNfts ? (
                 <> <span>{beneficiariesLength}</span>Beneficiaries</>
              ) : (
                <><Spinner animation="border" variant="success" className='stats-spinner'/>Beneficiaries</>
              )}
            </div>
            <div className="col">
             {allNfts ? (
                 <> <span>{campaignsLength}</span>Campaigns</>
              ) : (
                <><Spinner animation="border" variant="success" className='stats-spinner'/>Campaigns</>
              )}
            </div>
            <div className="col">
              {allNfts ? (
                 <> <span>{creatorsLength}</span>Creators</>
              ) : (
                <><Spinner animation="border" variant="success" className='stats-spinner'/>Creators</>
              )}
            </div>
            <div className="col">
              {allNfts ? (
                 <> <span>{collectionsLength}</span>Collections</>
              ) : (
                <><Spinner animation="border" variant="success" className='stats-spinner'/>Collections</>
              )}
            </div>
            <div className="col">
              {allNfts ? (
                 <> <span>{allNfts?.length}</span>NFTs</>
              ) : (
                <><Spinner animation="border" variant="success" className='stats-spinner'/>NFTs</>
              )}
            </div>
            <div className="col">
              {allNfts ? (
                 <> <span>{csprSum}</span>CSPR</>
              ) : (
                <><Spinner animation="border" variant="success" className='stats-spinner'/>CSPR</>
              )}
            </div>
            <div className="col">
              {allNfts ? (
                 <> <span>{(csprSum / 13.68).toFixed(2)}</span>$$</>
              ) : (
                <><Spinner animation="border" variant="success" className='stats-spinner'/>$$</>
              )}
            </div>
          </div>
        </div>

        {openSliderCamp1 && (
          <LightBoxComponent
            Data={allNfts
              ?.filter((nft) => nft.campaignName === 'Stand With Ukraine')
              .slice(0, 4)}
            camNumber="1"
          />
        )}
        {openSliderCamp2 && (
          <LightBoxComponent
            Data={allNfts
              ?.filter((nft) => nft.campaignName === 'Refugees')
              .slice(0, 4)}
            camNumber="2"
          />
        )}
        {openSliderCamp3 && (
          <LightBoxComponent
            Data={allNfts
              ?.filter((nft) => nft.campaignName === 'Reconstruction')
              .slice(0, 4)}
            camNumber="3"
          />
        )}
        {openSliderCamp4 && (
          <LightBoxComponent
            Data={allNfts
              ?.filter((nft) => nft.campaignName === 'Forever Keys')
              .slice(0, 4)}
            camNumber="4"
          />
        )}
        {allNfts ? (
          <>
            {' '}
            <h3 className="text-center mt-5">Latest Campaigns</h3>
            <h4 className="text-success text-center  d-flex align-items-center justify-content-center">
              <Link
                to={`./BenefeiciaryNFTs?beneficiary=${'Ukraine Gov'}&campaign=${'Stand With Ukraine'}`}
                className="mr-1 text-success text-underline"
              >
                Top NFTs from the Stand With Ukraine Campaign, click to see all{' '}
                {
                  allNfts?.filter(
                    (nft) => nft.campaignName === 'Stand With Ukraine'
                  ).length
                }{' '}
                NFTs
              </Link>
              {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                <CampaignOrCollectionTwitterShare
                  campaign={'Stand With Ukraine'}
                  beneficiary={'Ukraine Gov'}
                />
              )}
            </h4>
            <SimpleReactLightbox>
              <SRLWrapper options={options}>
                <div className="clearfix portfolio nfts-slider">
                  <ul
                    id="masonry"
                    className="dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1"
                  >
                    <Masonry
                      className={'my-gallery-class'} // default ''
                      options={masonryOptions} // default {}
                      disableImagesLoaded={false} // default false
                      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                      imagesLoadedOptions={imagesLoadedOptions} // default {}
                    >
                      <Carousel itemsToShow={4} breakPoints={breakPoints}>
                        {allNfts
                          ?.filter(
                            (nft) => nft.campaignName === 'Stand With Ukraine'
                          )
                          .slice(0, 5)
                          .map((item, index) => (
                            <li
                              className="web design card-container  p-a0"
                              key={index}
                            >
                              <NFTCard
                                item={item}
                                openSlider={(newIndex) => {
                                  setPhotoIndex(newIndex);
                                  setOpenSliderCamp1(true);
                                }}
                                index={index}
                              />
                            </li>
                          ))}
                      </Carousel>
                    </Masonry>
                  </ul>
                </div>
              </SRLWrapper>
            </SimpleReactLightbox>
            <h4 className="text-success text-center  d-flex align-items-center justify-content-center mt-5">
              <Link
                to={`./BenefeiciaryNFTs?beneficiary=${'Ukraine Gov'}&campaign=${'Refugees'}`}
                className="mr-1 text-success text-underline"
              >
                Top NFTs from the Refugees Campaign, click to see all{' '}
                {
                  allNfts?.filter((nft) => nft.campaignName === 'Refugees')
                    .length
                }{' '}
                NFTs
              </Link>
              {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                <CampaignOrCollectionTwitterShare
                  campaign={'Refugees'}
                  beneficiary={'Ukraine Gov'}
                />
              )}
            </h4>
            <SimpleReactLightbox>
              <SRLWrapper options={options}>
                <div className="clearfix portfolio nfts-slider">
                  <ul
                    id="masonry"
                    className="dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1"
                  >
                    <Masonry
                      className={'my-gallery-class'} // default ''
                      options={masonryOptions} // default {}
                      disableImagesLoaded={false} // default false
                      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                      imagesLoadedOptions={imagesLoadedOptions} // default {}
                    >
                      <Carousel itemsToShow={4} breakPoints={breakPoints}>
                        {allNfts
                          ?.filter((nft) => nft.campaignName === 'Refugees')
                          .slice(0, 5)
                          .map((item, index) => (
                            <li
                              className="web design card-container p-a0"
                              key={index}
                            >
                              <NFTCard
                                item={item}
                                openSlider={(newIndex) => {
                                  setPhotoIndex(newIndex);
                                  setOpenSliderCamp2(true);
                                }}
                                index={index}
                              />
                            </li>
                          ))}
                      </Carousel>
                    </Masonry>
                  </ul>
                </div>
              </SRLWrapper>
            </SimpleReactLightbox>
            <h4 className="text-success text-center  d-flex align-items-center justify-content-center mt-5">
              <Link
                to={`./BenefeiciaryNFTs?beneficiary=${'Ukraine Gov'}&campaign=${'Reconstruction'}`}
                className="mr-1 text-success text-underline"
              >
                Top NFTs from the Reconstruction Campaign, click to see all{' '}
                {
                  allNfts?.filter(
                    (nft) => nft.campaignName === 'Reconstruction'
                  ).length
                }{' '}
                NFTs
              </Link>
              {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                <CampaignOrCollectionTwitterShare
                  campaign={'Reconstruction'}
                  beneficiary={'Ukraine Gov'}
                />
              )}
            </h4>
            <SimpleReactLightbox>
              <SRLWrapper options={options}>
                <div className="clearfix portfolio nfts-slider">
                  <ul
                    id="masonry"
                    className="dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1"
                  >
                    <Masonry
                      className={'my-gallery-class'} // default ''
                      options={masonryOptions} // default {}
                      disableImagesLoaded={false} // default false
                      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                      imagesLoadedOptions={imagesLoadedOptions} // default {}
                    >
                      <Carousel itemsToShow={4} breakPoints={breakPoints}>
                        {allNfts
                          ?.filter(
                            (nft) => nft.campaignName === 'Reconstruction'
                          )
                          .slice(0, 5)
                          .map((item, index) => (
                            <li
                              className="web design card-container  p-a0"
                              key={index}
                            >
                              <NFTCard
                                item={item}
                                openSlider={(newIndex) => {
                                  setPhotoIndex(newIndex);
                                  setOpenSliderCamp3(true);
                                }}
                                index={index}
                              />
                            </li>
                          ))}
                      </Carousel>
                    </Masonry>
                  </ul>
                </div>
              </SRLWrapper>
            </SimpleReactLightbox>
          </>
        ) : (
          <div className="vinft-section-loader">
            <div className="vinft-spinner-body">
              <Spinner animation="border" variant="success" />
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
      <Footer3 />
    </>
  );
};

export default Index4;
