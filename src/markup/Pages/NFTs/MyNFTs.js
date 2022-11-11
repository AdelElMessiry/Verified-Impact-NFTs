import React from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import Masonry from 'react-masonry-component';
import { Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { CLPublicKey } from 'casper-js-sdk';

import { useAuth } from '../../../contexts/AuthContext';
import { useNFTState } from '../../../contexts/NFTContext';
import { getMappedNftsByList } from '../../../api/nftInfo';
import { getNFTsOwned } from '../../../api/userInfo';

import VINftsTooltip from '../../Element/Tooltip';
import NFTCard from '../../Element/NFTCard';
import BuyNFTModal from '../../Element/BuyNFT';
import PromptLogin from '../PromptLogin';
import Layout from '../../Layout';
import NFTTwitterShare from '../../Element/TwitterShare/NFTTwitterShare';
import CopyText from '../../Element/copyText';

//images
import bnr1 from './../../../images/banner/bnr1.jpg';
import soldIcon from '../../../images/icon/sold.png';
import unitedNation from '../../../images/icon/unitedNation.png';

import CopyCode from '../../Element/copyCode';
import ReactGA from 'react-ga';
import { SDGsData } from '../../../data/SDGsGoals';
// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const options = {
  buttons: { showDownloadButton: false },
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

const MyNFTs = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const { beneficiaries, profileCreators, collections, campaigns } = useNFTState();

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
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();

  const [collectionTags, setCollectionTags] = React.useState([]);
  const [campaignTags, setCampaignTags] = React.useState([]);
  const [creatorTags, setCreatorTags] = React.useState([]);
  const [allNFTs, setAllNFTs] = React.useState();
  const [filteredNFTs, setFilteredNFTs] = React.useState();
  const [isRefreshNFTList, setIsRefreshNFTList] = React.useState(false);
  const [changedNFT, setChangedNFT] = React.useState();
  const filterCollectionByTag = React.useCallback((tag, filteredNFTs) => {
    const collectionsTagsName =
      filteredNFTs &&
      filteredNFTs
        .map(({ collectionName }) => (tag === 'All' ? collectionName : tag))
        .filter((name, index, names) => names.indexOf(name) === index);
    collectionsTagsName && setCollectionTags(['All', ...collectionsTagsName]);
  }, []);

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

    const nftsList = await getNFTsOwned(entityInfo.publicKey);
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
    filteredNFTs && setFilteredNFTs(filteredNFTs);
    filteredNFTs && filterCollectionByTag('All', filteredNFTs);
    filteredNFTs && filterCampaignByTag('All', filteredNFTs);
    filteredNFTs && filterCreatorByTag('All', filteredNFTs);
    filteredNFTs && setAllNFTs(filteredNFTs);

    filteredNFTs &&
      filteredNFTs.forEach((nft) => captions.push(CaptionNFT(nft)));
    filteredNFTs && captions.length && setSliderCaptions(captions);
  }, [
    entityInfo.publicKey,
    beneficiaries,
    campaigns,
    collections,
    profileCreators,
    filterCollectionByTag,
    filterCampaignByTag,
    filterCreatorByTag,
  ]);

  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname +"MyNfts");
    entityInfo.publicKey && getFilteredNFTs();
  }, [entityInfo.publicKey, getFilteredNFTs]);

  React.useEffect(() => {
    if (changedNFT) {
      const resIndex = filteredNFTs?.findIndex(
        ({ tokenId }) => tokenId == changedNFT.tokenId
      );
      filteredNFTs?.splice(resIndex, 1);
      setFilteredNFTs(filteredNFTs);
      setShowBuyModal(false);
    }
  }, [isRefreshNFTList]);

  const getCollectionsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCollection(tag);
      setTagCreator('All');
      setTagCampaign('All');

      // const collectionsTagsName =
      //   allNFTs && filterCollectionByTag(tag, allNFTs);
      // collectionsTagsName && setCollectionTags(['All', ...collectionsTagsName]);

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
    },
    [allNFTs, filterCampaignByTag, filterCreatorByTag]
  );

  const getCampaignsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCampaign(tag);
      setTagCreator('All');
      setTagCollection('All');

      // const campaignsTagsName = allNFTs && filterCampaignByTag(tag, allNFTs);

      // campaignsTagsName && setCampaignTags(['All', ...campaignsTagsName]);

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
    },
    [allNFTs, filterCollectionByTag, filterCreatorByTag]
  );

  const getCreatorsBasedOnTag = React.useCallback(
    (tag = 'All') => {
      setTagCreator(tag);
      setTagCollection('All');
      setTagCampaign('All');

      // const creatorsTagsName = allNFTs && filterCreatorByTag(tag, allNFTs);

      // creatorsTagsName && setCreatorTags(['All', ...creatorsTagsName]);

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
    },
    [allNFTs, setFilteredNFTs, filterCollectionByTag, filterCampaignByTag]
  );

  //function returns button of buying NFT
  const IconImage = ({ nft }) => {
    return (
      <>
        <i
          className='ti-exchange-vertical transfer-icon buy-icon mfp-link fa-2x mfp-link'
          onClick={() => {
            setSelectedNFT(nft);
            setShowBuyModal(true);
          }}
        ></i>
      </>
    );
  };

  const CaptionNFT = (nft) => (
    <div className='text-white text-left port-box'>
      <h5>
        {nft.title}&nbsp;&nbsp;{' '}
        {nft.isCreatorOwner === false && nft.isForSale === 'false' && (
          <img src={soldIcon} width='40px' alt='soldIcon' />
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
            {' '}
            <b>Price: </b>
            {nft.price} {nft.currency}
            &nbsp;&nbsp;
            <IconImage nft={nft} />
          </>
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
            size={90}
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
      <div className='page-content bg-white'>
        {/*  banner  */}
        <div
          className='dlab-bnr-inr dlab-bnr-inr-sm overlay-primary bg-pt'
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <div className='container'>
            <div className='dlab-bnr-inr-entry'>
              <h1 className='text-white d-flex align-items-center'>
                <span className='mr-1'>My NFTs</span>
              </h1>

              <div className='breadcrumb-row'>
                <ul className='list-inline'>
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className='ml-1'>My NFTs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*  Section-1 Start  */}
        {!isLoggedIn ? (
          <PromptLogin />
        ) : (
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
            {openSlider && (
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
            {filteredNFTs ? (
              filteredNFTs?.length > 0 ? (
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
                            item.creator != `${CLPublicKey.fromHex(
                              entityInfo.publicKey
                            )
                              .toAccountHashStr()
                              .slice(13)}`&& (
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
                                  isTransfer={true}
                                  isMyNft={true}
                                  handleCallChangeBuyNFTs={(nft) => {
                                    setChangedNFT(nft);
                                    setIsRefreshNFTList(
                                      !isRefreshNFTList
                                    );
                                  }}
                                />
                              </li>
                            )                                                       
                          ))}
                        </Masonry>
                      </ul>
                    </div>
                  </SRLWrapper>
                </SimpleReactLightbox>
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
          handleTransactionBuySuccess={(nft)=>{ setChangedNFT(nft);
            setIsRefreshNFTList(
              !isRefreshNFTList
            );}}
        />
      )}
    </Layout>
  );
};
export default MyNFTs;
