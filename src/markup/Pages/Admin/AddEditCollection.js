import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';
import { CLPublicKey } from 'casper-js-sdk';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import { getDeployDetails } from '../../../api/universal';
import { addCollection, updateCollection } from '../../../api/addCollection';
import { useAuth } from '../../../contexts/AuthContext';
import PromptLogin from '../PromptLogin';
import { useNFTState } from '../../../contexts/NFTContext';

import Layout from '../../Layout';
import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { sendDiscordMessage } from '../../../utils/discordEvents';
import { SendTweet } from '../../../utils/VINFTsTweets';

//add new beneficiary page
const AddCollection = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const collectionId = queryParams.get('id');
  const { collections } = useNFTState();

  const [isSaveClicked, setIsSaveClicked] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState();
  const [collectionInputs, setCollectionInputs] = React.useState({
    name: '',
    description: '',
    creator: '',
    url: '',
  });

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
    if (collectionId !== '0') {
      getSelectedCollection();
    } else {
      setSelectedCollection(true);
    }
  }, [collectionId, getSelectedCollection]);

  //saving new collection function
  const addNewCollection = async () => {
    setIsSaveClicked(true);
    const savedCollection = await addCollection(
      collectionInputs.name,
      collectionInputs.description,
      collectionInputs.url,
      entityInfo.publicKey,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );

    const deployResult = await getDeployDetails(savedCollection);
    console.log('...... Collection saved successfully', deployResult);
    await sendDiscordMessage(
      process.env.REACT_APP_COLLECTIONS_WEBHOOK_ID,
      process.env.REACT_APP_COLLECTIONS_TOKEN,
      '',
      '',
      `Exciting news! [${collectionInputs.name}] Collection is just created. [Click here  to check more available collections.](${window.location.origin}/#/)`
    );
    await SendTweet(
      `${collectionInputs.name} just added a new interesting #verified_impact_nfts collection. Click here ${window.location.origin}/#/ to see more interesting collections`
    );
    VIToast.success('Collection saved successfully');
    setIsSaveClicked(false);
    window.location.reload();
    setCollectionInputs({
      name: '',
      description: '',
      creator: '',
      url: '',
    });
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
    console.log('...... Collection saved successfully', deployResult);
    VIToast.success('Collection saved successfully');
    setIsSaveClicked(false);
    window.location.reload();
  };

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
              motherMenu={`${collectionId !== '0' ? 'Edit' : 'Add'} Collection`}
              activeMenu={`${collectionId !== '0' ? 'Edit' : 'Add'} Collection`}
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
                          />
                        </Col>
                        <Col>
                          <input
                            type='text'
                            placeholder='URL'
                            name='url'
                            className='form-control'
                            value={collectionInputs.url}
                            onChange={(e) =>
                              setCollectionInputs({
                                ...collectionInputs,
                                url: e.target.value,
                              })
                            }
                          />
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
                          {' '}
                          <p className='form-submit'>
                            <button
                              className='btn btn-success'
                              name='submit'
                              onClick={
                                collectionId === '0'
                                  ? addNewCollection
                                  : editCollection
                              }
                            >
                              {isSaveClicked ? (
                                <Spinner animation='border' variant='light' />
                              ) : collectionId === '0' ? (
                                'Add'
                              ) : (
                                'Edit'
                              )}
                            </button>
                          </p>
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
