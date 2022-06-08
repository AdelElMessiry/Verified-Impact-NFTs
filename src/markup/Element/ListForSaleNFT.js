import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';

import { setIsTokenForSale } from '../../api/nftInfo';
import { useAuth } from '../../contexts/AuthContext';

//list nft for sale NFT Modal
const ListForSaleNFTModal = ({ show, handleCloseParent, data }) => {
  const { entityInfo } = useAuth();
  const [price, setPrice] = React.useState('');
  const [showModal, setShowModal] = React.useState(show);
  if (!data) return <></>;

  //list NFT forSale Function
  const ListNFTForSale = async () => {
    const nftID = data.tokenId.toString();
    try {
      const deployUpdatedNftResult = await setIsTokenForSale(
        data.isForSale === 'true' ? false : true,
        nftID,
        CLPublicKey.fromHex(entityInfo.publicKey),
        price
      );
      if (deployUpdatedNftResult) {
        VIToast.success('NFT transferred successfully');
      } else {
        VIToast.error('Error happened please try again later');
      }
    } catch (err) {
      console.log('Transfer Err ' + err);
      VIToast.error('Error happened please try again later');
    }
  };

  //handle closing modal
  const handleClose = () => {
    setShowModal(false);
    handleCloseParent();
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
        <Modal.Title>
          {data.isForSale === 'true' ? 'UnList' : 'List'} {data.title} NFT For
          Sale
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
          {data.isForSale === 'true' ? (
            <span>Are you sure you want to unlist {data.title} for sale?</span>
          ) : (
            <div className='row form-group justify-content-center'>
              <div className='col-6'>
                <input
                  type='text'
                  className='form-control'
                  name='address'
                  placeholder='Price in CSPR*'
                  onChange={(e) => setPrice(price)}
                  value={price}
                />
              </div>
            </div>
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
            ListNFTForSale();
          }}
        >
          {data.isForSale === 'true'
            ? 'UnList NFT For Sale'
            : 'List NFT For Sale'}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ListForSaleNFTModal;
