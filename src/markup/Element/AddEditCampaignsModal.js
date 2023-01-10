import React from 'react';
import Modal from 'react-bootstrap/Modal';
import AddEditCampaignForm from './AddEditCampaignForm';

//this shared component using in manage campaign page
const AddEditCampaignsModal = ({
  show,
  handleCloseParent,
  data,
  beneficiaryAddress,
  beneficiaryPKAddress
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
          {data ? 'Edit' : 'Add'} {data && data.name} Campaign
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddEditCampaignForm
          data={data}
          closeModal={() => handleCloseParent()}
          isFromModal={true}
          beneficiaryAddress={beneficiaryAddress}
          beneficiaryPKAddress={beneficiaryPKAddress}
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

export default AddEditCampaignsModal;
