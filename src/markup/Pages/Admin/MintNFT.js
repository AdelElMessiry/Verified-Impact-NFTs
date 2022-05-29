import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';
import { toast as VIToast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';

import { useAuth } from '../../../contexts/AuthContext';
import { useNFTState } from '../../../contexts/NFTContext';

import { uploadImg } from '../../../api/imageCDN';
import { mint } from '../../../api/mint';
import { getDeployDetails } from '../../../api/universal';
import validator from 'validator';

import PageTitle from '../../Layout/PageTitle';
import PromptLogin from '../PromptLogin';
import Layout from '../../Layout';

import bnr1 from './../../../images/banner/bnr1.jpg';

//handling of creating new option in creatable select control
const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

//minting new nft page
const MintNFT = () => {
  const { entityInfo, refreshAuth, isLoggedIn } = useAuth();
  const { campaigns, beneficiaries, creators, collections } = useNFTState();
  const [showURLErrorMsg, setShowURLErrorMsg] = React.useState(false);
  const [isMintClicked, setIsMintClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [beneficiary, setBeneficiary] = React.useState();
  const [campaign, setCampaign] = React.useState();
  const [collectionsList, setCollectionsList] = React.useState();
  const [campaignsList, setCampaignsList] = React.useState();
  const [creator, setCreator] = React.useState('');
  const [isCreatorExist, setIsCreatorExist] = React.useState(false);
  const [creatorPercentage, setCreatorPercentage] = React.useState();
  const [uploadedImageURL, setUploadedImage] = React.useState(null);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [selectedCollectionValue, setSelectedCollectionValue] = React.useState(
    {}
  );
  const [isCreateNewCollection, setIsCreateNewCollection] = React.useState();
  const [beneficiaryPercentage, setBeneficiaryPercentage] = React.useState();
  const [state, setState] = React.useState({
    inputs: {
      imageUrl: '',
      name: '',
      description: '',
      price: '',
      isForSale: false,
      category: '',
      currency: 'CSPR',
      beneficiaryPercentage: '',
      collection: '',
      isImageURL: false,
    },
  });

  const loadCollections = React.useCallback(async () => {
    if (entityInfo.publicKey && creators && collections) {
      const existingCreator = creators.find(
        ({ address }) => address === entityInfo.publicKey
      );
      existingCreator && setIsCreatorExist(true);
      existingCreator && setCreator(existingCreator.name);

      const _collections =
        // existingCreator &&
        collections.filter(({ creator }) => creator === entityInfo.publicKey);

      const selectedCollections =
        _collections &&
        _collections?.map((col) => ({
          value: col.id,
          label: <div>&nbsp;{col.name} </div>,
        }));

      selectedCollections && setCollectionsList(selectedCollections);
      selectedCollections && setSelectedCollectionValue(selectedCollections[0]);
    }
  }, [
    entityInfo.publicKey,
    creators,
    collections,
    setCollectionsList,
    setCreator,
    setIsCreatorExist,
    setSelectedCollectionValue,
  ]);

  React.useEffect(() => {
    beneficiaries && !beneficiary && setBeneficiary(beneficiaries[0].address);
    campaigns && !campaign && setCampaign(campaigns[0].id);
    !campaignsList && campaigns && setCampaignsList(campaigns);
    !collectionsList && collections && loadCollections();
  }, [
    collectionsList,
    collections,
    campaignsList,
    campaigns,
    beneficiaries,
    beneficiary,
    campaign,
    loadCollections,
    setBeneficiary,
    setCampaign,
    setCampaignsList,
  ]);

  //handling of adding new option to the existing collections in creatable select
  const handleCreate = (inputValue) => {
    setIsLoading(true);
    console.group('Option created');
    console.log('Wait a moment...');
    setTimeout(() => {
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      setIsLoading(false);
      setCollectionsList([...collections, newOption]);
      setSelectedCollectionValue(newOption);
      setIsCreateNewCollection(true);
    }, 1000);
  };

  const handleChange = (e, isBeneficiary = false) => {
    const { value, name, checked, type } = e.target;
    const { inputs } = state;

    if (isBeneficiary) {
      let selectedBeneficiary = beneficiaries.find(
        ({ address }) => address === value
      );
      const filteredCampaigns = campaignsList.filter(
        ({ wallet_address }) => selectedBeneficiary.address === wallet_address
      );
      setCampaignsList(filteredCampaigns);
    }

    inputs[name] = type === 'checkbox' ? checked : value;
    setState({
      ...state,
      inputs,
    });
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

  //handling minting new NFT
  async function mintNFT() {
    if (!uploadedImageURL) {
      return VIToast.error('Please upload image or enter direct URL');
    }
    if (!entityInfo.publicKey) {
      return VIToast.error('Please enter sign in First');
    }
    if (state.inputs.isImageURL && showURLErrorMsg) {
      return;
    }
    setIsMintClicked(true);
    let cloudURL = uploadedImageURL;
    if (!state.inputs.isImageURL && uploadedFile) {
      console.log('Img', uploadedFile);
      console.log('Img url', uploadedImageURL);

      try {
        cloudURL = await uploadImg(uploadedFile);
      } catch (err) {
        console.log(err);
        VIToast.error("Image couldn't be uploaded to cloud CDN !");

        return;
      }
      VIToast.success('Image uploaded to cloud CDN successfully !');
    }
    mintNewNFT(cloudURL);
  }

  async function mintNewNFT(imgURL) {
    if (!uploadedImageURL) {
      return VIToast.error('Please upload image or enter direct URL');
    }

    if (entityInfo.publicKey) {
      let mintDeployHash;

      try {
        mintDeployHash = await mint(entityInfo.publicKey, creator, {
          title: state.inputs.name,
          description: state.inputs.description,
          image: imgURL,
          price: state.inputs.price,
          isForSale: state.inputs.isForSale,
          campaign: campaign || '',
          currency: state.inputs.currency,
          collection: isCreateNewCollection ? 0 : selectedCollectionValue.value,
          collectionName: isCreateNewCollection
            ? selectedCollectionValue.label
            : '',
          creator: entityInfo.publicKey,
          creatorPercentage: creatorPercentage
            ? creatorPercentage.toString()
            : '',
          beneficiary: beneficiary || '',
          beneficiaryPercentage: beneficiaryPercentage
            ? beneficiaryPercentage
            : '',
        });
      } catch (err) {
        if (err.message.includes('User Cancelled')) {
        }
        return;
      }

      try {
        const deployResult = await getDeployDetails(mintDeployHash);
        if (campaign !== '' && campaign !== null) {
          localStorage.setItem('selectedCampaign', campaign);
        } else {
          localStorage.setItem('selectedCampaign', null);
        }
        console.log('...... Token minted successfully', deployResult);
        VIToast.success('NFT minted successfully');
        window.location.reload();
        setIsMintClicked(false);
      } catch (err) {
        console.log(err);
        //   setErrStage(MintingStages.TX_PENDING);
        VIToast.error(err);
      }

      setState({
        inputs: {
          title: '',
          description: '',
          price: '',
          isForSale: false,
          category: '',
          currency: '',
          beneficiaryPercentage: '',
          isImageURL: false,
        },
      });
      refreshAuth();
    }
  }

  const setCampaignSelectedData = (allCampaigns, value) => {
    setCampaign(value);
    let campaignPercentage = allCampaigns.filter((c) => c.id === value)[0]
      .requested_royalty;
    setCreatorPercentage(100 - campaignPercentage);
    setBeneficiaryPercentage(campaignPercentage);
  };

  const checkURLValidation = (value) => {
    if (validator.isURL(value)) {
      setShowURLErrorMsg(false);
    } else {
      setShowURLErrorMsg(true);
    }
  };

  return (
    <Layout>
      <div className='page-content bg-white'>
        {/* <!-- inner page banner --> */}
        <div
          className='dlab-bnr-inr overlay-primary bg-pt'
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <PageTitle motherMenu='Mint NFT' activeMenu='Mint NFT' />
        </div>
        {/* <!-- inner page banner END --> */}
        {/* <!-- contact area --> */}
        {!isLoggedIn ? (
          <PromptLogin />
        ) : (
          <div className='section-full content-inner shop-account'>
            {/* <!-- Product --> */}
            <div className='container'>
              <div>
                <div className=' m-auto m-b30'>
                  <Container>
                    <Row>
                      <Col>
                        <Row className='form-group'>
                          <Col>
                            <label>Select Beneficiary</label>
                            <select
                              name='beneficiary'
                              placeholder='Beneficiary'
                              className='form-control'
                              onChange={(e) => {
                                handleChange(e, true);
                                setBeneficiary(e.target.value);
                              }}
                              value={beneficiary}
                            >
                              {beneficiaries?.map(({ name, address }) => (
                                <option key={address} value={address}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </Col>
                        </Row>
                        <Row className='form-group'>
                          <Col>
                            <label>Select Campaign</label>
                            <select
                              name='campaign'
                              placeholder='Campaign'
                              className='form-control'
                              onChange={(e) =>
                                setCampaignSelectedData(
                                  campaigns,
                                  e.target.value
                                )
                              }
                              value={campaign}
                            >
                              {campaignsList?.map(
                                ({ name, id, requested_royalty }) => (
                                  <option key={id} value={id}>
                                    {name} (creator Percentage is{' '}
                                    {100 - requested_royalty})
                                  </option>
                                )
                              )}
                            </select>
                          </Col>
                        </Row>
                        <Row className='form-group'>
                          <Col>
                            <label>
                              Select Existing Collection or Create new one
                            </label>

                            <CreatableSelect
                              isClearable
                              isLoading={isLoading}
                              onChange={(v) => setSelectedCollectionValue(v)}
                              onCreateOption={(v) => handleCreate(v)}
                              options={collectionsList}
                              value={selectedCollectionValue}
                              menuPortalTarget={document.body}
                              placeholder='Select...'
                              className='creatable-select'
                              formatCreateLabel={(v) =>
                                'Click here to create "' + v + '" Collection'
                              }
                            />
                          </Col>
                        </Row>
                        <Row className='form-group'>
                          <Col>
                            <label>
                              Please enter your creator name the name can not be
                              changed
                            </label>
                            <input
                              type='text'
                              placeholder='Creator'
                              name='creator'
                              className='form-control'
                              onChange={(e) => setCreator(e.target.value)}
                              value={creator}
                              disabled={isCreatorExist}
                            />
                          </Col>
                        </Row>
                        <Row className='form-group'>
                          <Col>
                            <input
                              type='text'
                              placeholder='NFT Name'
                              name='name'
                              className='form-control'
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.name}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row className='form-group'>
                          <Col>
                            <Form.Check
                              type={'checkbox'}
                              id={'isImageURL'}
                              label={`Already hosted image, enter direct url ?`}
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.isImageURL}
                              name='isImageURL'
                            />
                          </Col>
                        </Row>
                        <Row className='form-group'>
                          <Col>
                            {state.inputs.isImageURL ? (
                              <>
                                {' '}
                                <input
                                  type='text'
                                  placeholder='Image URl'
                                  name='imageUrl'
                                  className='form-control'
                                  onChange={(e) => {
                                    setUploadedImage(e.target.value);
                                    checkURLValidation(e.target.value);
                                  }}
                                  value={uploadedImageURL || ''}
                                />
                                {showURLErrorMsg && (
                                  <span className='text-danger'>
                                    Please enter Valid URL{' '}
                                  </span>
                                )}
                              </>
                            ) : (
                              <ImageUploader
                                singleImage
                                withIcon={true}
                                buttonText='Choose image'
                                onChange={onDrop}
                                imgExtension={['.jpg', '.gif', '.png']}
                                maxFileSize={20209230}
                                withPreview={true}
                                label={
                                  'Max file size: 20mb, accepted: jpg|gif|png'
                                }
                              />
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className='form-group'>
                      <Col>
                        <Form.Check
                          type={'checkbox'}
                          id={'isForSale'}
                          label={`Is For Sale`}
                          onChange={(e) => handleChange(e)}
                          value={state.inputs.isForSale}
                          name='isForSale'
                        />
                      </Col>
                    </Row>
                    {state.inputs.isForSale && (
                      <>
                        <Row className='form-group'>
                          <Col>
                            <input
                              type='number'
                              placeholder='Price'
                              name='price'
                              className='form-control'
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.price}
                              min={0}
                            />
                          </Col>
                          <Col>
                            <select
                              placeholder='Currency'
                              name='currency'
                              className='form-control'
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.currency}
                            >
                              <option value={'CSPR'}>CSPR</option>
                            </select>
                          </Col>
                        </Row>
                      </>
                    )}
                    <Row className='form-group'>
                      <Col>
                        <textarea
                          rows={4}
                          name='description'
                          placeholder='NFT Description'
                          className='form-control'
                          onChange={(e) => handleChange(e)}
                          value={state.inputs.description}
                        ></textarea>
                      </Col>
                    </Row>
                    <Row className='form-group'>
                      <Col>
                        <p className='form-submit'>
                          <button
                            type='button'
                            className='btn btn-success'
                            name='submit'
                            onClick={mintNFT}
                            disabled={
                              beneficiary === '' ||
                              campaign === '' ||
                              selectedCollectionValue === {} ||
                              selectedCollectionValue === undefined ||
                              selectedCollectionValue === null ||
                              selectedCollectionValue?.value === '' ||
                              creator === '' ||
                              state.inputs.name === '' ||
                              (state.inputs.isForSale &&
                                state.inputs.price === '') ||
                              isMintClicked
                            }
                          >
                            {isMintClicked ? (
                              <Spinner animation='border' variant='light' />
                            ) : (
                              'Mint'
                            )}
                          </button>
                        </p>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </div>
            {/* <!-- Product END --> */}
          </div>
        )}

        {/* <!-- contact area  END --> */}
      </div>
    </Layout>
  );
};

export default MintNFT;
