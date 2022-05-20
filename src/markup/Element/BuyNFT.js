import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col } from 'react-bootstrap';

import { transferFees } from '../../utils/contract-utils';
import { transfer } from '../../api/transfer';
import { approve } from '../../api/approve';
import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';
import { toast as VIToast } from 'react-toastify';

//buying NFT Modal
const BuyNFTModal = ({ show, handleCloseParent, data ,isTransfer=false}) => {
  const IntialInputs = () => ({
    inputs: {
      address: '',
    },
  });

  const { entityInfo } = useAuth();
  const [showModal, setShowModal] = useState(show);
  const [state, setState] = useState(IntialInputs());
  if (!data) return <></>;

  //transfer NFT Function
  const buyNFT = async () => {
    const nftID = data.tokenId;

    const approveTransfer = await approve(
      CLPublicKey.fromHex(entityInfo.publicKey),
      nftID
    );

    try {
      const deployApproveResult = await getDeployDetails(approveTransfer);
      console.log(
        '...... Token approve transferred successfully',
        deployApproveResult
      );
      VIToast.success("Token approve transferred successfully")
      const transferDeployHash = await transfer(
        CLPublicKey.fromHex(entityInfo.publicKey),
        CLPublicKey.fromHex(entityInfo.publicKey),
        nftID
      );
      const deployTransferResult = await getDeployDetails(transferDeployHash);
      console.log(
        '...... Token fees transferred successfully',
        deployTransferResult
      );
      VIToast.success("Token fees transferred successfully")

    } catch (err) {
      console.log('Transfer Err ' + err);
    }

    try {
      const transferFeesHash = await transferFees(entityInfo.publicKey, nftID);
      const deployFeesResult = await getDeployDetails(transferFeesHash);

      console.log('...... Token transferred successfully', deployFeesResult);
      VIToast.success("transaction ended successfully")
    } catch (err) {
      console.log('Transfer Err ' + err);
      VIToast.error("Error happend please try again later")
    }
  };

const transferNFT=async()=>{
  const nftID = data.tokenId;
  try{const transferDeployHash= await  transfer(
    {signer: CLPublicKey.fromHex(entityInfo.publicKey),
    recipient: CLPublicKey.fromHex(state.inputs.address),
    nftId: nftID}
  )
  if(transferDeployHash){
    VIToast.success("NFT transfered successfully")
  }else{
    VIToast.error("Error happend please try again later")

  }
}
  catch (err){
    console.log('Transfer Err ' + err);
    VIToast.error("Error happend please try again later")
  }
}

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

  return (
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
              <p className='text-muted'>{data.description}</p>
            </Col>
          </Row>
          {isTransfer?   <div className='row form-group justify-content-center'>
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
          </div>:<span>Are you sure want to buy {data.title} NFT?</span>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn' onClick={handleClose}>
          Close
        </button>
        <button className='btn btn-success' onClick={() => {isTransfer? transferNFT():buyNFT()}}>
          Buy
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyNFTModal;
