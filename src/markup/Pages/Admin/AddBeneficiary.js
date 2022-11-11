import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';
import { CLPublicKey } from 'casper-js-sdk';

import { getDeployDetails } from '../../../api/universal';
import { addBeneficiary } from '../../../api/addBeneficiary';
import { useAuth } from '../../../contexts/AuthContext';
import PromptLogin from '../PromptLogin';

import Layout from '../../Layout';
import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { sendDiscordMessage } from '../../../utils/discordEvents';
import { SendTweet } from '../../../utils/VINFTsTweets';
import ReactGA from 'react-ga';
import { SDGsData } from '../../../data/SDGsGoals/index';
import SDGsMultiSelect from '../../Element/SDGsMultiSelect';
import { isValidWallet } from '../../../utils/contract-utils';
import { refreshBeneficiaries, useNFTDispatch, useNFTState} from '../../../contexts/NFTContext';

//add new beneficiary page
const AddBeneficiary = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const { ...stateList } = useNFTState();
  const nftDispatch = useNFTDispatch();

  const [beneficiaryInputs, setBeneficiaryInputs] = React.useState({
    name: '',
    description: '',
    address: '',
    SDGsGoals: [SDGsData[18].value],
  });
  
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname + '/admin_beneficiary');
  }, []);
  const [isButtonClicked, setIsButtonClicked] = React.useState(false);
  const [isClearSDGs, setIsClearSDGs] = React.useState(false);
  
  // },[])
  //saving new beneficiary function
  const saveBeneficiary = async () => {
    setIsButtonClicked(true);
    try {
      const savedBeneficiary = await addBeneficiary(
        beneficiaryInputs.name,
        beneficiaryInputs.description,
        CLPublicKey.fromHex(beneficiaryInputs.address).toAccountHashStr().slice(13),
        beneficiaryInputs.address,
        beneficiaryInputs.SDGsGoals.map(str => {
          return Number(str);
        }),
        CLPublicKey.fromHex(entityInfo.publicKey)
      );
      const deployResult = await getDeployDetails(savedBeneficiary);
      console.log('...... Beneficiary saved successfully', deployResult);
      VIToast.success('Beneficiary saved successfully');
      ReactGA.event({
        category: 'Success',
        action: 'Add beneficiary',
        label: `${entityInfo.publicKey}: [${beneficiaryInputs.name}] beneficiary has been added`,
      });
      // await sendDiscordMessage(
      //   process.env.REACT_APP_BENEFICIARIES_WEBHOOK_ID,
      //   process.env.REACT_APP_BENEFICIARIES_TOKEN,
      //   beneficiaryInputs.name,
      //   '',
      //   `Great news! [${beneficiaryInputs.name}] beneficiary has been added to #verified-impact-nfts [click here to know more about their cause. (${window.location.origin}/#/)]  @vinfts @casper_network @devxdao `
      // );
      let s = []
      if (beneficiaryInputs.SDGsGoals.length > 0){     
        beneficiaryInputs.SDGsGoals.map((sdg) => (
            s.push(`#SDG${sdg}`)
        ))}
      // await SendTweet(
      //   `Great news! ${beneficiaryInputs.name} beneficiary has been added to #verified_impact_nfts. ${s.toString().replaceAll(',', ' ')} click here ${window.location.origin}/#/ to know more about their cause.  @vinfts @casper_network @devxdao `
      // );
      
       await refreshBeneficiaries(nftDispatch, stateList)
      setBeneficiaryInputs({
        name: '',
        description: '',
        address: '',
        SDGsGoals:[SDGsData[18].value]
      });
      setIsClearSDGs(!isClearSDGs);
      setIsButtonClicked(false);
    } catch (err) {
      if (err.message.includes('User Cancelled')) {
        VIToast.error('User Cancelled Signing');
        ReactGA.event({
          category: 'User Cancelation',
          action: 'Add beneficiary',
          label: `${entityInfo.publicKey}: Cancelled Signing`,
        });
      } else {
        ReactGA.event({
          category: 'Error',
          action: 'Add beneficiary',
          label: `${entityInfo.publicKey}: ${err.message}`,
        });
        VIToast.error(err.message);
      }
      setIsButtonClicked(false);
      return;
    }
  };

  const handleSDGsChange = (data) => {
    setBeneficiaryInputs({
      ...beneficiaryInputs,
      SDGsGoals: data,
    });
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
              motherMenu='Add Beneficiary'
              activeMenu='Add Beneficiary'
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
                    <Container>
                      <Row>
                        <Col>
                          <div className='required-field vinft-bg-gray'>
                            <input
                              type='text'
                              name='name'
                              placeholder='Name'
                              className='form-control'
                              value={beneficiaryInputs.name}
                              onChange={(e) =>
                                setBeneficiaryInputs({
                                  ...beneficiaryInputs,
                                  name: e.target.value,
                                })
                              }
                            />
                            <span className='text-danger required-field-symbol'>
                              *
                            </span>
                          </div>
                        </Col>
                        <Col>
                          <div className='required-field'>
                            <input
                              type='text'
                              placeholder='Address'
                              name='address'
                              className='form-control'
                              value={beneficiaryInputs.address}
                              onChange={(e) =>
                                setBeneficiaryInputs({
                                  ...beneficiaryInputs,
                                  address: e.target.value,
                                })
                              }
                            />

                            <span className='text-danger required-field-symbol'>
                              *
                            </span>
                          </div>{' '}
                          {beneficiaryInputs.address !== '' &&
                            !isValidWallet(beneficiaryInputs.address) && (
                              <span className="text-danger">
                                Please Enter Valid Public Address
                              </span>
                            )}
                        </Col>
                      </Row>
                      <Row className='mt-4'>
                        <Col>
                        <SDGsMultiSelect data={SDGsData} SDGsChanged={(selectedData)=>{handleSDGsChange(selectedData)}} isAddBeneficiary={true} isClear={isClearSDGs}/>
                        </Col>
                      </Row>
                      <Row className='mt-4'>
                        <Col>
                          <textarea
                            rows={4}
                            name='description'
                            placeholder='Description'
                            className='form-control'
                            value={beneficiaryInputs.description}
                            onChange={(e) =>
                              setBeneficiaryInputs({
                                ...beneficiaryInputs,
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
                            onClick={saveBeneficiary}
                            disabled={
                              beneficiaryInputs.name == '' ||
                              beneficiaryInputs.address == '' ||
                              isButtonClicked ||
                              beneficiaryInputs.SDGsGoals.length <= 0 ||
                              !isValidWallet(beneficiaryInputs.address)
                            }
                          >
                            {isButtonClicked ? (
                              <Spinner animation='border' variant='light' />
                            ) : (
                              'Create'
                            )}
                          </button>
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

export default AddBeneficiary;
