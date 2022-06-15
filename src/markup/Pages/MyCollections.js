import React from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import Masonry from 'react-masonry-component';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Carousel from 'react-elastic-carousel';

import { useAuth } from '../../contexts/AuthContext';
import { useNFTState } from '../../contexts/NFTContext';
import { getCreatorNftList } from '../../api/nftInfo';
import { getMappedNftsByList } from '../../api/nftInfo';
import { CaptionCampaign } from '../Element/CaptionCampaign';

import Layout from '../Layout';
import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import CampaignOrCollectionTwitterShare from '../Element/TwitterShare/CampaignOrCollectionTwitterShare';
import NFTCard from '../Element/NFTCard';
import VINftsTooltip from '../Element/Tooltip';

import BuyNFTModal from '../Element/BuyNFT';
import PromptLogin from './PromptLogin';
import ListForSaleNFTModal from '../Element/ListForSaleNFT';

//images
import bnr1 from './../../images/banner/bnr1.jpg';
import plusIcon from './../../images/icon/plus.png';
// Masonry section
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

//handling filtration markup
const TagLi = ({ name, handleSetTag, tagActive, type }) => {
  return (
    <VINftsTooltip
      title={`Click to see all NFTs under the "${name}" ${
        type === 'creator'
          ? name === 'All'
            ? 'creators'
            : 'creator'
          : type === 'campaign'
          ? name === 'All'
            ? 'campaigns'
            : 'campaign'
          : name === 'All'
          ? 'collections'
          : 'collection'
      } `}
    >
      <li
        className={` tag ${tagActive ? 'btn active' : 'btn'}`}
        onClick={() => handleSetTag(name)}
      >
        <input type="radio" />
        <button className="site-button-secondry radius-sm">
          <span>
            {name} {''}
          </span>{' '}
        </button>
      </li>
    </VINftsTooltip>
  );
};

const MyCollections = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const { beneficiaries, campaigns, collections, creators } = useNFTState();

  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const creator = queryParams.get('creator');
  const campaign = queryParams.get('campaign');

  const [tagCollection, setTagCollection] = React.useState('All');
  const [tagCreator, setTagCreator] = React.useState('All');
  const [tagCampaign, setTagCampaign] = React.useState('All');
  const [openSlider, setOpenSlider] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [sliderCaptions, setSliderCaptions] = React.useState([]);
  const [collectionTags, setCollectionTags] = React.useState([]);
  const [campaignTags, setCampaignTags] = React.useState([]);
  const [creatorTags, setCreatorTags] = React.useState([]);
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();
  const [showListForSaleModal, setShowListForSaleModal] = React.useState(false);
  const [listForSaleNFT, setListForSaleNFT] = React.useState();
  const [soldNFTsFilter, setSoldNFTsFilter] = React.useState();

  const [allNFTs, setAllNFTs] = React.useState();
  const [filteredNFTs, setFilteredNFTs] = React.useState();

  const [selectedCollection, setSelectedCollection] = React.useState();

  //function returns button of buying NFT
  const IconImage = ({ nft }) => {
    return (
      <>
        <VINftsTooltip title={'Transfer NFT'}>
          <i
            className="ti-exchange-vertical transfer-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"
            onClick={() => {
              setSelectedNFT(nft);
              setShowBuyModal(true);
            }}
          ></i>
        </VINftsTooltip>
        <VINftsTooltip
          title={
            nft.isForSale == 'true'
              ? 'Unlist NFT for Sale'
              : 'List NFT for sale'
          }
        >
          <div
            onClick={() => {
              setListForSaleNFT(nft);
              setShowListForSaleModal(true);
            }}
          >
            {nft.isForSale == 'true' ? (
              <div>
                {' '}
                <i className="ti-close sale-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen position-absolute"></i>
                <i className="ti-money transfer-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
              </div>
            ) : (
              <i className="ti-money transfer-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
            )}
          </div>
        </VINftsTooltip>
      </>
    );
  };

  const CaptionItem = (nft) => (
    <div className="text-white text-left port-box">
      <h5>{nft.title}</h5>
      <p>
        <b>Description: </b>
        {nft.description}
      </p>
      <p>
        <b>Beneficiary: </b>
        <VINftsTooltip
          title={`Click to see all NFTs for "${nft.beneficiaryName}" beneficiary`}
        >
          <Link
            to={`./BeneficiaryNFTs?beneficiary=${nft.beneficiaryName}`}
            className="dez-page text-white"
            onClick={() => {
              setOpenSlider(false);
            }}
          >
            {nft.beneficiaryName}
          </Link>
        </VINftsTooltip>
        <span className="bg-success text-white px-1 ml-1 border-raduis-2">
          {nft.beneficiaryPercentage}%
        </span>

        <b className="ml-4">Campaign: </b>
        <VINftsTooltip
          title={`Click to see all NFTs for "${nft.campaignName}" campaign`}
        >
          {nft.beneficiary ? (
            <Link
              to={`./BeneficiaryNFTs?beneficiary=${nft.beneficiaryName}&campaign=${nft.campaignName}`}
              className="dez-page text-white"
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {nft.campaignName}
            </Link>
          ) : (
            <Link
              to={`./CreatorNFTs?creator=${nft.creatorName}&collection=${nft.collectionName}`}
              className="dez-page text-white"
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {nft.campaignName}
            </Link>
          )}
        </VINftsTooltip>
        <b className="ml-4">Creator: </b>
        <VINftsTooltip
          title={`Click to see all NFTs created by "${nft.creatorName}"`}
        >
          <Link
            to={`./CreatorNFTs?creator=${nft.creatorName}`}
            className="dez-page text-white"
            onClick={() => {
              setOpenSlider(false);
            }}
          >
            {nft.creatorName}
          </Link>
        </VINftsTooltip>
        <span className="bg-info text-white px-1 ml-1 border-raduis-2">
          {nft.creatorPercentage}%
        </span>

        <b className="ml-4">Collection: </b>
        <Link
          to={`./CreatorNFTs?creator=${nft.creatorName}&collection=${nft.collectionName}`}
          className="dez-page text-white"
          onClick={() => {
            setOpenSlider(false);
          }}
        >
          {nft.collectionName}
        </Link>
      </p>
      <p className="d-flex align-content-center align-items-center">
        <b>Price: </b>
        {nft.price} {nft.currency}
        &nbsp;&nbsp;
        <IconImage nft={nft} />
        &nbsp;&nbsp; &nbsp;&nbsp;{' '}
        {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
          <NFTTwitterShare item={nft} />
        )}
        &nbsp;&nbsp;{' '}
        <Link
          to={`./nft-detail?id=${nft.tokenId}`}
          className="mr-1 text-success text-underline"
        >
          <QRCode
            value={`${window.location.origin}/#/nft-detail?id=${nft.tokenId}`}
            size={80}
          />
        </Link>
      </p>
    </div>
  );

  const filterCollectionByTag = React.useCallback(
    (tag, filteredNFTs) => {
      const collectionsTagsName =
        filteredNFTs &&
        filteredNFTs
          .map(({ collectionName }) => (tag === 'All' ? collectionName : tag))
          .filter((name, index, names) => names.indexOf(name) === index);
      collectionsTagsName && setCollectionTags(['All', ...collectionsTagsName]);
    },
    []
    // [currentTagFilter, allNFTs]
  );

  const filterCampaignByTag = React.useCallback((tag, filteredNFTs) => {
    const campaignsTagsName =
      filteredNFTs &&
      filteredNFTs
        .map(({ campaignName }) => (tag === 'All' ? campaignName : tag))
        .filter((name, index, names) => names.indexOf(name) === index);
    campaignsTagsName && setCampaignTags(['All', ...campaignsTagsName]);
  }, []);

  const filterCreatorByTag = React.useCallback((tag, filteredNFTs) => {
    const creatorsTagsName =
      filteredNFTs &&
      filteredNFTs
        .map(({ creatorName }) => (tag === 'All' ? creatorName : tag))
        .filter((name, index, names) => names.indexOf(name) === index);
    creatorsTagsName && setCreatorTags(['All', ...creatorsTagsName]);
  }, []);

  const setNFTsBasedOnCollection = (nftsArr) => {
    const pluckedCollections =
      nftsArr &&
      nftsArr
        .map(({ collection }) => collection)
        .filter((id, index, ids) => ids.indexOf(id) === index);
    const nftBasedCollection = [];
    nftsArr &&
      nftsArr.forEach((nft) =>
        pluckedCollections.includes(nft.collection) &&
        !!nftBasedCollection[pluckedCollections.indexOf(nft.collection)]
          ? nftBasedCollection[pluckedCollections.indexOf(nft.collection)][
              nft.collection
            ].push(nft)
          : nftBasedCollection.push({ [nft.collection]: [nft] })
      );
    return nftBasedCollection;
  };

  const getFilteredNFTs = React.useCallback(async () => {
    const captions = [];

    const nftsList = await getCreatorNftList(entityInfo.publicKey);

    setNFTsBasedOnCollection(nftsList);

    //nftBasedCollection && setDisplayedCampaigns(nftBasedCollection);

    const mappedNFTsList =
      nftsList &&
      beneficiaries &&
      campaigns &&
      creators &&
      collections &&
      getMappedNftsByList(
        nftsList,
        beneficiaries,
        campaigns,
        creators,
        collections
      );

    const filteredNFTs =
      mappedNFTsList && setNFTsBasedOnCollection(mappedNFTsList);

    filteredNFTs && setFilteredNFTs(filteredNFTs);
    filteredNFTs && filterCollectionByTag('All', mappedNFTsList);
    filteredNFTs && filterCampaignByTag('All', mappedNFTsList);
    filteredNFTs && filterCreatorByTag('All', mappedNFTsList);
    filteredNFTs && setAllNFTs(filteredNFTs);

    filteredNFTs &&
      filteredNFTs.forEach((nft) => captions.push(CaptionItem(nft)));
    filteredNFTs && captions.length && setSliderCaptions(captions);
  }, [
    entityInfo.publicKey,
    beneficiaries,
    campaigns,
    collections,
    creators,
    filterCollectionByTag,
    filterCampaignByTag,
    filterCreatorByTag,
  ]);

  React.useEffect(() => {
    entityInfo.publicKey && getFilteredNFTs();
  }, [entityInfo.publicKey, getFilteredNFTs]);

  const getCollectionsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCollection(tag);
      setTagCreator('All');
      setTagCampaign('All');

      const filteredCollectionsNFTs = allNFTs.filter(({ collectionName }) =>
        tag === 'All' ? collectionName : collectionName === tag
      );

      filteredCollectionsNFTs && setFilteredNFTs(filteredCollectionsNFTs);

      const campaignsTagsName =
        filteredCollectionsNFTs &&
        filterCampaignByTag('All', filteredCollectionsNFTs);
      campaignsTagsName && setCampaignTags(['All', ...campaignsTagsName]);

      const creatorsTagsName =
        filteredCollectionsNFTs &&
        filterCreatorByTag('All', filteredCollectionsNFTs);
      creatorsTagsName && setCreatorTags(['All', ...creatorsTagsName]);

      setSoldNFTsFilter('All');
    },
    [allNFTs, filterCampaignByTag, filterCreatorByTag]
  );

  const getCampaignsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCampaign(tag);
      setTagCreator('All');
      setTagCollection('All');

      const filteredCampaignsNFTs =
        allNFTs &&
        allNFTs.filter(({ campaignName }) =>
          tag === 'All' ? campaignName : campaignName === tag
        );

      filteredCampaignsNFTs && setFilteredNFTs(filteredCampaignsNFTs);

      const collectionsTagsName =
        filteredCampaignsNFTs &&
        filterCollectionByTag('All', filteredCampaignsNFTs);
      collectionsTagsName && setCollectionTags(['All', ...collectionsTagsName]);

      const creatorsTagsName =
        filteredCampaignsNFTs &&
        filterCreatorByTag('All', filteredCampaignsNFTs);
      creatorsTagsName && setCreatorTags(['All', ...creatorsTagsName]);

      setSoldNFTsFilter('All');
    },
    [allNFTs, filterCollectionByTag, filterCreatorByTag]
  );

  const getCreatorsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCreator(tag);
      setTagCollection('All');
      setTagCampaign('All');

      const filteredCreatorsNFTs =
        allNFTs &&
        allNFTs.filter(({ creatorName }) =>
          tag === 'All' ? creatorName : creatorName === tag
        );

      filteredCreatorsNFTs && setFilteredNFTs(filteredCreatorsNFTs);

      const collectionsTagsName =
        filteredCreatorsNFTs &&
        filterCollectionByTag('All', filteredCreatorsNFTs);
      collectionsTagsName && setCollectionTags(['All', ...collectionsTagsName]);

      const campaignsTagsName =
        filteredCreatorsNFTs &&
        filterCampaignByTag('All', filteredCreatorsNFTs);
      campaignsTagsName && setCampaignTags(['All', ...campaignsTagsName]);

      setSoldNFTsFilter('All');
    },
    [allNFTs, setFilteredNFTs, filterCollectionByTag, filterCampaignByTag]
  );

  const handleNFTStatus = (value) => {
    setSoldNFTsFilter(value);
    const newFilteredNFTs = allNFTs.filter(
      ({ isOwner }) => isOwner === (value === 'sold' ? false : true)
    );
    setFilteredNFTs(value !== 'All' ? newFilteredNFTs : allNFTs);

    const collectionsTagsName = filterCollectionByTag('All', newFilteredNFTs);
    collectionsTagsName && setCollectionTags(['All', ...collectionsTagsName]);

    const creatorsTagsName = filterCreatorByTag('All', newFilteredNFTs);
    creatorsTagsName && setCreatorTags(['All', ...creatorsTagsName]);

    const campaignsTagsName = filterCampaignByTag('All', newFilteredNFTs);
    campaignsTagsName && setCampaignTags(['All', ...campaignsTagsName]);
  };

  const setCaptions = (data) => {
    const captionsCamp = [];
    data &&
      data.forEach((nft) => captionsCamp.push(CaptionCampaign(nft, IconImage)));
    captionsCamp && setSliderCaptions(captionsCamp);
  };

  return (
    <Layout>
      <div className="page-content bg-white">
        {/*  banner  */}
        <div
          className="dlab-bnr-inr dlab-bnr-inr-sm overlay-primary bg-pt"
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <div className="container">
            <div className="dlab-bnr-inr-entry">
              <h1 className="text-white d-flex align-items-center">
                <span className="mr-1">
                  My Collections{' '}
                  <VINftsTooltip title={`Add New Collection`}>
                    <Link to={'./add-collection'}>
                      <img
                        src={plusIcon}
                        className="img img-fluid"
                        width="40px"
                        alt="plusIcon"
                      />
                    </Link>
                  </VINftsTooltip>
                </span>
              </h1>

              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className="ml-1">My Collections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*  Section-1 Start  */}
        {!isLoggedIn ? (
          <PromptLogin />
        ) : (
          <div className="section-full content-inner-1 portfolio text-uppercase">
            {(creator === undefined || creator === null) && (
              <div className="site-filters clearfix  left mx-5   m-b40">
                <ul className="filters" data-toggle="buttons">
                  Creator:{' '}
                  {creatorTags &&
                    creatorTags.length > 0 &&
                    creatorTags.map((singleTag, index) => (
                      <TagLi
                        key={index}
                        name={singleTag}
                        handleSetTag={getCreatorsBasedOnTag}
                        tagActive={tagCreator === singleTag ? true : false}
                        type="creator"
                      />
                    ))}
                </ul>
              </div>
            )}
            {(campaign === undefined || campaign === null) && (
              <div className="site-filters clearfix  left mx-5   m-b40">
                <ul className="filters" data-toggle="buttons">
                  Campaign:{' '}
                  {campaignTags &&
                    campaignTags.length > 0 &&
                    campaignTags.map((singleTag, index) => (
                      <TagLi
                        key={index}
                        name={singleTag}
                        handleSetTag={getCampaignsBasedOnTag}
                        tagActive={tagCampaign === singleTag ? true : false}
                        type="campaign"
                      />
                    ))}
                </ul>
              </div>
            )}
            <div className="site-filters clearfix left mx-5  m-b40">
              <ul className="filters" data-toggle="buttons">
                Collection:{' '}
                {collectionTags &&
                  collectionTags.length > 0 &&
                  collectionTags.map((singleTag, index) => (
                    <TagLi
                      key={index}
                      name={singleTag}
                      handleSetTag={getCollectionsBasedOnTag}
                      tagActive={tagCollection === singleTag ? true : false}
                      type="collection"
                    />
                  ))}
              </ul>
            </div>
            <Row>
              <Col
                lg={4}
                md={6}
                xs={12}
                className="site-filters clearfix  left mx-5   m-b40 form-group"
              >
                <Row className="align-items-center">
                  <Col className="col-auto pr-1">
                    <span className="float-left">NFT status:</span>
                  </Col>
                  <Col className="pl-0">
                    <select
                      onChange={(e) => handleNFTStatus(e.target.value)}
                      value={soldNFTsFilter}
                      className="form-control"
                      name="soldNFTsFilter"
                    >
                      <option value="All">All NFTs</option>
                      <option value="sold">Sold NFTs</option>
                      <option value="notSold">Not Sold NFTs</option>
                    </select>
                  </Col>
                </Row>
              </Col>
            </Row>
            
            {filteredNFTs ? (
              filteredNFTs?.length > 0 ? (
                <>
                  {filteredNFTs.map((n, index) => {
                    let collectionsName = Object.keys(n);
                    let NFts = Object.values(n)[0];
                    return (
                      <div key={index} className="mb-5">
                        <h4 className="text-success text-center  d-flex align-items-center justify-content-center">
                          <Link
                            to={`./BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiaryName}&campaign=${NFts[0]?.campaignName}`}
                            className="mr-1 text-success text-underline"
                          >
                            <QRCode
                              value={`${
                                window.location.origin
                              }/#/BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiaryName?.replace(
                                / /g,
                                '%20'
                              )}&campaign=${NFts[0]?.campaignName?.replace(
                                / /g,
                                '%20'
                              )}`}
                              size={70}
                            />
                          </Link>
                          &nbsp;&nbsp;
                          <Link
                            to={`./BeneficiaryNFTs?beneficiary=${NFts[0]?.beneficiaryName}&campaign=${NFts[0]?.campaignName}`}
                            className="mr-1 text-success text-underline"
                          >
                            {NFts.length} NFTs from the {NFts[0]?.collectionName}{' '}
                            Collection
                          </Link>
                          {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                            <CampaignOrCollectionTwitterShare
                              campaign={NFts[0]?.campaignName}
                              beneficiary={NFts[0]?.beneficiaryName}
                              beneficiaryPercentage={
                                NFts[0]?.beneficiaryPercentage
                              }
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
                                  <Carousel
                                    itemsToShow={4}
                                    breakPoints={breakPoints}
                                  >
                                    {NFts.map((item, index) => (
                                      <React.Fragment
                                        key={`${index}${item.tokenId}`}
                                      >
                                        <li className="web design card-container p-a0">
                                          <NFTCard
                                            item={item}
                                            openSlider={(
                                              newIndex,
                                              itemCampaign,
                                              itemCollection
                                            ) => {
                                              setPhotoIndex(newIndex);
                                              setOpenSlider(true);
                                              itemCollection &&
                                                setSelectedCollection(
                                                  itemCollection
                                                );
                                              setCaptions(NFts);
                                            }}
                                            index={index}
                                          />
                                        </li>
                                        {openSlider &&
                                          collectionsName[0] ===
                                            selectedCollection && (
                                            <Lightbox
                                              mainSrc={NFts[photoIndex].image}
                                              nextSrc={
                                                NFts[
                                                  (photoIndex + 1) % NFts.length
                                                ].image
                                              }
                                              prevSrc={
                                                NFts[
                                                  (photoIndex +
                                                    NFts.length -
                                                    1) %
                                                    NFts.length
                                                ].image
                                              }
                                              onCloseRequest={() =>
                                                setOpenSlider(false)
                                              }
                                              onMovePrevRequest={() =>
                                                setPhotoIndex(
                                                  (photoIndex +
                                                    NFts.length -
                                                    1) %
                                                    NFts.length
                                                )
                                              }
                                              onMoveNextRequest={() =>
                                                setPhotoIndex(
                                                  (photoIndex + 1) % NFts.length
                                                )
                                              }
                                              imageCaption={
                                                sliderCaptions[photoIndex]
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
                <h4 className="text-muted text-center mb-5">
                  You Don't have NFTS yet!
                </h4>
              )
            ) : (
              <div className="vinft-page-loader">
                <div className="vinft-spinner-body">
                  <Spinner animation="border" variant="success" />
                  <p>Fetching your NFTs Please wait...</p>
                </div>
              </div>
            )}
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
          isTransfer={true}
        />
      )}
      {showListForSaleModal && (
        <ListForSaleNFTModal
          show={showListForSaleModal}
          handleCloseParent={() => {
            setShowListForSaleModal(false);
          }}
          data={listForSaleNFT}
        />
      )}
    </Layout>
  );
};

export default MyCollections;
