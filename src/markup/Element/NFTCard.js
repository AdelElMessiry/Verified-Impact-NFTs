import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { faStoreAlt, faStoreAltSlash,faReceipt, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VINftsTooltip from './Tooltip';
import BuyNFTModal from './BuyNFT';
import ListForSaleNFTModal from './ListForSaleNFT';
import NFTTwitterShare from './TwitterShare/NFTTwitterShare';
import CopyCode from './copyCode';
import soldIcon from '../../images/icon/sold.png';
import { SDGsData } from '../../data/SDGsGoals';
import ReceiptModal from './RecieptModal';
import { useNFTState } from '../../contexts/NFTContext';

import unitedNation from '../../images/icon/unitedNation.png';
//NFT Card component
const NFTCard = ({
  index,
  item,
  openSlider,
  isTransfer = false,
  isCreation = false,
  isMyNft = false
}) => {
  const { beneficiaries } =  useNFTState()

  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [showListForSaleModal, setShowListForSaleModal] = React.useState(false);

  const [showReceiptModal , setShowReceiptModal] = React.useState(false);
  const [ beneficiaryData , setBeneficiaryData ] =  React.useState()  
  const getBeneficiaries = React.useCallback(async () => {
    const setSelectedBeneficiary =
      beneficiaries &&
      beneficiaries.find(({ address }) => item.beneficiary === address);
      setSelectedBeneficiary &&
      setBeneficiaryData(setSelectedBeneficiary)
  }, [ beneficiaries ]);

  React.useEffect(() => {
    (!beneficiaryData) && getBeneficiaries();
  }, [beneficiaryData, getBeneficiaries ]);
  //function which return buttons (buy NFT) & (expand NFT) on nft card
  const IconImage = () => {
    return (
      <>
        <ul className='list-inline portfolio-fullscreen mt-4'>
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
              item.isForSale === 'true' && (
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
                    item.isCreatorOwner === true && (
                      <FontAwesomeIcon icon={faStoreAlt} size='2x' />
                    )
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
        {(isMyNft &&beneficiaryData?.has_receipt==="true") &&(
          item.hasReceipt == "false" ? (
            <VINftsTooltip
            title={'Generate receipt'}
            >
              <li className=' mr-1 align-items-center' onClick={()=>setShowReceiptModal(true)}>              
                  <FontAwesomeIcon icon={faReceipt} size='2x'/>              
              </li>  
            </VINftsTooltip>   
            ):(
              <VINftsTooltip
            title={'Copy receipt'}
            >
              <li className=' mr-1 align-items-center' onClick={()=>setShowReceiptModal(true)}>              
                  <FontAwesomeIcon icon={faPrint} size='2x'/>              
              </li>  
            </VINftsTooltip> 
            )             
          )}          
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
        {showReceiptModal && (
          <ReceiptModal 
          show={showReceiptModal}
            handleCloseParent={() => {
              setShowReceiptModal(false);
            }}
            data= {item}
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
    <>
      <div className='mb-3 nftcard-parent'>
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
                  <h6 className='VI-text-truncate'>{item.title}</h6>

                  {item?.beneficiary && (
                    <VINftsTooltip
                      title={`Click to see all NFTs for '${item.beneficiaryName}' beneficiary`}
                    >
                      <div>
                        <p className='VI-text-truncate'>
                          <b>Beneficiary: </b>

                          <Link
                            to={`./BeneficiaryNFTs?beneficiary=${item.beneficiary}`}
                            className='dez-page text-white d-flex'
                          >
                           {item?.beneficiaryName}
                          </Link>
                        </p>
                        <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
                          {item.beneficiaryPercentage}%
                        </span>
                      </div>
                    </VINftsTooltip>
                  )}
                  {item?.campaign && (
                    <VINftsTooltip
                      title={`Click to see all NFTs for '${item.campaignName}' campaign`}
                    >
                      <p className='VI-text-truncate'>
                        <b>Campaign: </b>

                        {item?.beneficiary && (
                          <Link
                            to={`./BeneficiaryNFTs?beneficiary=${item.beneficiary}&campaign=${item.campaign}`}
                            className='dez-page text-white d-flex'
                          >
                            {item?.campaignName}
                          </Link>
                        )}
                      </p>
                    </VINftsTooltip>
                  )}
                  {item?.creator && (
                    <VINftsTooltip
                      title={`Click to see all NFTs created by '${item.creatorName}'`}
                    >
                      <div>
                        <p className='VI-text-truncate'>
                          <b>Creator: </b>
                          <Link
                            to={`./CreatorNFTs?creator=${item.creator}`}
                            className='dez-page text-white d-flex'
                          >
                            {item?.creatorName}
                          </Link>
                        </p>
                        <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
                          {item.creatorPercentage}%
                        </span>
                      </div>
                    </VINftsTooltip>
                  )}
                  {item?.collection && (
                    <VINftsTooltip
                      title={`Click to see all NFTs created by '${item.collectionName}'`}
                    >
                      <p className='VI-text-truncate'>
                        <b>Collection: </b>
                        <Link
                          to={`./CreatorNFTs?creator=${item.creator}&collection=${item.collection}`}
                          className='dez-page text-white d-flex'
                        >
                          {item?.collectionName}
                        </Link>
                      </p>
                    </VINftsTooltip>
                  )}
                  {item.isForSale === 'true' && (
                    <p>
                      <b>Price: </b>
                      {item.price} {item.currency}
                    </p>
                  )}
                  <div>
                    <IconImage />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {item?.sdgs_ids?.length > 0 && item?.sdgs_ids !== '0' && (
        <div className='mt-3 px-2'>
          <a href='https://sdgs.un.org/goals' target='_blank'>
            <img
              src={unitedNation}
              style={{ width: 40, pointerEvents: 'none', cursor: 'default' }}
            />
          </a>
          :{' '}
          {SDGsData?.filter(({ value }) =>
            item?.sdgs_ids?.split(',').includes(value.toString())
          )?.map((sdg, index) => (
            <VINftsTooltip title={sdg.label} key={index}>
              <label>
                <img
                  src={process.env.PUBLIC_URL + 'images/sdgsIcons/' + sdg.icon}
                  style={{
                    width: 25,
                    pointerEvents: 'none',
                    cursor: 'default',
                  }}
                />
              </label>
            </VINftsTooltip>
          ))}
        </div>
      )}
    </>
  );
};
export default NFTCard;
