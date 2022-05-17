import React, { Component, useState, useEffect, Fragment } from "react";
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import Header from "../Layout/Header1";
import Footer from "../Layout/Footer1";
import Masonry from "react-masonry-component";
import NFTCard from "../Element/NFTCard";
//images
import bnr1 from "./../../images/banner/bnr1.jpg";

import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Lightbox from "react-image-lightbox";
import { Link } from "react-router-dom";
import { imageBlog } from "../NFTData";
import VINFTsTooltip from "../Element/Tooltip";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { Row, Col, Container } from "reactstrap";
import NFTTwitterShare from "../Element/TwitterShare/NFTTwitterShare";
import ReactGA from 'react-ga';
// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const imagesLoadedOptions = { background: ".my-bg-image-el" };
// Masonry section end



const SingleCollection = () => {
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const collection = queryParams.get("collection");
  
  const [selectedNfts, setSelectedNfts] = useState(imageBlog);
  const [openSlider, setOpenSlider] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [sliderCaptions, setSliderCaptions] = useState([]);

  const Iconimage = (props) => {
    return (
      <>
        <i className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
      </>
    );
  };



  useEffect(() => {
    let Data=[]
    let location = window.location.href.split("/#/")
    ReactGA.pageview(window.location.pathname +location[1]);
    if (collection) {
      Data = imageBlog.filter((nft) => nft.collection === collection);
      setSelectedNfts(Data);
    } 
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
            {Data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${Data[item].beneficiary}" beneficiary`}
            >
              <Link
                to={`./BenefeiciaryNFTs?beneficiary=${Data[item].beneficiary}`}
                className="dez-page text-white"
                onClick={() => {
                  setOpenSlider(false);
                }}
              >
                {Data[item].beneficiary}
              </Link>
            </VINFTsTooltip>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {Data[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${Data[item].campaign}" campaign`}
            >
              {Data[item].beneficiary ? (
                <Link
                  to={`./BenefeiciaryNFTs?beneficiary=${Data[item].beneficiary}&campaign=${Data[item].campaign}`}
                  className="dez-page text-white"
                  onClick={() => {
                    setOpenSlider(false);
                  }}
                >
                  {Data[item].campaign}
                </Link>
              ) : (
                <Link
                  to={`./CreatorNFTs?creator=${Data[item].creator}&collection=${Data[item].collection}`}
                  className="dez-page text-white"
                  onClick={() => {
                    setOpenSlider(false);
                  }}
                >
                  {Data[item].campaign}
                </Link>
              )}
            </VINFTsTooltip>
            <b className="ml-4">Creator: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs created by "${Data[item].creator}"`}
            >
              <Link
                to={`./CreatorNFTs?creator=${Data[item].creator}`}
                className="dez-page text-white"
                onClick={() => {
                  setOpenSlider(false);
                }}
              >
                {Data[item].creator}
              </Link>
            </VINFTsTooltip>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {Data[item].creatorPercentage}%
            </span>

            <b className="ml-4">Collection: </b>
            <Link
                    to={`./collection?collection=${Data[item].collection}`}
                    className="dez-page text-white"  onClick={() => {
                      setOpenSlider(false);
                    }}
                  >{Data[item].collection}</Link>
          </p>
          <p className="d-flex align-content-center align-items-center">
            <b>Price: </b>
            {Data[item].price} {Data[item].currency}
            &nbsp;&nbsp;
            <Iconimage /> &nbsp;&nbsp; <NFTTwitterShare item={Data[item]}/>
          </p>
        </div>
      );
    }
    setSliderCaptions(captions);
  }, []);

  const options = {
    buttons: { showDownloadButton: false },
  };

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
              <span className="mr-1"> {collection}</span> 
                {collection && process.env.REACT_APP_SHOW_TWITTER != "false" &&(
                  <TwitterShareButton
                    className="twitter-icon mfp-link portfolio-fullscreen pt-2"
                    url={`https://verifiedimpactnfts.com/#/collection?collection=${collection.replace(/ /g,"%20")}`}
                    title={`I support the #NFT "${collection}" collection, of the proceeds go to the "Ukraine Gov". Check it out at `}
                  >
                    <TwitterIcon
                      size={32}
                      round
                      iconFillColor="white"
                      style={{ fill: "black" }}
                    />
                  </TwitterShareButton>
                )}
              </h1>

              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={"#"}>Home</Link>
                  </li>
                  <li className="ml-1">
                    {collection}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*  Section-1 Start  */}
        <div className="section-full content-inner-1 portfolio text-uppercase">
          {openSlider && (
            <Lightbox
              mainSrc={selectedNfts[photoIndex].image}
              nextSrc={
                selectedNfts[(photoIndex + 1) % selectedNfts.length].image
              }
              prevSrc={
                selectedNfts[
                  (photoIndex + selectedNfts.length - 1) %
                    selectedNfts.length
                ].image
              }
              onCloseRequest={() => setOpenSlider(false)}
              onMovePrevRequest={() =>
                setPhotoIndex(
                  (photoIndex + selectedNfts.length - 1) %
                    selectedNfts.length
                )
              }
              onMoveNextRequest={() =>
                setPhotoIndex((photoIndex + 1) % selectedNfts.length)
              }
              imageCaption={sliderCaptions[photoIndex]}
            />
          )}
          {selectedNfts.length > 0 ? (
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
                      {selectedNfts.map((item, index) => (
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
export default SingleCollection;
