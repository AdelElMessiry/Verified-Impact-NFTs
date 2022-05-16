import React from "react";
import { Link } from "react-router-dom";
import { TwitterIcon, TwitterShareButton } from "react-share";
//shared component for twitter used in case of want to share campaign or collection
const CampaignOrCollectionTwitterShare = ({ campaign="",beneficiary="",url="",creator="",collection="" }) => {
  return (
    <TwitterShareButton
    className="twitter-icon mfp-link portfolio-fullscreen pt-2"
    url={url?url:`https://verifiedimpactnfts.com/#/BenefeiciaryNFTs?beneficiary=${beneficiary.replace(
      / /g,
      "%20"
    )}&campaign=${campaign.replace(/ /g, "%20")}`}
    title={beneficiary!==""?`I support the #NFT "${campaign}" campaign, 80% of the proceeds go to the "${beneficiary}". Check it out at `:`I support the #NFT "${collection}" collection, 80% of the proceeds go to the "${creator}". Check it out at `}
  >
    <TwitterIcon
      size={32}
      round
      iconFillColor="white"
      style={{ fill: "black" }}
    />
  </TwitterShareButton>
  );
};
export default CampaignOrCollectionTwitterShare;
