import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Spinner } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';
import validator from 'validator';
import { toast as VIToast } from 'react-toastify';
import { CLPublicKey } from 'casper-js-sdk';

import { profileClient } from '../../api/profileInfo';
import { ProfileFormsEnum } from '../../Enums/index';
import { useAuth } from '../../contexts/AuthContext';
import { getDeployDetails } from '../../api/universal';
import { uploadImg } from '../../api/imageCDN';
import { addBeneficiary } from '../../api/addBeneficiary';

const ProfileForm = ({
  formName,
  isProfileExist,
  formData,
  isVINftExist = false,
}) => {
  // debugger;
  const { entityInfo, refreshAuth } = useAuth();
  //setting initial values of controls
  // debugger;
  const [state, setState] = useState({
    inputs: {
      userName: '',
      shortTagLine: '',
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
      isProfileImageURL: '',
      isNFTImageURL: '',
      address: '',
    },
  });

  const [uploadedProfileImageURL, setUploadedProfileImage] =
    React.useState(null);
  const [uploadedProfileFile, setUploadedProfileFile] = React.useState(null);
  const [uploadedNFTImageURL, setUploadedNFTImage] = React.useState(null);
  const [uploadedNFTFile, setUploadedNFTFile] = React.useState(null);
  const [isSaveButtonClicked, setIsSaveButtonClicked] = React.useState(false);
  const [isOndropProfileClicked, setIsOndropProfileClicked] = useState(false);
  const [isOndropNFTClicked, setIsOndropNFTClicked] = useState(false);

  const [showProfileURLErrorMsg, setShowProfileURLErrorMsg] =
    React.useState(false);
  const [showNFTURLErrorMsg, setShowNFTURLErrorMsg] = React.useState(false);

  React.useEffect(() => {
    setState({
      inputs: {
        userName: formData ? formData.username : '',
        shortTagLine: formData ? formData.tagline : '',
        firstName: formData ? formData.firstName : '',
        lastName: formData ? formData.lastName : '',
        fullBio: formData ? formData.bio : '',
        externalSiteLink: formData ? formData.externalLink : '',
        phone: formData ? formData.phone : '',
        twitter: formData ? formData.twitter : '',
        instagram: formData ? formData.instagram : '',
        facebook: formData ? formData.facebook : '',
        medium: formData ? formData.medium : '',
        email: formData ? formData.mail : '',
        telegram: formData ? formData.telegram : '',
        isProfileImageURL: '',
        isNFTImageURL: '',
        address: formData ? formData.address : '',
      },
    });
    setUploadedProfileImage(formData ? formData?.imgUrl : null);
    setUploadedNFTImage(formData ? formData?.nftUrl : null);
  }, [formData]);

  const handleChange = (e) => {
    const { value, name, checked, type } = e.target;
    const { inputs } = state;

    inputs[name] = type === 'checkbox' ? checked : value;
    setState({
      ...state,
      inputs,
    });
  };

  //handling of selecting image in image control
  const onDrop = (picture, isProfile) => {
    if (picture.length > 0) {
      const newImageUrl = URL.createObjectURL(picture[0]);
      isProfile
        ? setUploadedProfileImage(newImageUrl)
        : setUploadedNFTImage(newImageUrl);
      isProfile
        ? setUploadedProfileFile(picture[0])
        : setUploadedNFTFile(picture[0]);
      isProfile ? setIsOndropProfileClicked(true) : setIsOndropNFTClicked(true);
    } else {
      isProfile ? setUploadedProfileImage(null) : setUploadedNFTImage(null);
      isProfile ? setUploadedProfileFile(null) : setUploadedNFTFile(null);
    }
  };

  const checkURLValidation = (value, isProfile) => {
    if (validator.isURL(value)) {
      isProfile
        ? setShowProfileURLErrorMsg(false)
        : setShowNFTURLErrorMsg(false);
    } else {
      isProfile
        ? setShowProfileURLErrorMsg(true)
        : setShowNFTURLErrorMsg(false);
    }
  };

  //handling minting new NFT
  async function handleSave() {
    if (!uploadedProfileImageURL) {
      return VIToast.error('Please upload profile image or enter direct URL');
    }
    if (!uploadedNFTImageURL) {
      return VIToast.error('Please upload NFT image or enter direct URL');
    }
    if (!entityInfo.publicKey) {
      return VIToast.error('Please enter sign in First');
    }
    if (
      (state.inputs.isProfileImageURL && showProfileURLErrorMsg) ||
      (state.inputs.isNFTImageURL && showNFTURLErrorMsg)
    ) {
      return;
    }
    setIsSaveButtonClicked(true);
    let cloudProfileURL = uploadedProfileImageURL;
    let cloudNFTURL = uploadedNFTImageURL;
    if (!state.inputs.isProfileImageURL && uploadedProfileFile) {
      console.log('Img', uploadedProfileFile);
      console.log('Img url', uploadedProfileImageURL);

      try {
        cloudProfileURL = await uploadImg(uploadedProfileFile);
      } catch (err) {
        console.log(err);
        VIToast.error("Profile Image couldn't be uploaded to cloud CDN !");

        return;
      }
      VIToast.success('Profile Image uploaded to cloud CDN successfully !');
    }
    if (!state.inputs.isNFTImageURL && uploadedNFTFile) {
      console.log('Img', uploadedNFTFile);
      console.log('Img url', uploadedNFTImageURL);

      try {
        cloudNFTURL = await uploadImg(uploadedNFTFile);
      } catch (err) {
        console.log(err);
        VIToast.error("NFT Image couldn't be uploaded to cloud CDN !");

        return;
      }
      VIToast.success('NFT Image uploaded to cloud CDN successfully !');
    }
    saveProfile(cloudProfileURL, cloudNFTURL);
  }

  async function saveProfile(ProfileImgURL, NFTImgURL) {
    if (!uploadedProfileImageURL || !uploadedNFTImageURL) {
      return VIToast.error('Please upload image or enter direct URL');
    }
    if (entityInfo.publicKey) {
      let saveDeployHash;
      console.log(formData);
      // debugger;
      try {
        saveDeployHash = await profileClient.addUpdateProfile(
          CLPublicKey.fromHex(entityInfo.publicKey),
          // entityInfo.publicKey,
          state.inputs.userName,
          state.inputs.shortTagLine,
          ProfileImgURL,
          NFTImgURL,
          state.inputs.firstName,
          state.inputs.lastName,
          state.inputs.fullBio,
          state.inputs.externalSiteLink,
          state.inputs.phone,
          state.inputs.twitter,
          state.inputs.instagram,
          state.inputs.facebook,
          state.inputs.medium,
          state.inputs.telegram,
          state.inputs.email,
          formName === ProfileFormsEnum.NormalProfile
            ? 'normal'
            : formName === ProfileFormsEnum.BeneficiaryProfile
            ? 'beneficiary'
            : 'creator',
          CLPublicKey.fromHex(entityInfo.publicKey),
          isProfileExist ? 'UPDATE' : 'ADD'
        );
        if (formName === ProfileFormsEnum.BeneficiaryProfile) {
          const mailto = `mailto:verifiedimpactnfts@gmail.com?subject=New Beneficiary ${state.inputs.userName}&body=Dear Verified Impact NFTs Team:%0D%0A%0D%0AHello, ${state.inputs.userName} would like to signup .%0D%0A%0D%0APlease approve my beneficiary.%0D%0A%0D%0AAdditional notes:%0D%0A
          (Please type your notes here)%0D%0A%0D%0AMany thanks.%0D%0AWith kind regards,`;
          window.location.href = mailto;
        }
      } catch (err) {
        if (err.message.includes('User Cancelled')) {
          VIToast.error('User Cancelled Signing');
        } else {
          VIToast.error(err.message);
        }
        setIsSaveButtonClicked(false);
        return;
      }

      try {
        const deployResult = await getDeployDetails(saveDeployHash);
        console.log('...... Profile Saved successfully', deployResult);

        VIToast.success('Profile Saved successfully');
        //NOTE: every channel has a special keys and tokens sorted on .env file
        setTimeout(() => {
          setIsSaveButtonClicked(false);
          window.location.reload();
        }, 50);
      } catch (err) {
        console.log(err);
        //   setErrStage(MintingStages.TX_PENDING);
        VIToast.error(err);
        setIsSaveButtonClicked(false);
      }
      refreshAuth();
    }
  }

  return (
    <div className='shop-account '>
      <Row>
        <Col>
          <Row className='form-group'>
            <Col>
              <span>User Name</span>
              <input
                type='text'
                name='userName'
                className='form-control'
                value={state.inputs.userName}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Short Tag Line</span>
              <input
                type='text'
                name='shortTagLine'
                className='form-control'
                value={state.inputs.shortTagLine}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              <span>First Name</span>
              <input
                type='text'
                name='firstName'
                className='form-control'
                value={state.inputs.firstName}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Last Name</span>
              <input
                type='text'
                name='lastName'
                className='form-control'
                value={state.inputs.lastName}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              <span>External Site Link</span>
              <input
                type='text'
                name='externalSiteLink'
                className='form-control'
                value={state.inputs.externalSiteLink}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Phone</span>
              <input
                type='text'
                name='phone'
                className='form-control'
                value={state.inputs.phone}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              <span>Twitter</span>
              <input
                type='text'
                name='twitter'
                className='form-control'
                value={state.inputs.twitter}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Instagram</span>
              <input
                type='text'
                name='instagram'
                className='form-control'
                value={state.inputs.instagram}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              <span>Facebook</span>
              <input
                type='text'
                name='facebook'
                className='form-control'
                value={state.inputs.facebook}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Medium</span>
              <input
                type='text'
                name='medium'
                className='form-control'
                value={state.inputs.medium}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              <span>E-mail</span>
              <input
                type='text'
                name='email'
                className='form-control'
                value={state.inputs.email}
                onChange={(e) => handleChange(e)}
              />
            </Col>
            <Col>
              <span>Telegram</span>
              <input
                type='text'
                name='telegram'
                className='form-control'
                value={state.inputs.telegram}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className='form-group'>
            <Col>
              <Form.Check
                type={'checkbox'}
                id={`isProfileImageURL${formName}`}
                label={`Already hosted profile image, enter direct url ?`}
                onChange={(e) => handleChange(e)}
                value={state.inputs.isProfileImageURL}
                name='isProfileImageURL'
              />
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              {state.inputs.isProfileImageURL ? (
                <>
                  <input
                    type='text'
                    placeholder='Profile image URL'
                    name='profileImageUrl'
                    className='form-control'
                    onChange={(e) => {
                      setUploadedProfileImage(e.target.value);
                      checkURLValidation(e.target.value, true);
                    }}
                    value={uploadedProfileImageURL || ''}
                  />
                  {showProfileURLErrorMsg && (
                    <span className='text-danger'>Please enter Valid URL </span>
                  )}
                </>
              ) : (
                <ImageUploader
                  singleImage
                  withIcon={true}
                  buttonText='Choose image'
                  onChange={(e) => {
                    onDrop(e, true);
                  }}
                  imgExtension={['.jpg', '.gif', '.png']}
                  maxFileSize={20209230}
                  withPreview={true}
                  label={'Max file size: 20mb, accepted: jpg|gif|png'}
                  defaultImages={[
                    !isOndropProfileClicked
                      ? formData && formData?.imgUrl
                      : uploadedProfileImageURL
                      ? uploadedProfileImageURL
                      : '',
                  ]}
                />
              )}
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              <Form.Check
                type={'checkbox'}
                id={`isNFTImageURL${formName}`}
                label={`Already hosted NFT image, enter direct url ?`}
                onChange={(e) => handleChange(e)}
                value={state.inputs.isNFTImageURL}
                name='isNFTImageURL'
              />
            </Col>
          </Row>
          <Row className='form-group'>
            <Col>
              {state.inputs.isNFTImageURL ? (
                <>
                  {' '}
                  <input
                    type='text'
                    placeholder='NFT Image URL'
                    name='nftImageUrl'
                    className='form-control'
                    onChange={(e) => {
                      setUploadedNFTImage(e.target.value);
                      setUploadedNFTFile(e.target.value);
                    }}
                    value={uploadedNFTImageURL || ''}
                  />
                  {showNFTURLErrorMsg && (
                    <span className='text-danger'>Please enter Valid URL </span>
                  )}
                </>
              ) : (
                <ImageUploader
                  singleImage
                  withIcon={true}
                  buttonText='Choose image'
                  onChange={(e) => {
                    onDrop(e, false);
                  }}
                  imgExtension={['.jpg', '.gif', '.png']}
                  maxFileSize={20209230}
                  withPreview={true}
                  label={'Max file size: 20mb, accepted: jpg|gif|png'}
                  defaultImages={[
                    !isOndropNFTClicked
                      ? formData && formData?.nftUrl
                      : uploadedNFTImageURL
                      ? uploadedNFTImageURL
                      : '',
                  ]}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className='form-group'>
        <Col>
          <span>Full Bio</span>
          <textarea
            name='fullBio'
            className='form-control'
            value={state.inputs.fullBio}
            onChange={(e) => handleChange(e)}
          />
        </Col>
      </Row>

      <Row className='form-group'>
        <Col>
          <button
            className='btn btn-success'
            disabled={state.inputs.userName == '' || isSaveButtonClicked}
            onClick={(e) => {
              handleSave(e);
            }}
          >
            {isSaveButtonClicked ? (
              <Spinner animation='border' variant='light' />
            ) : (
              'Save'
            )}
          </button>
        </Col>
      </Row>
    </div>
  );
};
export default ProfileForm;
