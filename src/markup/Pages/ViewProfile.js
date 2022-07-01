import React from 'react';
import { Row, Col, Spinner, Modal } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTelegram,
  faMedium,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

import { profileClient } from '../../api/profileInfo';

import { ProfileFormsEnum } from '../../Enums/index';

const ViewProfile = ({ show, handleCloseParent, data, formName }) => {
  const [profileDetails, setProfileDetails] = React.useState();
  const [showModal, setShowModal] = React.useState(show);

  //getting beneficiary details
  const getProfile = React.useCallback(async () => {
    let userProfiles = await profileClient.getProfile(data.address);
    if (userProfiles) {
      if (userProfiles.err === 'Address Not Found') {
        setProfileDetails(null);
      } else {
        let list = Object.values(userProfiles)[0];
        userProfiles && setProfileDetails(formName===ProfileFormsEnum.BeneficiaryProfile? list.beneficiary:list.creator);
    }
  }}, [profileDetails]);

  React.useEffect(() => {
    !profileDetails && getProfile();
  }, [profileDetails, getProfile]);

  //handle closing modal
  const handleClose = () => {
    setShowModal(false);
    handleCloseParent();
  };

  return (
    <>
      <Modal
        show={showModal}
        fullscreen="true"
        onHide={handleClose}
        className="modal-full-screen"
      >
        <Modal.Header closeButton>
          <Modal.Title>{profileDetails&&profileDetails?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileDetails ? (
            <>
              <Row>
                <Col>
                  <Row className="form-group">
                    <Col>
                      <span>User Name</span>
                      <label>{profileDetails.username}</label>
                    </Col>
                    <Col>
                      <span>Short Tag Line</span>
                      <label>{profileDetails.tagline}</label>
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <span>First Name</span>
                      <label>{profileDetails.firstname}</label>
                    </Col>
                    <Col>
                      <span>Last Name</span>
                      <label>{profileDetails.lastname}</label>
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <span>External Site Link</span>
                      <label>{profileDetails.externalLink}</label>
                    </Col>
                    <Col>
                      <span>Phone</span>
                      <label>{profileDetails.phone}</label>
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <span>E-mail</span>
                      <label>{profileDetails.mail}</label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ul className='list-inline'>
                        <li>
                          <a href={profileDetails.facebook} target="_blank">
                            <FontAwesomeIcon icon={faFacebook} size="2x"/>
                          </a>
                        </li>
                        <li>
                          <a href={profileDetails.telegram} target="_blank">
                            <FontAwesomeIcon icon={faTelegram}  size="2x"/>
                          </a>
                        </li>
                        <li>
                          <a href={profileDetails.twitter} target="_blank">
                            <FontAwesomeIcon icon={faTwitter}  size="2x"/>
                          </a>
                        </li>
                        <li>
                          <a href={profileDetails.meduim} target="_blank">
                            <FontAwesomeIcon icon={faMedium}  size="2x"/>
                          </a>
                        </li>
                        <li>
                          <a href={profileDetails.instagram} target="_blank">
                            <FontAwesomeIcon icon={faInstagram}  size="2x"/>
                          </a>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="form-group">
                    <Col>
                      <img src={profileDetails.imgUrl} />
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <img src={profileDetails.nftUrl} />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="form-group">
                <Col>
                  <span>Full Bio</span>
                  <p>{profileDetails.bio}</p>
                </Col>
              </Row>
            </>
          ):( <div className='vinft-page-loader'>
          <div className='vinft-spinner-body'>
            <Spinner animation='border' variant='success' />
            <p>Fetching Data Please wait...</p>
          </div>
        </div>)}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewProfile;
