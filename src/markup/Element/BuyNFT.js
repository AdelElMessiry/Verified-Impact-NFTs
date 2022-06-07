import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';

import { transferFees } from '../../utils/contract-utils';
import { transfer, purchaseNFT } from '../../api/transfer';
import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';
import { sendDiscordMessage } from '../../utils/discordEvents';
import { SendTweetWithImage } from '../../utils/VINFTsTweets';

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
  
  //buy NFT Function
  const buyNFT = async () => {
    if (entityInfo.publicKey) {
      setIsBuyClicked(true);
      const nftID = data.tokenId.toString();

      try {
        // const transferFeesHash = await transferFees(
        //   entityInfo.publicKey,
        //   nftID
        // );
        // const deployFeesResult = await getDeployDetails(transferFeesHash);

        // console.log(
        //   '...... Token fees transferred successfully',
        //   deployFeesResult
        // );
        // VIToast.success('Token fees transferred successfully');

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
          VIToast.success('Transaction ended successfully');
          handleClose();
          sendDiscordMessage(
            process.env.REACT_APP_NFT_WEBHOOK_ID,
            process.env.REACT_APP_NFT_TOKEN,
            '',
            '',
            `Exciting news! [${data.title}] NFT of [${data.creatorName}] creator has been sold as a donation for [${data.campaignName}] campaign. Click here to buy #verified-impact-nfts and support more causes.`
          );
          SendTweetWithImage(
            data.image,
            `Exciting news! ${data.title} NFT of ${data.creatorName} creator has been sold as a donation for ${data.campaignName} campaign. Click here to buy #verified_impact_nfts and support more causes.`
          );
        }else{
          setIsBuyClicked(false);
        }
      } catch (err) {
        console.log('Transfer Fees Err ' + err);
        handleClose();
        VIToast.error('Error happened please try again later');
      }
    }
  };

  //transfer nft Function
  const transferNFT = async () => {
    const nftID = data.tokenId;
    setIsBuyClicked(true);
    try {
      const transferDeployHash = await transfer({
        signer: CLPublicKey.fromHex(entityInfo.publicKey),
        recipient: CLPublicKey.fromHex(state.inputs.address),
        nftId: nftID,
      });
      if (transferDeployHash) {
        VIToast.success('NFT transfered successfully');
        handleClose();
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
        <Modal.Title>Buy {data.title} NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='reserve-form'>
          <Row>
            <Col>
              <h5>{data.title}</h5>
              <p className="text-muted">{data.description}</p>
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
            <Spinner animation="border" variant="light" />
          ) : (
            'Buy'
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyNFTModal;
