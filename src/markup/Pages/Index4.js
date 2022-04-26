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

import Masonry from "react-masonry-component";
//Light Gallery on icon click
const Iconimage = (props) => {
  const { openLightbox } = useLightbox();
  return (
    <Link
      to={"#"}
      onClick={() => openLightbox(props.imageToOpen)}
      className="mfp-link"
    >
      <i className="ti-fullscreen icon-bx-xs"></i>
    </Link>
  );
};
const imageBlog = [
  {
    name: "Prayer",
    image:
      "https://churchrez.org/wp-content/uploads/2022/03/Pray-for-Ukraine-IG.png",
    category: "1",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Stand With Ukraine",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Pray for Ukraine",
    price: "1000",
    currency: "CSPR",
    description: "During hard days we should pray for peace ",
  },
  {
    name: "Solidarity",
    image: "https://www.eqar.eu/assets/uploads/2022/02/Flag_of_Ukraine.jpeg",
    category: "1",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Stand With Ukraine",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Pray for Ukraine",
    price: "1000",
    currency: "CSPR",
    description:
      "Solidarity and support to Ukraine is just a humane action regardless the consequences ",
  },
  {
    name: "The Motherland Monument",
    image:
      "https://rayleighbaptist.org.uk/wp-content/uploads/2022/02/Pray-for-Ukraine.png",
    category: "1",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Stand With Ukraine",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Pray for Ukraine",
    price: "1000",
    currency: "CSPR",
    description:
      "The Motherland Monument is a monumental statue in Kyiv, the capital of Ukraine. The sculpture is a part of the National Museum of the History of Ukraine in the Second World War.",
  },
  {
    name: "The Flag",
    image:
      "https://forhiskingdomandourgood.files.wordpress.com/2022/03/pray-for.png?w=500",
    category: "1",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Stand With Ukraine",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Pray for Ukraine",
    price: "1000",
    currency: "CSPR",
    description:
      "The colours in the Ukrainian flag represent golden fields of grain under a clear blue sky, appropriate for a country known as the 'bread basket' of its area.",
  },
  {
    name: "Dove of Peace",
    image:
      "https://news.scranton.edu/articles/2022/03/images/ukraine-prayer-vigil-3-10-22.jpg",
    category: "1",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Stand With Ukraine",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Pray for Ukraine",
    price: "1000",
    currency: "CSPR",
    description: "The Dove of peace will definitely fly over Ukrain soon ",
  },
  {
    name: "Children of Ukraine",
    image:
      "https://images.english.elpais.com/resizer/-H_Flr48rWE46RoaB_3NQY0eNeM=/1960x0/filters:focal(1187x607:1197x617)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/O7SHEKPH55MAUOO654FLPSBEDE.jpg",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
    description:
      "Children a re suffering from the new homeless routine far feom their homes and schools ",
  },
  {
    name: "Five Million Refugee",
    image:
      "https://ca-times.brightspotcdn.com/dims4/default/1172dd9/2147483647/strip/true/crop/5905x3912+0+0/resize/840x556!/format/webp/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F15%2F3d%2F18359ce2474987af32638e12a0d5%2Fap22067559048461.jpg",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
    description:
      "Refugees inside Ukraine's facilities likethe old days during WW2",
  },
  {
    name: "Railway Station",
    image:
      "https://socialeurope.eu/wp-content/uploads/2022/03/shutterstock_2133235509-750x392.jpg.webp",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
    description: "Huge playschools inside the railway satation of Warsaw ",
  },
  {
    name: "Pets Refugees",
    image:
      "https://static.euronews.com/articles/stories/06/51/84/04/800x650_cmsv2_efabd5ed-96fb-51d6-8736-8c8b98b2f0e0-6518404.jpg",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
    description: "Ukrainian did not let down their pets during the invasion ",
  },
  {
    name: "We Wait!",
    image:
      "https://www.irishtimes.com/polopoly_fs/1.4826550.1647270923!/image/image.jpg",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
    description: "Ukrainians wait in streets ",
  },
  {
    name: "No War!",
    image:
      "https://thumbs.dreamstime.com/z/destroyed-buildings-ruins-concrete-form-word-no-war-destruction-concept-illustration-242469701.jpg",
    category: "3",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Reconstruction",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Build it Back",
    price: "1000",
    currency: "CSPR",
    description: "Stop war to rebuild",
  },
  {
    name: "Destroyed",
    image:
      "https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F83306900-a860-11ec-8da7-c2b9b8c9eee5.jpg?crop=6001%2C3376%2C0%2C313&resize=1200",
    category: "3",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Reconstruction",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Build it Back",
    price: "1000",
    currency: "CSPR",
    description: "Nothing is worse than a war on your homeland ",
  },
  {
    name: "Once Upon a Time",
    image: "https://i.ytimg.com/vi/yfkI2TbkW8Q/maxresdefault.jpg",
    category: "3",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Reconstruction",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Build it Back",
    price: "1000",
    currency: "CSPR",
    description: "Kiev is the colourful city ",
  },
  {
    name: "New City",
    image:
      "https://www.northworldindustry.com/wp-content/uploads/2018/08/construccion-servicio-800x650.jpg.webp",
    category: "3",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Reconstruction",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Build it Back",
    price: "1000",
    currency: "CSPR",
    description:
      "Reconstruction of a city is simply way harder than destroying it",
  },
  {
    name: "Farming",
    image:
      "https://www.arc2020.eu/wp-content/uploads/2016/04/ukraine-cereal-by-voffka.jpg",
    category: "3",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Reconstruction",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Build it Back",
    price: "1000",
    currency: "CSPR",
    description: "We shall retain our bread basket city!",
  },
  {
    name: "City of Ghosts",
    image:
      "https://c.ndtvimg.com/2022-03/rk2ve078_borodyanka-destroyed-reuters-650_625x300_04_March_22.jpg",
    category: "4",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Forever Keys",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Damaged Houses",
    price: "1000",
    currency: "CSPR",
    description:
      "Dreams and memories are faded away just like ashes in the air ",
  },
  {
    name: "Children Damaged school",
    image:
      "https://s.abcnews.com/images/International/child-damaged-school-ukraine-gty-220_hpMain_20220324-051516_16x9_992.jpg",
    category: "4",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Forever Keys",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Damaged Houses",
    price: "1000",
    currency: "CSPR",
    description: "Childrens' second homes are a total mess ",
  },
  {
    name: "Home!",
    image:
      "https://phantom-marca.unidadeditorial.es/c2aaf157f2d706aa779286d29f09ee62/resize/1320/f/jpg/assets/multimedia/imagenes/2022/03/05/16464688135110.jpg",
    category: "4",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Forever Keys",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Damaged Houses",
    price: "1000",
    currency: "CSPR",
    description:
      "Your home is gone but together we will find a way to sort it out for you ",
  },
  {
    name: "Playground",
    image:
      "https://i.guim.co.uk/img/media/008236869b09bbf8b77797c074303d0fbcfd9402/0_259_5815_3489/master/5815.jpg?width=465&quality=45&auto=format&fit=max&dpr=2&s=7a559480e7e6eaf87f0bc3e60032a379",
    category: "4",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Forever Keys",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Damaged Houses",
    price: "1000",
    currency: "CSPR",
    description: "Stop war so our kids can find some assurance to play ",
  },
  {
    name: "My home is gone",
    image:
      "https://ichef.bbci.co.uk/news/976/cpsprodpb/68BA/production/_123401862_gettyimages-1238720000.jpg",
    category: "4",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Forever Keys",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Damaged Houses",
    price: "1000",
    currency: "CSPR",
    description: "My home is gone but I will go back again ",
  },
  {
    name: "Fight Fight",
    image:
      "https://static01.nyt.com/images/2022/03/03/us/politics/03dc-ukraine-fight1/03dc-ukraine-fight1-facebookJumbo.jpg",
    category: "5",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Never Forget",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Freedom is not Free",
    price: "1000",
    currency: "CSPR",
    description: "We will fight the ingolorious ghost ",
  },
  {
    name: "Be ready for war",
    image: "https://images.wsj.net/im-525434?width=860&height=573",
    category: "5",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Never Forget",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Freedom is not Free",
    price: "1000",
    currency: "CSPR",
    description: "You started this war and I am going to end it soon",
  },
  {
    name: "What Now!",
    image:
      "https://www.atlanticcouncil.org/wp-content/uploads/2022/02/2022-02-20T161749Z_536561585_RC2PNS9IFIPD_RTRMADP_3_UKRAINE-CRISIS-EAST-FRONTLINE-500x350.jpg",
    category: "5",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Never Forget",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Freedom is not Free",
    price: "1000",
    currency: "CSPR",
    description: "Waiting for the next command ",
  },
  {
    name: "Fight Back!",
    image:
      "https://foreignpolicy.com/wp-content/uploads/2022/03/GettyImages-1238620712.jpg?w=1500",
    category: "5",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Never Forget",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Freedom is not Free",
    price: "1000",
    currency: "CSPR",
    description: "War trenchers are harder targets ",
  },
  {
    name: "Proud Solider",
    image:
      "https://ichef.bbci.co.uk/news/976/cpsprodpb/B9B1/production/_100673574_025207645-1.jpg",
    category: "5",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Never Forget",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Freedom is not Free",
    price: "1000",
    currency: "CSPR",
    description: "Call of duty",
  },
  {
    name: "Rescuing a Friend",
    image:
      "https://media.vanityfair.com/photos/622643d4dcdd2790085ec50e/2:3/w_887",
    category: "6",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "A Hero’s Stand",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Soldiers",
    price: "1000",
    currency: "CSPR",
    description: "We don't leave our friends ",
  },
  {
    name: "War Consequences",
    image:
      "https://bloximages.newyork1.vip.townnews.com/unionleader.com/content/tncms/assets/v3/editorial/1/23/12389a1f-f0c9-5150-b529-3462f28d4a8b/622f2e079fd3e.image.jpg?resize=743%2C500",
    category: "6",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "A Hero’s Stand",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Soldiers",
    price: "1000",
    currency: "CSPR",
    description: "It was a tough tank",
  },
  {
    name: "Love!",
    image:
      "https://www.politico.eu/cdn-cgi/image/width=965,height=609,fit=crop,quality=80,onerror=redirect,format=auto/wp-content/uploads/2022/03/17/GettyImages-1239262293.jpg",
    category: "6",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "A Hero’s Stand",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Soldiers",
    price: "1000",
    currency: "CSPR",
    description: "I found love during the fight ",
  },
  {
    name: "Soliders on a Tank",
    image: "https://static.dw.com/image/17583852_303.jpg",
    category: "6",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "A Hero’s Stand",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Soldiers",
    price: "1000",
    currency: "CSPR",
    description: "We wait for orders or enemies whatever comes first ",
  },
  {
    name: "Sniper",
    image: "https://cdn.mos.cms.futurecdn.net/TJU6GTDfm565Y9SCUiRiW5.jpeg",
    category: "6",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "A Hero’s Stand",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Soldiers",
    price: "1000",
    currency: "CSPR",
    description: "Aim, hold your breath and Shoot!",
  },
];
const Index4 = () => {
  const [openSlider, setOpenSlider] = useState(false);
  const [photoIndex, setPhotoIndex] = useState();
  const [sliderCaptions, setSliderCaptions] = useState([]);

  const options = {
    buttons: { showDownloadButton: false },
  };
  // Masonry section
  const masonryOptions = {
    transitionDuration: 0,
  };

  const imagesLoadedOptions = { background: ".my-bg-image-el" };
  // Masonry section end
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
    const captions = [];
    for (let item = 0; item < imageBlog.length; item++) {
      captions.push(
        <div className="text-white text-left port-box">
          <h5>{imageBlog[item].name}</h5>
          {/* <p>
          <b>Category: </b>
          {imageBlog[item].category}
        </p> */}
          <p>
            <b>Beneficiary: </b>
            <Link
              to={`./NFTs?beneficiary=${imageBlog[item].beneficiary}`}
              className="dez-page text-white"
            >
              {imageBlog[item].beneficiary}
            </Link>
            <span className="bg-success text-white px-1 ml-1 border-raduis-2">
              {imageBlog[item].beneficiaryPercentage}%
            </span>
          </p>
          <p>
            <b>Campaign: </b>
            {imageBlog[item].beneficiary ? (
              <Link
                to={`./NFTs?beneficiary=${imageBlog[item].beneficiary}&campaign=${imageBlog[item].campaign}`}
                className="dez-page text-white"
              >
                {imageBlog[item].campaign}
              </Link>
            ) : (
              <Link
                to={`./NFTs?creator=${imageBlog[item].creator}&campaign=${imageBlog[item].campaign}`}
                className="dez-page text-white"
              >
                {imageBlog[item].campaign}
              </Link>
            )}
          </p>
          <p>
            <b>Creator: </b>
            <Link
              to={`./NFTs?creator=${imageBlog[item].creator}`}
              className="dez-page text-white"
            >
              {imageBlog[item].creator}
            </Link>
            <span className="bg-danger text-white px-1 ml-1 border-raduis-2">
              {imageBlog[item].creatorPercentage}%
            </span>
          </p>
          <p>
            <b>Collection: </b>
            {imageBlog[item].collection}
          </p>
          <p>
            <b>Description: </b>
            {imageBlog[item].description}
          </p>
          <p>
            <b>Price: </b>
            {imageBlog[item].price} {imageBlog[item].currency}
          </p>
        </div>
      );
    }
    setSliderCaptions(captions);
  }, []);

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
        </div>

        {/* <!-- contact area --> */}
        <div className="content-block">
          {/* <!-- About Us --> */}
          <div className="section-full content-inner about-progress">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-6">
                  <h2 className="text-uppercase">
                    <span className="font-weight-300">Give the </span>
                    <br />
                    green light
                  </h2>
                  <div className="progress-section">
                    <div className="progress-bx">
                      <h4>Hard Work</h4>
                      <div className="count-box">70%</div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          style={{ width: "70%" }}
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                    <div className="progress-bx">
                      <h4>Projects Delivery</h4>
                      <div className="count-box">80%</div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          style={{ width: "80%" }}
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                    <div className="progress-bx">
                      <h4>Customers Love</h4>
                      <div className="count-box">90%</div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          style={{ width: "90%" }}
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="m-b10">The Project</h3>
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters.
                  </p>
                </div>
                <div className="col-md-12 col-lg-6 d-flex ">
                  <div className="img-half-bx align-items-stretch">
                    <img src={about1} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- contact area END --> */}
        {openSlider && (
          <Lightbox
            mainSrc={imageBlog[photoIndex].image}
            nextSrc={imageBlog[(photoIndex + 1) % imageBlog.length].image}
            prevSrc={
              imageBlog[(photoIndex + imageBlog.length - 1) % imageBlog.length]
                .image
            }
            onCloseRequest={() => setOpenSlider(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + imageBlog.length - 1) % imageBlog.length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % imageBlog.length)
            }
            imageCaption={sliderCaptions[photoIndex]}
          />
        )}
        <h3>Latest Campaigns</h3>
        <h4 className="text-success">Stand With Ukraine</h4>
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
                            setPhotoIndex(newIndex);
                            setOpenSlider(true);
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
        <h4 className="mt-5 text-success">Refugees</h4>
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
                            setOpenSlider(true);
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
        <h4 className="mt-5 text-success">Reconstruction</h4>
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
                            setOpenSlider(true);
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
        <h4 className="mt-5 text-success">Forever Keys</h4>
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
                            setOpenSlider(true);
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
