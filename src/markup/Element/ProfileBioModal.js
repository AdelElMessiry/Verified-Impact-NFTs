import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';

import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileFormsEnum } from '../../Enums';
import { profileClient } from '../../api/profileInfo';
const InitialInputs = () => ({
  inputs: {
    address: '',
  },
});

//buying NFT Modal
const ProfileBioModal = ({ show, handleCloseParent, type,handleDataSaved = () => {} }) => {
  const { entityInfo } = useAuth();
  const [showModal, setShowModal] = React.useState(show);
  const [state, setState] = React.useState(InitialInputs());
  const [isSaveClicked, setIsSaveClicked] = React.useState(false);
  const [profileBio, setProfileBio] = React.useState();

  //transfer nft Function
  const SaveBio = async () => {
    setIsSaveClicked(true);
    try {
      debugger;
      const saveDeployHash = await profileClient.updateProfileBio(
        CLPublicKey.fromHex(entityInfo.publicKey),
        profileBio,
        type === ProfileFormsEnum.NormalProfile
        ? 'normal'
        : type === ProfileFormsEnum.BeneficiaryProfile
        ? 'beneficiary'
        : 'creator',
        CLPublicKey.fromHex(entityInfo.publicKey)
      );
      debugger;
      const deploySaveResult = await getDeployDetails(saveDeployHash);
      if (deploySaveResult) {
        handleDataSaved(profileBio)
        VIToast.success('Bio Saved successfully');
        handleClose();
      } else {
        VIToast.error('Error happened please try again later');
      }
    } catch (err) {
      debugger
      console.log('Save Err ' + err);
      handleClose();
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
          Edit Bio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='reserve-form'>
          <Row>
            <Col>
            <textarea
            name="fullBio"
            className="form-control"
            value={profileBio}
            onChange={(e) => {
              setProfileBio(e.target.value)
            }}
            // maxLength={100}
          />
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn' onClick={handleClose}>
          Close
        </button>
        <button
          className='btn btn-success'
          onClick={() => {
            SaveBio()
          }}
          disabled={isSaveClicked}
        >
          {isSaveClicked ? (
            <Spinner animation='border' variant='light' />
          ) : 'Save'}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileBioModal;
