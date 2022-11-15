import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useNFTState } from '../../contexts/NFTContext';
import BuyNFTModal from '../Element/BuyNFT';
import Layout from '../Layout';
import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import VINftsTooltip from '../Element/Tooltip';
import soldIcon from '../../images/icon/sold.png';
import unitedNation from '../../images/icon/unitedNation.png';

import { MenuItemUnstyled } from '@mui/base';
import ReactGA from 'react-ga';
import { SDGsData } from '../../data/SDGsGoals';
//nft details component
const NFTDetail = () => {
  const search = useLocation().search;
  const { nfts, beneficiaries, profileCreators, campaigns, collections } =
    useNFTState();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [item, setItem] = React.useState();
  const [showBuyModal, setShowBuyModal] = React.useState(false);
  const [selectedNFT, setSelectedNFT] = React.useState();
  const [allNFTs, setAllNFTs] = React.useState();

  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname + 'nft-detail');
    (async () => {
      if (!allNFTs) {
        nfts && setAllNFTs(nfts);
        let nft = nfts && nfts.find(({ tokenId }) => tokenId == id);
        nft && setItem(nft);
      }
    })();
  }, [allNFTs, nfts, id]);

  const getNftDetails = React.useCallback(async () => {
    if (item) {
      beneficiaries &&
        profileCreators &&
        campaigns &&
        collections &&
        setItem({
          ...item,
          campaignName: campaigns.find(({ id }) => item.campaign === id).name,
          creatorName: profileCreators.find(
            ({ address }) => item.creator === address
          ).username,
          beneficiaryName: beneficiaries.find(
            ({ address }) => item.beneficiary === address
          ).username,
          collectionName: collections.find(({ id }) => item.collection === id)
            .name,
        });
    }
  }, [beneficiaries, profileCreators, collections, campaigns]);

  //getting nft details
  React.useEffect(() => {
    getNftDetails();
  }, [getNftDetails]);

  const IconImage = ({ nft }) => {
    return (
      <>
        <i
          className='ti-shopping-cart buy-icon mfp-link fa-2x mfp-link'
          onClick={() => {
            setSelectedNFT(nft);
            setShowBuyModal(true);
          }}
        ></i>
      </>
    );
  };

  return (
    <Layout isNFTDetails={true}>
      <div className='page-content pb-0 bg-black-light pt-5'>
        {item ? (
          <div className='content-block position-relative h-100vh'>
            {/* <!-- Project Details --> */}
            <div className='section-full content-inner-2 h-100vh'>
              <div className='container h-100'>
                <div className='row h-100'>
                  <div className='col text-center align-items-center align-content-center d-flex justify-content-center h-100'>
                    <img
                      src={item?.image}
                      alt=''
                      className='img img-fluid fit-img'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='detail-page-caption p-3'>
              <div className='align-b text-white text-left'>
                <div className='text-white text-left port-box'>
                  <h5>
                    {item?.title} &nbsp;&nbsp;{' '}
                    {item?.isCreatorOwner === false &&
                      item?.isForSale === 'false' && (
                        <img src={soldIcon} width='40px' />
                      )}
                  </h5>
                  <p>Description: {item?.description}</p>
                  <p>
                    {/* <b>Category: </b>
                    {item?.category} 
                    &nbsp;&nbsp;*/}
                    <b>Beneficiary: </b>
                    <VINftsTooltip
                      title={`Click to see all NFTs for '${item?.beneficiaryName}' beneficiary`}
                    >
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${item?.beneficiary}`}
                        className='dez-page text-white'
                      >
                        {item?.beneficiaryName}
                      </Link>
                    </VINftsTooltip>
                    <span className='bg-success text-white px-1 ml-1 border-raduis-2'>
                      {item?.beneficiaryPercentage}%
                    </span>
                    &nbsp;&nbsp;
                    <b>Campaign: </b>
                    <VINftsTooltip
                      title={`Click to see all NFTs for "${item?.campaignName}" campaign`}
                    >
                      {item?.beneficiary ? (
                        <Link
                          to={`./BeneficiaryNFTs?beneficiary=${item?.beneficiary}&campaign=${item?.campaign}`}
                          className='dez-page text-white'
                        >
                          {item?.campaignName}
                        </Link>
                      ) : (
                        <Link
                          to={`./CreatorNFTs?creator=${item?.creator}&collection=${item?.collection}`}
                          className='dez-page text-white'
                        >
                          {item?.campaignName}
                        </Link>
                      )}
                    </VINftsTooltip>
                    &nbsp;&nbsp;
                    <b>Creator: </b>
                    <VINftsTooltip
                      title={`Click to see all NFTs created by "${item?.creator}"`}
                    >
                      <Link
                        to={`./CreatorNFTs?creator=${item?.creator}`}
                        className='dez-page text-white'
                      >
                        {item?.creatorName}
                      </Link>
                    </VINftsTooltip>
                    <span className='bg-info text-white px-1 ml-1 border-raduis-2'>
                      {item?.creatorPercentage}%
                    </span>
                    &nbsp;&nbsp;
                    <b>Collection: </b>
                    {item?.collectionName}
                  </p>
                  <p className='d-flex align-content-center align-items-center'>
                    {item?.isCreatorOwner !== false &&
                      item?.isForSale !== 'false' && (
                        <>
                          <b>Price: </b>
                          {item?.price} {item?.currency} &nbsp;&nbsp;
                        </>
                      )}
                    {item?.isCreatorOwner === true &&
                      item.isForSale === 'true' && (
                        <>
                          <IconImage nft={item} /> &nbsp;&nbsp;{' '}
                        </>
                      )}
                    {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                      <NFTTwitterShare item={item} />
                    )}
                  </p>
                  <p>
                    {item?.sdgs_ids?.length > 0 && item?.sdgs_ids !== '0' && (
                      <div className='mt-3 px-2'>
                        <a
                          href='https://sdgs.un.org/goals'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <img
                            src={unitedNation}
                            style={{
                              width: 40,
                              pointerEvents: 'none',
                              cursor: 'default',
                            }}
                          />
                        </a>
                        :{' '}
                        {SDGsData?.filter(({ value }) =>
                          item?.sdgs_ids?.split(',').includes(value.toString())
                        )?.map((sdg, index) => (
                          <VINftsTooltip title={sdg.label} key={index}>
                            <label>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  'images/sdgsIcons/' +
                                  sdg.icon
                                }
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
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='vinft-page-loader'>
            <div className='vinft-spinner-body'>
              <Spinner animation='border' variant='success' />
              <p>Fetching NFT Details Please wait...</p>
            </div>
          </div>
        )}
        {/* <!-- contact area END --> */}
      </div>
      {showBuyModal && (
        <BuyNFTModal
          show={showBuyModal}
          handleCloseParent={() => {
            setShowBuyModal(false);
          }}
          data={selectedNFT}
          isTransfer={false}
        />
      )}
    </Layout>
  );
};
export default NFTDetail;
