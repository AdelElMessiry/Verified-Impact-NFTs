import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import VINFTsTooltip from '../Element/Tooltip';
import { Spinner } from 'react-bootstrap';

import { getNFTsList } from '../../api/nftInfo';
import BuyNFTModal from '../Element/BuyNFT';
import Layout from '../Layout';
import NFTTwitterShare from '../Element/TwitterShare/NFTTwitterShare';
import { getBeneficiariesCampaignsList } from '../../api/beneficiaryInfo';
import { getCreatorsList } from '../../api/creatorInfo';
import { getCollectionsList } from '../../api/collectionInfo';

//nft details component
const NFTDetail = () => {
  const Iconimage = ({ nft }) => {
    return (
      <>
        <i
          className="ti-shopping-cart buy-icon mfp-link fa-2x mfp-link portfolio-fullscreen"
          onClick={() => {
            setSelectedNFT(nft);
            setShowBuyModal(true);
          }}
        ></i>
      </>
    );
  };
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [item, setItem] = useState();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState();
  const [allNFTs, setAllNFTs] = useState();
  const [beneficiaries, setbeneficiaries] = useState();
  const [allCreators, setCreators] = useState();
  const [allCollections, setCollections] = useState();

  useEffect(() => {
    (async () => {
      if (!allNFTs) {
        let newNFTList = await getNFTsList();
        setAllNFTs(newNFTList);
        let nft = newNFTList.find((nft) => nft.tokenId == id);
        let beneficiaryList = !beneficiaries
          ? await getBeneficiariesCampaignsList()
          : [];
        !beneficiaries && setbeneficiaries(beneficiaryList);
        let creatorsList = !allCreators && (await getCreatorsList());
        !allCreators && setCreators(creatorsList);
        let collectionsList = !allCollections && (await getCollectionsList());
        !allCollections && setCollections(collectionsList);
        setItem({
          ...nft,
          campaignName: beneficiaryList.find(
            ({ address }) => nft.beneficiary === address
          ).campaigns.find(({ id }) => nft.campaign === id)
            .name,
          creatorName: creatorsList.find(
            ({ address }) => nft.creator === address
          ).name,
          beneficiaryName: beneficiaryList.find(
            ({ address }) => nft.beneficiary === address
          ).name,
          collectionName: collectionsList.find(
            ({ id }) => nft.collection === id
          ).name,
        });
      }
    })();
  }, [id, allNFTs,beneficiaries,allCollections,allCreators]);

  return (
    <Layout isNFTDetails={true}>
      <div className="page-content pb-0 bg-black-light pt-5">
        {item ? (
          <div className="content-block position-relative h-100vh">
            {/* <!-- Project Details --> */}
            <div className="section-full content-inner-2 h-100vh">
              <div className="container h-100">
                <div className="row h-100">
                  <div className="col text-center align-items-center align-content-center d-flex justify-content-center h-100">
                    <img
                      src={item?.image}
                      alt=""
                      className="img img-fluid fit-img"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="detail-page-caption p-3">
              <div className="align-b text-white text-left">
                <div className="text-white text-left port-box">
                  <h5>{item?.title}</h5>
                  <p>Description: {item?.description}</p>
                  <p>
                    {/* <b>Category: </b>
                    {item?.category} 
                    &nbsp;&nbsp;*/}
                    <b>Beneficiary: </b>
                    <VINFTsTooltip
                      title={`Click to see all NFTs for "${item?.beneficiaryName}" beneficiary`}
                    >
                      <Link
                        to={`./BenefeiciaryNFTs?beneficiary=${item?.beneficiaryName}`}
                        className="dez-page text-white"
                      >
                        {item?.beneficiaryName}
                      </Link>
                    </VINFTsTooltip>
                    <span className="bg-success text-white px-1 ml-1 border-raduis-2">
                      {item?.beneficiaryPercentage}%
                    </span>
                    &nbsp;&nbsp;
                    <b>Campaign: </b>
                    <VINFTsTooltip
                      title={`Click to see all NFTs for "${item?.campaignName}" campaign`}
                    >
                      {item?.beneficiary ? (
                        <Link
                          to={`./BenefeiciaryNFTs?beneficiary=${item?.beneficiaryName}&campaign=${item?.campaignName}`}
                          className="dez-page text-white"
                        >
                          {item?.campaignName}
                        </Link>
                      ) : (
                        <Link
                          to={`./CreatorNFTs?creator=${item?.creator}&collection=${item?.collectionName}`}
                          className="dez-page text-white"
                        >
                          {item?.campaignName}
                        </Link>
                      )}
                    </VINFTsTooltip>
                    &nbsp;&nbsp;
                    <b>Creator: </b>
                    <VINFTsTooltip
                      title={`Click to see all NFTs created by "${item?.creator}"`}
                    >
                      <Link
                        to={`./CreatorNFTs?creator=${item?.creator}`}
                        className="dez-page text-white"
                      >
                        {item?.creatorName}
                      </Link>
                    </VINFTsTooltip>
                    <span className="bg-info text-white px-1 ml-1 border-raduis-2">
                      {item?.creatorPercentage}%
                    </span>
                    &nbsp;&nbsp;
                    <b>Collection: </b>
                    {item?.collectionName}
                  </p>
                  <p className="d-flex align-content-center align-items-center">
                    <b>Price: </b>
                    {item?.price} {item?.currency} &nbsp;&nbsp;
                    <Iconimage nft={item} /> &nbsp;&nbsp;{' '}
                    {process.env.REACT_APP_SHOW_TWITTER !== 'false' && (
                      <NFTTwitterShare item={item} />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="vinft-page-loader">
            <div className="vinft-spinner-body">
              <Spinner animation="border" variant="success" />
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
