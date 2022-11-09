import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';
import validator from 'validator';

import { useAuth } from '../../contexts/AuthContext';
import { getDeployDetails } from '../../api/universal';
import { createCampaign } from '../../api/createCampaign';

import {
  refreshCampaigns,
  refreshCollections,
  updateCampaigns,
  updateCollections,
  useNFTDispatch,
  useNFTState,
} from '../../contexts/NFTContext';
import ReactGA from 'react-ga';
import SDGsMultiSelect from './SDGsMultiSelect';
import { SDGsData } from '../../data/SDGsGoals/index';
import { isValidWallet } from '../../utils/contract-utils';
import { addCollection, updateCollection } from '../../api/addCollection';
import { sendDiscordMessage } from '../../utils/discordEvents';

//adding new campaign page
const AddEditCollectionForm = ({
  data = undefined,
  closeModal = undefined,
  isFromModal = false,
}) => {
  const { ...stateList } = useNFTState();
  const { collections } = stateList;
  const nftDispatch = useNFTDispatch();
  const { entityInfo } = useAuth();
  const [isSaveClicked, setIsSaveClicked] = React.useState(false);
  const [collectionInputs, setCollectionInputs] = React.useState({
    name: data ? data.name : '',
      description: data ? data.description : '',
      creator: data ? data.creator : '',
      url: data ? data.url : '',
  });
  const [showURLErrorMsg, setShowURLErrorMsg] = React.useState(false);

  const checkURLValidation = (value) => {
    if (validator.isURL(value)) {
      setShowURLErrorMsg(false);
    } else {
      setShowURLErrorMsg(true);
    }
  };

  //saving new collection function
  const addNewCollection = async () => {
    setIsSaveClicked(true);
    if (collectionInputs.url !== '' && showURLErrorMsg) {
      return;
    }
    try {
      const savedCollection = await addCollection(
        collectionInputs.name,
        collectionInputs.description,
        collectionInputs.url,
        entityInfo.publicKey,
        CLPublicKey.fromHex(entityInfo.publicKey)
      );

    const deployResult = await getDeployDetails(savedCollection);
    if(deployResult){
    console.log('...... Collection saved successfully', deployResult);
    ReactGA.event({
      category: 'Success',
      action: 'Add collection',
      label: `${entityInfo.publicKey}: added new collection ${collectionInputs.name}`,
    });
    await refreshCollections(nftDispatch, stateList);
    await sendDiscordMessage(
      process.env.REACT_APP_COLLECTIONS_WEBHOOK_ID,
      process.env.REACT_APP_COLLECTIONS_TOKEN,
      '',
      '',
      `Exciting news! [${collectionInputs.name}] Collection is just created. [Click here  to check more available collections.](${window.location.origin}/#/) @vinfts @casper_network @devxdao`
    );
      // await SendTweet(
      //   `${collectionInputs.creator} just added a new interesting #verified_impact_nfts collection. Click here ${window.location.origin}/#/ to see more interesting collections`
      // );
    VIToast.success('Collection saved successfully');
    setIsSaveClicked(false);
    isFromModal && closeModal();
    setCollectionInputs({
      name: '',
      description: '',
      creator: '',
      url: '',
    });
  }
  } catch (err) {
    if (err.message.includes('User Cancelled')) {
      VIToast.error('User Cancelled Signing');
      ReactGA.event({
        category: 'User Cancelation',
        action: 'Add collection',
        label: `${entityInfo.publicKey}: Cancelled Signing`,
      });
    } else {
      VIToast.error('Error happened please try again later');
      ReactGA.event({
        category: 'Error',
        action: 'Add collection',
        label: `${entityInfo.publicKey}: ${err.message}`,
      });
    }
    setIsSaveClicked(false);
  }
  };

  const editCollection = async () => {
    setIsSaveClicked(true);
    const savedCollection = await updateCollection(
      data.id,
      collectionInputs.name,
      collectionInputs.description,
      collectionInputs.url,
      entityInfo.publicKey,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );
    const deployResult = await getDeployDetails(savedCollection);
    if(deployResult){
      const changedCollection = {
        name:  collectionInputs.name,
        description:  collectionInputs.description ,
        creator: collectionInputs.creator ,
        url:  collectionInputs.url ,
        id:data.id,
        token_ids:"0"
      };
    await updateCollections(nftDispatch, stateList, changedCollection);
    }
    console.log('...... Collection saved successfully', deployResult);
    VIToast.success('Collection saved successfully');
    await refreshCollections(nftDispatch, stateList);
    setIsSaveClicked(false);
    isFromModal && closeModal();
  }
  return (
    <div className='section-full content-inner shop-account'>
    {/* <!-- Product --> */}
    <div className='container'>
      <div>
        <div className=' m-auto m-b30'>
          {/* {data.id == '0' ||
          (data.id != '0' && selectedCollection) ? ( */}
          <Container>
            <Row>
              <Col>
                <div className='required-field'>
                  <input
                    type='text'
                    name='name'
                    placeholder='Name'
                    className='form-control'
                    value={collectionInputs.name}
                    onChange={(e) =>
                      setCollectionInputs({
                        ...collectionInputs,
                        name: e.target.value,
                      })
                    }
                  />{' '}
                  <span className='text-danger required-field-symbol'>
                    *
                  </span>
                </div>
              </Col>
              <Col>
                <input
                  type='text'
                  placeholder='URL'
                  name='url'
                  className='form-control'
                  value={collectionInputs.url}
                  onChange={(e) => {
                    setCollectionInputs({
                      ...collectionInputs,
                      url: e.target.value,
                    });
                    checkURLValidation(e.target.value);
                  }}
                />
                {showURLErrorMsg && (
                  <span className='text-danger'>
                    Please enter Valid URL
                  </span>
                )}
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col>
                <textarea
                  rows={4}
                  name='description'
                  placeholder='Description'
                  className='form-control'
                  value={collectionInputs.description}
                  onChange={(e) =>
                    setCollectionInputs({
                      ...collectionInputs,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col>
                <button
                  className='btn btn-success'
                  name='submit'
                  onClick={
                  data==undefined || data?.id === '0' || data?.id === null
                      ? addNewCollection
                      : editCollection
                  }
                  disabled={
                    collectionInputs.name == '' || isSaveClicked
                  }
                >
                  {isSaveClicked ? (
                    <Spinner animation='border' variant='light' />
                  ) : data==undefined ||data?.id === '0' ||
                    data?.id === null ? (
                    'Add'
                  ) : (
                    'Edit'
                  )}
                </button>
              </Col>
            </Row>
          </Container>
          {/* ) : (
            <div className='vinft-section-loader'>
              <div className='vinft-spinner-body'>
                <Spinner animation='border' variant='success' />
                <p>Fetching Collection Detail Please wait...</p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
    {/* <!-- Product END --> */}
  </div>
  );
};

export default AddEditCollectionForm;
