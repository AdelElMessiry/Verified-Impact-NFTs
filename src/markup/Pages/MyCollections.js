import React from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Carousel from 'react-elastic-carousel';
import ReactGA from 'react-ga';
import { faStoreAlt, faStoreAltSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CLPublicKey } from 'casper-js-sdk';

import { useAuth } from '../../contexts/AuthContext';
import {
  getMappedNftsByList,
  getCachedCreatorNftList,
} from '../../api/nftInfo';
import { CaptionCampaign } from '../Element/CaptionCampaign';
import DeleteCollectionModal from '../Element/DeletCollectionModal';
import Layout from '../Layout';
import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import CampaignOrCollectionTwitterShare from '../Element/TwitterShare/CampaignOrCollectionTwitterShare';
import NFTCard from '../Element/NFTCard';
import VINftsTooltip from '../Element/Tooltip';

import BuyNFTModal from '../Element/BuyNFT';
import PromptLogin from './PromptLogin';
import ListForSaleNFTModal from '../Element/ListForSaleNFT';
import CopyText from '../Element/copyText';

//images
import bnr1 from './../../images/banner/bnr1.jpg';
import plusIcon from './../../images/icon/plus.png';
import editIcon from './../../images/icon/edit.png';
import soldIcon from '../../images/icon/sold.png';
import mintIcon from '../../images/icon/Mint.png';
import unitedNation from '../../images/icon/unitedNation.png';

import CopyCode from '../Element/copyCode';
import { SDGsData } from '../../data/SDGsGoals';

import { 
  useNFTState,
  refreshCollections,
  useNFTDispatch
} from '../../contexts/NFTContext';
import { removeCollections } from '../../contexts/NFTContext';
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
        <input type='radio' />
        <button className='site-button-secondry radius-sm'>
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
   const { ...stateList } = useNFTState();
  const {
    nfts,
    beneficiaries,
    campaigns,
    collections,
    profileCreators,
  } = useNFTState();

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
  const [displayedCollections, setDisplayedCollections] = React.useState();

  const [selectedCollection, setSelectedCollection] = React.useState();
  const [isRefreshNFTList, setIsRefreshNFTList] = React.useState(false);
  const [changedNFT, setChangedNFT] = React.useState();
  const [isCreatorExist, setIsCreatorExist] = React.useState();
  const [showEmptyCollectionModal , setShowEmptyCollectionModal] =  React.useState(false)
  const [emptyCollection , setEmptyCollection] = React.useState([])
  const nftDispatch = useNFTDispatch();
  //function returns button of buying NFT
  const IconImage = ({ nft }) => {
    return (
      <>
        {nft.isOwner && (
          <VINftsTooltip
            title={
              nft.isForSale === 'true'
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
              {nft.isForSale === 'true' ? (
                <FontAwesomeIcon icon={faStoreAltSlash} size='2x' />
              ) : (
                <FontAwesomeIcon icon={faStoreAlt} size='2x' />
              )}
            </div>
          </VINftsTooltip>
        )}
      </>
    );
  };

  const CaptionItem = (nft) => (
    <div className='text-white text-left port-box'>
      <h5>
        {nft.title}
        &nbsp;&nbsp;{' '}
        {nft.isCreatorOwner === false && nft.isForSale === 'false' && (
          <img src={soldIcon} width='40px' />
        )}
      </h5>
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
            to={`./BeneficiaryNFTs?beneficiary=${nft.beneficiary}`}
            className='dez-page text-white'
            onClick={() => {
              setOpenSlider(false);
            }}
          >
            {nft.beneficiaryName}
          </Link>
        </VINftsTooltip>
        <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
          {nft.beneficiaryPercentage}%
        </span>

        <b className='ml-4'>Campaign: </b>
        <VINftsTooltip
          title={`Click to see all NFTs for "${nft.campaignName}" campaign`}
        >
          {nft.beneficiary ? (
            <Link
              to={`./BeneficiaryNFTs?beneficiary=${nft.beneficiary}&campaign=${nft.campaign}`}
              className='dez-page text-white'
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {nft.campaignName}
            </Link>
          ) : (
            <Link
              to={`./CreatorNFTs?creator=${nft.creator}&collection=${nft.collection}`}
              className='dez-page text-white'
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {nft.campaignName}
            </Link>
          )}
        </VINftsTooltip>
        <b className='ml-4'>Creator: </b>
        <VINftsTooltip
          title={`Click to see all NFTs created by "${nft.creatorName}"`}
        >
          <Link
            to={`./CreatorNFTs?creator=${nft.creator}`}
            className='dez-page text-white'
            onClick={() => {
              setOpenSlider(false);
            }}
          >
            {nft.creatorName}
          </Link>
        </VINftsTooltip>
        <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
          {nft.creatorPercentage}%
        </span>

        <b className='ml-4'>Collection: </b>
        <Link
          to={`./CreatorNFTs?creator=${nft.creator}&collection=${nft.collection}`}
          className='dez-page text-white'
          onClick={() => {
            setOpenSlider(false);
          }}
        >
          {nft.collectionName}
        </Link>
      </p>
      <p className='d-flex align-content-center align-items-center'>
        {nft.isCreatorOwner !== false && nft.isForSale !== 'false' && (
          <>
            <b>Price: </b>
            {nft.price} {nft.currency}&nbsp;&nbsp;
          </>
        )}
        {nft.isCreatorOwner === false && nft.isForSale === 'true' && (
          <IconImage nft={nft} />
        )}
        &nbsp;&nbsp; &nbsp;&nbsp;{' '}
        {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
          <NFTTwitterShare item={nft} />
        )}
        &nbsp;&nbsp;{' '}
        <Link
          to={`./nft-detail?id=${nft.tokenId}`}
          className='mr-1 text-success text-underline'
        >
          <QRCode
            value={`${window.location.origin}/#/nft-detail?id=${nft.tokenId}`}
            size={80}
          />
        </Link>
        &nbsp;&nbsp;{' '}
        <CopyText
          link={`${window.location.origin}/#/nft-detail?id=${nft.tokenId}`}
        />
        &nbsp;&nbsp;{' '}
        <CopyCode
          link={`<iframe src='${window.location.origin}/#/nft-card?id=${nft.tokenId}'></iframe>`}
        />
      </p>
      <p>
        {nft?.sdgs_ids?.length > 0 && nft?.sdgs_ids !== '0' && (
          <div className='mt-3 px-2'>
            <a
              href='https://sdgs.un.org/goals'
              target='_blank'
              rel='noreferrer'
            >
              <img
                alt='unitedNation'
                src={unitedNation}
                style={{ width: 40, pointerEvents: 'none', cursor: 'default' }}
              />
            </a>
            :{' '}
            {SDGsData?.filter(({ value }) =>
              nft?.sdgs_ids?.split(',').includes(value.toString())
            )?.map((sdg, index) => (
              <VINftsTooltip title={sdg.label} key={index}>
                <label>
                  <img
                    alt='sdgsIcon'
                    src={
                      process.env.PUBLIC_URL + 'images/sdgsIcons/' + sdg.icon
                    }
                    style={{
                      width: 25,
                      pointerEvents: 'none',
                      cursor: 'default',
                    }}
                  />
                </label>
              </VINftsTooltip>
            ))}
          </div>
        )}
      </p>
    </div>
  );

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

  const getFilteredNFTs = React.useCallback(async () => {
    const captions = [];
    const isCreatorExist =
      profileCreators &&
      profileCreators.filter(
        ({ address }) =>
          address ===
          CLPublicKey.fromHex(entityInfo.publicKey).toAccountHashStr().slice(13)
      );
    if (profileCreators) {
      if (isCreatorExist.length > 0) {
        setIsCreatorExist(true);
        const nftsList = await getCachedCreatorNftList(
          nfts,
          entityInfo.publicKey
        );
        const mappedNFTsList =
          nftsList &&
          beneficiaries &&
          campaigns &&
          profileCreators &&
          collections &&
          getMappedNftsByList(
            nftsList,
            beneficiaries,
            campaigns,
            profileCreators,
            collections
          );

        const filteredNFTs = mappedNFTsList && mappedNFTsList;
        filteredNFTs &&
          setDisplayedCollections(setNFTsBasedOnCollection(filteredNFTs));
        filteredNFTs && filterCollectionByTag('All', filteredNFTs);
        filteredNFTs && filterCampaignByTag('All', filteredNFTs);
        filteredNFTs && filterCreatorByTag('All', filteredNFTs);
        filteredNFTs && setAllNFTs(filteredNFTs);

        filteredNFTs &&
          filteredNFTs.forEach((nft) => captions.push(CaptionItem(nft)));
        filteredNFTs && captions.length && setSliderCaptions(captions);
        collections && collections.length > 0 && filterEmptyCollections(collections , filteredNFTs)
      } else {
        setIsCreatorExist(false);
      }
    }
  }, [
    entityInfo.publicKey,
    beneficiaries,
    campaigns,
    collections,
    filterCollectionByTag,
    filterCampaignByTag,
    filterCreatorByTag,
    nfts,
    profileCreators,
  ]);
// detect user empty collection
  const filterEmptyCollections = (collections , filteredNft)=>{
    let newArr = [];
    for (let i = 0; i < collections.length; i++) {
      if (CLPublicKey.fromHex(entityInfo.publicKey).toAccountHashStr().slice(13) === collections[i].creator){
        let found = false;
        for (let j = 0; j < filteredNft.length; j++) {
            if (collections[i].id === filteredNft[j].collection ) {              
                found = true;
                break;
            }
        }
        if (!found) {
          newArr.push(collections[i]);
        }
      }        
    }
    setEmptyCollection(newArr)
  }
  // refresh user creator collection after remove empty collection
  const refreshCollectionAfterRemove = async(collection)=>{
    await removeCollections(nftDispatch, stateList , collection.id)
  }
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname + 'my-collections');
    entityInfo.publicKey && getFilteredNFTs();
  }, [entityInfo.publicKey, getFilteredNFTs]);

  React.useEffect(() => {
    if (changedNFT) {
      let flatAll = displayedCollections.flat();
      let finalArr = [];
      flatAll.forEach((flat) => {
        const collectionArr = Object.values(flat);
        finalArr = [...finalArr, ...collectionArr[0]];
      });
      const resIndex = finalArr?.findIndex(
        ({ tokenId }) => tokenId === changedNFT.tokenId
      );
      finalArr?.splice(resIndex, 1);
      setDisplayedCollections(
        setNFTsBasedOnCollection([
          ...finalArr?.slice(0, resIndex),
          changedNFT,
          ...finalArr?.slice(resIndex),
        ])
      );
      //from Expand
      const captions = [];
      [
        ...finalArr?.slice(0, resIndex),
        changedNFT,
        ...finalArr?.slice(resIndex),
      ].forEach((nft) => captions.push(CaptionCampaign(nft, IconImage)));
      captions.length && setSliderCaptions(captions);
      setShowListForSaleModal(false);
    }
  }, [isRefreshNFTList, changedNFT]);

  const getCollectionsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCollection(tag);
      setTagCreator('All');
      setTagCampaign('All');

      const filteredCollectionsNFTs = allNFTs.filter(({ collectionName }) =>
        tag === 'All' ? collectionName : collectionName === tag
      );
      filteredCollectionsNFTs &&
        setDisplayedCollections(
          setNFTsBasedOnCollection(filteredCollectionsNFTs)
        );

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

      filteredCampaignsNFTs &&
        setDisplayedCollections(
          setNFTsBasedOnCollection(filteredCampaignsNFTs)
        );
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

      filteredCreatorsNFTs &&
        setDisplayedCollections(setNFTsBasedOnCollection(filteredCreatorsNFTs));
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
    [
      allNFTs,
      setDisplayedCollections,
      filterCollectionByTag,
      filterCampaignByTag,
    ]
  );

  const handleNFTStatus = (value) => {
    setSoldNFTsFilter(value);
    const newFilteredNFTs = allNFTs.filter(
      ({ isOwner }) => isOwner === (value === 'sold' ? false : true)
    );
    setDisplayedCollections(
      value !== 'All'
        ? setNFTsBasedOnCollection(newFilteredNFTs)
        : setNFTsBasedOnCollection(allNFTs)
    );

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
      <div className='page-content bg-white'>
        {/*  banner  */}
        <div
          className='dlab-bnr-inr dlab-bnr-inr-sm overlay-primary bg-pt'
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <div className='container'>
            <div className='dlab-bnr-inr-entry'>
              <h1 className='text-white d-flex align-items-center'>
                <span className='mr-1'>
                  My Minted Collections{' '}
                 {isCreatorExist===true&&<> <VINftsTooltip title={`Add New Collection`}>
                    <Link to={'./add-collection?id=0'}>
                      <img
                        src={plusIcon}
                        className='img img-fluid'
                        width='40px'
                        alt='plusIcon'
                      />
                    </Link>
                  </VINftsTooltip>{' '}
                  <VINftsTooltip title={`Mint NFT`}>
                    <Link to={'./mint-nft'}>
                      <img
                        src={mintIcon}
                        className='img img-fluid'
                        width='40px'
                        alt='mintIcon'
                      />
                    </Link>
                  </VINftsTooltip>
                  <div className='breadcrumb-row pt-2 '>
                  <button onClick={()=>setShowEmptyCollectionModal(!showEmptyCollectionModal)}
                  className='site-button-secondry radius-sm'>
                  Show my Empty Collection
                  </button>
              </div>
                  </>
                }
                </span>
              </h1>
              
              <div className='breadcrumb-row'>
                <ul className='list-inline'>
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className='ml-1'>My Collections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*  Section-1 Start  */}
        {!isLoggedIn ? (
          <PromptLogin />
        ) : isCreatorExist ? (
          <div className='section-full content-inner-1 portfolio text-uppercase'>
            {(creator === undefined || creator === null) && (
              <div className='site-filters clearfix  left mx-5   m-b40'>
                <ul className='filters' data-toggle='buttons'>
                  Creator:{' '}
                  {creatorTags &&
                    creatorTags.length > 0 &&
                    creatorTags.map((singleTag, index) => (
                      <TagLi
                        key={index}
                        name={singleTag}
                        handleSetTag={getCreatorsBasedOnTag}
                        tagActive={tagCreator === singleTag ? true : false}
                        type='creator'
                      />
                    ))}
                </ul>
              </div>
            )}
            {(campaign === undefined || campaign === null) && (
              <div className='site-filters clearfix  left mx-5   m-b40'>
                <ul className='filters' data-toggle='buttons'>
                  Campaign:{' '}
                  {campaignTags &&
                    campaignTags.length > 0 &&
                    campaignTags.map((singleTag, index) => (
                      <TagLi
                        key={index}
                        name={singleTag}
                        handleSetTag={getCampaignsBasedOnTag}
                        tagActive={tagCampaign === singleTag ? true : false}
                        type='campaign'
                      />
                    ))}
                </ul>
              </div>
            )}
            <div className='site-filters clearfix left mx-5  m-b40'>
              <ul className='filters' data-toggle='buttons'>
                Collection:{' '}
                {collectionTags &&
                  collectionTags.length > 0 &&
                  collectionTags.map((singleTag, index) => (
                    <TagLi
                      key={index}
                      name={singleTag}
                      handleSetTag={getCollectionsBasedOnTag}
                      tagActive={tagCollection === singleTag ? true : false}
                      type='collection'
                    />
                  ))}
              </ul>
            </div>
            <Row>
              <Col
                lg={4}
                md={6}
                xs={12}
                className='site-filters clearfix  left mx-5   m-b40 form-group'
              >
                <Row className='align-items-center'>
                  <Col className='col-auto pr-1'>
                    <span className='float-left'>NFT status:</span>
                  </Col>
                  <Col className='pl-0'>
                    <select
                      onChange={(e) => handleNFTStatus(e.target.value)}
                      value={soldNFTsFilter}
                      className='form-control'
                      name='soldNFTsFilter'
                    >
                      <option value='All'>All NFTs</option>
                      <option value='sold'>Sold NFTs</option>
                      <option value='notSold'>Not Sold NFTs</option>
                    </select>
                  </Col>
                </Row>
              </Col>
            </Row>

            {displayedCollections ? (
              displayedCollections?.length > 0 ? (
                <>
                  {displayedCollections.map((n, index) => {
                    let collectionsName = Object.keys(n);
                    let NFts = Object.values(n)[0];
                    return (
                      <div key={index} className='mb-5'>
                        <h4 className='text-success text-center  d-flex align-items-center justify-content-center'>
                          <Link
                            to={`${window.location.origin}/#/CreatorNFTs?creator=${NFts[0]?.creator}&collection=${NFts[0]?.collection}`}
                            className='mr-1 text-success text-underline'
                          >
                            <QRCode
                              value={`${window.location.origin}/#/CreatorNFTs?creator=${NFts[0]?.creator}&collection=${NFts[0]?.collection}`}
                              size={90}
                            />
                          </Link>
                          &nbsp;&nbsp;
                          <Link
                            to={`./CreatorNFTs?creator=${NFts[0]?.creator}&collection=${NFts[0]?.collection}`}
                            className='mr-1 text-success text-underline'
                          >
                            {NFts.length} NFTs from the{' '}
                            {NFts[0]?.collectionName} Collection
                          </Link>
                          &nbsp;&nbsp;
                          <VINftsTooltip title={`Edit Collection`}>
                            <Link
                              to={`./add-collection?id=${NFts[0]?.collection}`}
                            >
                              <img
                                src={editIcon}
                                className='img img-fluid'
                                width='40px'
                                alt='plusIcon'
                              />
                            </Link>
                          </VINftsTooltip>
                          {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                            <CampaignOrCollectionTwitterShare
                              campaign={''}
                              beneficiary={NFts[0]?.beneficiaryName}
                              creator={NFts[0]?.creatorName}
                              collection={NFts[0]?.collectionName}
                              url={`${window.location.origin}/#/CreatorNFTs?creator=${NFts[0]?.creator}&collection=${NFts[0]?.collection}`}
                              beneficiaryPercentage={
                                NFts[0]?.beneficiaryPercentage
                              }
                            />
                          )}
                          &nbsp;&nbsp;{' '}
                          <CopyText
                            link={`${window.location.origin}/#/CreatorNFTs?creator=${NFts[0]?.creator}&collection=${NFts[0]?.collection}`}
                          />
                        </h4>
                        <SimpleReactLightbox>
                          <SRLWrapper options={options}>
                            <div className='clearfix portfolio nfts-slider'>
                              <ul
                                id='masonry'
                                className='dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1'
                              >
                                <Carousel
                                  itemsToShow={4}
                                  breakPoints={breakPoints}
                                >
                                  {NFts.map((item, index) => (
                                    <React.Fragment
                                      key={`${index}${item.tokenId}`}
                                    >
                                      <li className='web design card-container p-a0'>
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
                                          isCreation={true}
                                          handleCallChangeNFTs={(nft) => {
                                            setChangedNFT(nft);
                                            setIsRefreshNFTList(
                                              !isRefreshNFTList
                                            );
                                          }}
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
                                                (photoIndex + NFts.length - 1) %
                                                  NFts.length
                                              ].image
                                            }
                                            onCloseRequest={() =>
                                              setOpenSlider(false)
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
                                              sliderCaptions[photoIndex]
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
                <h4 className='text-muted text-center mb-5'>
                  You Don't have NFTS yet!
                </h4>
              )
            ) : (
              <div className='vinft-page-loader'>
                <div className='vinft-spinner-body'>
                  <Spinner animation='border' variant='success' />
                  <p>Fetching your NFTs Please wait...</p>
                </div>
              </div>
            )}
          </div>
        ) : isCreatorExist === false ? (
          <h4 className='text-muted text-center my-5'>
            You Don't have Creator Profile Please Create One First
          </h4>
        ) : (
          <div className='vinft-page-loader'>
            <div className='vinft-spinner-body'>
              <Spinner animation='border' variant='success' />
              <p>Checking if Creator Exist...</p>
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
          isTransfer={true}
          handleTransactionBuySuccess={(nft) => {
            setChangedNFT(nft);
            setIsRefreshNFTList(!isRefreshNFTList);
          }}
        />
      )}
      {showListForSaleModal && (
        <ListForSaleNFTModal
          show={showListForSaleModal}
          handleCloseParent={() => {
            setShowListForSaleModal(false);
          }}
          data={listForSaleNFT}
          handleTransactionSuccess={(nft) => {
            setChangedNFT(nft);
            setIsRefreshNFTList(!isRefreshNFTList);
          }}
        />
      )}
            {showEmptyCollectionModal && (
        <DeleteCollectionModal
          show={showEmptyCollectionModal}
          handleCloseParent={() => {
            setShowEmptyCollectionModal(false);
          }}
          data={emptyCollection}
          deleteCollection={(collection) => {
            refreshCollectionAfterRemove(collection)
          }}
        />
      )}
    </Layout>
  );
};

export default MyCollections;
