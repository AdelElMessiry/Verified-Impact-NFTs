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
import plusIcon from "./../../../images/icon/plus.png";

import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Lightbox from "react-image-lightbox";
import { Link } from "react-router-dom";
import { getNFTsOwned } from '../../../api/userInfo';

import VINFTsTooltip from "../../Element/Tooltip";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { Row, Col, Container } from "reactstrap";
import NFTTwitterShare from "../../Element/TwitterShare/NFTTwitterShare";
import CampaignOrCollectionTwitterShare from "../../Element/TwitterShare/CampaignOrCollectionTwitterShare";
import { useAuth } from '../../../contexts/AuthContext';
import {getCreatorsList,getCreatorDetails} from "../../../api/creatorInfo"

// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: ".my-bg-image-el" };
// Masonry section end

const TagLi = ({ name, handlesettag, tagActive, type }) => {
  return (
    <VINFTsTooltip
      title={`Click to see all NFTs under the "${name}" ${
        type == "creator"
          ? name == "All"
            ? "creators"
            : "creator"
          : type == "campaign"
          ? name == "All"
            ? "campaigns"
            : "campaign"
          : name == "All"
          ? "collections"
          : "collection"
      } `}
    >
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
    </VINFTsTooltip>
  );
};

const MyCreations = () => {
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const beneficiary = queryParams.get("beneficiary");
  const creator = queryParams.get("creator");
  const campaign = queryParams.get("campaign");
  const [tagCollection, setTagCollection] = useState("All");
  const [tagCreator, setTagCreator] = useState("All");
  const [tagCampaign, setTagCampaign] = useState("All");
  const [filteredImages, setFilterdImages] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [allNfts, setAllNfts] = useState([]);
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
    if (tag !== "All") {
      console.log(allNfts);
      let campaigns = allNfts
        .filter((d) => d.collection == tag)
        .map((data) => ({ name: data.campaign }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );
      setCampaignTags([{ name: "All" }, ...campaigns]);
      setTagCampaign("All");

      let creators = allNfts
        .filter((d) => d.collection == tag)
        .map((data) => ({ name: data.creator }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: "All" }, ...creators]);
      setTagCreator("All");
    } else {
      let campaigns = allNfts
        .map((data) => ({ name: data.campaign }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCampaignTags([{ name: "All" }, ...campaigns]);
      setTagCampaign("All");

      let creators = allNfts
        .map((data) => ({ name: data.creator }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: "All" }, ...creators]);
      setTagCreator("All");
    }
    setSearchFlag(!searchFlag);
  };

  const setSelectedCampaignTag = (tag, data = null) => {
    setTagCampaign(tag);
    if (tag !== "All") {
      let collections = allNfts
        .filter((d) => d.campaign == tag)
        .map((data) => ({ name: data.collection }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );
      setCollectionTags([{ name: "All" }, ...collections]);
      setTagCollection("All");

      let creators = allNfts
        .filter((d) => d.campaign == tag)
        .map((data) => ({ name: data.creator }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: "All" }, ...creators]);
      setTagCreator("All");
    } else {
      let collections = allNfts
        .map((data) => ({ name: data.collection }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCollectionTags([{ name: "All" }, ...collections]);
      setTagCollection("All");

      let creators = allNfts
        .map((data) => ({ name: data.creator }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCreatorTags([{ name: "All" }, ...creators]);
      setTagCreator("All");
    }
    setSearchFlag(!searchFlag);
  };

  const setSelectedCreatorTag = (tag, data = null) => {
    setTagCreator(tag);
    if (tag !== "All") {
      let campaigns = allNfts
        .filter((d) => d.creator == tag)
        .map((data) => ({ name: data.campaign }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );
      setCampaignTags([{ name: "All" }, ...campaigns]);
      setTagCampaign("All");

      let collections = allNfts
        .filter((d) => d.creator == tag)
        .map((data) => ({ name: data.collection }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCollectionTags([{ name: "All" }, ...collections]);
      setTagCollection("All");
    } else {
      let campaigns = allNfts
        .map((data) => ({ name: data.campaign }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCampaignTags([{ name: "All" }, ...campaigns]);
      setTagCampaign("All");
      let collections = allNfts
        .map((data) => ({ name: data.collection }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      setCollectionTags([{ name: "All" }, ...collections]);
      setTagCollection("All");
    }
    setSearchFlag(!searchFlag);
  };

  const handleSearch = (collectionFilter, creatorFilter, campaignFilter) => {
    let filteredAllData = selectedNfts?.filter((nft) => {
      return (
        (collectionFilter === nft.collection || collectionFilter === "All") &&
        (creatorFilter === nft.creator || creatorFilter === "All") &&
        (campaignFilter === nft.campaign || campaignFilter === "All")
      );
    });
    setFilterdImages(filteredAllData);
  };

  const { isLoggedIn, entityInfo } = useAuth();

  useEffect(() => {
    if (!entityInfo.publicKey) return;
    let newNFTList ; 
    (async () => {
      if (!entityInfo.publicKey) return;

      let  creatorsList = await getCreatorsList();
      console.log(creatorsList)
      let selectedCreator=creatorsList.filter((c)=>(c.address===entityInfo.publicKey))
      debugger;
       newNFTList = selectedCreator.length>0?await getCreatorDetails(selectedCreator[0].id):[];
      setAllNfts("ertreretetetertertre",newNFTList)
    
    debugger;
    console.log(newNFTList);
 
    let collection = newNFTList.map((data) => ({ name: data.collection })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );
    setCollectionTags([{ name: "All" }, ...collection]);

    let campaigns = newNFTList.map((data) => ({ name: data.campaign })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setCampaignTags([{ name: "All" }, ...campaigns]);

    let creators = newNFTList.map((data) => ({ name: data.creator })).filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setCreatorTags([{ name: "All" }, ...creators]);
    setSelectedNfts(newNFTList);
    setTagCampaign("All");
    setTagCollection("All");
    setTagCreator("All");
    setSearchFlag(!searchFlag);
    const captions = [];
    for (let item = 0; item < newNFTList.length; item++) {
      captions.push(
        <div className="text-white text-left port-box">
          <h5>{newNFTList[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {GetNFTs[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {newNFTList[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${newNFTList[item].beneficiary}" beneficiary`}
            >
              <Link
                to={`./BenefeiciaryNFTs?beneficiary=${newNFTList[item].beneficiary}`}
                className="dez-page text-white"
                onClick={() => {
                  setOpenSlider(false);
                }}
              >
                {newNFTList[item].beneficiary}
              </Link>
            </VINFTsTooltip>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {newNFTList[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${newNFTList[item].campaign}" campaign`}
            >
              {newNFTList[item].beneficiary ? (
                <Link
                  to={`./BenefeiciaryNFTs?beneficiary=${newNFTList[item].beneficiary}&campaign=${newNFTList[item].campaign}`}
                  className="dez-page text-white"
                  onClick={() => {
                    setOpenSlider(false);
                  }}
                >
                  {newNFTList[item].campaign}
                </Link>
              ) : (
                <Link
                  to={`./CreatorNFTs?creator=${newNFTList[item].creator}&collection=${newNFTList[item].collection}`}
                  className="dez-page text-white"
                  onClick={() => {
                    setOpenSlider(false);
                  }}
                >
                  {newNFTList[item].campaign}
                </Link>
              )}
            </VINFTsTooltip>
            <b className="ml-4">Creator: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs created by "${newNFTList[item].creator}"`}
            >
              <Link
                to={`./CreatorNFTs?creator=${newNFTList[item].creator}`}
                className="dez-page text-white"
                onClick={() => {
                  setOpenSlider(false);
                }}
              >
                {newNFTList[item].creator}
              </Link>
            </VINFTsTooltip>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {newNFTList[item].creatorPercentage}%
            </span>

            <b className="ml-4">Collection: </b>
            <Link
              to={`./collection?collection=${newNFTList[item].collection}`}
              className="dez-page text-white"
              onClick={() => {
                setOpenSlider(false);
              }}
            >
              {newNFTList[item].collection}
            </Link>
          </p>
          <p className="d-flex align-content-center align-items-center">
            <b>Price: </b>
            {newNFTList[item].price} {newNFTList[item].currency}
            &nbsp;&nbsp;
            <Iconimage /> &nbsp;&nbsp; <NFTTwitterShare item={newNFTList[item]} />
          </p>
        </div>
      );
    }
    setSliderCaptions(captions);})();
  }, [entityInfo]);

  const options = {
    buttons: { showDownloadButton: false },
  };
  useEffect(() => {
    handleSearch(tagCollection, tagCreator, tagCampaign);
  }, [searchFlag]);
  return (
    <Fragment>
      <Header />
      <div className="page-content bg-white">
        {/*  banner  */}
        <div
          className="dlab-bnr-inr dlab-bnr-inr-sm overlay-primary bg-pt"
          style={{ backgroundImage: "url(" + bnr1 + ")" }}
        >
          <div className="container">
            <div className="dlab-bnr-inr-entry">
              <h1 className="text-white d-flex align-items-center">
                <span className="mr-1">
                  My Creations   <VINFTsTooltip
                  title={`Add New Creation`}
                ><Link to={"./mint-nft"}><img src={plusIcon} className="img img-fluid" width="40px"/></Link></VINFTsTooltip>
                </span>
              </h1>

              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={"#"}>Home</Link>
                  </li>
                  <li className="ml-1">
                    My Creations
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
                      type="creator"
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
                      type="campaign"
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
                    type="collection"
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
              You Don't have NFTS yet!
            </h4>
          )}
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};
export default MyCreations;
