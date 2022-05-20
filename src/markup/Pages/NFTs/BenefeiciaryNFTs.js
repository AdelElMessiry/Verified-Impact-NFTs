import React, { useState, useEffect, Fragment } from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import Masonry from 'react-masonry-component';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';

import { getBeneficiariesList } from '../../../api/beneficiaryInfo';
import { getNFTsList } from '../../../api/nftInfo';
import VINFTsTooltip from '../../Element/Tooltip';
import NFTCard from '../../Element/NFTCard';
import BuyNFTModal from '../../Element/BuyNFT';
import Header from '../../Layout/Header1';
import Footer from '../../Layout/Footer1';
import {Spinner} from "react-bootstrap";
import { getBeneficiariesCampaignsList } from '../../../api/beneficiaryInfo';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { getCreatorsList } from '../../../api/creatorInfo';

// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };
// Masonry section end

//handling filteration markup
const TagLi = ({ name, handlesettag, tagActive, type }) => {
  return (
    <VINFTsTooltip
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
    </VINFTsTooltip>
  );
};

const BenefeiciaryNFTs = () => {
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
  const [loader, setLoader] = useState(true);
  const [openSlider, setOpenSlider] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [sliderCaptions, setSliderCaptions] = useState([]);
  const [collectionTags, setCollectionTags] = useState([]);
  const [campaignTags, setCampaignTags] = useState([]);
  const [creatorTags, setCreatorTags] = useState([]);
  const [searchFlag, setSearchFlag] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState();
  const [beneficiaryDescription, setBeneficiaryDescription] = useState();
  const [beneficiaries, setbeneficiaries] = useState();
  const [allCreators, setCreators] = useState();
  
  useEffect(() => {
    (async () => {
      if (!campaign) {
        let beneficiaryList =
          !beneficiaryDescription && (await getBeneficiariesList());
        let selectedBeneficiary =
          !beneficiaryDescription &&
          beneficiaryList.filter((b) => b.name === beneficiary);
        !beneficiaryDescription &&
          setBeneficiaryDescription(selectedBeneficiary[0].description);
      }
    })();
  }, [beneficiaryDescription]);

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

  //set selected collections in filteration
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

  //set selected campaigns in filteration
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

  //set selected creators in filteration
  const setSelectedCreatorTag = (tag, data = null) => {
    setTagCreator(tag);
    if (tag !== 'All') {
     // const selectedCreator = creatorsList.find(creator=> creator.name === tag);
      //const filteredNfts = allNfts.filter(nft => nft.creator === selectedCreator.address);
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
        (collectionFilter === nft.collectionName || collectionFilter === 'All') &&
        (creatorFilter === nft.creatorName || creatorFilter === 'All') &&
        (campaignFilter === nft.campaignName || campaignFilter === 'All')
      );
    });
    setFilterdImages(filteredAllData);
  };
  useEffect(() => {
    (async () => {
      if(!allNfts){
    let newNFTList = await getNFTsList();
      let nftList = [];
      let beneficiaryList =
        !beneficiaries ?(await getBeneficiariesCampaignsList()):[];
      !beneficiaries &&
        setbeneficiaries(beneficiaryList);
        let creatorsList =
        !allCreators &&await getCreatorsList();
      !allCreators &&
        setCreators(creatorsList);

        if(creatorsList?.length>0&&beneficiaries?.length>0 && newNFTList?.length>0){
        newNFTList.filter((n)=>(n.isForSale=="true")).forEach(async (element) => {
         let selectedBene= beneficiaries.filter((b) => b.address === element.beneficiary);
         let selectedCampaign=selectedBene[0]?.campaigns?.filter((c=>(c.id===element.campaign)))
         let selectedCreator=creatorsList?.filter((c=>(c.address===element.creator)))

          element['beneficiaryName'] = selectedBene[0].name;
          element['campaignName'] = selectedCampaign[0].name;
          element['creatorName'] = selectedCreator[0].name;

          nftList.push(element);
        });
      !allNfts && setAllNfts(nftList);
      console.log(newNFTList);
        }else{
          setAllNfts([]);
       }}
  })()}, [allNfts,beneficiaries,allCreators]);
  useEffect(() => {
    (async () => {
        if(beneficiaries?.length>0 && allNfts?.length>0&& allCreators?.length>0) {    
    let Data = [];
    if (beneficiary && !campaign) {
      Data = allNfts.filter((nft) => nft.beneficiaryName === beneficiary);
    } else if (beneficiary && campaign) {
      Data = allNfts.filter(
        (nft) => nft.beneficiaryName === beneficiary && nft.campaignName === campaign
      );
    } else {
      Data = allNfts;
    }
    let collection = Data.map((data) => ({ name: data.collectionName })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );
    setCollectionTags([{ name: 'All' }, ...collection]);

    let campaigns = Data.map((data) => ({ name: data.campaignName })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setCampaignTags([{ name: 'All' }, ...campaigns]);

    let creators = Data.map((data) => ({ name: data.creatorName })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setCreatorTags([{ name: 'All' }, ...creators]);
    setSelectedNfts(Data);
    setTagCampaign('All');
    setTagCollection('All');
    setTagCreator('All');
    setSearchFlag(!searchFlag);
        
    const captions = [];
    for (let item = 0; item < Data.length; item++) {
      captions.push(
        <div className='text-white text-left port-box'>
          <h5>{Data[item].title}</h5>
          {/* <p>
          <b>Category: </b>
          {GetNFTs[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {Data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${Data[item].beneficiaryName}" beneficiary`}
            >
              <Link
                to={`./BenefeiciaryNFTs?beneficiary=${Data[item].beneficiaryName}`}
                className='dez-page text-white'
                onClick={() => {
                  setOpenSlider(false);
                }}
              >
                {Data[item].beneficiaryName}
              </Link>
            </VINFTsTooltip>
            <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
              {Data[item].beneficiaryPercentage}%
            </span>

            <b className='ml-4'>Campaign: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${Data[item].campaignName}" campaign`}
            >
              {Data[item].beneficiary ? (
                <Link
                  to={`./BenefeiciaryNFTs?beneficiary=${Data[item].beneficiaryName}&campaign=${Data[item].campaignName}`}
                  className='dez-page text-white'
                  onClick={() => {
                    setOpenSlider(false);
                  }}
                >
                  {Data[item].campaignName}
                </Link>
              ) : (
                <Link
                  to={`./CreatorNFTs?creator=${Data[item].creatorName}&collection=${Data[item].collectionName}`}
                  className='dez-page text-white'
                  onClick={() => {
                    setOpenSlider(false);
                  }}
                >
                  {Data[item].campaignName}
                </Link>
              )}
            </VINFTsTooltip>
            <b className='ml-4'>Creator: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs created by "${Data[item].creatorName}"`}
            >
              <Link
                to={`./CreatorNFTs?creator=${Data[item].creatorName}`}
                className='dez-page text-white'
                onClick={() => {
                  setOpenSlider(false);
                }}
              >
                {Data[item].creatorName}
              </Link>
            </VINFTsTooltip>
            <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
              {Data[item].creatorPercentage}%
            </span>

            <b className='ml-4'>Collection: </b>
            <Link
              to={`./collection?collection=${Data[item].collectionName}`}
              className='dez-page text-white'
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {Data[item].collectionName}
            </Link>
          </p>
          <p className='d-flex align-content-center align-items-center'>
            <b>Price: </b>
            {Data[item].price} {Data[item].currency}
            &nbsp;&nbsp;
            <Iconimage nft={Data[item]} /> 
          </p>
        </div>
      );
    }
    setSliderCaptions(captions);
        }
  })()}, [campaign,beneficiary,creator, allNfts]);

  const options = {
    buttons: { showDownloadButton: false },
  };
  useEffect(() => {
    handleSearch(tagCollection, tagCreator, tagCampaign);
  }, [searchFlag]);
  return (
    <Fragment>
      <Header />
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
                  {campaign ? campaign : beneficiary ? beneficiary : creator}
                </span>
              </h1>
              <p className='text-white ben-desc'>
                {!campaign && beneficiaryDescription
                  ? beneficiaryDescription
                  : ''}
              </p>

              <div className='breadcrumb-row'>
                <ul className='list-inline'>
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className='ml-1'>
                    {beneficiary ? beneficiary : creator}
                  </li>
                  {campaign && <li className='ml-1'>{campaign}</li>}
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
                      tagActive={tagCampaign === singleTag.name ? true : false}
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
                    tagActive={tagCollection === singleTag.name ? true : false}
                    type='collection'
                  />
                ))}
            </ul>
          </div>
          {(openSlider&&filteredImages&&filteredImages?.length>0) && (
            <Lightbox
              mainSrc={filteredImages[photoIndex].image}
              nextSrc={
                filteredImages[(photoIndex + 1) % filteredImages?.length].image
              }
              prevSrc={
                filteredImages[
                  (photoIndex + filteredImages?.length - 1) %
                    filteredImages?.length
                ].image
              }
              onCloseRequest={() => setOpenSlider(false)}
              onMovePrevRequest={() =>
                setPhotoIndex(
                  (photoIndex + filteredImages?.length - 1) %
                    filteredImages?.length
                )
              }
              onMoveNextRequest={() =>
                setPhotoIndex((photoIndex + 1) % filteredImages.length)
              }
              imageCaption={sliderCaptions[photoIndex]}
            />
          )}
         {(allNfts&&filteredImages)?(
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
                      {filteredImages?.map((item, index) => (
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
             )):  ( 
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
        />
      )}
      <Footer />
    </Fragment>
  );
};
export default BenefeiciaryNFTs;
