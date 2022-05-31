import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

const ProfileForm = ({ isCollection = false }) => {
  //setting initial values of controls
  const [state, setState] = useState({
    inputs: {
      userName: '',
      shortTagLine: '',
      profileImageURL: '',
      profileNFT: '',
      firstName: '',
      lastName: '',
      fullBio: '',
      externalSiteLink: '',
      phone: '',
      twitter: '',
      instagram: '',
      facebook: '',
      medium: '',
      email: '',
      telegram: '',
    },
  });

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
    <>
      <Row className="form-group">
        <Col>
          <span>User Name</span>
          <input
            type="text"
            name="userName"
            placeholder="User Name"
            className="form-control"
            value={state.inputs.userName}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <span>Short Tag Line</span>
          <input
            type="text"
            placeholder="Short Tag Line"
            name="shortTagLine"
            className="form-control"
            value={state.inputs.shortTagLine}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>profile Image URL</span>
          <input
            type="text"
            name="ProfileImageURL"
            placeholder="Profile Image URL"
            className="form-control"
            value={state.inputs.profileImageURL}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <span>Profile NFT</span>
          <input
            type="text"
            placeholder="Profile NFT"
            name="profileNFT"
            className="form-control"
            value={state.inputs.profileNFT}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>First Name</span>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="form-control"
            value={state.inputs.firstName}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <span>Last Name</span>
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            className="form-control"
            value={state.inputs.lastName}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>External Site Link</span>
          <input
            type="text"
            name="externalSiteLink"
            placeholder="External Site Link"
            className="form-control"
            value={state.inputs.externalSiteLink}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <span>Phone</span>
          <input
            type="text"
            placeholder="Phone"
            name="phone"
            className="form-control"
            value={state.inputs.phone}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>Twitter</span>
          <input
            type="text"
            name="twitter"
            placeholder="Twitter"
            className="form-control"
            value={state.inputs.twitter}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <span>Instagram</span>
          <input
            type="text"
            placeholder="Instagram"
            name="instagram"
            className="form-control"
            value={state.inputs.instagram}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>Facebook</span>
          <input
            type="text"
            name="Facebook"
            placeholder="facebook"
            className="form-control"
            value={state.inputs.facebook}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <span>Medium</span>
          <input
            type="text"
            placeholder="Medium"
            name="medium"
            className="form-control"
            value={state.inputs.medium}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>E-mail</span>
          <input
            type="text"
            name="email"
            placeholder="E-mail"
            className="form-control"
            value={state.inputs.email}
            onChange={(e) => handleChange(e)}
          />
        </Col>
        <Col>
          <span>Telegram</span>
          <input
            type="text"
            placeholder="Telegram"
            name="telegram"
            className="form-control"
            value={state.inputs.telegram}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>Full Bio</span>
          <textarea
            placeholder="Full Bio"
            name="fullBio"
            className="form-control"
            value={state.inputs.fullBio}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <button
            className="btn btn-success"
            disabled={state.inputs.userName == ''}
          >
            Save
          </button>
        </Col>
      </Row>
    </>
  );
};
export default ProfileForm;
