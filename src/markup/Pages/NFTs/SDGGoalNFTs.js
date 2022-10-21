import React from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import Masonry from 'react-masonry-component';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import QRCode from 'react-qr-code';

import { useNFTState } from '../../../contexts/NFTContext';

import VINftsTooltip from '../../Element/Tooltip';
import NFTCard from '../../Element/NFTCard';
import BuyNFTModal from '../../Element/BuyNFT';
import Layout from '../../Layout';
import NFTTwitterShare from '../../Element/TwitterShare/NFTTwitterShare';
import CopyText from '../../Element/copyText';
import ViewProfile from '../ViewProfile';
import { ProfileFormsEnum } from '../../../Enums/index';

import bnr1 from './../../../images/banner/bnr1.jpg';
import soldIcon from '../../../images/icon/sold.png';
import unitedNation from '../../../images/icon/unitedNation.png';

import CopyCode from '../../Element/copyCode';
import ReactGA from 'react-ga';
import SDGsMultiSelect from '../../Element/SDGsMultiSelect';
import { SDGsData } from '../../../data/SDGsGoals';
// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const options = {
  buttons: { showDownloadButton: false },
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };

//handling filtration markup
const TagLi = ({ item, handleSetTag, tagActive, type, beneficiary }) => {
  return (
    <VINftsTooltip
      title={`Click to see all NFTs under the "${item?.name}" ${
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
            {' '}
            <Link
              to={
                type === 'creator'
                  ? `./CreatorNFTs?creator=${item?.id}`
                  : type === 'campaign'
                  ? `./BeneficiaryNFTs?beneficiary=${beneficiary}&campaign=${item?.id}`
                  : `./CreatorNFTs?creator=${item?.creator}&collection=${item?.id}`
              }
              className="mr-1 text-success text-underline"
            >
              <QRCode
                className="mr-1"
                value={
                  type === 'creator'
                    ? `${window.location.origin}/#/CreatorNFTs?creator=${item?.id}`
                    : type === 'campaign'
                    ? `${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${beneficiary}&campaign=${item?.id}`
                    : `${window.location.origin}/#/CreatorNFTs?creator=${item?.creator}&collection=${item?.id}`
                }
                size={90}
              />
            </Link>
            &nbsp;
            <CopyText
              link={
                type === 'creator'
                  ? `${window.location.origin}/#/CreatorNFTs?creator=${item?.id}`
                  : type === 'campaign'
                  ? `${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${beneficiary}&campaign=${item?.id}`
                  : `${window.location.origin}/#/CreatorNFTs?creator=${item?.creator}&collection=${item?.id}`
              }
            />
          </>
        )}
      </li>
    </VINftsTooltip>
  );
};

const SDGGoalNFTs = () => {
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const { beneficiaries, nfts, campaigns } = useNFTState();
  const [tagCollection, setTagCollection] = React.useState({
    name: 'All',
    id: '',
    creator: '',
  });
  const [tagCreator, setTagCreator] = React.useState({
    name: 'All',
    id: '',
  });
  const [tagCampaign, setTagCampaign] = React.useState({
    name: 'All',
    id: '',
  });
  const [openSlider, setOpenSlider] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [sliderCaptions, setSliderCaptions] = React.useState([]);
  const [collectionTags, setCollectionTags] = React.useState([]);
  const [campaignTags, setCampaignTags] = React.useState([]);
  const [creatorTags, setCreatorTags] = React.useState([]);

  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();
  const [selectedSDGData, setselectedSDGData] = React.useState();

  const [allNFTs, setAllNFTs] = React.useState();
  const [filteredNFTs, setFilteredNFTs] = React.useState();
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [selectedViewProfile, setSelectedViewProfile] = React.useState();
  const [SDGsGoals, setSDGsGoals] = React.useState([]);
  const [isRefreshNFTList, setIsRefreshNFTList] = React.useState(false);
  const [changedNFT, setChangedNFT] = React.useState();
  //getting beneficiary details
  const getSDGsData = React.useCallback(async () => {
    const setSelectedSDG =
      SDGsData && id && SDGsData.find(({ value }) => id === value.toString());
    setSelectedSDG && setselectedSDGData(setSelectedSDG);
  }, [id, SDGsData]);

  React.useEffect(() => {
    ReactGA.pageview(window.location.href);
    (!selectedSDGData || id) && getSDGsData();
  }, [selectedSDGData, getSDGsData, id]);

  const filterCollectionByTag = React.useCallback(
    (tag, filteredNFTs) => {
      // currentTagFilter === 'collection'
      //   ? allNFTs &&
      //     allNFTs
      //       .map(({ collectionName }) => (tag === 'All' ? collectionName : tag))
      //       .filter((name, index, names) => names.indexOf(name) === index)
      //   :
      const AllCollectionsTagsName =
        filteredNFTs &&
        filteredNFTs.map((nft) =>
          tag.name === 'All'
            ? {
                name: nft.collectionName,
                id: nft.collection,
                creator: nft.creator,
              }
            : tag
        );

      let keys = ['name', 'creator'];
      let collectionsTagsName = AllCollectionsTagsName.filter(
        (
          (s) => (o) =>
            ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join('|'))
        )(new Set())
      );

      collectionsTagsName &&
        setCollectionTags([
          { name: 'All', id: '', creator: '' },
          ...collectionsTagsName,
        ]);
    },
    []
    // [currentTagFilter, allNFTs]
  );

  const filterCampaignByTag = React.useCallback((tag, filteredNFTs) => {
    // currentTagFilter === 'campaign'
    //   ? allNFTs &&
    //     allNFTs
    //       .map(({ campaignName }) => (tag === 'All' ? campaignName : tag))
    //       .filter((name, index, names) => names.indexOf(name) === index)
    //   :
    const AllCampaignsTagsName =
      filteredNFTs &&
      filteredNFTs.map((nft) =>
        tag.name === 'All' ? { name: nft.campaignName, id: nft.campaign } : tag
      );
    let keys = ['name', 'id'];
    let campaignsTagsName = AllCampaignsTagsName.filter(
      (
        (s) => (o) =>
          ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join('|'))
      )(new Set())
    );
    campaignsTagsName &&
      setCampaignTags([{ name: 'All', id: '' }, ...campaignsTagsName]);
  }, []);

  const filterCreatorByTag = React.useCallback((tag, filteredNFTs) => {
    // currentTagFilter === 'creator'
    //   ? allNFTs &&
    //     allNFTs
    //       .map(({ creatorName }) => (tag === 'All' ? creatorName : tag))
    //       .filter((name, index, names) => names.indexOf(name) === index)
    //   :
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
      setCreatorTags([{ name: 'All', id: '' }, ...creatorsTagsName]);
  }, []);

  const handleSDGsChange = (data) => {
    setSDGsGoals(data);
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
    //to be changed after save sdgs with nft
    if (id) {
      filteredNFTs =
        nftsList &&
        nftsList.filter(
          (nft) => nft.sdgs_ids?.split(",").includes(id)
        );
    }

    filteredNFTs && setFilteredNFTs(filteredNFTs);
    filteredNFTs &&
      filterCollectionByTag({ name: 'All', id: '', creator: '' }, filteredNFTs);
    filteredNFTs && filterCampaignByTag({ name: 'All', id: '' }, filteredNFTs);
    filteredNFTs && filterCreatorByTag({ name: 'All', id: '' }, filteredNFTs);
    filteredNFTs && setAllNFTs(filteredNFTs);

    //setting captions of nfts full screen mode
    filteredNFTs &&
      filteredNFTs.forEach((nft) => captions.push(CaptionItem(nft)));
    filteredNFTs && captions.length && setSliderCaptions(captions);
  }, [
    id,
    nfts,
    filterCollectionByTag,
    filterCampaignByTag,
    filterCreatorByTag,
  ]);

  React.useEffect(() => {
    getFilteredNFTs();
  }, [getFilteredNFTs]);

  React.useEffect(() => {
    if (changedNFT) {
      const resIndex = filteredNFTs?.findIndex(
        ({ tokenId }) => tokenId == changedNFT.tokenId
      );
      filteredNFTs?.splice(resIndex, 1);
      setFilteredNFTs([
          ...filteredNFTs?.slice(0, resIndex),
          changedNFT,
          ...filteredNFTs?.slice(resIndex),
        ]
      );
      setShowBuyModal(false);
    }
  }, [isRefreshNFTList]);

  const getCollectionsBasedOnTag = React.useCallback(
    (tag = { name: 'All', id: '', creator: '' }) => {
      setTagCollection(tag);
      setTagCreator({
        name: 'All',
        id: '',
      });
      setTagCampaign({
        name: 'All',
        id: '',
      });

      const filteredCollectionsNFTs = allNFTs.filter(({ collectionName }) =>
        tag.name === 'All' ? collectionName : collectionName === tag.name
      );
      filteredCollectionsNFTs && setFilteredNFTs(filteredCollectionsNFTs);

      const campaignsTagsName =
        filteredCollectionsNFTs &&
        filterCampaignByTag(
          {
            name: 'All',
            id: '',
          },
          filteredCollectionsNFTs
        );
      campaignsTagsName &&
        setCampaignTags([{ name: 'All', id: '' }, ...campaignsTagsName]);

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
    [allNFTs, filterCampaignByTag, filterCreatorByTag]
  );

  const getCampaignsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCampaign(tag);
      setTagCreator({
        name: 'All',
        id: '',
      });
      setTagCollection({ name: 'All', id: '', creator: '' });

      const filteredCampaignsNFTs =
        allNFTs &&
        allNFTs.filter(({ campaignName }) =>
          tag.name === 'All' ? campaignName : campaignName === tag.name
        );

      filteredCampaignsNFTs && setFilteredNFTs(filteredCampaignsNFTs);

      const collectionsTagsName =
        filteredCampaignsNFTs &&
        filterCollectionByTag(
          { name: 'All', id: '', creator: '' },
          filteredCampaignsNFTs
        );
      collectionsTagsName &&
        setCollectionTags([
          { name: 'All', id: '', creator: '' },
          ...collectionsTagsName,
        ]);

      const creatorsTagsName =
        filteredCampaignsNFTs &&
        filterCreatorByTag(
          {
            name: 'All',
            id: '',
          },
          filteredCampaignsNFTs
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
    [allNFTs, filterCollectionByTag, filterCreatorByTag]
  );

  const getCreatorsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCreator(tag);
      setTagCollection({ name: 'All', id: '', creator: '' });
      setTagCampaign({
        name: 'All',
        id: '',
      });

      const filteredCreatorsNFTs =
        allNFTs &&
        allNFTs.filter(({ creatorName }) =>
          tag.name === 'All' ? creatorName : creatorName === tag.name
        );

      filteredCreatorsNFTs && setFilteredNFTs(filteredCreatorsNFTs);

      const collectionsTagsName =
        filteredCreatorsNFTs &&
        filterCollectionByTag(
          { name: 'All', id: '', creator: '' },
          filteredCreatorsNFTs
        );
      collectionsTagsName &&
        setCollectionTags([
          { name: 'All', id: '', creator: '' },
          ...collectionsTagsName,
        ]);

      const campaignsTagsName =
        filteredCreatorsNFTs &&
        filterCampaignByTag(
          {
            name: 'All',
            id: '',
          },
          filteredCreatorsNFTs
        );
      campaignsTagsName &&
        setCampaignTags([{ name: 'All', id: '' }, ...campaignsTagsName]);
    },
    [allNFTs, setFilteredNFTs, filterCollectionByTag, filterCampaignByTag]
  );

  //function returns button of buying NFT
  const IconImage = ({ nft }) => {
    return (
      <>
        <i
          className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link"
          onClick={() => {
            setSelectedNFT(nft);
            setShowBuyModal(true);
          }}
        ></i>
      </>
    );
  };

  const CaptionItem = (nft) => (
    <div className="text-white text-left port-box">
      <h5>
        {nft.title} &nbsp;&nbsp;{' '}
        {nft.isCreatorOwner === false && nft.isForSale === 'false' && (
          <img src={soldIcon} width="40px" />
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
              to={`./BeneficiaryNFTs?beneficiary=${nft.beneficiary}&campaign=${nft.campaign}`}
              className="dez-page text-white"
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {nft.campaignName}
            </Link>
          ) : (
            <Link
              to={`./CreatorNFTs?creator=${nft.creator}&collection=${nft.collection}`}
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
            to={`./CreatorNFTs?creator=${nft.creator}`}
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
          to={`./CreatorNFTs?creator=${nft.creator}&collection=${nft.collection}`}
          className="dez-page text-white"
          onClick={() => {
            setOpenSlider(false);
          }}
        >
          {nft.collectionName}
        </Link>
      </p>
      <p className="d-flex align-content-center align-items-center">
        {nft.isCreatorOwner !== false && nft.isForSale !== 'false' && (
          <>
            <b>Price: </b>
            {nft.price} {nft.currency}
            &nbsp;&nbsp;
          </>
        )}
        {nft.isForSale === 'true' && <IconImage nft={nft} />}
        &nbsp;&nbsp;{' '}
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
            size={90}
          />
        </Link>
        &nbsp;
        <CopyText
          link={`${window.location.origin}/#/nft-detail?id=${nft.tokenId}`}
        />
        &nbsp;
        <CopyCode
          link={`<iframe src="${window.location.origin}/#/nft-card?id=${nft.tokenId}"></iframe>`}
        />
      </p>
      <p>
      {nft?.sdgs_ids?.length > 0 && nft?.sdgs_ids !== '0' && (
        <div className="mt-3 px-2">
          <a href="https://sdgs.un.org/goals" target="_blank">
            <img
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
                  src={process.env.PUBLIC_URL + 'images/sdgsIcons/' + sdg.icon}
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
                <img
                  src={
                    process.env.PUBLIC_URL +
                    'images/sdgsIcons/' +
                    selectedSDGData?.icon
                  }
                  style={{ width: 40 }}
                />{' '}
                <span className="mr-1">{selectedSDGData?.label}</span>
                &nbsp;
                <CopyText link={window.location.href} />
              </h1>

              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className="ml-1">{selectedSDGData?.label}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*  Section-1 Start  */}
        <div className="section-full content-inner-1 portfolio text-uppercase">
          <div className="site-filters clearfix  left mx-5   m-b40">
            <ul className="filters" data-toggle="buttons">
              Creator:{' '}
              {creatorTags &&
                creatorTags.length &&
                creatorTags.map((singleTag, index) => (
                  <TagLi
                    key={index}
                    item={singleTag}
                    handleSetTag={getCreatorsBasedOnTag}
                    tagActive={
                      tagCreator.name === singleTag.name ? true : false
                    }
                    type="creator"
                    beneficiary={''}
                  />
                ))}
            </ul>
          </div>
          <div className="site-filters clearfix  left mx-5   m-b40">
            <ul className="filters" data-toggle="buttons">
              Campaign:{' '}
              {campaignTags &&
                campaignTags.length > 0 &&
                campaignTags.map((singleTag, index) => (
                  <TagLi
                    key={index}
                    item={singleTag}
                    handleSetTag={getCampaignsBasedOnTag}
                    tagActive={
                      tagCampaign.name === singleTag.name ? true : false
                    }
                    type="campaign"
                    beneficiary={''}
                  />
                ))}
            </ul>
          </div>
          <div className="site-filters clearfix left mx-5  m-b40">
            <ul className="filters" data-toggle="buttons">
              Collection:{' '}
              {collectionTags &&
                collectionTags.length &&
                collectionTags.map((singleTag, index) => (
                  <TagLi
                    key={index}
                    item={singleTag}
                    handleSetTag={getCollectionsBasedOnTag}
                    tagActive={
                      tagCollection.name === singleTag.name ? true : false
                    }
                    type="collection"
                    beneficiary={''}
                  />
                ))}
            </ul>
          </div>
          {openSlider && filteredNFTs && filteredNFTs.length && (
            <Lightbox
              mainSrc={filteredNFTs[photoIndex].image}
              nextSrc={
                filteredNFTs[(photoIndex + 1) % filteredNFTs?.length].image
              }
              prevSrc={
                filteredNFTs[
                  (photoIndex + filteredNFTs?.length - 1) % filteredNFTs?.length
                ].image
              }
              onCloseRequest={() => setOpenSlider(false)}
              onMovePrevRequest={() =>
                setPhotoIndex(
                  (photoIndex + filteredNFTs?.length - 1) % filteredNFTs?.length
                )
              }
              onMoveNextRequest={() =>
                setPhotoIndex((photoIndex + 1) % filteredNFTs.length)
              }
              imageCaption={sliderCaptions[photoIndex]}
            />
          )}
          {filteredNFTs ? (
            filteredNFTs?.length ? (
              <SimpleReactLightbox>
                <SRLWrapper options={options}>
                  <div className="clearfix">
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
                        {filteredNFTs?.map((item, index) => (
                          <li
                            className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0"
                            key={index}
                          >
                            <NFTCard
                              item={item}
                              index={index}
                              openSlider={(newIndex) => {
                                setPhotoIndex(newIndex);
                                setOpenSlider(true);
                              }}
                              handleCallChangeBuyNFTs={(nft) => {
                                setChangedNFT(nft);
                                setIsRefreshNFTList(
                                  !isRefreshNFTList
                                );
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
              <h4 className="text-muted text-center mb-5">
                There is No Data With this Filter
              </h4>
            )
          ) : (
            <div className="vinft-page-loader">
              <div className="vinft-spinner-body">
                <Spinner animation="border" variant="success" />
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
          handleTransactionBuySuccess={(nft)=>{ setChangedNFT(nft);
            setIsRefreshNFTList(
              !isRefreshNFTList
            );}}
        />
      )}
      {showViewModal && (
        <ViewProfile
          show={showViewModal}
          handleCloseParent={() => {
            setShowViewModal(false);
          }}
          data={selectedViewProfile}
          formName={ProfileFormsEnum.BeneficiaryProfile}
        />
      )}
    </Layout>
  );
};

export default SDGGoalNFTs;
