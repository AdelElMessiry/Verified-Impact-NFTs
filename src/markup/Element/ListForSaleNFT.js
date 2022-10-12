import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';

import { setIsTokenForSale } from '../../api/nftInfo';
import { useAuth } from '../../contexts/AuthContext';
import {
  useNFTState,
  useNFTDispatch,
  updateNFTs,
  refreshNFTs,
} from '../../contexts/NFTContext';

//list nft for sale NFT Modal
const ListForSaleNFTModal = ({
  show,
  handleCloseParent,
  data,
  handleTransactionSuccess = () => {},
}) => {
  const { entityInfo } = useAuth();
  const { ...stateList } = useNFTState();
  const nftDispatch = useNFTDispatch();
  const [price, setPrice] = React.useState('');
  const [showModal, setShowModal] = React.useState(show);
  const [isListForSaleClicked, setIsListForSaleClicked] = React.useState(false);

  if (!data) return <></>;

  //list NFT forSale Function
  const ListNFTForSale = async () => {
    const nftID = data.tokenId.toString();
    setIsListForSaleClicked(true);
    try {
      const deployUpdatedNftResult = await setIsTokenForSale(
        data.isForSale === 'true' ? false : true,
        nftID,
        CLPublicKey.fromHex(entityInfo.publicKey),
        price
      );

      if (deployUpdatedNftResult) {
        //update listed/unlisted nft to radis
        const changedNFT = Object.assign({}, data, {
          isForSale: data.isForSale == 'true' ? 'false' : 'true',
          price: data.isForSale == 'true' ? '0' : price,
        });
        await updateNFTs(nftDispatch, stateList, changedNFT);
        handleTransactionSuccess(changedNFT);
        VIToast.success(
          data.isForSale === 'true'
          ? 'NFT is unlisted for sale'
          : 'NFT is listed for sale'
          );
          await refreshNFTs(nftDispatch, stateList);
          setIsListForSaleClicked(false);
          handleClose();
      } else {
        VIToast.error('Error happened please try again later');
        setIsListForSaleClicked(false);
      }
    } catch (err) {
      if (err.message.includes('User Cancelled')) {
        VIToast.error('User Cancelled Signing');
      } else {
        VIToast.error(err.message);
      }
      setIsListForSaleClicked(false);
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
                  type='number'
                  className='form-control'
                  name='price'
                  placeholder='Price in CSPR*'
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
                {price < 250 && (
                  <span className='text-danger'>
                    NFT price should be more than 250 CSPR
                  </span>
                )}
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
          disabled={isListForSaleClicked || (price !== '' && price < 250)}
        >
          {isListForSaleClicked ? (
            <Spinner animation='border' variant='light' />
          ) : data.isForSale === 'true' ? (
            'UnList NFT For Sale'
          ) : (
            'List NFT For Sale'
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ListForSaleNFTModal;
