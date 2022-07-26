import React, { useEffect } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';
import { toast as VIToast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import validator from 'validator';

import { useAuth } from '../../../contexts/AuthContext';
import { useNFTState } from '../../../contexts/NFTContext';

import { uploadImg } from '../../../api/imageCDN';
import { mint } from '../../../api/mint';
import { getDeployDetails } from '../../../api/universal';
import { profileClient } from '../../../api/profileInfo';

import PageTitle from '../../Layout/PageTitle';
import PromptLogin from '../PromptLogin';
import Layout from '../../Layout';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { sendDiscordMessage } from '../../../utils/discordEvents';
import { SendTweet, SendTweetWithImage } from '../../../utils/VINFTsTweets';
import { CLPublicKey } from 'casper-js-sdk';

//handling of creating new option in creatable select control
const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

//minting new nft page
const MintNFT = () => {
  const { entityInfo, refreshAuth, isLoggedIn } = useAuth();
  const { campaigns, beneficiaries, collections } = useNFTState();
  let storageData = localStorage.getItem('selectedData');
  let savedData = storageData ? JSON.parse(storageData) : null;
  const [showURLErrorMsg, setShowURLErrorMsg] = React.useState(false);
  const [isMintClicked, setIsMintClicked] = React.useState(false);
  const [isMintAnotherClicked, setIsMintAnotherClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [beneficiary, setBeneficiary] = React.useState(
    savedData ? savedData.beneficiary : undefined
  );
  const [campaign, setCampaign] = React.useState(
    savedData ? savedData.campaign : undefined
  );
  const [collectionsList, setCollectionsList] = React.useState();
  const [campaignsList, setCampaignsList] = React.useState();
  const [allCampaignsList, setAllCampaignsList] = React.useState();
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
  const [beneficiariesList, setBeneficiariesList] = React.useState();
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
    if (entityInfo.publicKey) {
      let userProfiles = await profileClient.getProfile(entityInfo.publicKey);
      if (userProfiles) {
        if (userProfiles.err === 'Address Not Found') {
          setCreator(null);
          setIsCreatorExist(false);
          setCollectionsList();
        } else {
          let list = Object.values(userProfiles)[0];

          userProfiles && setCreator(list.creator.username);
          userProfiles && setIsCreatorExist(true);
          if (list?.creator?.address !== '') {
            const _collections =
              // existingCreator &&
              collections &&
              collections.filter(
                ({ creator }) => creator === entityInfo.publicKey
              );

            const selectedCollections =
              _collections &&
              _collections?.map((col) => ({
                value: col.id,
                label: col.name,
              }));

            selectedCollections && setCollectionsList(selectedCollections);
            selectedCollections &&
              setSelectedCollectionValue(
                savedData ? savedData.collection : selectedCollections[0]
              );
          } else {
            setCollectionsList();
          }
        }
      }
    }
  }, [
    entityInfo.publicKey,
    collections,
    setCollectionsList,
    setCreator,
    setIsCreatorExist,
    setSelectedCollectionValue,
  ]);
  React.useEffect(() => {
    beneficiaries?.length &&
      !beneficiary &&
      setBeneficiary(
        beneficiaries?.filter(({ approved }) => approved === 'true')[0]?.address
      );
    campaigns?.length &&
      !campaign &&
      setCampaign(savedData ? savedData.campaign : campaigns[0]?.id);
    !campaignsList &&
      campaigns?.length &&
      setCampaignsList(
        campaigns.filter(
          ({ wallet_address }) =>
            (savedData
              ? savedData.beneficiary
              : beneficiaries?.filter(({ approved }) => approved === 'true')[0]
                  ?.address) === wallet_address
        )
      );
    !campaignsList && campaigns?.length && setAllCampaignsList(campaigns);
    !campaignsList &&
      campaigns?.length &&
      setCampaignSelectedData(
        campaigns,
        savedData ? savedData.campaign : campaigns[0]?.id
      );
  }, [
    campaignsList,
    campaigns,
    beneficiaries,
    beneficiary,
    campaign,
    setBeneficiary,
    setCampaign,
    setCampaignsList,
  ]);

  React.useEffect(() => {
    !collectionsList && loadCollections();
  }, [collectionsList, collections, loadCollections]);

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
      let selectedBeneficiary = beneficiaries
        ?.filter(({ approved }) => approved === 'true')
        .find(({ address }) => address === value);
      const filteredCampaigns = allCampaignsList?.filter(
        ({ wallet_address }) => selectedBeneficiary.address === wallet_address
      );
      setCampaignsList(filteredCampaigns);
      filteredCampaigns?.length > 0 &&
        setCampaignSelectedData(filteredCampaigns, filteredCampaigns[0].id);
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
  async function mintNFT(isAnotherMint) {
    if (!uploadedImageURL) {
      return VIToast.error('Please upload image or enter direct URL');
    }
    if (!entityInfo.publicKey) {
      return VIToast.error('Please enter sign in First');
    }
    if (state.inputs.isImageURL && showURLErrorMsg) {
      return;
    }
    isAnotherMint?setIsMintAnotherClicked(true): setIsMintClicked(true);
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
    mintNewNFT(cloudURL, isAnotherMint);
  }

  async function mintNewNFT(imgURL, isAnotherMint) {
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
          price: state.inputs.price || '0',
          isForSale: !!state.inputs.isForSale,
          campaign: campaign || '',
          currency: state.inputs.currency,
          collection: isCreateNewCollection
            ? '0'
            : selectedCollectionValue.value,
          collectionName: isCreateNewCollection
            ? selectedCollectionValue.label
            : '',
          creator: entityInfo.publicKey,
          creatorPercentage: creatorPercentage?.toString()
            ? creatorPercentage.toString()
            : '',
          beneficiary: beneficiary || '',
          beneficiaryPercentage: beneficiaryPercentage
            ? beneficiaryPercentage
            : '',
        });
      } catch (err) {
        if (err.message.includes('User Cancelled')) {
          VIToast.error('User Cancelled Signing');
        } else {
          VIToast.error(err.message);
        }
        setIsMintClicked(false);
        setIsMintAnotherClicked(false);
        return;
      }

      try {
        const deployResult = await getDeployDetails(mintDeployHash);
        if (
          campaign !== '' &&
          campaign !== null &&
          beneficiary !== '' &&
          beneficiary !== null &&
          selectedCollectionValue !== '' &&
          selectedCollectionValue !== null &&
          isAnotherMint
        ) {
          localStorage.setItem(
            'selectedData',
            JSON.stringify({
              campaign: campaign,
              beneficiary: beneficiary,
              collection: {
                value: selectedCollectionValue.value,
                label: selectedCollectionValue.label,
              },
            })
          );
        } else {
          localStorage.setItem('selectedData', null);
        }
       console.log('...... Token minted successfully', deployResult);

        VIToast.success('NFT minted successfully');
        //NOTE: every channel has a special keys and tokens sorted on .env file
        sendDiscordMessage(
          process.env.REACT_APP_NFT_WEBHOOK_ID,
          process.env.REACT_APP_NFT_TOKEN,
          state.name,
          '',
          `Great news! [${state.inputs.name}] NFT  has been added to #verified-impact-nfts [click here to know more about their cause.](${window.location.origin}/#/)`
        );
        SendTweetWithImage(
          imgURL,
          `Great news! "${state.inputs.name}" NFT  has been added to #verified_impact_nfts click here ${window.location.origin}/#/ to know more about their cause.`
        );
        if (isCreateNewCollection) {
          //add collection discord
          sendDiscordMessage(
            process.env.REACT_APP_COLLECTIONS_WEBHOOK_ID,
            process.env.REACT_APP_COLLECTIONS_TOKEN,
            selectedCollectionValue.value,
            '',
            `${creator} creator has just added a new interesting #verified-impact-nfts collection. [Click here to see more interesting collections](${window.location.origin}/#/)`
          );
          SendTweet(
            `${creator} creator has just added a new interesting #verified_impact_nfts collection. Click here ${window.location.origin}/#/ to see more interesting collections`
          );
        }
        if (!isCreatorExist) {
          //add creator discord
          sendDiscordMessage(
            process.env.REACT_APP_CREATORS_WEBHOOK_ID,
            process.env.REACT_APP_CREATORS_TOKEN,
            creator,
            '',
            `We are glad to announce that ${creator} creator has joined #verified-impact-nfts and minted a striking NFT for donations. [Click here to see more about creators and their NFTs collections.](${window.location.origin}/#/) `
          );
          SendTweet(
            `We are glad to announce that ${creator} creator has joined #verified_impact_nfts and minted a striking NFT for donations. Click here ${window.location.origin}/#/ to see more about creators and their NFTs collections `
          );
        }
        window.location.reload();
        setIsMintClicked(false);
        setIsMintAnotherClicked(false);
      } catch (err) {
        console.log(err);
        //   setErrStage(MintingStages.TX_PENDING);
        VIToast.error(err);
        setIsMintClicked(false);
        setIsMintAnotherClicked(false);
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
                              {beneficiaries
                                ?.filter(({ approved }) => approved == 'true')
                                .map(({ username, address }) => (
                                  <option key={address} value={address}>
                                    {username}
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
                            className='btn btn-success mr-2'
                            name='submit'
                            onClick={() => mintNFT(false)}
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
                              isMintClicked ||
                              isMintAnotherClicked
                            }
                          >
                            {isMintClicked ? (
                              <Spinner animation='border' variant='light' />
                            ) : (
                              'Mint'
                            )}
                          </button>
                          <button
                            type='button'
                            className='btn btn-success'
                            name='submit'
                            onClick={() => mintNFT(true)}
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
                              isMintAnotherClicked||
                              isMintClicked
                            }
                          >
                            {isMintAnotherClicked ? (
                              <Spinner animation='border' variant='light' />
                            ) : (
                              'Mint another NFT'
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
