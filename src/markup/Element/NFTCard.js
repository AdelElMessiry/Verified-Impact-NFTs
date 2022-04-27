import React from "react";
import { Link } from "react-router-dom";

const NFTCard = ({ index, item, openSlider }) => {
  //Light Gallery on icon click
  const Iconimage = (props) => {
    return (
      <>
        <Link
          to={"/#"}
          onClick={(e) => {
            e.preventDefault();
            openSlider(index);
          }}
          className="mfp-link portfolio-fullscreen"
        >
          <i className="ti-fullscreen icon-bx-xs"></i>
        </Link>
        <i className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
      </>
    );
  };
  return (
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
                <Link
              to={`./NFTs?beneficiary=${item.beneficiary}`}
              className="dez-page text-white"
            >
              {item.beneficiary}
            </Link>
                
                <span className="bg-success text-white px-1 ml-1 border-raduis-2">
                  {item.beneficiaryPercentage}%
                </span>
              </p>
              <p>
                <b>Campaign: </b>
                
                {item.beneficiary ? (
              <Link
                to={`./NFTs?beneficiary=${item.beneficiary}&campaign=${item.campaign}`}
                className="dez-page text-white"
              >
                {item.campaign}
              </Link>
            ) : (
              <Link
                to={`./NFTs?creator=${item.creator}&campaign=${item.campaign}`}
                className="dez-page text-white"
              >
               {item.campaign}
              </Link>
            )}
              </p>
              <p>
                <b>Creator: </b>
                <Link
                  to={`./NFTs?creator=${item.creator}`}
                  className="dez-page text-white"
                >
                  {item.creator}
                </Link>
                <span className="bg-info text-white px-1 ml-1 border-raduis-2">
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
  );
};
export default NFTCard;
