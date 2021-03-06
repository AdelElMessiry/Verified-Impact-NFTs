import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import VINFTsTooltip from './Tooltip';
import BuyNFTModal from './BuyNFT';
import ListForSaleNFTModal from './ListForSaleNFT';
/**
 * @module NFTCard
 */
/**
 * @name component
 * @property {number} index - show selected nft index 
 * @property {object} item - provide selected nft information
 * @property {function} openSlider - fire when user click on full screen icon to display nft on all page 
 * @property {boolean} isTransfer - flag set to true if user want to transfer his nft
 * @property {boolean} isCreation - flag set to true if user call nft card component from my creations screen
 */

//NFT Card component
const NFTCard = ({
  index,
  item,
  openSlider,
  isTransfer = false,
  isCreation = false,
}) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showListForSaleModal, setShowListForSaleModal] = useState(false);
  //function which return buttons (buy NFT) & (expand NFT) on nft card
  const Iconimage = () => {
    return (
      <>
        <Link
          to={'/#'}
          onClick={(e) => {
            e.preventDefault();
            openSlider(index,item.campaign);
          }}
          className="mfp-link portfolio-fullscreen"
        >
          <i className="ti-fullscreen icon-bx-xs"></i>
        </Link>
        {isTransfer ? (
          <i
            className="ti-exchange-vertical transfer-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"
            onClick={() => {
              setShowBuyModal(true);
            }}
          ></i>
        ) : (
          <i
            className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"
            onClick={() => {
              setShowBuyModal(true);
            }}
          ></i>
        )}
        {isCreation && (
          <VINFTsTooltip
            title={
              item.isForSale == 'true'
                ? 'Unlist NFT for Sale'
                : 'List NFT for sale'
            }
          >
            <div
              onClick={() => {
                setShowListForSaleModal(true);
              }}
            >
              {item.isForSale == 'true' && (
                <i className="ti-close sale-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
              )}
              <i className="ti-money sale-icon buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"></i>
            </div>
          </VINFTsTooltip>
        )}
        {showBuyModal && (
          <BuyNFTModal
            show={showBuyModal}
            handleCloseParent={() => {
              setShowBuyModal(false);
            }}
            data={item}
            isTransfer={isTransfer}
          />
        )}
        {showListForSaleModal && (
          <ListForSaleNFTModal
            show={showListForSaleModal}
            handleCloseParent={() => {
              setShowListForSaleModal(false);
            }}
            data={item}
          />
        )}
      </>
    );
  };

  return (
    <div className="dlab-box dlab-gallery-box">
      <div className="dlab-media dlab-img-overlay1 dlab-img-effect">
        <img
          src={item.image}
          alt=""
          className="img img-fluid fit-img fit-img-cover"
        />
        <div className="overlay-bx">
          <div className="overlay-icon align-b text-white text-left">
            <div className="text-white text-left port-box">
              <h5>{item.title}</h5>
              <p>
                <b>Category: </b>
                {item.category}
              </p>
              <p>
                <b>Beneficiary: </b>
                <VINFTsTooltip
                  title={`Click to see all NFTs for "${item.beneficiaryName}" beneficiary`}
                >
                  <Link
                    to={`./BenefeiciaryNFTs?beneficiary=${item.beneficiaryName}`}
                    className="dez-page text-white"
                  >
                    {item.beneficiaryName}
                  </Link>
                </VINFTsTooltip>
                <span className="bg-success text-white px-1 ml-1 border-raduis-2">
                  {item.beneficiaryPercentage}%
                </span>
              </p>
              <p>
                <b>Campaign: </b>

                <VINFTsTooltip
                  title={`Click to see all NFTs for "${item.campaignName}" campaign`}
                >
                  {item.beneficiary && (
                    <Link
                      to={`./BenefeiciaryNFTs?beneficiary=${item.beneficiaryName}&campaign=${item.campaignName}`}
                      className="dez-page text-white"
                    >
                      {item.campaignName}
                    </Link>
                  )}
                </VINFTsTooltip>
              </p>
              <p>
                <b>Creator: </b>
                <VINFTsTooltip
                  title={`Click to see all NFTs created by "${item.creatorName}"`}
                >
                  <Link
                    to={`./CreatorNFTs?creator=${item.creatorName}`}
                    className="dez-page text-white"
                  >
                    {item.creatorName}
                  </Link>
                </VINFTsTooltip>
                <span className="bg-info text-white px-1 ml-1 border-raduis-2">
                  {item.creatorPercentage}%
                </span>
              </p>
              <p>
                <b>Collection: </b>
                <Link
                  to={`./CreatorNFTs?creator=${item.creatorName}&collection=${item.collectionName}`}
                  className="dez-page text-white"
                >
                  {item.collectionName}
                </Link>
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
