import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import Header6 from "./../Layout/Header6";
import Footer3 from "./../Layout/footer3";
import Index4Tab from "./../Element/Index4Tab";
import ReviewsCarousel from "./../Element/ReviewsCarousel";
import { VideoPopup2 } from "./../Element/VideoPopup";
import NFTCard from "../Element/NFTCard";
//Images..
import bgimg from "./../../images/main-slider/slide6.jpg";
import bg16 from "./../../images/background/bg16.jpg";
import about1 from "./../../images/about/pic9.jpg";
import Lightbox from "react-image-lightbox";
import { imageBlog } from "../NFTData";
import Masonry from "react-masonry-component";
import VINFTsTooltip from "../Element/Tooltip";
import { TwitterIcon, TwitterShareButton } from "react-share";

//Light Gallery on icon click
const Iconimage = (props) => {
  return (
    <>
      <i className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
    </>
  );
};

const Index4 = () => {
  const [openSliderCamp1, setOpenSliderCamp1] = useState(false);
  const [openSliderCamp2, setOpenSliderCamp2] = useState(false);
  const [openSliderCamp3, setOpenSliderCamp3] = useState(false);
  const [openSliderCamp4, setOpenSliderCamp4] = useState(false);
  const [photoIndex, setPhotoIndex] = useState();
  const [sliderCaptionsCamp1, setSliderCaptionsCamp1] = useState([]);
  const [sliderCaptionsCamp2, setSliderCaptionsCamp2] = useState([]);
  const [sliderCaptionsCamp3, setSliderCaptionsCamp3] = useState([]);
  const [sliderCaptionsCamp4, setSliderCaptionsCamp4] = useState([]);

  const options = {
    buttons: { showDownloadButton: false },
  };
  // Masonry section
  const masonryOptions = {
    transitionDuration: 0,
  };

  const imagesLoadedOptions = { background: ".my-bg-image-el" };
  // Masonry section end
  let collectionLength = imageBlog
    .map((data) => ({ name: data.collection }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    ).length;

  let campaignLength = imageBlog
    .map((data) => ({ name: data.campaign }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    ).length;

  let creatorLength = imageBlog
    .map((data) => ({ name: data.creator }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    ).length;

  let beneficiaryLength = imageBlog
    .map((data) => ({ name: data.beneficiary }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    ).length;

  let csprSum = imageBlog
    .map((a) => Number(a.price))
    .reduce(function (a, b) {
      return a + b;
    });
  const setCaptions = (data, camNumber) => {
    const captionsCamp = [];
    for (let item = 0; item < data.length; item++) {
      captionsCamp.push(
        <div className="text-white text-left port-box">
          <h5>{data[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {Camp4Data[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${data[item].beneficiary}" beneficiary`}
            >
              <Link
                to={`./NFTs?beneficiary=${data[item].beneficiary}`}
                className="dez-page text-white"
              >
                {data[item].beneficiary}
              </Link>
            </VINFTsTooltip>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {data[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs for "${data[item].campaign}" campaign`}
            >
              {data[item].beneficiary ? (
                <Link
                  to={`./NFTs?beneficiary=${data[item].beneficiary}&campaign=${data[item].campaign}`}
                  className="dez-page text-white"
                >
                  {data[item].campaign}
                </Link>
              ) : (
                <Link
                  to={`./NFTs?creator=${data[item].creator}&campaign=${data[item].campaign}`}
                  className="dez-page text-white"
                >
                  {data[item].campaign}
                </Link>
              )}
            </VINFTsTooltip>
            <b className="ml-4">Creator: </b>
            <VINFTsTooltip
              title={`Click to see all NFTs created by "${data[item].creator}"`}
            >
              <Link
                to={`./NFTs?creator=${data[item].creator}`}
                className="dez-page text-white"
              >
                {data[item].creator}
              </Link>
            </VINFTsTooltip>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {data[item].creatorPercentage}%
            </span>

            <b className="ml-4">Collection: </b>
            {data[item].collection}
          </p>

          <p className="d-flex align-content-center align-items-center">
            <b>Price: </b>
            {data[item].price} {data[item].currency}
            &nbsp;&nbsp; <Iconimage /> &nbsp;&nbsp; Let other people know about
            it &nbsp;&nbsp;{" "}
            <TwitterShareButton
              className="twitter-icon mfp-link portfolio-fullscreen"
              url={`https://verifiedimpactnfts.com/#/nft-detail?id=${data[item].id}`}
              title={`I like "${data[item].name}" #NFT from "${data[item].collection}" collection By "${data[item].creator}"! [${data[item].creatorPercentage}%] of the proceeds go to the "${data[item].beneficiary}" in support of the "${data[item].campaign}" campaign!`}
            >
              <TwitterIcon
                size={32}
                round
                iconFillColor="white"
                style={{ fill: "black" }}
              />
            </TwitterShareButton>
          </p>
        </div>
      );
    }
    camNumber == 1
      ? setSliderCaptionsCamp1(captionsCamp)
      : camNumber == 2
      ? setSliderCaptionsCamp2(captionsCamp)
      : camNumber == 3
      ? setSliderCaptionsCamp3(captionsCamp)
      : setSliderCaptionsCamp4(captionsCamp);
  };
  useEffect(() => {
    var i = 0;

    // Placeholder Animation Start
    var inputSelector = document.querySelectorAll("input, textarea");

    for (i = 0; i < inputSelector.length; i++) {
      inputSelector[i].addEventListener("focus", function (event) {
        return this.parentElement.parentElement.classList.add("focused");
      });
    }

    for (i = 0; i < inputSelector.length; i++) {
      inputSelector[i].addEventListener("blur", function (event) {
        var inputValue = this.value;
        if (inputValue === "") {
          this.parentElement.parentElement.classList.remove("filled");
          this.parentElement.parentElement.classList.remove("focused");
        } else {
          this.parentElement.parentElement.classList.add("filled");
        }
      });
    }

    const Camp1Data = imageBlog
      .filter((nft) => nft.campaign === "Stand With Ukraine")
      .slice(0, 4);
    setCaptions(Camp1Data, 1);
    const Camp2Data = imageBlog
      .filter((nft) => nft.campaign === "Refugees")
      .slice(0, 4);
    setCaptions(Camp2Data, 2);

    const Camp3Data = imageBlog
      .filter((nft) => nft.campaign === "Reconstruction")
      .slice(0, 4);
    setCaptions(Camp3Data, 3);

    const Camp4Data = imageBlog
      .filter((nft) => nft.campaign === "Forever Keys")
      .slice(0, 4);
    setCaptions(Camp4Data, 4);
  }, []);

  const LightBoxComponent = ({ Data, camNumber }) => {
    //let Data = arr.Data;
    return (
      <Lightbox
        mainSrc={Data[photoIndex].image}
        nextSrc={Data[(photoIndex + 1) % Data.length].image}
        prevSrc={Data[(photoIndex + Data.length - 1) % Data.length].image}
        onCloseRequest={() =>
          camNumber == 1
            ? setOpenSliderCamp1(false)
            : camNumber == 2
            ? setOpenSliderCamp2(false)
            : camNumber == 3
            ? setOpenSliderCamp3(false)
            : setOpenSliderCamp4(false)
        }
        onMovePrevRequest={() =>
          setPhotoIndex((photoIndex + Data.length - 1) % Data.length)
        }
        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % Data.length)}
        imageCaption={
          camNumber == 1
            ? sliderCaptionsCamp1[photoIndex]
            : camNumber == 2
            ? sliderCaptionsCamp2[photoIndex]
            : camNumber == 3
            ? sliderCaptionsCamp3[photoIndex]
            : sliderCaptionsCamp4[photoIndex]
        }
      />
    );
  };

  return (
    <>
      <Header6 />
      <div className="page-content bg-white rubik">
        <div
          className="home-banner"
          style={{ backgroundImage: "url(" + bgimg + ")" }}
        >
          <div className="home-bnr-inner">
            <div className="home-bnr-content">
              <h4 className="dz-title">Verified Impact NFTs</h4>
              <h2 className="sub-title">Making a Verified Impact</h2>
              <div className="home-bnr-btns">
                <Link to={"#"} className="site-button white btn-icon">
                  Read more <i className="fa fa-angle-double-right"></i>
                </Link>
                <VideoPopup2 />
              </div>
            </div>
          </div>
          <div className="row stats-section">
            <div className="col">
              <span>{beneficiaryLength}</span> Beneficiaries
            </div>
            <div className="col">
              <span>{campaignLength}</span> Campaigns
            </div>
            <div className="col">
              <span>{creatorLength}</span> Creators
            </div>
            <div className="col">
              <span>{collectionLength} </span>Collections
            </div>
            <div className="col">
              <span>{imageBlog.length}</span> NFTs
            </div>
            <div className="col">
              <span>{csprSum}</span> CSPR
            </div>
            <div className="col">
              <span>{(csprSum / 13.68).toFixed(2)}</span> $$
            </div>
          </div>
        </div>

        {openSliderCamp1 && (
          <LightBoxComponent
            Data={imageBlog
              .filter((nft) => nft.campaign === "Stand With Ukraine")
              .slice(0, 4)}
            camNumber="1"
          />
        )}
        {openSliderCamp2 && (
          <LightBoxComponent
            Data={imageBlog
              .filter((nft) => nft.campaign === "Refugees")
              .slice(0, 4)}
            camNumber="2"
          />
        )}
        {openSliderCamp3 && (
          <LightBoxComponent
            Data={imageBlog
              .filter((nft) => nft.campaign === "Reconstruction")
              .slice(0, 4)}
            camNumber="3"
          />
        )}
        {openSliderCamp4 && (
          <LightBoxComponent
            Data={imageBlog
              .filter((nft) => nft.campaign === "Forever Keys")
              .slice(0, 4)}
            camNumber="4"
          />
        )}
        <h3 className="text-center mt-5">Latest Campaigns</h3>
        <h4 className="text-success text-center  d-flex align-items-center justify-content-center">
        <Link  to={`./NFTs?beneficiary=${"Ukraine Gov"}&campaign=${"Stand With Ukraine"}`} className="mr-1 text-success text-underline">Stand With Ukraine</Link>
          <TwitterShareButton
            className="twitter-icon mfp-link portfolio-fullscreen pt-2"
            url={`https://verifiedimpactnfts.com/#/NFTs?beneficiary=${"Ukraine Gov".replace(
              / /g,
              "%20"
            )}&campaign=${"Stand With Ukraine".replace(/ /g, "%20")}`}
            title={`I support the #NFT "${"Stand With Ukraine"}" campaign, [80%] of the proceeds go to the "${"Ukraine Gov"}".Check it out at `}
          >
            <TwitterIcon
              size={32}
              round
              iconFillColor="white"
              style={{ fill: "black" }}
            />
          </TwitterShareButton>
        </h4>
        <SimpleReactLightbox>
          <SRLWrapper options={options}>
            <div className="clearfix portfolio">
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
                  {imageBlog
                    .filter((nft) => nft.campaign === "Stand With Ukraine")
                    .slice(0, 4)
                    .map((item, index) => (
                      <li
                        className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0"
                        key={index}
                      >
                        <NFTCard
                          item={item}
                          openSlider={(newIndex) => {
                            setPhotoIndex(newIndex);
                            setOpenSliderCamp1(true);
                          }}
                          index={index}
                        />
                      </li>
                    ))}
                </Masonry>
              </ul>
            </div>
          </SRLWrapper>
        </SimpleReactLightbox>
        <h4 className="text-success text-center  d-flex align-items-center justify-content-center mt-5">
        <Link  to={`./NFTs?beneficiary=${"Ukraine Gov"}&campaign=${"Refugees"}`} className="mr-1 text-success text-underline">Refugees</Link>
          <TwitterShareButton
            className="twitter-icon mfp-link portfolio-fullscreen pt-2"
            url={`https://verifiedimpactnfts.com/#/NFTs?beneficiary=${"Ukraine Gov".replace(
              / /g,
              "%20"
            )}&campaign=${"Refugees".replace(/ /g, "%20")}`}
            title={`I support the #NFT "${"Refugees"}" campaign, [80%] of the proceeds go to the "${"Ukraine Gov"}".Check it out at `}
          >
            <TwitterIcon
              size={32}
              round
              iconFillColor="white"
              style={{ fill: "black" }}
            />
          </TwitterShareButton>
        </h4>
        <SimpleReactLightbox>
          <SRLWrapper options={options}>
            <div className="clearfix portfolio">
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
                  {imageBlog
                    .filter((nft) => nft.campaign === "Refugees")
                    .slice(0, 4)
                    .map((item, index) => (
                      <li
                        className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0"
                        key={index}
                      >
                        <NFTCard
                          item={item}
                          openSlider={(newIndex) => {
                            setPhotoIndex(newIndex);
                            setOpenSliderCamp2(true);
                          }}
                          index={index}
                        />
                      </li>
                    ))}
                </Masonry>
              </ul>
            </div>
          </SRLWrapper>
        </SimpleReactLightbox>
        <h4 className="text-success text-center  d-flex align-items-center justify-content-center mt-5">
        <Link  to={`./NFTs?beneficiary=${"Ukraine Gov"}&campaign=${"Reconstruction"}`} className="mr-1 text-success text-underline">Reconstruction</Link>
          <TwitterShareButton
            className="twitter-icon mfp-link portfolio-fullscreen pt-2"
            url={`https://verifiedimpactnfts.com/#/NFTs?beneficiary=${"Ukraine Gov".replace(
              / /g,
              "%20"
            )}&campaign=${"Reconstruction".replace(/ /g, "%20")}`}
            title={`I support the #NFT "${"Reconstruction"}" campaign, [80%] of the proceeds go to the "${"Ukraine Gov"}".Check it out at `}
          >
            <TwitterIcon
              size={32}
              round
              iconFillColor="white"
              style={{ fill: "black" }}
            />
          </TwitterShareButton>
        </h4>
        <SimpleReactLightbox>
          <SRLWrapper options={options}>
            <div className="clearfix portfolio">
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
                  {imageBlog
                    .filter((nft) => nft.campaign === "Reconstruction")
                    .slice(0, 4)
                    .map((item, index) => (
                      <li
                        className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0"
                        key={index}
                      >
                        <NFTCard
                          item={item}
                          openSlider={(newIndex) => {
                            setPhotoIndex(newIndex);
                            setOpenSliderCamp3(true);
                          }}
                          index={index}
                        />
                      </li>
                    ))}
                </Masonry>
              </ul>
            </div>
          </SRLWrapper>
        </SimpleReactLightbox>
        <h4 className="text-success text-center  d-flex align-items-center justify-content-center mt-5">
        <Link  to={`./NFTs?beneficiary=${"Ukraine Gov"}&campaign=${"Forever Keys"}`} className="mr-1 text-success text-underline">Forever Keys</Link>
          <TwitterShareButton
            className="twitter-icon mfp-link portfolio-fullscreen pt-2"
            url={`https://verifiedimpactnfts.com/#/NFTs?beneficiary=${"Ukraine Gov".replace(
              / /g,
              "%20"
            )}&campaign=${"Forever Keys".replace(/ /g, "%20")}`}
            title={`I support the #NFT "${"Forever Keys"}" campaign, [80%] of the proceeds go to the "${"Ukraine Gov"}".Check it out at `}
          >
            <TwitterIcon
              size={32}
              round
              iconFillColor="white"
              style={{ fill: "black" }}
            />
          </TwitterShareButton>
        </h4>
        <SimpleReactLightbox>
          <SRLWrapper options={options}>
            <div className="clearfix portfolio">
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
                  {imageBlog
                    .filter((nft) => nft.campaign === "Forever Keys")
                    .slice(0, 4)
                    .map((item, index) => (
                      <li
                        className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0"
                        key={index}
                      >
                        <NFTCard
                          item={item}
                          openSlider={(newIndex) => {
                            setPhotoIndex(newIndex);
                            setOpenSliderCamp4(true);
                          }}
                          index={index}
                        />
                      </li>
                    ))}
                </Masonry>
              </ul>
            </div>
          </SRLWrapper>
        </SimpleReactLightbox>
      </div>

      <Footer3 />
    </>
  );
};

export default Index4;
