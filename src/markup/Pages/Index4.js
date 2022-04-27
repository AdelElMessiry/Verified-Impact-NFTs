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
//Light Gallery on icon click
const Iconimage = (props) => {
  return (
    <i className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
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
  debugger;

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

    let csprSum = imageBlog.map(a => Number(a.price)).reduce(function(a, b)
    {
      return a + b;
    });

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
    const captionsCamp1 = [];
    const Camp1Data = imageBlog.filter(
      (nft) => nft.campaign === "Stand With Ukraine"
    );
    for (let item = 0; item < Camp1Data.length; item++) {
      captionsCamp1.push(
        <div className="text-white text-left port-box">
          <h5>{Camp1Data[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {Camp4Data[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {Camp1Data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <Link
              to={`./NFTs?beneficiary=${Camp1Data[item].beneficiary}`}
              className="dez-page text-white"
            >
              {Camp1Data[item].beneficiary}
            </Link>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {Camp1Data[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            {Camp1Data[item].beneficiary ? (
              <Link
                to={`./NFTs?beneficiary=${Camp1Data[item].beneficiary}&campaign=${Camp1Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp1Data[item].campaign}
              </Link>
            ) : (
              <Link
                to={`./NFTs?creator=${Camp1Data[item].creator}&campaign=${Camp1Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp1Data[item].campaign}
              </Link>
            )}

            <b className="ml-4">Creator: </b>
            <Link
              to={`./NFTs?creator=${Camp1Data[item].creator}`}
              className="dez-page text-white"
            >
              {Camp1Data[item].creator}
            </Link>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {Camp1Data[item].creatorPercentage}%
            </span>

            <b className="ml-4">Collection: </b>
            {Camp1Data[item].collection}
          </p>

          <p>
            <b>Price: </b>
            {Camp1Data[item].price} {Camp1Data[item].currency}
            &nbsp;&nbsp; <Iconimage />{" "}
          </p>
        </div>
      );
    }
    setSliderCaptionsCamp1(captionsCamp1);

    const captionsCamp2 = [];
    const Camp2Data = imageBlog.filter((nft) => nft.campaign === "Refugees");
    for (let item = 0; item < Camp2Data.length; item++) {
      captionsCamp2.push(
        <div className="text-white text-left port-box">
          <h5>{Camp2Data[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {Camp4Data[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {Camp2Data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <Link
              to={`./NFTs?beneficiary=${Camp2Data[item].beneficiary}`}
              className="dez-page text-white"
            >
              {Camp2Data[item].beneficiary}
            </Link>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {Camp2Data[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            {Camp2Data[item].beneficiary ? (
              <Link
                to={`./NFTs?beneficiary=${Camp2Data[item].beneficiary}&campaign=${Camp2Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp2Data[item].campaign}
              </Link>
            ) : (
              <Link
                to={`./NFTs?creator=${Camp2Data[item].creator}&campaign=${Camp2Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp2Data[item].campaign}
              </Link>
            )}
            <b className="ml-4">Creator: </b>
            <Link
              to={`./NFTs?creator=${Camp2Data[item].creator}`}
              className="dez-page text-white"
            >
              {Camp2Data[item].creator}
            </Link>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {Camp2Data[item].creatorPercentage}%
            </span>
            <b className="ml-4">Collection: </b>
            {Camp2Data[item].collection}
          </p>

          <p>
            <b>Price: </b>
            {Camp2Data[item].price} {Camp2Data[item].currency}
            <Iconimage />
            &nbsp;&nbsp;
          </p>
        </div>
      );
    }
    setSliderCaptionsCamp2(captionsCamp2);

    const captionsCamp3 = [];
    const Camp3Data = imageBlog.filter(
      (nft) => nft.campaign === "Reconstruction"
    );

    for (let item = 0; item < Camp3Data.length; item++) {
      debugger;
      captionsCamp3.push(
        <div className="text-white text-left port-box">
          <h5>{Camp3Data[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {Camp4Data[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {Camp3Data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <Link
              to={`./NFTs?beneficiary=${Camp3Data[item].beneficiary}`}
              className="dez-page text-white"
            >
              {Camp3Data[item].beneficiary}
            </Link>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {Camp3Data[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            {Camp3Data[item].beneficiary ? (
              <Link
                to={`./NFTs?beneficiary=${Camp3Data[item].beneficiary}&campaign=${Camp3Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp3Data[item].campaign}
              </Link>
            ) : (
              <Link
                to={`./NFTs?creator=${Camp3Data[item].creator}&campaign=${Camp3Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp3Data[item].campaign}
              </Link>
            )}

            <b className="ml-4">Creator: </b>
            <Link
              to={`./NFTs?creator=${Camp3Data[item].creator}`}
              className="dez-page text-white"
            >
              {Camp3Data[item].creator}
            </Link>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {Camp3Data[item].creatorPercentage}%
            </span>

            <b className="ml-4">Collection: </b>
            {Camp3Data[item].collection}
          </p>

          <p>
            <b>Price: </b>
            {Camp3Data[item].price} {Camp3Data[item].currency}
            &nbsp;&nbsp; <Iconimage />
          </p>
        </div>
      );
    }
    setSliderCaptionsCamp3(captionsCamp3);

    const captionsCamp4 = [];
    const Camp4Data = imageBlog.filter(
      (nft) => nft.campaign === "Forever Keys"
    );

    for (let item = 0; item < Camp4Data.length; item++) {
      captionsCamp4.push(
        <div className="text-white text-left port-box">
          <h5>{Camp4Data[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {Camp4Data[item].category}
        </p> */}
          <p>
            <b>Description: </b>
            {Camp4Data[item].description}
          </p>
          <p>
            <b>Beneficiary: </b>
            <Link
              to={`./NFTs?beneficiary=${Camp4Data[item].beneficiary}`}
              className="dez-page text-white"
            >
              {Camp4Data[item].beneficiary}
            </Link>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {Camp4Data[item].beneficiaryPercentage}%
            </span>

            <b className="ml-4">Campaign: </b>
            {Camp4Data[item].beneficiary ? (
              <Link
                to={`./NFTs?beneficiary=${Camp4Data[item].beneficiary}&campaign=${Camp4Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp4Data[item].campaign}
              </Link>
            ) : (
              <Link
                to={`./NFTs?creator=${Camp4Data[item].creator}&campaign=${Camp4Data[item].campaign}`}
                className="dez-page text-white"
              >
                {Camp4Data[item].campaign}
              </Link>
            )}

            <b className="ml-4">Creator: </b>
            <Link
              to={`./NFTs?creator=${Camp4Data[item].creator}`}
              className="dez-page text-white"
            >
              {Camp4Data[item].creator}
            </Link>
            <span className="bg-info text-white px-1 ml-1 border-raduis-2">
              {Camp4Data[item].creatorPercentage}%
            </span>

            <b className="ml-4">Collection: </b>
            {Camp4Data[item].collection}
          </p>

          <p>
            <b>Price: </b>
            {Camp4Data[item].price} {Camp4Data[item].currency}
            &nbsp;&nbsp; <Iconimage />{" "}
          </p>
        </div>
      );
    }
    debugger;
    setSliderCaptionsCamp4(captionsCamp4);
  }, []);

  const LightBoxComponent = ({ Data, camNumber }) => {
    debugger;
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
            <div className="col"><span>{beneficiaryLength}</span> Beneficiaries</div>
            <div className="col"><span>{campaignLength}</span> Campaigns</div>
            <div className="col"><span>{creatorLength}</span> Creators</div>
            <div className="col"><span>{collectionLength} </span>Collections</div>
            <div className="col"><span>{imageBlog.length}</span> NFTs</div>
            <div className="col"><span>{csprSum}</span> CSPR</div>
            <div className="col"><span>{(csprSum/13.68).toFixed(2)}</span> $$</div>
          </div>
        </div>

        {openSliderCamp1 && (
          <LightBoxComponent
            Data={imageBlog.filter(
              (nft) => nft.campaign === "Stand With Ukraine"
            )}
            camNumber="1"
          />
        )}
        {openSliderCamp2 && (
          <LightBoxComponent
            Data={imageBlog.filter((nft) => nft.campaign === "Refugees")}
            camNumber="2"
          />
        )}
        {openSliderCamp3 && (
          <LightBoxComponent
            Data={imageBlog.filter((nft) => nft.campaign === "Reconstruction")}
            camNumber="3"
          />
        )}
        {openSliderCamp4 && (
          <LightBoxComponent
            Data={imageBlog.filter((nft) => nft.campaign === "Forever Keys")}
            camNumber="4"
          />
        )}
        <h3 className="text-center mt-5">Latest Campaigns</h3>
        <h4 className="text-success text-center">Stand With Ukraine</h4>
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
                    .map((item, index) => (
                      <li
                        className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0"
                        key={index}
                      >
                        <NFTCard
                          item={item}
                          openSlider={(newIndex) => {
                            debugger;
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
        <h4 className="mt-5 text-success text-center">Refugees</h4>
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
        <h4 className="mt-5 text-success text-center">Reconstruction</h4>
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
        <h4 className="mt-5 text-success text-center">Forever Keys</h4>
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
