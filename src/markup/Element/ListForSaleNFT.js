import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col } from 'react-bootstrap';

import { setIsTokenForSale } from '../../api/nftInfo';
import { useAuth } from '../../contexts/AuthContext';
import { toast as VIToast } from 'react-toastify';

/**
 * @module ListForSaleNFTModal
 */
/** 
 * listing nft for sale data
 * @property {boolean} show - show module render status
 * @property {function} handleCloseParent - callback function to parent on close modal
 * @property {object} data - object includes nft information
 */

//list nft for sale NFT Modal
const ListForSaleNFTModal = ({ show, handleCloseParent, data }) => {
  const { entityInfo } = useAuth();
  const [price, setPrice] = React.useState('');
  const [showModal, setShowModal] = useState(show);
  if (!data) return <></>;

  //list NFT forSale Function
  const ListNFTForSale = async () => {
    const nftID = data.tokenId;
    try {
      const deployUpdatedNftResult = setIsTokenForSale({
        isForSale: data.isForSale == 'true' ? false : true,
        tokenId: nftID,
        deploySender: CLPublicKey.fromHex(entityInfo.publicKey),
        price: price,
      });
      if (deployUpdatedNftResult) {
        VIToast.success('NFT transfered successfully');
      } else {
        VIToast.error('Error happend please try again later');
      }
    } catch (err) {
      console.log('Transfer Err ' + err);
      VIToast.error('Error happend please try again later');
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
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {data.isForSale == 'true' ? 'UnList' : 'List'} {data.title} NFT For
          Sale
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="reserve-form">
          <Row>
            <Col>
              <h5>{data.title}</h5>
              <p className="text-muted">{data.description}</p>
            </Col>
          </Row>
          {data.isForSale == 'true' ? (
            <span>Are you sure you want to unlist {data.title} for sale?</span>
          ) : (
            <div className="row form-group justify-content-center">
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="Price in CSPR*"
                  onChange={(e) => setPrice(price)}
                  value={price}
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn" onClick={handleClose}>
          Close
        </button>
        <button
          className="btn btn-success"
          onClick={() => {
            ListNFTForSale();
          }}
        >
          {data.isForSale == 'true'
            ? 'UnList NFT For Sale'
            : 'List NFT For Sale'}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ListForSaleNFTModal;
