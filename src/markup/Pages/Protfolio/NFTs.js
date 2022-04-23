import React, { Component, useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import Header from "../../Layout/Header1";
import Footer from "../../Layout/Footer1";
import PageTitle from "../../Layout/PageTitle";
import Masonry from "react-masonry-component";

//images
import bnr1 from "./../../../images/banner/bnr1.jpg";

import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

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
  },
  {
    name: "Food Portions",
    image:
      "https://media.npr.org/assets/img/2022/03/03/gettyimages-1377728411_custom-f265b99e048006a23cff07314bcedb2e54711725-s900-c85.webp",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
  },
  {
    name: "Twins Refugees ",
    image:
      "https://i.guim.co.uk/img/media/79184ce9e786449f09c64db3e3a96f9d5ea81a13/0_247_4703_2822/master/4703.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=8c3659a6e5fd210b5c341667222ddfcf",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
  },
  {
    name: "Cold Children",
    image:
      "https://i.guim.co.uk/img/media/f6bb7d35e8cc60ad05a3385d0281cebd9092d73d/0_0_5568_3341/master/5568.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=9670286535fb54af84ca1296365a0a40",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
  },
  {
    name: "Pets Refugees",
    image:
      "https://static.independent.co.uk/2022/03/24/17/64a707b26424bdd011aae4fcc23d7037Y29udGVudHNlYXJjaGFwaSwxNjQ4MjIyNjk0-2.66022243.jpg?quality=75&width=982&height=726&auto=webp",
    category: "2",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "Refugees",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "A hard night",
    price: "1000",
    currency: "CSPR",
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
  },
  {
    name: "Abondoned School",
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
  },
  {
    name: "Rescuing a Friend",
    image:
      "https://www.telegraph.co.uk/content/dam/world-news/2022/02/24/TELEMMGLPICT000287174617_trans_NvBQzQNjv4BqAfwcn9-ioHookDyYnjAMrUR8YSybYNWDTYrGStsI8ko.jpeg",
    category: "6",
    beneficiary: "Ukraine Gov",
    beneficiaryPercentage: "80",
    campaign: "A Hero’s Stand",
    creator: "NFT Punks",
    creatorPercentage: "20",
    collection: "Soldiers",
    price: "1000",
    currency: "CSPR",
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
  },
];

//Light Gallery on icon click
const Iconimage = (props) => {
  const { openLightbox } = useLightbox();
  return (
    <>
      <Link
        to={"#"}
        onClick={() => openLightbox(props.imageToOpen)}
        className="mfp-link portfolio-fullscreen"
      >
        <i className="ti-fullscreen icon-bx-xs"></i>
      </Link>
      <i className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
    </>
  );
};

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
  const [tag, setTag] = useState("All");
  const [filteredImages, setFilterdImages] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState(imageBlog);

  const setSelectedTag=(tag,data=null) => {
    setTag(tag)
    tag === "All" &&data?setFilterdImages(data)
     : tag === "All" &&!data ?setFilterdImages(selectedNfts)
      : setFilterdImages(selectedNfts.filter((nft) => nft.collection === tag));
  }

  useEffect(() => {
    let Data=[]
    if (beneficiary && !campaign) {
      Data=
        imageBlog.filter((nft) => nft.beneficiary === beneficiary)
     
    } else if (beneficiary && campaign) {
      Data=
        imageBlog.filter(
          (nft) => nft.beneficiary === beneficiary && nft.campaign === campaign
        )
      
    } else if (creator && !campaign) {
      Data=imageBlog.filter((nft) => nft.creator === creator)
    } else if (creator && campaign) {
      Data=
        imageBlog.filter(
          (nft) => nft.creator === creator && nft.campaign === campaign
        )
     
    } else {
      Data=imageBlog;
    }
    setSelectedNfts(Data);
    setSelectedTag("All",Data)
  }, [beneficiary,campaign,creator]);
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
        <div className="site-filters clearfix center  m-b40">
          <ul className="filters" data-toggle="buttons">
            <TagLi
              name="All"
              handlesettag={setSelectedTag}
              tagActive={tag === "All" ? true : false}
            />
            <TagLi
              name="Pray for Ukraine"
              handlesettag={setSelectedTag}
              tagActive={tag === "Pray for Ukraine" ? true : false}
            />
            <TagLi
              name="A hard night"
              handlesettag={setSelectedTag}
              tagActive={tag === "A hard night" ? true : false}
            />
            <TagLi
              name="Build it Back"
              handlesettag={setSelectedTag}
              tagActive={tag === "Build it Back" ? true : false}
            />
            <TagLi
              name="Damaged Houses"
              handlesettag={setSelectedTag}
              tagActive={tag === "Damaged Houses" ? true : false}
            />
            <TagLi
              name="Freedom is not Free"
              handlesettag={setSelectedTag}
              tagActive={tag === "Freedom is not Free" ? true : false}
            />
            <TagLi
              name="Soldiers"
              handlesettag={setSelectedTag}
              tagActive={tag === "Soldiers" ? true : false}
            />
          </ul>
        </div>
       {filteredImages.length>0?( <SimpleReactLightbox>
          <SRLWrapper>
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
                      <div className="dlab-box dlab-gallery-box">
                        <div className="dlab-media dlab-img-overlay1 dlab-img-effect">
                          <img src={item.image} alt="" />
                          <div className="overlay-bx">
                            <div className="overlay-icon align-b text-white text-left">
                              <div className="text-white text-left port-box">
                                <h5>{item.name}</h5>
                                <p>
                                  <b>Category: </b>
                                  {item.category}
                                </p>
                                <p>
                                  <b>Beneficiary: </b>
                                  {item.beneficiary}
                                  <span className="bg-success text-white px-1 ml-1 border-raduis-2">
                                    {item.beneficiaryPercentage}%
                                  </span>
                                </p>
                                <p>
                                  <b>Campaign: </b>
                                  {item.campaign}
                                </p>
                                <p>
                                  <b>Creator: </b>
                                  {item.creator}
                                  <span className="bg-danger text-white px-1 ml-1 border-raduis-2">
                                    {item.creatorPercentage}%
                                  </span>
                                </p>
                                <p>
                                  <b>Collection: </b>
                                  {item.collection}
                                </p>
                                <p>
                                  <b>Price: </b>
                                  {item.price} {item.currency}
                                </p>
                                <Iconimage />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </Masonry>
              </ul>
            </div>
          </SRLWrapper>
        </SimpleReactLightbox>):(<h4 className="text-muted text-center mb-5">There is No Data With this Filter</h4>)}
      </div>
      </div>
      <Footer />
    </Fragment>
  );
};
export { imageBlog };
export default NFTs;
