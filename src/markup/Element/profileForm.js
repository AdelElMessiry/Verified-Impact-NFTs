import React, { useState } from 'react';
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
import { SocialLinks } from 'social-links';
import SDGsMultiSelect from './SDGsMultiSelect';
import { SDGsData } from '../../data/SDGsGoals';
import {
  useNFTState,
  useNFTDispatch,
  updateProfiles,
  refreshProfiles
} from '../../contexts/NFTContext';
import ProfileBioModal from './ProfileBioModal';
const ProfileForm = ({
  formName,
  isProfileExist,
  formData,
  isSignUpBeneficiary = false,
  allProfileData = {},
  noProfilesForThisUser=false
}) => {
  const { entityInfo, refreshAuth, isLoggedIn } = useAuth();
  const { ...stateList } = useNFTState();
  const nftDispatch = useNFTDispatch();
  const { campaigns } = stateList;

  //setting initial values of controls
  const [state, setState] = useState({
    inputs: {
      userName: '',
      shortTagLine: '',
      firstName: '',
      lastName: '',
      //fullBio: '',
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
      donationReceipt: false,
      ein: "",
      acceptPolicies: false,
      authorizeArtist: false
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
  const [showExternalURLErrorMsg, setShowExternalURLErrorMsg] =
    React.useState(false);
  const [socialErrors, setSocialErrors] = useState({
    twitter: true,
    instagram: true,
    medium: true,
    facebook: true,
    telegram: true,
  });
  const [SDGsGoals, setSDGsGoals] = React.useState([SDGsData[18].value]);
  const [mandatorySDGs, setMandatorySDGs] = React.useState([SDGsData[18].value]);
  const [showBioModal, setShowBioModal] = React.useState(false);
  const [profileBio, setProfileBio] = React.useState();
  
  React.useEffect(() => {
    setState({
      inputs: {
        userName: formData ? formData.username : '',
        shortTagLine: formData ? formData.tagline : '',
        firstName: formData ? formData.firstName : '',
        lastName: formData ? formData.lastName : '',
       // fullBio: formData ? formData.bio : '',
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
        ein: formData ? formData.ein : '',
        donationReceipt: formData ? formData.has_receipt==="true"?true:false : false
      },
    });
    setProfileBio(formData ? formData.bio : '')
    setUploadedProfileImage(formData ? formData?.imgUrl : null);
    setUploadedNFTImage(formData ? formData?.nftUrl : null);
    setSDGsGoals(formData ? formData?.sdgs_ids?.split(",") : SDGsGoals);
   if (formName==ProfileFormsEnum.BeneficiaryProfile&&formData){
    const beneficiaryCampaigns=campaigns.filter(({beneficiary_address})=>beneficiary_address==formData.address);
  if (beneficiaryCampaigns&& beneficiaryCampaigns.length>0){
  const sdgsCampaigns=  beneficiaryCampaigns.map(({sdgs_ids})=>!Array.isArray(sdgs_ids)&& sdgs_ids?.split(",")).flat();
  const beneficiaryArray=  formData?.sdgs_ids?.split(',')
    var savedSDGs = sdgsCampaigns.filter(function(obj) { 
      return beneficiaryArray.indexOf(obj) > -1; 
    });
    setMandatorySDGs(savedSDGs);
  }
   }
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

  const handleSDGsChange = (data) => {
    setSDGsGoals(data);
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

  const checkURLValidation = (value, urlNum) => {
    var re = new RegExp("^(http|https)://", "i");
    if (validator.isURL(value) && re.test(value)) {
      urlNum == 1
        ? setShowProfileURLErrorMsg(false)
        : urlNum == 2
        ? setShowNFTURLErrorMsg(false)
        : setShowExternalURLErrorMsg(false);
    } else {
      urlNum == 1
        ? setShowProfileURLErrorMsg(true)
        : urlNum == 2
        ? setShowNFTURLErrorMsg(true)
        : setShowExternalURLErrorMsg(true);
    }
  };
  const socialLinks = new SocialLinks();
  // check social links validation
  const checkSocialLinksValidation = (value, socialType) => {
    const urlSocialInputs = socialErrors;
    if (value == "" ) {
      urlSocialInputs[socialType] = true;
    } else if (!value.includes("https://")) {
      urlSocialInputs[socialType] = value.includes("https://");
    } else {
      urlSocialInputs[socialType] = socialLinks.isValid(socialType, value);
    }
    setSocialErrors({
      ...socialErrors,
      urlSocialInputs,
    });
  };
  //handling minting new NFT
  async function handleSave() {
    if (!uploadedProfileImageURL) {
      return VIToast.error('Please upload profile image or enter direct URL');
    }
    if (!uploadedNFTImageURL) {
      return VIToast.error('Please upload NFT image or enter direct URL');
    }

    if (
      (state.inputs.isProfileImageURL && showProfileURLErrorMsg) ||
      (state.inputs.isNFTImageURL && showNFTURLErrorMsg) ||
      (state.inputs.externalSiteLink !== '' && showExternalURLErrorMsg)
    ) {
      return;
    }
    if (
      !socialErrors.facebook ||
      !socialErrors.twitter ||
      !socialErrors.instagram ||
      !socialErrors.medium ||
      !socialErrors.telegram
    )
      return;
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
    if (!entityInfo.publicKey && !isSignUpBeneficiary) {
      return VIToast.error('Please enter sign in First');
    }
    if (entityInfo.publicKey) {
      let saveDeployHash;
      console.log(formData);
      try {
        saveDeployHash = await profileClient.addUpdateProfile(
          CLPublicKey.fromHex(entityInfo.publicKey),
          entityInfo.publicKey,
          state.inputs.userName,
          state.inputs.shortTagLine,
          ProfileImgURL,
          NFTImgURL,
          state.inputs.firstName,
          state.inputs.lastName,
          //state.inputs.fullBio,
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
          isProfileExist ? 'UPDATE' : 'ADD',
          formName === ProfileFormsEnum.BeneficiaryProfile?SDGsGoals:[],
          state.inputs.donationReceipt,
          state.inputs.donationReceipt?state.inputs.ein:""
        );
      } catch (err) {
        if (err.message.includes('User Cancelled')) {
          VIToast.error('User Cancelled Signing');
        } else if (err.message.includes('1024')) {
          VIToast.error(
            'Sorry an error happened while saving, please try again with less number of characters in the bio field'
          );
        } else {
          VIToast.error(err.message);
        }
        setIsSaveButtonClicked(false);
        return;
      }

      try {
        const deployResult = await getDeployDetails(saveDeployHash);
        console.log('...... Profile Saved successfully', deployResult);
        if (formName === ProfileFormsEnum.BeneficiaryProfile) {
          const mailto = `mailto:verifiedimpactnfts@gmail.com?subject=New Beneficiary ${state.inputs.userName}&body=Dear Verified Impact NFTs Team:%0D%0A%0D%0AHello, ${state.inputs.userName} would like to signup .%0D%0A%0D%0APlease approve my beneficiary.%0D%0A%0D%0AAdditional notes:%0D%0A
          (Please type your notes here)%0D%0A%0D%0AMany thanks.%0D%0AWith kind regards,`;
          window.location.href = mailto;
        }
        if(noProfilesForThisUser||isSignUpBeneficiary){
         await refreshProfiles(nftDispatch,stateList)
        }else{
        const pk = CLPublicKey.fromHex(entityInfo.publicKey)
        .toAccountHashStr()
        .slice(13);
        let changedData = {};
        if (formName === ProfileFormsEnum.BeneficiaryProfile) {
          changedData = {
            [pk]: {
              normal: allProfileData.normal,
              beneficiary: {
                address: CLPublicKey.fromHex(entityInfo.publicKey)
                  .toAccountHashStr()
                  .slice(13),
                address_pk: entityInfo.publicKey,
                ein: state.inputs.donationReceipt ? state.inputs.ein : '',
                externalLink: state.inputs.externalSiteLink,
                facebook: state.inputs.facebook,
                firstName: state.inputs.firstName,
                has_receipt: state.inputs.donationReceipt,
                imgUrl: ProfileImgURL,
                instagram: state.inputs.instagram,
                isApproved:  formData ?formData?.isApproved:"false",
                lastName: state.inputs.lastName,
                mail: state.inputs.email,
                medium: state.inputs.medium,
                nftUrl: NFTImgURL,
                phone: state.inputs.phone,
                sdgs_ids: SDGsGoals.join(','),
                tagline: state.inputs.tagline,
                telegram: state.inputs.telegram,
                twitter: state.inputs.twitter,
                username: state.inputs.userName,
                bio: formData ? formData.bio : '',
              },
              creator: allProfileData.creator,
            },
          };
        } else if (formName === ProfileFormsEnum.CreatorProfile) {
          changedData = {
            [pk]: {
              normal: allProfileData.normal,
              beneficiary: allProfileData.beneficiary,
              creator: {
                address: CLPublicKey.fromHex(entityInfo.publicKey)
                  .toAccountHashStr()
                  .slice(13),
                address_pk: entityInfo.publicKey,
                ein: state.inputs.donationReceipt ? state.inputs.ein : '',
                externalLink: state.inputs.externalSiteLink,
                facebook: state.inputs.facebook,
                firstName: state.inputs.firstName,
                has_receipt: state.inputs.donationReceipt,
                imgUrl: ProfileImgURL,
                instagram: state.inputs.instagram,
                isApproved: 'false',
                lastName: state.inputs.lastName,
                mail: state.inputs.email,
                medium: state.inputs.medium,
                nftUrl: NFTImgURL,
                phone: state.inputs.phone,
                tagline: state.inputs.tagline,
                telegram: state.inputs.telegram,
                twitter: state.inputs.twitter,
                username: state.inputs.userName,
                bio: formData ? formData.bio : '',
              },
            },
          };
        } else {
          changedData = {
            [pk]: {
              normal: {
                address: CLPublicKey.fromHex(entityInfo.publicKey)
                  .toAccountHashStr()
                  .slice(13),
                address_pk: entityInfo.publicKey,
                ein: state.inputs.donationReceipt ? state.inputs.ein : '',
                externalLink: state.inputs.externalSiteLink,
                facebook: state.inputs.facebook,
                firstName: state.inputs.firstName,
                has_receipt: state.inputs.donationReceipt,
                imgUrl: ProfileImgURL,
                instagram: state.inputs.instagram,
                isApproved: "false",
                lastName: state.inputs.lastName,
                mail: state.inputs.email,
                medium: state.inputs.medium,
                nftUrl: NFTImgURL,
                phone: state.inputs.phone,
                tagline: state.inputs.tagline,
                telegram: state.inputs.telegram,
                twitter: state.inputs.twitter,
                username: state.inputs.userName,
                bio: formData ? formData.bio : '',
              },
              beneficiary: allProfileData.beneficiary,
              creator: allProfileData.creator,
            },
          };
        }
        console.log("chnaged Data",changedData)
        await updateProfiles(nftDispatch, stateList, changedData);
      }
        if (
          formName === ProfileFormsEnum.BeneficiaryProfile &&
          !isProfileExist
        ) {
          handleSaveToSheet(ProfileImgURL, NFTImgURL);
        }
        VIToast.success('Profile Saved successfully');
        //NOTE: every channel has a special keys and tokens sorted on .env file
        setTimeout(() => {
          // window.location.reload();
          setIsSaveButtonClicked(false);
        }, 50);
      } catch (err) {
        if (err.message.includes('1024')) {
          VIToast.error(
            'Sorry an error happened while saving, please try again with less number of characters in the bio field'
          );
        } else {
          VIToast.error(err.message);
        }
        console.log(err);
        //   setErrStage(MintingStages.TX_PENDING);
        setIsSaveButtonClicked(false);
      }
      refreshAuth();
    } else {
      if (formName === ProfileFormsEnum.BeneficiaryProfile && !isProfileExist) {
        handleSaveToSheet(ProfileImgURL, NFTImgURL);
        setIsSaveButtonClicked(false);
        refreshProfiles(nftDispatch,stateList)
      }
    }
  }

  const handleSaveToSheet = async (ProfileImgURL, NFTImgURL) => {
    await fetch(process.env.REACT_APP_BENEFICIARIES_SIGNUP_SHEET, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Address: isLoggedIn ? entityInfo.publicKey : 'Not Logged User',
        UserName: state.inputs.userName,
        ShoreTagName: state.inputs.shortTagLine,
        ProfileImgURL: ProfileImgURL,
        NFTImgURL: NFTImgURL,
        FirstName: state.inputs.firstName,
        LastName: state.inputs.lastName,
        Bio: state.inputs.fullBio,
        ExternalSiteLink: state.inputs.externalSiteLink,
        Phone: state.inputs.phone,
        Twitter: state.inputs.twitter,
        Instagram: state.inputs.instagram,
        Facebook: state.inputs.facebook,
        Meduim: state.inputs.medium,
        Telegram: state.inputs.telegram,
        Email: state.inputs.email,
      }),
    })
      .then((r) => r.json())
      .then((response) => {
        VIToast.success('Your Sign up submitted Successfully');
        setTimeout(() => {
          // window.location.reload();
          setIsSaveButtonClicked(false);
        }, 50);
      })
      .catch((error) => {
        VIToast.error('An error occured with sign up');
        setTimeout(() => {
          //  window.location.reload();
          setIsSaveButtonClicked(false);
        }, 50);
      });
  };

  const getSavedData = async (bio) => {
    setProfileBio(bio);
    const pk = CLPublicKey.fromHex(entityInfo.publicKey)
    .toAccountHashStr()
    .slice(13);
    let changedData = {};
    if (formName === ProfileFormsEnum.BeneficiaryProfile) {
      changedData = {
        [pk]: {
          normal: allProfileData.normal,
          beneficiary: Object.assign({}, formData, {
            bio: bio,
          }),
          creator: allProfileData.creator,
        },
      };
    } else if (formName === ProfileFormsEnum.CreatorProfile) {
      changedData = {
        [pk]: {
          normal: allProfileData.normal,
          beneficiary: allProfileData.beneficiary,
          creator: Object.assign({}, formData, {
            bio: bio,
          }),
        },
      };
    } else {
      changedData = {
        [pk]: {
          normal: Object.assign({}, formData, {
            bio: bio,
          }),
          beneficiary: allProfileData.beneficiary,
          creator: allProfileData.creator,
        },
      };
    }
    await updateProfiles(nftDispatch, stateList, changedData);
  };

  return (
    <div className='shop-account '>
        <Row>
        <Col>
        <h4 className='text-dark'>Main Info</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className='form-group'>
            <Col>
              <span>
                User Name <span className='text-danger'>*</span>
              </span>
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
                placeholder="https://example.com"
                onChange={(e) => {
                  handleChange(e);
                  checkURLValidation(e.target.value, 3);
                }}
              />
              {showExternalURLErrorMsg && (
                <span className='text-danger'>Please enter Valid URL </span>
              )}
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
                placeholder="https://twitter.com/userName"
                onChange={(e) => {
                  handleChange(e);
                  checkSocialLinksValidation(e.target.value, 'twitter');
                }}
              />
              {!socialErrors.twitter && (
                <span className='text-danger'>
                  Please enter Valid Twitter URL
                </span>
              )}
            </Col>
            <Col>
              <span>Instagram</span>
              <input
                type='text'
                name='instagram'
                className='form-control'
                value={state.inputs.instagram}
                placeholder="https://instagram.com/userName"
                onChange={(e) => {
                  handleChange(e);
                  checkSocialLinksValidation(e.target.value, 'instagram');
                }}
              />
              {!socialErrors.instagram && (
                <span className='text-danger'>
                  Please enter Valid Instagram URL
                </span>
              )}
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
                placeholder='https://facebook.com/userName'
                onChange={(e) => {
                  handleChange(e);
                  checkSocialLinksValidation(e.target.value, 'facebook');
                }}
              />
              {!socialErrors.facebook && (
                <span className='text-danger'>
                  Please enter Valid Facebook URL{' '}
                </span>
              )}
            </Col>
            <Col>
              <span>Medium</span>
              <input
                type='text'
                name='medium'
                className='form-control'
                value={state.inputs.medium}
                placeholder="https://medium.com/@userName"
                onChange={(e) => {
                  handleChange(e);
                  checkSocialLinksValidation(e.target.value, 'medium');
                }}
              />
              {!socialErrors.medium && (
                <span className='text-danger'>
                  Please enter Valid Medium URL
                </span>
              )}
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
                placeholder='https://t.me/userName'
                onChange={(e) => {
                  handleChange(e);
                  checkSocialLinksValidation(e.target.value, 'telegram');
                }}
              />
              {!socialErrors.telegram && (
                <span className='text-danger'>
                  Please enter Valid Telegram URL
                </span>
              )}
            </Col>
          </Row>
          {(formName === ProfileFormsEnum.BeneficiaryProfile || isSignUpBeneficiary) && (
            <>
              
              <Row className='form-group pt-4'>
                <Col>
                  <Form.Check
                    type={'checkbox'}
                    id={`donationReceipt${formName}`}
                    label={`Provide organization donation receipt `}
                    onChange={(e) => handleChange(e)}
                    value={state.inputs.donationReceipt}
                    name='donationReceipt'
                    className='float-left'
                    checked={state.inputs.donationReceipt}
                  />
                </Col>
              </Row>
              {(isSignUpBeneficiary || (formName === ProfileFormsEnum.BeneficiaryProfile && !formData)) && (
                <>
                  <Row className='form-group pt-1'>
                    <Col>
                      <Form.Check
                        type={'checkbox'}
                        id={`acceptPolicies`}
                        label={
                          <span>
                            By signing up I accept the
                            {" "}
                            <a href={`${window.location.origin}/#/terms-of-services`} target="_blank" rel="noopener noreferrer">
                              Terms of Service 
                            </a>
                            {" "}
                            and
                            {" "}
                            <a href={`${window.location.origin}/#/privacy`} target="_blank" rel="noopener noreferrer">
                              Privacy
                            </a>
                          </span>
                        }
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.acceptPolicies}
                        name='acceptPolicies'
                        className='float-left'
                        checked={state.inputs.acceptPolicies}
                      />
                    </Col>
                  </Row>
                  <Row className='form-group'>
                    <Col>
                      <Form.Check
                        type={'checkbox'}
                        id={`authorizeArtist`}
                        label={`I authorize artists and creators to list NFTs for the benefit of my campaigns`}
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.authorizeArtist}
                        name='authorizeArtist'
                        className='float-left'
                        checked={state.inputs.authorizeArtist}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {state.inputs.donationReceipt && (
                <Row className='form-group'>
                <Col>
                  <span>EIN</span> <span className='text-danger'>*</span>
                  <input
                    type='text'
                    name='ein'
                    className='form-control'
                    value={state.inputs.ein}
                    placeholder=""
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {!socialErrors.telegram && (
                    <span className='text-danger'>Please set the EIN</span>
                  )}
                </Col>
              </Row>
              )}
            </>

          )}

          {formName === ProfileFormsEnum.BeneficiaryProfile && (
            <Row>
              <Col>
                <SDGsMultiSelect
                  data={SDGsData}
                  SDGsChanged={(selectedData) => {
                    handleSDGsChange(selectedData);
                  }}
                  defaultValues={formData? formData?.sdgs_ids:""}
                  mandatorySDGs={mandatorySDGs}
                  isAddBeneficiary={formData?false:true}
                  isClear={undefined}
                />
              </Col>
            </Row>
          )}
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
                className='float-left'
              />{' '}
              <span className='text-danger'>*</span>
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
                      checkURLValidation(e.target.value, 1);
                    }}
                    value={uploadedProfileImageURL || ''}
                  />
                  {showProfileURLErrorMsg && (
                    <span className='text-danger'>Please enter Valid URL </span>
                  )}
                </>
              ) : formData && formData?.imgUrl ? (
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
              ) : (
                <ImageUploader
                  singleImage
                  withIcon={true}
                  buttonText="Choose image"
                  onChange={(e) => {
                    onDrop(e, true);
                  }}
                  imgExtension={['.jpg', '.gif', '.png']}
                  maxFileSize={20209230}
                  withPreview={true}
                  label={'Max file size: 20mb, accepted: jpg|gif|png'}
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
                className='float-left'
              />{' '}
              <span className='text-danger'>*</span>
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
                      checkURLValidation(e.target.value, 2);
                    }}
                    value={uploadedNFTImageURL || ''}
                  />
                  {showNFTURLErrorMsg && (
                    <span className='text-danger'>Please enter Valid URL </span>
                  )}
                </>
              ) : formData && formData?.nftUrl ? (
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
              ) : (
                <ImageUploader
                  singleImage
                  withIcon={true}
                  buttonText="Choose image"
                  onChange={(e) => {
                    onDrop(e, false);
                  }}
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

      <Row className='form-group mt-3'>
        <Col>
          <button
            className='btn btn-success'
            disabled={
              state.inputs.userName == '' ||
              isSaveButtonClicked ||
              !uploadedProfileImageURL ||
              !uploadedNFTImageURL ||
              (state.inputs.donationReceipt && state.inputs.ein == "") ||
              ((formName === ProfileFormsEnum.BeneficiaryProfile && SDGsGoals?.length <= 0) || (formName === ProfileFormsEnum.BeneficiaryProfile && SDGsGoals == undefined))||
             ( isSignUpBeneficiary || (formName === ProfileFormsEnum.BeneficiaryProfile && !formData))&&
             (
              !state.inputs.authorizeArtist ||
              !state.inputs.acceptPolicies)
            }
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
      <hr/>
      <Row>
        <Col>
        <h4  className='text-dark'>Full Bio</h4>{!formData&&<span>Please add Profile First</span>}
        </Col>
      </Row>
     {formData&& <>
      <Row className='form-group'>
        
        <Col lg={6} md={6}>
          <div>
            {profileBio}
          </div>
      
          {/* <span>{state.inputs.fullBio.length} / 100 characters</span> */}
        </Col>
      </Row>
      <Row className='form-group'>
        <Col>
          <button
            className='btn btn-success'
            onClick={() => {
              setShowBioModal(true);
            }}
          >
              Edit
          </button>
        </Col>        
      </Row></>}
      {showBioModal && (
          <ProfileBioModal
            show={showBioModal}
            handleCloseParent={() => {
              setShowBioModal(false);
            }}
            type={formName}
            handleDataSaved={(bio)=>{getSavedData(bio)}}
            existingBio={profileBio}
          />
        )}
    </div>
  );
};
export default ProfileForm;
