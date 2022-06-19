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
//images
import bnr1 from './../../../images/banner/bnr1.jpg';
import soldIcon from '../../../images/icon/sold.png';
// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };
// Masonry section end

//handling filtration markup
const TagLi = ({ name, handleSetTag, tagActive, type, creator }) => {
  return (
    <VINftsTooltip
      title={`Click to see all NFTs under the '${
        type === 'campaign' ? name.name : name
      }' ${
        type === 'creator'
          ? name === 'All'
            ? 'creators'
            : 'creator'
          : type === 'campaign'
          ? name.name === 'All'
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
            {type == 'campaign' ? name.name : name} {''}
          </span>{' '}
        </button>
        &nbsp;&nbsp;
        {(type === 'campaign' ? name.name : name) !== 'All' && (
          <>
            <Link
              to={
                type === 'campaign'
                  ? `./BeneficiaryNFTs?beneficiary=${name.beneficiary.replace(
                      / /g,
                      '%20'
                    )}&campaign=${name?.name?.replace(/ /g, '%20')}`
                  : `./CreatorNFTs?creator=${creator.replace(
                      / /g,
                      '%20'
                    )}&collection=${name?.replace(/ /g, '%20')}`
              }
              className='mr-1 text-success text-underline'
            >
              <QRCode
                className='mr-1'
                value={
                  type === 'campaign'
                    ? `${
                        window.location.origin
                      }/#/BeneficiaryNFTs?beneficiary=${name.beneficiary.replace(
                        / /g,
                        '%20'
                      )}&campaign=${name?.name?.replace(/ /g, '%20')}`
                    : `${
                        window.location.origin
                      }/#/CreatorNFTs?creator=${creator.replace(
                        / /g,
                        '%20'
                      )}&collection=${name?.replace(/ /g, '%20')}`
                }
                size={70}
              />
            </Link>
            &nbsp;&nbsp;{' '}
            <CopyText
              link={
                type === 'campaign'
                  ? `${
                      window.location.origin
                    }/#/BeneficiaryNFTs?beneficiary=${name.beneficiary.replace(
                      / /g,
                      '%20'
                    )}&campaign=${name?.name?.replace(/ /g, '%20')}`
                  : `${
                      window.location.origin
                    }/#/CreatorNFTs?creator=${creator.replace(
                      / /g,
                      '%20'
                    )}&collection=${name?.replace(/ /g, '%20')}`
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

  const { nfts } = useNFTState();
  const [tagCollection, setTagCollection] = React.useState('All');
  const [tagCreator, setTagCreator] = React.useState('All');
  const [tagCampaign, setTagCampaign] = React.useState({
    name: 'All',
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

  const filterCollectionByTag = React.useCallback((tag, filteredNFTs) => {
    const collectionsTagsName =
      filteredNFTs &&
      filteredNFTs
        .map(({ collectionName }) => (tag === 'All' ? collectionName : tag))
        .filter((name, index, names) => names.indexOf(name) === index);
    collectionsTagsName && setCollectionTags(['All', ...collectionsTagsName]);
  }, []);

  const filterCampaignByTag = React.useCallback((tag, filteredNFTs) => {
    const AllCampaignsTagsName =
      filteredNFTs &&
      filteredNFTs.map((nft) =>
        tag.name === 'All'
          ? { name: nft.campaignName, beneficiary: nft.beneficiaryName }
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
      setCampaignTags([{ name: 'All', beneficiary: '' }, ...campaignsTagsName]);
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
        nftsList && nftsList.filter((nft) => nft.creatorName === creator);
    } else if (creator && collection) {
      filteredNFTs =
        nftsList &&
        nftsList.filter(
          (nft) =>
            nft.creatorName === creator && nft.collectionName === collection
        );
    } else {
      filteredNFTs = nftsList && nftsList;
    }

    filteredNFTs && setFilteredNFTs(filteredNFTs);
    filteredNFTs && filterCollectionByTag('All', filteredNFTs);
    filteredNFTs &&
      filterCampaignByTag({ name: 'All', beneficiary: '' }, filteredNFTs);
    filteredNFTs && filterCreatorByTag('All', filteredNFTs);
    filteredNFTs && setAllNFTs(filteredNFTs);

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
  ]);

  React.useEffect(() => {
    getFilteredNFTs();
  }, [getFilteredNFTs]);

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
        filterCampaignByTag(
          { name: 'All', beneficiary: '' },
          filteredCollectionsNFTs
        );
      campaignsTagsName &&
        setCampaignTags([
          { name: 'All', beneficiary: '' },
          ...campaignsTagsName,
        ]);

      const creatorsTagsName =
        filteredCollectionsNFTs &&
        filterCreatorByTag('All', filteredCollectionsNFTs);
      creatorsTagsName && setCreatorTags(['All', ...creatorsTagsName]);
    },
    [allNFTs, filterCampaignByTag, filterCreatorByTag]
  );

  const getCampaignsBasedOnTag = React.useCallback(
    (tag = { name: 'All', beneficiary: '' }) => {
      setTagCampaign(tag);
      setTagCreator('All');
      setTagCollection('All');

      const filteredCampaignsNFTs =
        allNFTs &&
        allNFTs.filter(({ campaignName }) =>
          tag.name === 'All' ? campaignName : campaignName === tag.name
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
        filterCampaignByTag(
          { name: 'All', beneficiary: '' },
          filteredCreatorsNFTs
        );
      campaignsTagsName &&
        setCampaignTags([
          { name: 'All', beneficiary: '' },
          ...campaignsTagsName,
        ]);
    },
    [allNFTs, setFilteredNFTs, filterCollectionByTag, filterCampaignByTag]
  );

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
          title={`Click to see all NFTs for "${nft.beneficiaryName}" beneficiary`}
        >
          <Link
            to={`./BeneficiaryNFTs?beneficiary=${nft.beneficiaryName}`}
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
              to={`./BeneficiaryNFTs?beneficiary=${nft.beneficiaryName}&campaign=${nft.campaignName}`}
              className='dez-page text-white'
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {nft.campaignName}
            </Link>
          ) : (
            <Link
              to={`./CreatorNFTs?creator=${nft.creatorName}&collection=${nft.collectionName}`}
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
            to={`./CreatorNFTs?creator=${nft.creatorName}`}
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
          to={`./CreatorNFTs?creator=${nft.creatorName}&collection=${nft.collectionName}`}
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
            size={80}
          />{' '}
        </Link>
        &nbsp;&nbsp;{' '}
        <CopyText
          link={`${window.location.origin}/#/nft-detail?id=${nft.tokenId}`}
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
                  {collection ? collection : creator}
                </span>
                {collection &&
                  process.env.REACT_APP_SHOW_TWITTER != 'false' && (
                    <CampaignOrCollectionTwitterShare
                      campaign={''}
                      beneficiary={
                        filteredNFTs && filteredNFTs[0]?.beneficiaryName
                      }
                      creator={creator}
                      collection={collection}
                      url={`${
                        window.location.origin
                      }/#/CreatorNFTs?creator=${creator.replace(
                        / /g,
                        '%20'
                      )}&collection=${collection.replace(/ /g, '%20')}`}
                      beneficiaryPercentage={
                        allNFTs && allNFTs[0]?.beneficiaryPercentage
                      }
                    />
                  )}
                &nbsp;&nbsp;
                <CopyText link={window.location.href} />
              </h1>

              <div className='breadcrumb-row'>
                <ul className='list-inline'>
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className='ml-1'>{creator}</li>
                  {collection && <li className='ml-1'>{collection}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*  Section-1 Start  */}
        <div className='section-full content-inner-1 portfolio text-uppercase'>
          {(creator === undefined || creator === null) && (
            <div className='site-filters clearfix  left mx-5   m-b40'>
              <ul className='filters' data-toggle='buttons'>
                Creator:{' '}
                {creatorTags &&
                  creatorTags.length &&
                  creatorTags.map((singleTag, index) => (
                    <TagLi
                      key={index}
                      name={singleTag}
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
                    name={singleTag}
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
                      name={singleTag}
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
    </Layout>
  );
};
export default CreatorNFTs;
