import React, { Component, useState, useEffect, Fragment } from "react";
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import Header from "../../Layout/Header1";
import Footer from "../../Layout/Footer1";
import PageTitle from "../../Layout/PageTitle";
import Masonry from "react-masonry-component";
import NFTCard from "../../Element/NFTCard";
//images
import bnr1 from "./../../../images/banner/bnr1.jpg";

import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Lightbox from "react-image-lightbox";
import { Link } from "react-router-dom";
import {imageBlog} from "../../NFTData"



// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: ".my-bg-image-el" };
// Masonry section end

const TagLi = ({ name, handlesettag, tagActive }) => {
  return (
    <li
      className={` tag ${tagActive ? "btn active" : "btn"}`}
      onClick={() => handlesettag(name)}
    >
      <input type="radio" />
      <button className="site-button-secondry radius-sm">
        <span>
          {name} {""}
        </span>{" "}
      </button>
    </li>
  );
};

const NFTs = () => {
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const beneficiary = queryParams.get("beneficiary");
  const creator = queryParams.get("creator");
  const campaign = queryParams.get("campaign");
  const [tagCollection, setTagCollection] = useState("All");
  const [tagCreator, setTagCreator] = useState("All");
  const [tagCampaign, setTagCampaign] = useState("All");
  const [filteredImages, setFilterdImages] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState(imageBlog);
  const [openSlider, setOpenSlider] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [sliderCaptions, setSliderCaptions] = useState([]);
  const [collectionTags, setCollectionTags] = useState([]);
  const [campaignTags, setCampaignTags] = useState([]);
  const [creatorTags, setCreatorTags] = useState([]);
  const [searchFlag, setSearchFlag] = useState(false);

  const Iconimage = (props) => {
    return (
      <>
        <i className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
      </>
    );
  };

  const setSelectedCollectionTag = (tag, data = null) => {
    setTagCollection(tag);
    setSearchFlag(!searchFlag)
  };

  const setSelectedCampaignTag = (tag, data = null) => {
    setTagCampaign(tag);
    setSearchFlag(!searchFlag)
  };

  const setSelectedCreatorTag = (tag, data = null) => {
    setTagCreator(tag);
    setSearchFlag(!searchFlag)

  };


  const handleSearch=(collectionFilter,creatorFilter,campaignFilter)=>{
let filteredAllData = selectedNfts?.filter((nft) => {
  return (
    (collectionFilter === nft.collection || collectionFilter === "All") &&
    (creatorFilter === nft.creator || creatorFilter === "All") &&
    (campaignFilter === nft.campaign || campaignFilter === "All") 
  );
});
setFilterdImages(filteredAllData)
  }

  useEffect(() => {
    let Data = [];
    if (beneficiary && !campaign) {
      Data = imageBlog.filter((nft) => nft.beneficiary === beneficiary);
    } else if (beneficiary && campaign) {
      Data = imageBlog.filter(
        (nft) => nft.beneficiary === beneficiary && nft.campaign === campaign
      );
    } else if (creator && !campaign) {
      Data = imageBlog.filter((nft) => nft.creator === creator);
    } else if (creator && campaign) {
      Data = imageBlog.filter(
        (nft) => nft.creator === creator && nft.campaign === campaign
      );
    } else {
      Data = imageBlog;
    }
    let collection = Data.map((data) => ({ name: data.collection })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );
    setCollectionTags([{ name: "All" }, ...collection]);

    let campaigns = Data.map((data) => ({ name: data.campaign })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setCampaignTags([{ name: "All" }, ...campaigns]);

    let creators = Data.map((data) => ({ name: data.creator })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setCreatorTags([{ name: "All" }, ...creators]);
    setSelectedNfts(Data);
    setTagCampaign("All")
    setTagCollection("All")
    setTagCreator("All")
    setSearchFlag(!searchFlag)
    const captions = [];
    for (let item = 0; item < Data.length; item++) {
      captions.push(
        <div className="text-white text-left port-box">
          <h5>{Data[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {imageBlog[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {imageBlog[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <Link
              to={`./NFTs?beneficiary=${Data[item].beneficiary}`}
              className="dez-page text-white" onClick={()=>{setOpenSlider(false)}}
            >
              {Data[item].beneficiary}
            </Link>
            
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {Data[item].beneficiaryPercentage}%
            </span>
         
            <b className="ml-4">Campaign: </b>
            {Data[item].beneficiary ? (
              <Link
                to={`./NFTs?beneficiary=${Data[item].beneficiary}&campaign=${Data[item].campaign}`}
                className="dez-page text-white" onClick={()=>{setOpenSlider(false)}}
              >
                {Data[item].campaign}
              </Link>
            ) : (
              <Link
                to={`./NFTs?creator=${Data[item].creator}&campaign=${Data[item].campaign}`}
                className="dez-page text-white" onClick={()=>{setOpenSlider(false)}}
              >
                {Data[item].campaign}
              </Link>
            )}
            
            <b className="ml-4">Creator: </b>
            <Link
              to={`./NFTs?creator=${Data[item].creator}`}
              className="dez-page text-white" onClick={()=>{setOpenSlider(false)}}
            >
              {Data[item].creator}
            </Link>
            
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {Data[item].creatorPercentage}%
            </span>
         
            <b className="ml-4">Collection: </b>
            {Data[item].collection}
        </p><p>
            <b>Price: </b>
            {Data[item].price} {Data[item].currency}
         &nbsp;&nbsp;
          <Iconimage /> </p>
        </div>
      );
    }
    setSliderCaptions(captions);
  }, [beneficiary, campaign, creator]);

  const options = {
    buttons: { showDownloadButton: false },
  };
  useEffect(()=>{handleSearch(tagCollection,tagCreator,tagCampaign)},[searchFlag])
  return (
    <Fragment>
      <Header />
      <div className="page-content bg-white">
        {/*  banner  */}
        <div
          className="dlab-bnr-inr dlab-bnr-inr-sm overlay-primary bg-pt"
          style={{ backgroundImage: "url(" + bnr1 + ")" }}
        >
          <PageTitle
            motherMenu={
              campaign ? campaign : beneficiary ? beneficiary : creator
            }
            activeMenu={beneficiary ? beneficiary : creator}
            secondMenu={campaign ? campaign : undefined}
          />
        </div>
        {/*  Section-1 Start  */}
        <div className="section-full content-inner-1 portfolio text-uppercase">
          {(creator === undefined || creator === null) && (
            <div className="site-filters clearfix  left mx-5   m-b40">
              <ul className="filters" data-toggle="buttons">
                Creator:{" "}
                {creatorTags &&
                  creatorTags.length > 0 &&
                  creatorTags.map((singleTag, index) => (
                    <TagLi
                      key={index}
                      name={singleTag.name}
                      handlesettag={setSelectedCreatorTag}
                      tagActive={tagCreator === singleTag.name ? true : false}
                    />
                  ))}
              </ul>
            </div>
          )}
          {(campaign === undefined || campaign === null) && (
            <div className="site-filters clearfix  left mx-5   m-b40">
              <ul className="filters" data-toggle="buttons">
                Campaign:{" "}
                {campaignTags &&
                  campaignTags.length > 0 &&
                  campaignTags.map((singleTag, index) => (
                    <TagLi
                      key={index}
                      name={singleTag.name}
                      handlesettag={setSelectedCampaignTag}
                      tagActive={tagCampaign === singleTag.name ? true : false}
                    />
                  ))}
              </ul>
            </div>
          )}
          <div className="site-filters clearfix left mx-5  m-b40">
            <ul className="filters" data-toggle="buttons">
              Collection:{" "}
              {collectionTags &&
                collectionTags.length > 0 &&
                collectionTags.map((singleTag, index) => (
                  <TagLi
                    key={index}
                    name={singleTag.name}
                    handlesettag={setSelectedCollectionTag}
                    tagActive={tagCollection === singleTag.name ? true : false}
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
          {filteredImages.length > 0 ? (
            <SimpleReactLightbox>
              <SRLWrapper options={options}>
                <div className="clearfix">
                  <ul
                    id="masonry"
                    className="dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1"
                  >
                    <Masonry
                      className={"my-gallery-class"} // default ''
                      options={masonryOptions} // default {}
                      disableImagesLoaded={false} // default false
                      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                      imagesLoadedOptions={imagesLoadedOptions} // default {}
                    >
                      {filteredImages.map((item, index) => (
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
          )}
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};
export { imageBlog };
export default NFTs;
