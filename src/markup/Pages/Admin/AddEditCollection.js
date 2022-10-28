import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';
import { CLPublicKey } from 'casper-js-sdk';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import validator from 'validator';

import { getDeployDetails } from '../../../api/universal';
import { addCollection, updateCollection } from '../../../api/addCollection';
import { useAuth } from '../../../contexts/AuthContext';
import PromptLogin from '../PromptLogin';
import { refreshCollections, updateCollections, useNFTDispatch, useNFTState } from '../../../contexts/NFTContext';

import Layout from '../../Layout';
import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { sendDiscordMessage } from '../../../utils/discordEvents';
import { SendTweet } from '../../../utils/VINFTsTweets';
import ReactGA from 'react-ga';

//add new beneficiary page
const AddCollection = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const collectionId = queryParams.get('id');
  const { ...stateList } = useNFTState();
  const { collections } = stateList;
  const nftDispatch = useNFTDispatch();

  const [isSaveClicked, setIsSaveClicked] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState();
  const [collectionInputs, setCollectionInputs] = React.useState({
    name: '',
    description: '',
    creator: '',
    url: '',
  });
  const [showURLErrorMsg, setShowURLErrorMsg] = React.useState(false);

  const getSelectedCollection = React.useCallback(async () => {
    const collectionData =
      collections && collections.find(({ id }) => id === collectionId);
    collections && setSelectedCollection(collectionData);
    setCollectionInputs({
      name: collectionData ? collectionData.name : '',
      description: collectionData ? collectionData.description : '',
      creator: collectionData ? collectionData.creator : '',
      url: collectionData ? collectionData.url : '',
    });
  }, [collections, collectionId]);

  //getting list of NFTs
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname +"/add-collection");
    if (collectionId !== '0' && collectionId !== null) {
      getSelectedCollection();
    } else {
      setSelectedCollection(true);
    }
  }, [collectionId, getSelectedCollection]);

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
    await SendTweet(
      `${collectionInputs.name} just added a new interesting #verified_impact_nfts collection. Click here ${window.location.origin}/#/ to see more interesting collections`
    );
    VIToast.success('Collection saved successfully');
    setIsSaveClicked(false);
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
      collectionId,
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
        id:collectionId,
        token_ids:"0"
      };
    await updateCollections(nftDispatch, stateList, changedCollection);
    }
    console.log('...... Collection saved successfully', deployResult);
    VIToast.success('Collection saved successfully');
    await refreshCollections(nftDispatch, stateList);
    setIsSaveClicked(false);
  }

  return (
    <>
      <Layout>
        <div className='page-content bg-white'>
          {/* <!-- inner page banner --> */}
          <div
            className='dlab-bnr-inr overlay-primary bg-pt'
            style={{ backgroundImage: 'url(' + bnr1 + ')' }}
          >
            <PageTitle
              motherMenu={`${
                collectionId !== '0' && collectionId !== null ? 'Edit' : 'Add'
              } Collection`}
              activeMenu={`${
                collectionId !== '0' && collectionId !== null ? 'Edit' : 'Add'
              } Collection`}
            />
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
                    {/* {collectionId == '0' ||
                    (collectionId != '0' && selectedCollection) ? ( */}
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
                              collectionId === '0' || collectionId === null
                                ? addNewCollection
                                : editCollection
                            }
                            disabled={
                              collectionInputs.name == '' || isSaveClicked
                            }
                          >
                            {isSaveClicked ? (
                              <Spinner animation='border' variant='light' />
                            ) : collectionId === '0' ||
                              collectionId === null ? (
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
          )}
          {/* <!-- contact area  END --> */}
        </div>
      </Layout>
    </>
  );
};

export default AddCollection;
