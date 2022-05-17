import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import ImageUploader from 'react-images-upload';
import { toast as VIToast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';

import { useAuth } from '../../../contexts/AuthContext';
import { getBeneficiariesCampaignsList } from '../../../api/beneficiaryInfo';
import { uploadImg } from '../../../api/imageCDN';
import { mint } from '../../../api/mint';
import { getDeployDetails } from '../../../api/universal';
import { numberOfNFTsOwned } from '../../../api/userInfo';

import Header from '../../Layout/Header1';
import Footer from '../../Layout/Footer1';
import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';

const MintNFT = () => {
  const { entityInfo, refreshAuth } = useAuth();
  const [image, setImage] = useState([]);
  const [collectionState, setCollectionState] = useState(1);
  const [uploadedImageURL, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadingToCloud, setUploadingToCloud] = useState(false);
  const [validID, setValidID] = useState(false);
  const [selectedCollectionValue, setSelectedCollectionValue] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [beneficiary, setBeneficiary] = useState();
  const [campaign, setCampaign] = useState();

  let selectedOptions = [];
  const [options, setOptions] = useState(selectedOptions);

  //handling of creating new option in creatable select control
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

  //handling of adding new option to the existing options in creatable select
  const handleCreate = (inputValue) => {
    setIsLoading(true);
    console.group('Option created');
    console.log('Wait a moment...');
    setTimeout(() => {
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      setIsLoading(false);
      setOptions([...options, newOption]);
      setSelectedCollectionValue(newOption);
    }, 1000);
  };

  const handleChange = (e, isBeneficiary = false) => {
    const { value, name, checked, type } = e.target;
    const { inputs } = state;
    if (isBeneficiary) {
      let selectedBeneficiary = beneficiaries.filter(
        (b) => b.address === value
      );
      setCampaigns(selectedBeneficiary[0].campaigns);
    }
    inputs[name] = type === 'checkbox' ? checked : value;
    setState({
      ...state,
      inputs,
    });
  };

  //intialize of controls values
  const [state, setState] = useState({
    inputs: {
      imageUrl: '',
      name: '',
      description: '',
      price: '',
      isForSale: false,
      category: '',
      currency: '',
      creator: '',
      creatorPercentage: '',
      beneficiaryPercentage: '',
      collection: '',
      isImageURL: false,
    },
  });
  const [beneficiaries, setBeneficiaries] = useState();
  const [campaigns, setCampaigns] = React.useState();

  //getting beneficiaries and campaigns lists
  useEffect(() => {
    (async () => {
      let beneficiaryList =
        !beneficiaries && (await getBeneficiariesCampaignsList());
      !beneficiaries && setBeneficiaries(beneficiaryList);
      !beneficiaries && setCampaigns(beneficiaryList[0]?.campaigns);
      !beneficiaries &&setBeneficiary(beneficiaryList[0].address)
      !beneficiaries &&setCampaign(beneficiaryList[0]?.campaigns[0]?.id)
    })();
  }, [beneficiaries]);

  //handling of selecting image in image control
  const onDrop = (picture) => {
    const newImageUrl = URL.createObjectURL(picture[0]);
    setImage(newImageUrl);
    setUploadedFile(picture[0]);
  };

  //handling minting new NFT
  async function mintNFT() {
    if (!uploadedImageURL) {
      return VIToast.error('Please upload image or enter direct URL');
    }
    if (!validID) {
      return VIToast.error('Please enter an id that is not already occupied');
    }

    let cloudURL = uploadedImageURL;
    if (!state.inputs.imgURL && uploadedFile) {
      console.log('Img', uploadedFile);
      console.log('Img url', uploadedImageURL);
      setUploadingToCloud(true);
      try {
        cloudURL = await uploadImg(uploadedFile);
      } catch (err) {
        console.log(err);
        VIToast.error("Image couldn't be uploaded to cloud CDN !");
        setUploadingToCloud(false);
        return;
      }
      VIToast.success('Image uploaded to cloud CDN successfully !');
      setUploadingToCloud(false);
    }
    mintNewNFT(cloudURL);
  }

  async function mintNewNFT(imgURL) {
    if (!uploadedImageURL) {
      return VIToast.error('Please upload image or enter direct URL');
    }

    if (entityInfo.publicKey) {
      console.log('Your pub key: ', entityInfo.publicKey);

      // setMintStage(MintingStages.STARTED);

      let mintDeployHash;

      try {
        mintDeployHash = await mint(CLPublicKey.fromHex(entityInfo.publicKey), {
          title: state.inputs.name,
          description: state.inputs.description,
          image: imgURL,
          price: state.inputs.price,
          isForSale: state.inputs.isForSale,
          campaign: campaign,
          category: state.inputs.category,
          currency: state.inputs.currency,
          collectionName: selectedCollectionValue.value,
          creator: state.inputs.creator,
          creatorPercentage: state.inputs.creatorPercentage,
          beneficiary: beneficiary,
          beneficiaryPercentage: state.inputs.beneficiaryPercentage,
        });
      } catch (err) {
        if (err.message.includes('User Cancelled')) {
          // setErrStage(MintingStages.STARTED);
        }
        return;
      }

      //setMintStage(MintingStages.TX_PENDING);

      try {
        const deployResult = await getDeployDetails(mintDeployHash);
        console.log('...... Token minted successfully', deployResult);
      } catch (err) {
        //   setErrStage(MintingStages.TX_PENDING);
      }
      //  setMintStage(MintingStages.TX_SUCCESS);
      setState({
        inputs: {
          title: '',
          description: '',
          price: '',
          isForSale: false,
          category: '',
          currency: '',
          creator: '',
          creatorPercentage: '',
          beneficiaryPercentage: '',
          isImageURL: false,
        },
      });
      refreshAuth();

      const newBalance = await numberOfNFTsOwned(entityInfo.publicKey);
      console.log('...... No. of NFTs in your account: ', newBalance);
    }
  }

  return (
    <>
      <Header />

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
                            onChange={(e) => {handleChange(e, true);setBeneficiary(e.target.value)}}
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
                            onChange={(e) =>setCampaign(e.target.value)}
                            value={campaign}
                          >
                            {campaigns?.map(({ name, id }) => (
                              <option key={id} value={id}> {name}</option>
                            ))}
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
                            options={options}
                            value={selectedCollectionValue}
                            menuPortalTarget={document.body}
                            placeholder='Select...'
                            className='creatable-select'
                          />
                        </Col>
                      </Row>
                      <Row className='form-group'>
                        <Col>
                          <input
                            type='text'
                            placeholder='Creator'
                            name='creator'
                            className='form-control'
                            onChange={(e) => handleChange(e)}
                            value={state.inputs.creator}
                          />
                        </Col>
                      </Row>
                      <Row className='form-group'>
                        <Col>
                          <input
                            type='text'
                            placeholder='Name'
                            name='name'
                            className='form-control'
                            onChange={(e) => handleChange(e)}
                            value={state.inputs.name}
                          />
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
                            <input
                              type='text'
                              placeholder='Image URl'
                              name='imageUrl'
                              className='form-control'
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.imageUrl}
                            />
                          ) : (
                            <ImageUploader
                              singleImage
                              withIcon={true}
                              buttonText='Choose images'
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
                      <textarea
                        rows={4}
                        name='description'
                        placeholder='Description'
                        className='form-control'
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.description}
                      ></textarea>
                    </Col>
                  </Row>
                  <Row className='form-group'>
                    <Col>
                      <p className='form-submit'>
                        <input
                          type='button'
                          value='Mint'
                          className='btn btn-success'
                          name='submit'
                          onClick={mintNFT}
                          disabled={
                            beneficiary === '' ||
                            campaign === '' ||
                            selectedCollectionValue.value === '' ||
                            state.inputs.creator === '' ||
                            state.inputs.name === ''
                          }
                        />
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </div>
          {/* <!-- Product END --> */}
        </div>

        {/* <!-- contact area  END --> */}
      </div>

      <Footer />
    </>
  );
};

export default MintNFT;
