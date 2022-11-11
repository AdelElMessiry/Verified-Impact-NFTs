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
import AddEditCampaignForm from './AddEditCampaignForm';
import AddEditCollectionForm from './AddEditCollectionForm';

//buying NFT Modal
const AddEditCollectionsModal = ({
  show,
  handleCloseParent,
  data,
}) => {
  const [showModal, setShowModal] = React.useState(show);

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
          {data ? 'Edit' : 'Add'} {data && data.name} Collection
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddEditCollectionForm
          data={data}
          closeModal={() => handleCloseParent()}
          isFromModal={true}
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditCollectionsModal;
