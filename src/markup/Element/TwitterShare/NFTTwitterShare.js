import React from "react";
import { Link } from "react-router-dom";
import { TwitterIcon, TwitterShareButton } from "react-share";

const NFTTwitterShare = ({ item ,isWithoutText=false}) => {
  //Light Gallery on icon click

  return (
      <>
  {!isWithoutText&&<span>Let other people know about it &nbsp;&nbsp;{" "}</span> }  <TwitterShareButton
    className="twitter-icon mfp-link portfolio-fullscreen"
    url={`https://verifiedimpactnfts.com/#/nft-detail?id=${item.id}`}
    title={`I like "${item.name}" #NFT from "${item.collection}" collection By "${item.creator}"! ${item.beneficiaryPercentage}% of the proceeds go to the "${item.beneficiary}" in support of the "${item.campaign}" campaign!`}
  >
    <TwitterIcon
      size={32}
      round
      iconFillColor="white"
      style={{ fill: "black" }}
    />
  </TwitterShareButton></>
  );
};
export default NFTTwitterShare;
