import React from "react";
import { Link } from "react-router-dom";
import { TwitterIcon, TwitterShareButton } from "react-share";

const CampaignTwitterShare = ({ campaign,beneficiary,url="" }) => {
  //Light Gallery on icon click

  return (
    <TwitterShareButton
    className="twitter-icon mfp-link portfolio-fullscreen pt-2"
    url={url?url:`https://verifiedimpactnfts.com/#/NFTs?beneficiary=${beneficiary.replace(
      / /g,
      "%20"
    )}&campaign=${campaign.replace(/ /g, "%20")}`}
    title={`I support the #NFT "${campaign}" campaign, 80% of the proceeds go to the "${beneficiary}". Check it out at `}
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
export default CampaignTwitterShare;
