import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';
import CreatableSelect from 'react-select/creatable';
import validator from 'validator';

import { ProfileFormsEnum } from '../../Enums/index';

const ProfileForm = ({ formName }) => {
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

  const [collectionList, setCollectionList] = useState([
    { id: 1, label: 'Stand With Ukraine' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([
    { id: 1, label: 'Stand With Ukraine' },
  ]);
  const [uploadedImageURL, setUploadedImage] = React.useState(null);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [showURLErrorMsg, setShowURLErrorMsg] = React.useState(false);

  const handleChange = (e) => {
    const { value, name, checked, type } = e.target;
    const { inputs } = state;

    inputs[name] = type === 'checkbox' ? checked : value;
    setState({
      ...state,
      inputs,
    });
  };

  //handling of creating new option in creatable select control
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

  //handling of adding new option to the existing options in creatable select
  const handleCreateCollection = (inputValue) => {
    setIsLoading(true);
    console.group('Option created');
    console.log('Wait a moment...');
    setTimeout(() => {
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      setIsLoading(false);
      setOptions([...options, newOption]);
      setCollectionList([...options, newOption]);
    }, 1000);
  };

  //handling of selecting image in image control
  const onDrop = (picture) => {
    if (picture.length > 0) {
      const newImageUrl = URL.createObjectURL(picture[0]);
      setUploadedImage(newImageUrl);
      setUploadedFile(picture[0]);
    } else {
      setUploadedImage(null);
      setUploadedFile(null);
    }
  };

  const checkURLValidation = (value) => {
    if (validator.isURL(value)) {
      setShowURLErrorMsg(false);
    } else {
      setShowURLErrorMsg(true);
    }
  };

  return (
    <div className="shop-account ">
      <Row>
        <Col>
          <Row className="form-group">
            <Col>
              <span>User Name</span>
              <input
                type="text"
                name="userName"
                className="form-control"
                value={state.inputs.userName}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Short Tag Line</span>
              <input
                type="text"
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
                className="form-control"
                value={state.inputs.profileImageURL}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Profile NFT</span>
              <input
                type="text"
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
                className="form-control"
                value={state.inputs.firstName}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Last Name</span>
              <input
                type="text"
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
                className="form-control"
                value={state.inputs.externalSiteLink}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Phone</span>
              <input
                type="text"
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
                className="form-control"
                value={state.inputs.twitter}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Instagram</span>
              <input
                type="text"
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
                name="facebook"
                className="form-control"
                value={state.inputs.facebook}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Medium</span>
              <input
                type="text"
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
                className="form-control"
                value={state.inputs.email}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Telegram</span>
              <input
                type="text"
                name="telegram"
                className="form-control"
                value={state.inputs.telegram}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="form-group">
            <Col>
              <Form.Check
                type={'checkbox'}
                id={'isImageURL'}
                label={`Already hosted image, enter direct url ?`}
                onChange={(e) => handleChange(e)}
                value={state.inputs.isImageURL}
                name="isImageURL"
              />
            </Col>
          </Row>
          <Row className="form-group">
            <Col>
              {state.inputs.isImageURL ? (
                <>
                  {' '}
                  <input
                    type="text"
                    placeholder="Image URl"
                    name="imageUrl"
                    className="form-control"
                    onChange={(e) => {
                      setUploadedImage(e.target.value);
                      checkURLValidation(e.target.value);
                    }}
                    value={uploadedImageURL || ''}
                  />
                  {showURLErrorMsg && (
                    <span className="text-danger">Please enter Valid URL </span>
                  )}
                </>
              ) : (
                <ImageUploader
                  singleImage
                  withIcon={true}
                  buttonText="Choose image"
                  onChange={onDrop}
                  imgExtension={['.jpg', '.gif', '.png']}
                  maxFileSize={20209230}
                  withPreview={true}
                  label={'Max file size: 20mb, accepted: jpg|gif|png'}
                />
              )}
            </Col>
          </Row>
          <Row className="form-group">
            <Col>
              <Form.Check
                type={'checkbox'}
                id={'isImageURL'}
                label={`Already hosted image, enter direct url ?`}
                onChange={(e) => handleChange(e)}
                value={state.inputs.isImageURL}
                name="isImageURL"
              />
            </Col>
          </Row>
          <Row className="form-group">
            <Col>
              {state.inputs.isImageURL ? (
                <>
                  {' '}
                  <input
                    type="text"
                    placeholder="Image URl"
                    name="imageUrl"
                    className="form-control"
                    onChange={(e) => {
                      setUploadedImage(e.target.value);
                      checkURLValidation(e.target.value);
                    }}
                    value={uploadedImageURL || ''}
                  />
                  {showURLErrorMsg && (
                    <span className="text-danger">Please enter Valid URL </span>
                  )}
                </>
              ) : (
                <ImageUploader
                  singleImage
                  withIcon={true}
                  buttonText="Choose image"
                  onChange={onDrop}
                  imgExtension={['.jpg', '.gif', '.png']}
                  maxFileSize={20209230}
                  withPreview={true}
                  label={'Max file size: 20mb, accepted: jpg|gif|png'}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <span>Full Bio</span>
          <textarea
            name="fullBio"
            className="form-control"
            value={state.inputs.fullBio}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>
      {ProfileFormsEnum.CreatorProfile === formName && (
        <Row className="form-group">
          <Col>
            <span>Collection List</span>
            <CreatableSelect
              isClearable
              isLoading={isLoading}
              isMulti={true}
              onChange={(v) => setCollectionList(v)}
              onCreateOption={(v) => handleCreateCollection(v)}
              options={options}
              value={collectionList}
              menuPortalTarget={document.body}
              placeholder="Select..."
              className="creatable-select"
              formatCreateLabel={(v) =>
                'Click here to create "' + v + '" Collection'
              }
            />
          </Col>
        </Row>
      )}

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
    </div>
  );
};
export default ProfileForm;
