import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';

import { transferFees, isValidHttpUrl } from '../../utils/contract-utils';
import { transfer, purchaseNFT } from '../../api/transfer';
import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';
import { sendDiscordMessage } from '../../utils/discordEvents';
import {
  SendTweetWithImage,
  SendTweetWithImage64,
} from '../../utils/VINFTsTweets';
import ReactGA from 'react-ga';
import { NFTActionTypes, useNFTDispatch, useNFTState } from '../../contexts/NFTContext';
const InitialInputs = () => ({
  inputs: {
    address: '',
  },
});

//buying NFT Modal
const BuyNFTModal = ({ show, handleCloseParent, data, isTransfer = false }) => {
  const { entityInfo } = useAuth();
  const [showModal, setShowModal] = React.useState(show);
  const [state, setState] = React.useState(InitialInputs());
  const [isBuyClicked, setIsBuyClicked] = React.useState(false);
  const { ...stateList } = useNFTState();
  const { refreshNFTs } = stateList;
  const nftDispatch = useNFTDispatch();
  //buy NFT Function
  const buyNFT = async () => {
    if (entityInfo.publicKey) {
      setIsBuyClicked(true);
      const nftID = data.tokenId.toString();

      try {
        const transferFeesHash = await transferFees(
          entityInfo.publicKey,
          nftID
        );
        const deployFeesResult = await getDeployDetails(transferFeesHash);

        console.log(
          '...... Token fees transferred successfully',
          deployFeesResult
        );
        VIToast.success('Token fees transferred successfully');

        const transferDeployHash = await purchaseNFT(
          CLPublicKey.fromHex(entityInfo.publicKey),
          nftID
        );
        const deployTransferResult = await getDeployDetails(transferDeployHash);
        console.log(
          '...... Token fees transferred successfully',
          deployTransferResult
        );
        if (deployTransferResult) {
          ReactGA.event({
            category: 'Success',
            action: 'Buy nft',
            label: `${entityInfo.publicKey}: bought a new nft id: ${nftID}`,
          });
          const updatedNFTsList = await refreshNFTs();
          nftDispatch({
            type: NFTActionTypes.SUCCESS,
            payload: {
              ...stateList,
              nft: updatedNFTsList,
            },
          });
          VIToast.success('Transaction ended successfully');
          handleClose();
          await sendDiscordMessage(
            process.env.REACT_APP_NFT_WEBHOOK_ID,
            process.env.REACT_APP_NFT_TOKEN,
            '',
            '',
            `Exciting news! [${data.title}] NFT of [${data.creatorName}] creator has been sold as a donation for [${data.campaignName}] campaign. [Click here  to buy #verified-impact-nfts and support more causes.] (${window.location.origin}/#/)  @vinfts @casper_network @devxdao `
          );
          let image = encodeURI(data.image);
          if (isValidHttpUrl(data.pureImageKey)) {
            await SendTweetWithImage(
              image,
              `Exciting news! ${data.title} #NFT of ${data.creatorName} creator has been sold as a donation for ${data.campaignName} campaign. Click here ${window.location.origin}/#/ to buy #verified_impact_nfts and support more causes.  @vinfts @casper_network @devxdao `
            );
          } else {
            let image64 =
              'https://vinfts.mypinata.cloud/ipfs/' + data.pureImageKey;
            await SendTweetWithImage64(
              image64,
              `Exciting news! ${data.title} #NFT of ${data.creatorName} creator has been sold as a donation for ${data.campaignName} campaign. Click here ${window.location.origin}/#/ to buy #verified_impact_nfts and support more causes.  @vinfts @casper_network @devxdao `
            );
          }
        } else {
          setIsBuyClicked(false);
        }
      } catch (err) {
        if (err.message.includes('User Cancelled')) {
          VIToast.error('User Cancelled Signing');
          ReactGA.event({
            category: 'User Cancelation',
            action: 'Buy nft',
            label: `${entityInfo.publicKey}: Cancelled Signing`,
          });
        } else {
          VIToast.error('Error happened please try again later');
          ReactGA.event({
            category: 'Error',
            action: 'Buy nft',
            label: `${entityInfo.publicKey}: ${err.message}`,
          });
        }
        setIsBuyClicked(false);
        handleClose();
      }
    }
  };

  //transfer nft Function
  const transferNFT = async () => {
    const nftID = data.tokenId;
    setIsBuyClicked(true);
    try {
      const transferDeployHash = await transfer(
        CLPublicKey.fromHex(entityInfo.publicKey),
        CLPublicKey.fromHex(state.inputs.address),
        nftID
      );
      if (transferDeployHash) {
        VIToast.success('NFT transfered successfully');
        handleClose();
        const updatedNFTsList = await refreshNFTs();
        nftDispatch({
          type: NFTActionTypes.SUCCESS,
          payload: {
            ...stateList,
            nft: updatedNFTsList,
          },
        });
      } else {
        VIToast.error('Error happened please try again later');
      }
    } catch (err) {
      console.log('Transfer Err ' + err);
      handleClose();
      VIToast.error('Error happened please try again later');
    }
  };

  //handle closing modal
  const handleClose = () => {
    setShowModal(false);
    handleCloseParent();
  };

  //handling changing in controls
  const handleChange = (e) => {
    const { value, name, checked, type } = e.target;
    const { inputs } = state;

    inputs[name] = type === 'checkbox' ? checked : value;
    setState({
      ...state,
      inputs,
    });
  };

  return !data ? (
    <></>
  ) : (
    <Modal
      show={showModal}
      onHide={handleClose}
      scrollable={true}
      size='lg'
      backdrop='static'
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isTransfer ? 'Transfer' : 'Buy'} {data.title} NFT
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='reserve-form'>
          <Row>
            <Col>
              <h5>{data.title}</h5>
              <p className='text-muted'>{data.description}</p>
            </Col>
          </Row>
          {isTransfer ? (
            <div className='row form-group justify-content-center'>
              <div className='col-6'>
                <input
                  type='text'
                  className='form-control'
                  name='address'
                  placeholder='Transfer To*'
                  onChange={(e) => handleChange(e)}
                  value={state.inputs.address}
                />
              </div>
            </div>
          ) : (
            <span>Are you sure want to buy {data.title} NFT?</span>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn' onClick={handleClose}>
          Close
        </button>
        <button
          className='btn btn-success'
          onClick={() => {
            isTransfer ? transferNFT() : buyNFT();
          }}
          disabled={isBuyClicked}
        >
          {isBuyClicked ? (
            <Spinner animation='border' variant='light' />
          ) : isTransfer ? (
            'Transfer'
          ) : (
            'Buy'
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyNFTModal;
