import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

import VINftsTooltip from './Tooltip';
import BuyNFTModal from './BuyNFT';
import ListForSaleNFTModal from './ListForSaleNFT';
import NFTTwitterShare from './TwitterShare/NFTTwitterShare';
import CopyCode from './copyCode';
import soldIcon from '../../images/icon/sold.png';
import { faStoreAlt, faStoreAltSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//NFT Card component
const NFTCard = ({
  index,
  item,
  openSlider,
  isTransfer = false,
  isCreation = false,
}) => {
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [showListForSaleModal, setShowListForSaleModal] = React.useState(false);
  //function which return buttons (buy NFT) & (expand NFT) on nft card
  const IconImage = () => {
    return (
      <>
        <ul className='list-inline portfolio-fullscreen'>
          <li className='text-success mr-1 align-items-center'>
            <i
              className='ti-fullscreen mfp-link fa-2x '
              onClick={(e) => {
                e.preventDefault();
                openSlider(index, item.campaign, item.collection);
              }}
            ></i>
          </li>
          <li className='mr-1'>
            {(isTransfer && isCreation && item.isOwner) ||
            (isTransfer && !isCreation && item.isForSale === 'true') ? (
              <i
                className='ti-exchange-vertical transfer-icon buy-icon mfp-link fa-2x'
                onClick={() => {
                  setShowBuyModal(true);
                }}
              ></i>
            ) : (
              !isCreation &&
              item.isForSale === "true" && (
                <i
                  className='ti-shopping-cart buy-icon mfp-link fa-2x mfp-link'
                  onClick={() => {
                    setShowBuyModal(true);
                  }}
                ></i>
              )
            )}
          </li>
          {isCreation && item.isOwner && (
            <li className='mr-1'>
              <VINftsTooltip
                title={
                  item.isForSale === 'true'
                    ? 'Unlist NFT for Sale'
                    : 'List NFT for sale'
                }
              >
                <div
                  onClick={() => {
                    setShowListForSaleModal(true);
                  }}
                >
                  {item.isForSale === 'true' ? (
                    <FontAwesomeIcon icon={faStoreAltSlash} size='2x' />
                  ) : (
                    item.isCreatorOwner === true &&  <FontAwesomeIcon icon={faStoreAlt} size='2x' />
                  )}
                </div>
              </VINftsTooltip>
            </li>
          )}
          {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
            <li className=' mr-1 align-items-center'>
              <NFTTwitterShare item={item} isWithoutText={true} />
            </li>
          )}
          <li className=' mr-1 align-items-center'>
            <CopyCode
              link={`<iframe src='https://dev.verifiedimpactnfts.com/#/nft-card?id=${item.tokenId}'></iframe>`}
            />
          </li>
        </ul>
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
    <div className='dlab-box dlab-gallery-box'>
      <div className='dlab-media dlab-img-overlay1 position-relative dlab-img-effect'>
        <img
          src={item.image}
          alt=''
          className='img img-fluid fit-img fit-img-cover'
        />
        <div className='qr-code-border qr-code-oncard position-absolute'>
          <Link
            to={`./nft-detail?id=${item.tokenId}`}
            className='mr-1 text-success text-underline'
          >
            <QRCode
              value={`${window.location.origin}/#/nft-detail?id=${item.tokenId}`}
              size={80}
            />
          </Link>
        </div>
        {item.isCreatorOwner === false && item.isForSale === 'false' && (
          <div className='sold-icon'>
            <img src={soldIcon} />
          </div>
        )}
        <div className='overlay-bx'>
          <div className='overlay-icon align-b text-white text-left'>
            <div className='text-white text-left port-box'>
              <h5>{item.title}</h5>

              {item.beneficiaryName && (
                <p>
                  <b>Beneficiary: </b>
                  <VINftsTooltip
                    title={`Click to see all NFTs for "${item.beneficiaryName}" beneficiary`}
                  >
                    <Link
                      to={`./BeneficiaryNFTs?beneficiary=${item.beneficiary}`}
                      className='dez-page text-white'
                    >
                      {item.beneficiaryName}
                    </Link>
                  </VINftsTooltip>
                  <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
                    {item.beneficiaryPercentage}%
                  </span>
                </p>
              )}
              <p>
                <b>Campaign: </b>

                {item.campaignName && (
                  <VINftsTooltip
                    title={`Click to see all NFTs for "${item.campaignName}" campaign`}
                  >
                    {item.beneficiary && (
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${item.beneficiary}&campaign=${item.campaign}`}
                        className='dez-page text-white'
                      >
                        {item.campaignName}
                      </Link>
                    )}
                  </VINftsTooltip>
                )}
              </p>
              <p>
                <b>Creator: </b>
                <VINftsTooltip
                  title={`Click to see all NFTs created by "${item.creatorName}"`}
                >
                  <Link
                    to={`./CreatorNFTs?creator=${item.creator}`}
                    className='dez-page text-white'
                  >
                    {item.creatorName}
                  </Link>
                </VINftsTooltip>
                <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
                  {item.creatorPercentage}%
                </span>
              </p>
              <p>
                <b>Collection: </b>
                <Link
                  to={`./CreatorNFTs?creator=${item.creator}&collection=${item.collection}`}
                  className='dez-page text-white'
                >
                  {item.collectionName}
                </Link>
              </p>
              {item.isCreatorOwner !== false && item.isForSale !== 'false' && (
                <p>
                  <b>Price: </b>
                  {item.price} {item.currency}
                </p>
              )}
              <p>
                {' '}
                <IconImage />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NFTCard;
