import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Spinner } from 'react-bootstrap';
import Lightbox from 'react-image-lightbox';
import Masonry from 'react-masonry-component';
import Carousel from 'react-elastic-carousel';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import QRCode from 'react-qr-code';

import { useNFTState } from '../../contexts/NFTContext';
// import { profileClient } from '../../api/profileInfo';

import VideoPopup from '../Element/VideoPopup';
import { CaptionCampaign } from '../Element/CaptionCampaign';
import NFTCard from '../Element/NFTCard';
import BuyNFTModal from '../Element/BuyNFT';
import Layout from '../Layout';
import CampaignOrCollectionTwitterShare from '../Element/TwitterShare/CampaignOrCollectionTwitterShare';
import bgImg from './../../images/main-slider/slide6.jpg';
import CopyText from '../Element/copyText';
import ReactGA from 'react-ga';
import SDGsStatsItem from '../Element/SDGsStatsItem';
import { SDGsData } from '../../data/SDGsGoals';
//Light Gallery on icon click

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

const imagesLoadedOptions = { background: '.my-bg-image-el' };

const Dashboard = () => {
  const {
    beneficiaryCount,
    campaignsCount,
    creatorsCount,
    collectionsCount,
    nfts,
  } = useNFTState();

  const [openSliderCamp, setOpenSliderCamp] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState();
  const [sliderCaptionsCamp, setSliderCaptionsCamp] = React.useState([]);
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();
  const [beneficiariesLength, setBeneficiariesLength] =
    React.useState(undefined);
  const [campaignsLength, setCampaignsLength] = React.useState(undefined);
  const [creatorsLength, setCreatorsLength] = React.useState(undefined);
  const [collectionsLength, setCollectionLength] = React.useState(undefined);
  const [csprSum, setCsprSum] = React.useState();
  const [allNfts, setAllNfts] = React.useState();
  const [displayedCampaigns, setDisplayedCampaigns] = React.useState();
  const [selectedCampaign, setSelectedCampaign] = React.useState();
  const [SDGsGoals, setSDGsGoals] = React.useState(SDGsData);
  
  const getNftsList = React.useCallback(async () => {
    // const list = await profileClient
    //   .profilesList
    //   // '0127271ea03f8cb24e0e3100d18e4d29fc860b35a2c9eb86ae4cca280a8fc40e1f'
    //   ();
    // console.log(list);
    const nftsList = nfts && nfts.filter((nft) => nft.isForSale === 'true');

    nftsList && setAllNfts(nftsList);
    nfts && setSelectedNFT(nftsList);
    nfts &&
      setCsprSum(
        nftsList.reduce(
          (xPrice, { price }) => Number(xPrice) + Number(price),
          0
        )
      );

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
   
    const AllSDGsTagsName =
      nfts &&
      nfts.filter((nft)=>nft.hasOwnProperty('sdgs_ids'))
        .map((nft) => (({ value: nft.sdgs_ids?.split(',') })))
        .flatMap(({ value }) => (value));
    const sdgOccur =
      AllSDGsTagsName &&
      AllSDGsTagsName.reduce(
        (b, c) => (
          (
            b[b.findIndex((d) => d.value === c)] ||
            b[b.push({ value: c, nftNumber: 0 }) - 1]
          ).nftNumber++,
          b
        ),
        []
      );
    const sdgsWithNFTCount =
      sdgOccur &&
      SDGsData.map((t1) => ({
        ...t1,
        ...sdgOccur.find((t2) => t2.value?.toString() === t1.value?.toString()),
      }));
    sdgsWithNFTCount &&
      setSDGsGoals(
        sdgsWithNFTCount.map((s) =>
          s.nftNumber
            ? { ...s, ['nftNumber']: s.nftNumber }
            : { ...s, ['nftNumber']: 0 }
        )
      );
  }, [nfts]);

  //getting list of NFTs
  React.useEffect(() => {
      ReactGA.pageview(window.location.pathname +"/");
    getNftsList();
  }, [getNftsList]);
  React.useEffect(() => {
    setBeneficiariesLength(beneficiaryCount);
    setCampaignsLength(campaignsCount);
    setCreatorsLength(creatorsCount);
    setCollectionLength(collectionsCount);
  }, [beneficiaryCount, campaignsCount, collectionsCount, creatorsCount]);
  const setCaptions = (data) => {
    const captionsCamp = [];
    data &&
      data.forEach((nft) => captionsCamp.push(CaptionCampaign(nft, IconImage)));
    captionsCamp && setSliderCaptionsCamp(captionsCamp);
  };

  //function returns button of buying NFT
  const IconImage = ({ nft }) => {
    return (
      <>
        {nft.isForSale === 'true' && (
          <i
            className='ti-shopping-cart buy-icon mfp-link fa-2x mfp-link'
            onClick={() => {
              setSelectedNFT(nft);
              setShowBuyModal(true);
            }}
          ></i>
        )}
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
                <a href={process.env.REACT_APP_MEDUIM_ACCOUNT_LINK} target="_blank" rel="noopener noreferrer" className='site-button white btn-icon'>
                  Read more <i className='fa fa-angle-double-right'></i>
                </a>
                <VideoPopup />
              </div>
            </div>
          </div>
          <div className='row stats-section'>
            <div className='col'>
              {beneficiariesLength !== undefined ? (
                <>
                  {' '}
                  <span>{beneficiariesLength || 0}</span> Beneficiaries
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
              {campaignsLength !== undefined ? (
                <>
                  {' '}
                  <span>{campaignsLength || 0}</span> Campaigns
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
              {creatorsLength !== undefined ? (
                <>
                  {' '}
                  <span>{creatorsLength || 0}</span> Creators
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
              {collectionsLength !== undefined ? (
                <>
                  {' '}
                  <span>{collectionsLength || 0}</span> Collections
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
                  <span>{nfts?.length}</span> NFTs
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
        <Row className='mx-2 mt-4 justify-content-center dash-sdgs'>
          {SDGsGoals?.map((d)=>(
          <Col className="mb-4"  key={d.value}>
            <SDGsStatsItem data={d}/>
          </Col>))}
        </Row>
        {allNfts && selectedNFT && displayedCampaigns ? (
          displayedCampaigns.length ? (
            <>
              <h3 className='text-center mt-5'>Latest Campaigns</h3>
              {displayedCampaigns.map((n, index) => {
                let campaignsName = Object.keys(n);
                let NFts = Object.values(n)[0];
                return (
                  <div key={index} className='mb-5'>
                    <h4 className='text-success text-center  d-flex align-items-center justify-content-center'>
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiary}&campaign=${NFts[0]?.campaign}`}
                        className='mr-1 text-success text-underline'
                      >
                        <QRCode
                          value={`${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiary}&campaign=${NFts[0]?.campaign}`}
                          size={90}
                        />
                      </Link>
                      &nbsp;&nbsp;
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiary}&campaign=${NFts[0]?.campaign}`}
                        className='mr-1 text-success text-underline'
                      >
                        Top NFTs from the {NFts[0]?.campaignName} Campaign,
                        click to see all {NFts.length} NFTs
                      </Link>
                      {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                        <CampaignOrCollectionTwitterShare
                          campaign={NFts[0]?.campaignName}
                          beneficiary={NFts[0]?.beneficiaryName}
                          beneficiaryPercentage={NFts[0]?.beneficiaryPercentage}
                          url={`${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiary}&campaign=${NFts[0]?.campaign}`}
                        />
                      )}
                      &nbsp;&nbsp;{' '}
                      <CopyText
                        link={`${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiary}&campaign=${NFts[0]?.campaign}`}
                      />
                    </h4>
                    <SimpleReactLightbox>
                      <SRLWrapper options={options}>
                        <div className='clearfix portfolio nfts-slider'>
                          <ul
                            id='masonry'
                            className='dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1'
                          >
                            <Carousel itemsToShow={4} breakPoints={breakPoints}>
                              {NFts.slice(0, 5).map((item, index) => (
                                <React.Fragment key={`${index}${item.tokenId}`}>
                                  <li className='web design card-container p-a0'>
                                    <NFTCard
                                      item={item}
                                      openSlider={(newIndex, itemCampaign) => {
                                        setPhotoIndex(newIndex);
                                        setOpenSliderCamp(true);
                                        itemCampaign &&
                                          setSelectedCampaign(itemCampaign);
                                        setCaptions(NFts.slice(0, 5));
                                      }}
                                      index={index}
                                    />
                                  </li>
                                  {openSliderCamp &&
                                    campaignsName[0] === selectedCampaign && (
                                      <Lightbox
                                        mainSrc={NFts[photoIndex].image}
                                        nextSrc={
                                          NFts[
                                            (photoIndex + 1) %
                                              NFts.slice(0, 5).length
                                          ].image
                                        }
                                        prevSrc={
                                          NFts[
                                            (photoIndex +
                                              NFts.slice(0, 5).length -
                                              1) %
                                              NFts.slice(0, 5).length
                                          ].image
                                        }
                                        onCloseRequest={() =>
                                          setOpenSliderCamp(false)
                                        }
                                        onMovePrevRequest={() =>
                                          setPhotoIndex(
                                            (photoIndex +
                                              NFts.slice(0, 5).length -
                                              1) %
                                              NFts.slice(0, 5).length
                                          )
                                        }
                                        onMoveNextRequest={() =>
                                          setPhotoIndex(
                                            (photoIndex + 1) %
                                              NFts.slice(0, 5).length
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
