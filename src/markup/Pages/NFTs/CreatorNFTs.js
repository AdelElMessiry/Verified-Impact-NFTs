import React from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import Masonry from 'react-masonry-component';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import QRCode from 'react-qr-code';

import { useNFTState } from '../../../contexts/NFTContext';

import NFTTwitterShare from '../../Element/TwitterShare/NFTTwitterShare';
import CampaignOrCollectionTwitterShare from '../../Element/TwitterShare/CampaignOrCollectionTwitterShare';
import NFTCard from '../../Element/NFTCard';
import VINftsTooltip from '../../Element/Tooltip';
import BuyNFTModal from '../../Element/BuyNFT';
import Layout from '../../Layout';
import CopyText from '../../Element/copyText';
import ViewProfile from '../ViewProfile';
import { ProfileFormsEnum } from '../../../Enums/index';

//images
import bnr1 from './../../../images/banner/bnr1.jpg';
import soldIcon from '../../../images/icon/sold.png';
import viewIcon from '../../../images/icon/view.png';
import CopyCode from '../../Element/copyCode';
import ReactGA from 'react-ga';
import SDGsMultiSelect from '../../Element/SDGsMultiSelect';
import { SDGsData } from '../../../data/SDGsGoals';
// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };
// Masonry section end

//handling filtration markup
const TagLi = ({ item, handleSetTag, tagActive, type, creator }) => {
  return (
    <VINftsTooltip
      title={`Click to see all NFTs under the '${item?.name}' ${
        type === 'creator'
          ? item?.name === 'All'
            ? 'creators'
            : 'creator'
          : type === 'campaign'
          ? item?.name === 'All'
            ? 'campaigns'
            : 'campaign'
          : item?.name === 'All'
          ? 'collections'
          : 'collection'
      } `}
    >
      <li
        className={` tag ${tagActive ? 'btn active' : 'btn'}`}
        onClick={() => handleSetTag(item)}
      >
        <input type="radio" />
        <button className="site-button-secondry radius-sm">
          <span>
            {item?.name} {''}
          </span>{' '}
        </button>
        &nbsp;&nbsp;
        {item?.name !== 'All' && (
          <>
            <Link
              to={
                type === 'campaign'
                  ? `./BeneficiaryNFTs?beneficiary=${item?.beneficiary}&campaign=${item?.id}`
                  : `./CreatorNFTs?creator=${creator}&collection=${item?.id}`
              }
              className="mr-1 text-success text-underline"
            >
              <QRCode
                className="mr-1"
                value={
                  type === 'campaign'
                    ? `${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${item?.beneficiary}&campaign=${item?.id}`
                    : `${window.location.origin}/#/CreatorNFTs?creator=${creator}&collection=${item?.id}`
                }
                size={90}
              />
            </Link>
            &nbsp;
            <CopyText
              link={
                type === 'campaign'
                  ? `${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${item?.beneficiary}&campaign=${item?.id}`
                  : `${window.location.origin}/#/CreatorNFTs?creator=${creator}&collection=${item?.id}`
              }
            />
          </>
        )}
      </li>
    </VINftsTooltip>
  );
};

const options = {
  buttons: { showDownloadButton: false },
};

const CreatorNFTs = () => {
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const creator = queryParams.get('creator');
  const collection = queryParams.get('collection');

  const { nfts, collections, creators } = useNFTState();
  const [tagCollection, setTagCollection] = React.useState({
    name: 'All',
    id: '',
  });
  const [tagCreator, setTagCreator] = React.useState({
    name: 'All',
    id: '',
  });
  const [tagCampaign, setTagCampaign] = React.useState({
    name: 'All',
    id: '',
    beneficiary: '',
  });

  const [allNFTs, setAllNFTs] = React.useState();
  const [filteredNFTs, setFilteredNFTs] = React.useState();
  const [openSlider, setOpenSlider] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [sliderCaptions, setSliderCaptions] = React.useState([]);
  const [collectionTags, setCollectionTags] = React.useState([]);
  const [campaignTags, setCampaignTags] = React.useState([]);
  const [creatorTags, setCreatorTags] = React.useState([]);
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();
  const [collectionName, setCollectionName] = React.useState();
  const [creatorName, setCreatorName] = React.useState();
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [selectedViewProfile, setSelectedViewProfile] = React.useState();
  const [SDGsGoals, setSDGsGoals] = React.useState([]);
  const [SDGsGoalsData, setSDGsGoalsData] = React.useState([]);
  const [isClearSDGs, setIsClearSDGs] = React.useState(false);

  //getting Collections details
  const getCollections = React.useCallback(async () => {
    const setSelectedCollection =
      collections &&
      collection &&
      collections.find(({ id }) => collection === id);
    setSelectedCollection && setCollectionName(setSelectedCollection.name);
  }, [collection, collections]);

  React.useEffect(() => {
    ReactGA.pageview(window.location.href);
    (!collectionName || collection) && getCollections();
  }, [collectionName, getCollections, collection]);

  //getting Creator details
  const getCreators = React.useCallback(async () => {
    const setSelectedCreator =
      creators &&
      creator &&
      creators.find(({ address }) => creator === address);
    setSelectedCreator && setCreatorName(setSelectedCreator.name);
  }, [creator, creators]);

  React.useEffect(() => {
    (!creatorName || creator) && getCreators();
  }, [creatorName, getCreators, creator]);

  const filterCollectionByTag = React.useCallback((tag, filteredNFTs) => {
    const AllCollectionsTagsName =
      filteredNFTs &&
      filteredNFTs.map((nft) =>
        tag.name === 'All'
          ? { name: nft.collectionName, id: nft.collection }
          : tag
      );
    let keys = ['name', 'id'];
    let collectionsTagsName = AllCollectionsTagsName.filter(
      (
        (s) => (o) =>
          ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join('|'))
      )(new Set())
    );
    collectionsTagsName &&
      setCollectionTags([
        {
          name: 'All',
          id: '',
        },
        ...collectionsTagsName,
      ]);
  }, []);

  const filterCampaignByTag = React.useCallback((tag, filteredNFTs) => {
    const AllCampaignsTagsName =
      filteredNFTs &&
      filteredNFTs.map((nft) =>
        tag.name === 'All'
          ? {
              name: nft.campaignName,
              id: nft.campaign,
              beneficiary: nft.beneficiary,
            }
          : tag
      );
    let keys = ['name', 'beneficiary'];
    let campaignsTagsName = AllCampaignsTagsName.filter(
      (
        (s) => (o) =>
          ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join('|'))
      )(new Set())
    );
    campaignsTagsName &&
      setCampaignTags([
        { name: 'All', id: '', beneficiary: '' },
        ...campaignsTagsName,
      ]);
  }, []);

  const filterCreatorByTag = React.useCallback((tag, filteredNFTs) => {
    const AllCreatorsTagsName =
      filteredNFTs &&
      filteredNFTs.map((nft) =>
        tag.name === 'All' ? { name: nft.creatorName, id: nft.creator } : tag
      );
    let keys = ['name', 'id'];
    let creatorsTagsName = AllCreatorsTagsName.filter(
      (
        (s) => (o) =>
          ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join('|'))
      )(new Set())
    );
    creatorsTagsName &&
      setCreatorTags([
        {
          name: 'All',
          id: '',
        },
        ...creatorsTagsName,
      ]);
  }, []);

  const filterSDGByTag = React.useCallback((tag, filteredNFTs) => {
    const AllSDGsTagsName =
      filteredNFTs &&
      filteredNFTs.map((nft) =>(
    {value: nft.sdgs_ids?.split(",")})).flatMap(({ value }) => value);
    let sdgsTagsName = AllSDGsTagsName.filter(function(item, pos) {
      return AllSDGsTagsName.indexOf(item) == pos;
  })
    sdgsTagsName &&
    setSDGsGoalsData(SDGsData.filter(({value})=>(sdgsTagsName.includes(value.toString()))));
  }, []);


  const handleSDGsChange = (data) => {
    setSDGsGoals(data);
    getSDGsBasedOnTag(data);
  };

  const getFilteredNFTs = React.useCallback(async () => {
    const captions = [];
    let filteredNFTs = [];

    const nftsList =
      nfts &&
      nfts.filter(
        (nft) =>
          nft.isForSale === 'true' ||
          (nft.isForSale === 'false' && nft.isCreatorOwner === false)
      );

    if (creator && !collection) {
      filteredNFTs =
        nftsList && nftsList.filter((nft) => nft.creator === creator);
    } else if (creator && collection) {
      filteredNFTs =
        nftsList &&
        nftsList.filter(
          (nft) => nft.creator === creator && nft.collection === collection
        );
    } else {
      filteredNFTs = nftsList && nftsList;
    }

    filteredNFTs && setFilteredNFTs(filteredNFTs);
    filteredNFTs &&
      filterCollectionByTag(
        {
          name: 'All',
          id: '',
        },
        filteredNFTs
      );
    filteredNFTs &&
      filterCampaignByTag(
        { name: 'All', id: '', beneficiary: '' },
        filteredNFTs
      );
    filteredNFTs &&
      filterCreatorByTag(
        {
          name: 'All',
          id: '',
        },
        filteredNFTs
      );
    filteredNFTs && setAllNFTs(filteredNFTs);
    filteredNFTs && filterSDGByTag({ name: 'All', id: '' }, filteredNFTs);

    //setting captions of nfts full screen mode
    filteredNFTs &&
      filteredNFTs.forEach((nft) => captions.push(CaptionItem(nft)));
    filteredNFTs && captions.length && setSliderCaptions(captions);
  }, [
    collection,
    nfts,
    creator,
    filterCampaignByTag,
    filterCollectionByTag,
    filterCreatorByTag,
    filterSDGByTag
  ]);

  React.useEffect(() => {
    getFilteredNFTs();
  }, [getFilteredNFTs]);

  const getCollectionsBasedOnTag = React.useCallback(
    (
      tag = {
        name: 'All',
        id: '',
      }
    ) => {
      setTagCollection(tag);
      setTagCreator({
        name: 'All',
        id: '',
      });
      setTagCampaign({
        name: 'All',
        id: '',
      });
      setIsClearSDGs(true);
      setSDGsGoals([])
      const filteredCollectionsNFTs = allNFTs.filter(({ collectionName }) =>
        tag.name === 'All' ? collectionName : collectionName === tag.name
      );

      filteredCollectionsNFTs && setFilteredNFTs(filteredCollectionsNFTs);

      const campaignsTagsName =
        filteredCollectionsNFTs &&
        filterCampaignByTag(
          { name: 'All', id: '', beneficiary: '' },
          filteredCollectionsNFTs
        );
      campaignsTagsName &&
        setCampaignTags([
          { name: 'All', id: '', beneficiary: '' },
          ...campaignsTagsName,
        ]);

      const creatorsTagsName =
        filteredCollectionsNFTs &&
        filterCreatorByTag(
          {
            name: 'All',
            id: '',
          },
          filteredCollectionsNFTs
        );
      creatorsTagsName &&
        setCreatorTags([
          {
            name: 'All',
            id: '',
          },
          ...creatorsTagsName,
        ]);
    },
    [allNFTs, filterCampaignByTag, filterCreatorByTag,filterSDGByTag]
  );

  const getCampaignsBasedOnTag = React.useCallback(
    (tag = { name: 'All', id: '', beneficiary: '' }) => {
      setTagCampaign(tag);
      setTagCreator({
        name: 'All',
        id: '',
      });
      setTagCollection({
        name: 'All',
        id: '',
      });
      setIsClearSDGs(true);
      setSDGsGoals([])
      const filteredCampaignsNFTs =
        allNFTs &&
        allNFTs.filter(({ campaignName }) =>
          tag.name === 'All' ? campaignName : campaignName === tag.name
        );

      filteredCampaignsNFTs && setFilteredNFTs(filteredCampaignsNFTs);

      const collectionsTagsName =
        filteredCampaignsNFTs &&
        filterCollectionByTag({ name: 'All', id: '' }, filteredCampaignsNFTs);
      collectionsTagsName &&
        setCollectionTags([{ name: 'All', id: '' }, ...collectionsTagsName]);

      const creatorsTagsName =
        filteredCampaignsNFTs &&
        filterCreatorByTag({ name: 'All', id: '' }, filteredCampaignsNFTs);
      creatorsTagsName &&
        setCreatorTags([{ name: 'All', id: '' }, ...creatorsTagsName]);
    },
    [allNFTs, filterCollectionByTag, filterCreatorByTag,filterSDGByTag]
  );

  const getCreatorsBasedOnTag = React.useCallback(
    (
      tag = {
        name: 'All',
        id: '',
      }
    ) => {
      setTagCreator(tag);
      setTagCollection({ name: 'All', id: '' });
      setTagCampaign({ name: 'All', id: '' });
      setIsClearSDGs(true);
      setSDGsGoals([])
      const filteredCreatorsNFTs =
        allNFTs &&
        allNFTs.filter(({ creatorName }) =>
          tag.name === 'All' ? creatorName : creatorName === tag.name
        );

      filteredCreatorsNFTs && setFilteredNFTs(filteredCreatorsNFTs);

      const collectionsTagsName =
        filteredCreatorsNFTs &&
        filterCollectionByTag({ name: 'All', id: '' }, filteredCreatorsNFTs);
      collectionsTagsName &&
        setCollectionTags([{ name: 'All', id: '' }, ...collectionsTagsName]);

      const campaignsTagsName =
        filteredCreatorsNFTs &&
        filterCampaignByTag(
          { name: 'All', id: '', beneficiary: '' },
          filteredCreatorsNFTs
        );
      campaignsTagsName &&
        setCampaignTags([
          { name: 'All', id: '', beneficiary: '' },
          ...campaignsTagsName,
        ]);
    },
    [allNFTs, setFilteredNFTs, filterCollectionByTag, filterCampaignByTag,filterSDGByTag]
  );

  const getSDGsBasedOnTag = React.useCallback(
    (selectedData=[]) => {
      setTagCreator({
        name: 'All',
        id: '',
      });
      setTagCampaign({
        name: 'All',
        id: '',
      });
      setTagCollection({ name: 'All', id: '', creator: '' });
      let allFilteredNFTs=[]
      for (let index = 0; index < selectedData.length; index++) {
       const selectedNfts= allNFTs &&
        allNFTs.filter(({ sdgs_ids }) =>
        ( sdgs_ids?.split(",").includes(selectedData[index].toString()))
        );
        allFilteredNFTs=[...allFilteredNFTs,...selectedNfts]
      }
      allFilteredNFTs.length>0 ? setFilteredNFTs(allFilteredNFTs):setFilteredNFTs(allNFTs);
      const collectionsTagsName =
      allFilteredNFTs.length>0 ?
      filterCollectionByTag(
        { name: 'All', id: '', creator: '' },
        allFilteredNFTs
      ): filterCollectionByTag(
        { name: 'All', id: '', creator: '' },
        allNFTs
      );
    collectionsTagsName &&
      setCollectionTags([
        { name: 'All', id: '', creator: '' },
        ...collectionsTagsName,
      ]);

    const campaignsTagsName =
    allFilteredNFTs.length>0 ?
      filterCampaignByTag(
        {
          name: 'All',
          id: '',
        },
        allFilteredNFTs
      ): filterCampaignByTag(
        {
          name: 'All',
          id: '',
        },
        allNFTs
      );
    campaignsTagsName &&
      setCampaignTags([{ name: 'All', id: '' }, ...campaignsTagsName]);
      const creatorsTagsName =
      allFilteredNFTs.length>0 ?
      filterCreatorByTag(
        {
          name: 'All',
          id: '',
        },
        allFilteredNFTs
      ):filterCreatorByTag(
        {
          name: 'All',
          id: '',
        },
        allNFTs
      );
    creatorsTagsName &&
      setCreatorTags([
        {
          name: 'All',
          id: '',
        },
        ...creatorsTagsName,
      ]);
    },
    
    [allNFTs, setFilteredNFTs,filterCampaignByTag,filterCollectionByTag,filterCreatorByTag]
  );

  //function returns button of buying NFT
  const IconImage = ({ nft }) => {
    return (
      <>
        <i
          className='ti-shopping-cart buy-icon mfp-link fa-2x mfp-link'
          onClick={() => {
            setSelectedNFT(nft);
            setShowBuyModal(true);
          }}
        ></i>
      </>
    );
  };

  const CaptionItem = (nft) => (
    <div className='text-white text-left port-box'>
      <h5>
        {nft.name}&nbsp;&nbsp;{' '}
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
          title={`Click to see all NFTs for '${nft.beneficiaryName}' beneficiary`}
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
            {nft.price} {nft.currency}
            &nbsp;&nbsp;
          </>
        )}
        {nft.isForSale === 'true' && <IconImage nft={nft} />}
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
            size={90}
          />{' '}
        </Link>
        &nbsp;
        <CopyText
          link={`${window.location.origin}/#/nft-detail?id=${nft.tokenId}`}
        />
        &nbsp;
        <CopyCode
          link={`<iframe src='https://dev.verifiedimpactnfts.com/#/nft-card?id=${nft.tokenId}'></iframe>`}
        />
      </p>
    </div>
  );

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
                  {' '}
                  {collection ? collectionName : creatorName}
                </span>
                {collection &&
                  process.env.REACT_APP_SHOW_TWITTER != 'false' && (
                    <CampaignOrCollectionTwitterShare
                      campaign={''}
                      beneficiary={
                        filteredNFTs && filteredNFTs[0]?.beneficiaryName
                      }
                      creator={creatorName}
                      collection={collectionName}
                      url={`${window.location.origin}/#/CreatorNFTs?creator=${creator}&collection=${collection}`}
                      beneficiaryPercentage={
                        allNFTs && allNFTs[0]?.beneficiaryPercentage
                      }
                    />
                  )}
                &nbsp;
                <CopyText link={window.location.href} />
                &nbsp;&nbsp;
                <img
                  src={viewIcon}
                  width='40px'
                  onClick={() => {
                    setSelectedViewProfile(creator);
                    setShowViewModal(true);
                  }}
                  className='cursor-pointer'
                />
              </h1>

              <div className='breadcrumb-row'>
                <ul className='list-inline'>
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className='ml-1'>{creatorName}</li>
                  {collection && <li className='ml-1'>{collectionName}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*  Section-1 Start  */}
        <div className='section-full content-inner-1 portfolio text-uppercase'>
        {SDGsGoalsData.length>0&& <div className="site-filters clearfix  left mx-5   m-b40">
           SDGs Goals:{' '} <SDGsMultiSelect
              data={SDGsGoalsData}
              SDGsChanged={(selectedData) => {
                handleSDGsChange(selectedData);
              }}
              isClear={isClearSDGs}
            />
          </div>}
          {(creator === undefined || creator === null) && (
            <div className='site-filters clearfix  left mx-5   m-b40'>
              <ul className='filters' data-toggle='buttons'>
                Creator:{' '}
                {creatorTags &&
                  creatorTags.length &&
                  creatorTags.map((singleTag, index) => (
                    <TagLi
                      key={index}
                      item={singleTag}
                      handleSetTag={getCreatorsBasedOnTag}
                      tagActive={tagCreator === singleTag ? true : false}
                      type='creator'
                      creator={creator}
                    />
                  ))}
              </ul>
            </div>
          )}
          {/* {(collection === undefined || collection === null) && ( */}
          <div className='site-filters clearfix  left mx-5   m-b40'>
            <ul className='filters' data-toggle='buttons'>
              Campaign:{' '}
              {campaignTags &&
                campaignTags.length &&
                campaignTags.map((singleTag, index) => (
                  <TagLi
                    key={index}
                    item={singleTag}
                    handleSetTag={getCampaignsBasedOnTag}
                    tagActive={
                      tagCampaign.name === singleTag.name ? true : false
                    }
                    type='campaign'
                    creator={creator}
                  />
                ))}
            </ul>
          </div>
          {/* )} */}
          {(collection === undefined || collection === null) && (
            <div className='site-filters clearfix left mx-5  m-b40'>
              <ul className='filters' data-toggle='buttons'>
                Collection:{' '}
                {collectionTags &&
                  collectionTags.length > 0 &&
                  collectionTags.map((singleTag, index) => (
                    <TagLi
                      key={index}
                      item={singleTag}
                      handleSetTag={getCollectionsBasedOnTag}
                      tagActive={tagCollection === singleTag ? true : false}
                      type='collection'
                      creator={creator}
                    />
                  ))}
              </ul>
            </div>
          )}
          {openSlider && filteredNFTs && filteredNFTs.length && (
            <Lightbox
              mainSrc={filteredNFTs[photoIndex].image}
              nextSrc={
                filteredNFTs[(photoIndex + 1) % filteredNFTs.length].image
              }
              prevSrc={
                filteredNFTs[
                  (photoIndex + filteredNFTs.length - 1) % filteredNFTs.length
                ].image
              }
              onCloseRequest={() => setOpenSlider(false)}
              onMovePrevRequest={() =>
                setPhotoIndex(
                  (photoIndex + filteredNFTs.length - 1) % filteredNFTs.length
                )
              }
              onMoveNextRequest={() =>
                setPhotoIndex((photoIndex + 1) % filteredNFTs.length)
              }
              imageCaption={sliderCaptions[photoIndex]}
            />
          )}
          {allNFTs && filteredNFTs ? (
            filteredNFTs?.length ? (
              <SimpleReactLightbox>
                <SRLWrapper options={options}>
                  <div className='clearfix'>
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
                        {filteredNFTs.map((item, index) => (
                          <li
                            className='web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0'
                            key={index}
                          >
                            <NFTCard
                              item={item}
                              index={index}
                              openSlider={(newIndex) => {
                                setPhotoIndex(newIndex);
                                setOpenSlider(true);
                              }}
                            />
                          </li>
                        ))}
                      </Masonry>
                    </ul>
                  </div>
                </SRLWrapper>
              </SimpleReactLightbox>
            ) : (
              <h4 className='text-muted text-center mb-5'>
                There is No Data With this Filter
              </h4>
            )
          ) : (
            <div className='vinft-page-loader'>
              <div className='vinft-spinner-body'>
                <Spinner animation='border' variant='success' />
                <p>Fetching NFTs Please wait...</p>
              </div>
            </div>
          )}
        </div>
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
      {showViewModal && (
        <ViewProfile
          show={showViewModal}
          handleCloseParent={() => {
            setShowViewModal(false);
          }}
          data={selectedViewProfile}
          formName={ProfileFormsEnum.CreatorProfile}
        />
      )}
    </Layout>
  );
};
export default CreatorNFTs;
