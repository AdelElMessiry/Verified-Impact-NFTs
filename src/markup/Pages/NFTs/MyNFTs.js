import React, { Component, useState, useEffect, Fragment } from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper, useLightbox } from 'simple-react-lightbox';

import Masonry from 'react-masonry-component';
import NFTCard from '../../Element/NFTCard';
//images
import bnr1 from './../../../images/banner/bnr1.jpg';
import { Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import { getNFTsOwned } from '../../../api/userInfo';
import { getBeneficiariesCampaignsList } from '../../../api/beneficiaryInfo';

import VINftsTooltip from '../../Element/Tooltip';
import { useAuth } from '../../../contexts/AuthContext';
import BuyNFTModal from '../../Element/BuyNFT';
import PromptLogin from '../PromptLogin';
import { getCreatorsList } from '../../../api/creatorInfo';
import { getCollectionsList } from '../../../api/collectionInfo';
import Layout from '../../Layout';

// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };
// Masonry section end

//handling filtration markup
const TagLi = ({ name, handlesettag, tagActive, type }) => {
  return (
    <VINftsTooltip
      title={`Click to see all NFTs under the "${name}" ${
        type == 'creator'
          ? name == 'All'
            ? 'creators'
            : 'creator'
          : type == 'campaign'
          ? name == 'All'
            ? 'campaigns'
            : 'campaign'
          : name == 'All'
          ? 'collections'
          : 'collection'
      } `}
    >
      <li
        className={` tag ${tagActive ? 'btn active' : 'btn'}`}
        onClick={() => handlesettag(name)}
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

const MyNFTs = () => {
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const beneficiary = queryParams.get('beneficiary');
  const creator = queryParams.get('creator');
  const campaign = queryParams.get('campaign');
  const [tagCollection, setTagCollection] = useState('All');
  const [tagCreator, setTagCreator] = useState('All');
  const [tagCampaign, setTagCampaign] = useState('All');
  const [filteredImages, setFilterdImages] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState();
  const [allNfts, setAllNfts] = useState();
  const [openSlider, setOpenSlider] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [sliderCaptions, setSliderCaptions] = useState([]);
  const [collectionTags, setCollectionTags] = useState([]);
  const [campaignTags, setCampaignTags] = useState([]);
  const [creatorTags, setCreatorTags] = useState([]);
  const [searchFlag, setSearchFlag] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState();
  const [beneficiaries, setbeneficiaries] = useState();
  const [allCreators, setCreators] = useState();
  const [allCollections, setCollections] = useState();

  //function returns button of buying NFT
  const Iconimage = ({ nft }) => {
    return (
      <>
        <i
          className='ti-exchange-vertical transfer-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen'
          onClick={() => {
            setSelectedNFT(nft);
            setShowBuyModal(true);
          }}
        ></i>
      </>
    );
  };

  //set selected collections in filtration
  const setSelectedCollectionTag = (tag, data = null) => {
    setTagCollection(tag);
    if (tag !== 'All') {
      console.log(allNfts);
      let campaigns = allNfts
        .filter((d) => d.collectionName == tag)
        .map((data) => ({ name: data.campaignName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );
      setCampaignTags([{ name: 'All' }, ...campaigns]);
      setTagCampaign('All');

      let creators = allNfts
        .filter((d) => d.collectionName == tag)
        .map((data) => ({ name: data.creatorName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: 'All' }, ...creators]);
      setTagCreator('All');
    } else {
      let campaigns = allNfts
        .map((data) => ({ name: data.campaignName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCampaignTags([{ name: 'All' }, ...campaigns]);
      setTagCampaign('All');

      let creators = allNfts
        .map((data) => ({ name: data.creatorName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: 'All' }, ...creators]);
      setTagCreator('All');
    }
    setSearchFlag(!searchFlag);
  };

  //set selected campaigns in filtration
  const setSelectedCampaignTag = (tag, data = null) => {
    setTagCampaign(tag);
    if (tag !== 'All') {
      let collections = allNfts
        .filter((d) => d.campaignName == tag)
        .map((data) => ({ name: data.collectionName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );
      setCollectionTags([{ name: 'All' }, ...collections]);
      setTagCollection('All');

      let creators = allNfts
        .filter((d) => d.campaignName == tag)
        .map((data) => ({ name: data.creatorName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: 'All' }, ...creators]);
      setTagCreator('All');
    } else {
      let collections = allNfts
        .map((data) => ({ name: data.collectionName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCollectionTags([{ name: 'All' }, ...collections]);
      setTagCollection('All');

      let creators = allNfts
        .map((data) => ({ name: data.creatorName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: 'All' }, ...creators]);
      setTagCreator('All');
    }
    setSearchFlag(!searchFlag);
  };

  //set selected creators in filtration
  const setSelectedCreatorTag = (tag, data = null) => {
    setTagCreator(tag);
    if (tag !== 'All') {
      let campaigns = allNfts
        .filter((d) => d.creatorName == tag)
        .map((data) => ({ name: data.campaignName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );
      setCampaignTags([{ name: 'All' }, ...campaigns]);
      setTagCampaign('All');

      let collections = allNfts
        .filter((d) => d.creatorName == tag)
        .map((data) => ({ name: data.collectionName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCollectionTags([{ name: 'All' }, ...collections]);
      setTagCollection('All');
    } else {
      let campaigns = allNfts
        .map((data) => ({ name: data.campaignName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCampaignTags([{ name: 'All' }, ...campaigns]);
      setTagCampaign('All');
      let collections = allNfts
        .map((data) => ({ name: data.collectionName }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCollectionTags([{ name: 'All' }, ...collections]);
      setTagCollection('All');
    }
    setSearchFlag(!searchFlag);
  };

  //handling of filter nfts according to selected criteria
  const handleSearch = (collectionFilter, creatorFilter, campaignFilter) => {
    let filteredAllData = selectedNfts?.filter((nft) => {
      return (
        (collectionFilter === nft.collectionName ||
          collectionFilter === 'All') &&
        (creatorFilter === nft.creatorName || creatorFilter === 'All') &&
        (campaignFilter === nft.campaignName || campaignFilter === 'All')
      );
    });
    setFilterdImages(filteredAllData);
  };

  const { isLoggedIn, entityInfo } = useAuth();

  //getting list of NFTs
  useEffect(() => {
    if (!entityInfo.publicKey) return;
    (async () => {
      if (!entityInfo.publicKey) return;
      if (!allNfts) {
        let newNFTList = await getNFTsOwned(entityInfo.publicKey);
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
          newNFTList.forEach(async (element) => {
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
          !allNfts && setSelectedNfts(nftList);
        } else {
          setAllNfts([]);
        }
        if (nftList.length > 0) {
          let collection = nftList
            ?.map((data) => ({ name: data.collectionName }))
            .filter(
              (value, index, self) =>
                index === self.findIndex((t) => t.name === value.name)
            );
          setCollectionTags([{ name: 'All' }, ...collection]);

          let campaigns = nftList
            ?.map((data) => ({ name: data.campaignName }))
            .filter(
              (value, index, self) =>
                index === self.findIndex((t) => t.name === value.name)
            );

          setCampaignTags([{ name: 'All' }, ...campaigns]);

          let creators = nftList
            ?.map((data) => ({ name: data.creatorName }))
            .filter(
              (value, index, self) =>
                index === self.findIndex((t) => t.name === value.name)
            );

          setCreatorTags([{ name: 'All' }, ...creators]);
          setTagCampaign('All');
          setTagCollection('All');
          setTagCreator('All');
          setSearchFlag(!searchFlag);

          //setting captions of nfts full screen mode
          const captions = [];
          for (let item = 0; item < nftList?.length; item++) {
            captions.push(
              <div className='text-white text-left port-box'>
                <h5>{nftList[item].title}</h5>
                {/* <p>
          <b>Category: </b>
          {GetNFTs[item].category}
        </p> */}
                <p>
                  <b>Description: </b>
                  {nftList[item].description}
                </p>
                <p>
                  <b>Beneficiary: </b>
                  <VINftsTooltip
                    title={`Click to see all NFTs for "${nftList[item].beneficiaryName}" beneficiary`}
                  >
                    <Link
                      to={`./BeneficiaryNFTs?beneficiary=${nftList[item].beneficiaryName}`}
                      className='dez-page text-white'
                      onClick={() => {
                        setOpenSlider(false);
                      }}
                    >
                      {nftList[item].beneficiaryName}
                    </Link>
                  </VINftsTooltip>
                  <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
                    {nftList[item].beneficiaryPercentage}%
                  </span>

                  <b className='ml-4'>Campaign: </b>
                  <VINftsTooltip
                    title={`Click to see all NFTs for "${nftList[item].campaignName}" campaign`}
                  >
                    {nftList[item].beneficiary ? (
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${nftList[item].beneficiaryName}&campaign=${nftList[item].campaignName}`}
                        className='dez-page text-white'
                        onClick={() => {
                          setOpenSlider(false);
                        }}
                      >
                        {nftList[item].campaignName}
                      </Link>
                    ) : (
                      <Link
                        to={`./CreatorNFTs?creator=${nftList[item].creatorName}&collection=${nftList[item].collectionName}`}
                        className='dez-page text-white'
                        onClick={() => {
                          setOpenSlider(false);
                        }}
                      >
                        {nftList[item].campaignName}
                      </Link>
                    )}
                  </VINftsTooltip>
                  <b className='ml-4'>Creator: </b>
                  <VINftsTooltip
                    title={`Click to see all NFTs created by "${nftList[item].creatorName}"`}
                  >
                    <Link
                      to={`./CreatorNFTs?creator=${nftList[item].creatorName}`}
                      className='dez-page text-white'
                      onClick={() => {
                        setOpenSlider(false);
                      }}
                    >
                      {nftList[item].creatorName}
                    </Link>
                  </VINftsTooltip>
                  <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
                    {nftList[item].creatorPercentage}%
                  </span>

                  <b className='ml-4'>Collection: </b>
                  <Link
                    to={`./CreatorNFTs?creator=${nftList[item].creatorName}&collection=${nftList[item].collectionName}`}
                    className='dez-page text-white'
                    onClick={() => {
                      setOpenSlider(false);
                    }}
                  >
                    {nftList[item].collectionName}
                  </Link>
                </p>
                <p className='d-flex align-content-center align-items-center'>
                  <b>Price: </b>
                  {nftList[item].price} {nftList[item].currency}
                  &nbsp;&nbsp;
                  <Iconimage nft={nftList[item]} />
                </p>
              </div>
            );
          }
          setSliderCaptions(captions);
        }
      }
    })();
  }, [entityInfo, allNfts, beneficiaries, allCreators, allCollections]);

  const options = {
    buttons: { showDownloadButton: false },
  };

  //calling of handling nfts filtration
  useEffect(() => {
    handleSearch(tagCollection, tagCreator, tagCampaign);
  }, [searchFlag]);

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
                        name={singleTag.name}
                        handlesettag={setSelectedCreatorTag}
                        tagActive={tagCreator === singleTag.name ? true : false}
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
                        name={singleTag.name}
                        handlesettag={setSelectedCampaignTag}
                        tagActive={
                          tagCampaign === singleTag.name ? true : false
                        }
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
                      name={singleTag.name}
                      handlesettag={setSelectedCollectionTag}
                      tagActive={
                        tagCollection === singleTag.name ? true : false
                      }
                      type='collection'
                    />
                  ))}
              </ul>
            </div>
            {openSlider && (
              <Lightbox
                mainSrc={filteredImages[photoIndex].image}
                nextSrc={
                  filteredImages[(photoIndex + 1) % filteredImages.length].image
                }
                prevSrc={
                  filteredImages[
                    (photoIndex + filteredImages.length - 1) %
                      filteredImages.length
                  ].image
                }
                onCloseRequest={() => setOpenSlider(false)}
                onMovePrevRequest={() =>
                  setPhotoIndex(
                    (photoIndex + filteredImages.length - 1) %
                      filteredImages.length
                  )
                }
                onMoveNextRequest={() =>
                  setPhotoIndex((photoIndex + 1) % filteredImages.length)
                }
                imageCaption={sliderCaptions[photoIndex]}
              />
            )}
            {allNfts ? (
              filteredImages?.length > 0 ? (
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
                          {filteredImages.map((item, index) => (
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
        />
      )}
    </Layout>
  );
};
export default MyNFTs;
