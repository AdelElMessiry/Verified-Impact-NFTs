import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

import VINftsTooltip from './Tooltip';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useNFTState } from '../../contexts/NFTContext';

import soldIcon from '../../images/icon/sold.png';
import { Spinner } from 'react-bootstrap';

//NFT Card component
const NFTCardURL = () => {
  const search = useLocation().search;
  const { nfts, beneficiaries, creators, campaigns, collections } =
    useNFTState();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [item, setItem] = React.useState();
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [allNFTs, setAllNFTs] = React.useState();

  React.useEffect(() => {
    (async () => {
      if (!allNFTs) {
        nfts && setAllNFTs(nfts);
        let nft = nfts && nfts.find(({ tokenId }) => tokenId == id);
        nft && setItem(nft);
      }
    })();
  }, [allNFTs, nfts, id]);

  const getNftDetails = React.useCallback(async () => {
    if(item){
      beneficiaries &&
        creators &&
        campaigns &&
        collections &&
        setItem({
          ...item,
          campaignName: campaigns.find(
            ({ id }) => item.campaign === id
          ).name,
          creatorName: creators.find(
            ({ address }) => item.creator === address
          ).name,
          beneficiaryName: beneficiaries.find(
            ({ address }) => item.beneficiary === address
          )?.username,
          collectionName: collections.find(
            ({ id }) => item.collection === id
          ).name,
        });
      }
  }, [beneficiaries, creators, collections, campaigns]);

  //getting nft details
  React.useEffect(() => {
    getNftDetails();
  }, [getNftDetails]);

  //function which return buttons (buy NFT) & (expand NFT) on nft card


  return (
   <> {item ? (
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
              {item.isCreatorOwner !== false && item.isForSale !== 'false' && ( <p>
                <b>Price: </b>
                {item.price} {item.currency}
              </p>)}
            </div>
          </div>
        </div>
      </div>
    </div>): (
          <div className='vinft-page-loader'>
            <div className='vinft-spinner-body'>
              <Spinner animation='border' variant='success' />
              <p>Fetching NFT Please wait...</p>
            </div>
          </div>
        )}</>
  );
};
export default NFTCardURL;
