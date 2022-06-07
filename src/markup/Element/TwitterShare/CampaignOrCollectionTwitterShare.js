import React from 'react';
import { TwitterIcon, TwitterShareButton } from 'react-share';

//shared component for twitter used in case of want to share campaign or collection
const CampaignOrCollectionTwitterShare = ({
  campaign = '',
  beneficiary = '',
  url = '',
  creator = '',
  collection = '',
  beneficiaryPercentage=''
}) => {
  return (
    <TwitterShareButton
      className='twitter-icon mfp-link portfolio-fullscreen'
      url={
        url
          ? url
          : `${window.location.origin}/#/BeneficiaryNFTs?beneficiary=${beneficiary.replace(
              / /g,
              '%20'
            )}&campaign=${campaign.replace(/ /g, '%20')}`
      }
      title={
        creator === ''
          ? `I support the "${campaign}" #NFT campaign, ${beneficiaryPercentage}% of the proceeds go to the "${beneficiary}". check it out On @vinfts
          @Casper_Network @DEVXDAO`
          : `I support the "${collection}" #NFT collection, ${beneficiaryPercentage}% of the proceeds go to the "${beneficiary}" and ${100-Number(beneficiaryPercentage)}% go to"${creator}". check it out  On @vinfts
          @Casper_Network @DEVXDAO`
      }
    >
      <TwitterIcon
        size={32}
        round
        iconFillColor='white'
        style={{ fill: 'black' }}
      />
    </TwitterShareButton>
  );
};
export default CampaignOrCollectionTwitterShare;
