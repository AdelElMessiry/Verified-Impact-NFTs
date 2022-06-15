import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';
import { CLPublicKey } from 'casper-js-sdk';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import { getDeployDetails } from '../../../api/universal';
import { addCollection, updateCollection } from '../../../api/addCollection';
import { useAuth } from '../../../contexts/AuthContext';
import PromptLogin from '../PromptLogin';

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
  const id = queryParams.get('id');
  debugger;
  const [isSaveClicked, setIsSaveClicked] = React.useState(false);
  const [collectionInputs, setCollectionInputs] = React.useState({
    name: '',
    description: '',
    address: '',
  });

  //saving new collection function
  const addNewCollection = async () => {
    const savedBeneficiary = await addCollection(
      collectionInputs.name,
      collectionInputs.description,
      collectionInputs.address,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );

    const deployResult = await getDeployDetails(savedBeneficiary);
    console.log('...... Beneficiary saved successfully', deployResult);
    VIToast.success('Beneficiary saved successfully');
    sendDiscordMessage(
      process.env.REACT_APP_BENEFICIARIES_WEBHOOK_ID,
      process.env.REACT_APP_BENEFICIARIES_TOKEN,
      collectionInputs.name,
      '',
      `Great news! [${collectionInputs.name}] beneficiary has been added to #verified-impact-nfts click here to know more about their cause.`
    );
    SendTweet(
      `Great news! ${collectionInputs.name} beneficiary has been added to #verified_impact_nfts click here ${window.location.origin}/#/ to know more about their cause.`
    );
    setCollectionInputs({
      name: '',
      description: '',
      address: '',
    });
  };

  const editCollection = async () => {
    const savedBeneficiary = await updateCollection(
      collectionInputs.name,
      collectionInputs.description,
      collectionInputs.address,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );

    const deployResult = await getDeployDetails(savedBeneficiary);
    console.log('...... Beneficiary saved successfully', deployResult);
    VIToast.success('Beneficiary saved successfully');
    sendDiscordMessage(
      process.env.REACT_APP_BENEFICIARIES_WEBHOOK_ID,
      process.env.REACT_APP_BENEFICIARIES_TOKEN,
      collectionInputs.name,
      '',
      `Great news! [${collectionInputs.name}] beneficiary has been added to #verified-impact-nfts click here to know more about their cause.`
    );
    SendTweet(
      `Great news! ${collectionInputs.name} beneficiary has been added to #verified_impact_nfts click here ${window.location.origin}/#/ to know more about their cause.`
    );
    setCollectionInputs({
      name: '',
      description: '',
      address: '',
    });
  };

  return (
    <>
      <Layout>
        <div className="page-content bg-white">
          {/* <!-- inner page banner --> */}
          <div
            className="dlab-bnr-inr overlay-primary bg-pt"
            style={{ backgroundImage: 'url(' + bnr1 + ')' }}
          >
            <PageTitle
              motherMenu={`${id ? 'Edit' : 'Add'} Collection`}
              activeMenu={`${id ? 'Edit' : 'Add'} Collection`}
            />
          </div>
          {/* <!-- inner page banner END --> */}
          {/* <!-- contact area --> */}
          {!isLoggedIn ? (
            <PromptLogin />
          ) : (
            <div className="section-full content-inner shop-account">
              {/* <!-- Product --> */}
              <div className="container">
                <div>
                  <div className=" m-auto m-b30">
                    <Container>
                      <Row>
                        <Col>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="form-control"
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
                            type="text"
                            placeholder="Address"
                            name="address"
                            className="form-control"
                            value={collectionInputs.address}
                            onChange={(e) =>
                              setCollectionInputs({
                                ...collectionInputs,
                                address: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col>
                          <textarea
                            rows={4}
                            name="description"
                            placeholder="Description"
                            className="form-control"
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
                      <Row className="mt-4">
                        <Col>
                          {' '}
                          <p className="form-submit">
                            <button
                              className="btn btn-success"
                              name="submit"
                              onClick={id == '0'?addNewCollection:editCollection}
                            >
                              {isSaveClicked ? (
                                <Spinner animation="border" variant="light" />
                              ) : id == '0' ? (
                                'Add'
                              ) : (
                                'Edit'
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
    </>
  );
};

export default AddCollection;
