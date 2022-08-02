import React from 'react';
import { TwitterIcon, TwitterShareButton } from 'react-share';
//shared component for twitter used in case of want to share NFT

const NFTTwitterShare = ({ item, isWithoutText = false }) => {
  //Light Gallery on icon click

  return (
    <>
      {!isWithoutText && (
        <span>Let other people know about it &nbsp;&nbsp; </span>
      )}{' '}
      <TwitterShareButton
        className='twitter-icon mfp-link portfolio-fullscreen'
        url={`${window.location.origin}/#/nft-detail?id=${item.tokenId}`}
        title={`I like "${item.title}" #NFT from "${item.collectionName}" collection By "${item.creatorName}"! ${item.beneficiaryPercentage}% of the proceeds go to the "${item.beneficiaryName}" in support of the "${item.campaignName}" campaign!`}
      >
        <TwitterIcon
          size={32}
          round
          iconFillColor='white'
          style={{ fill: 'black' }}
        />
      </TwitterShareButton>
    </>
  );
};
export default NFTTwitterShare;
