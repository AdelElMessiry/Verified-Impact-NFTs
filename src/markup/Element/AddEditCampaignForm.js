import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';
import validator from 'validator';

import { useAuth } from '../../contexts/AuthContext';
import { getDeployDetails } from '../../api/universal';
import { createCampaign } from '../../api/createCampaign';

import { useNFTState } from '../../contexts/NFTContext';
import ReactGA from 'react-ga';

//adding new campaign page
const AddEditCampaignForm = ({
  data = undefined,
  closeModal = undefined,
  isFromModal = false,
  beneficiaryAddress = undefined,
}) => {
  const { beneficiaries } = useNFTState();
  const { entityInfo, isLoggedIn } = useAuth();
  const [beneficiary, setBeneficiary] = React.useState();
  const [isButtonClicked, setIsButtonClicked] = React.useState(false);
  const [showURLErrorMsg, setShowURLErrorMsg] = React.useState(false);

  //getting beneficiary details
  const selectedBeneficiary = React.useCallback(async () => {
    const firstBeneficiary = beneficiaries?.filter(
      ({ isApproved }) => isApproved === 'true'
    );
    firstBeneficiary && setBeneficiary(firstBeneficiary[0]?.address);
  }, [beneficiaries]);

  React.useEffect(() => {
    !beneficiary && selectedBeneficiary();
  }, [beneficiary, selectedBeneficiary]);
  //setting initial values of controls
  const [state, setState] = React.useState({
    inputs: {
      campaignUrl: data ? data.url : '',
      name: data ? data.name : '',
      description: data ? data.description : '',
      requestedRoyalty: data ? data.requested_royalty : '',
    },
  });

  const checkURLValidation = (value) => {
    if (validator.isURL(value)) {
      setShowURLErrorMsg(false);
    } else {
      setShowURLErrorMsg(true);
    }
  };

  const handleChange = (e, isBeneficiary = false) => {
    if (isBeneficiary) {
      setBeneficiary(e.target.value);
    } else {
      const { value, name, checked, type } = e.target;
      const { inputs } = state;

      inputs[name] = type === 'checkbox' ? checked : value;
      setState({
        ...state,
        inputs,
      });
    }
  };

  //saving new campaign related to beneficiary function
  const saveCampaign = async () => {
    setIsButtonClicked(true);
    if (state.inputs.campaignUrl !== '' && showURLErrorMsg) {
      return;
    }
    try {
      const savedCampaign = await createCampaign(
        state.inputs.name,
        state.inputs.description,
        beneficiaryAddress ? beneficiaryAddress : beneficiary,
        state.inputs.campaignUrl,
        state.inputs.requestedRoyalty,
        CLPublicKey.fromHex(entityInfo.publicKey),
        data ? 'UPDATE' : 'ADD',
        data ? data.id : undefined
      );
      ReactGA.event({
        category: 'Success',
        action: 'Add campaign',
        label: `${entityInfo.publicKey}: added new campaign ${state.inputs.name}`,
      });
      const deployResult = await getDeployDetails(savedCampaign);
      console.log('...... Campaign saved successfully', deployResult);
      VIToast.success('Campaign saved successfully');
      setIsButtonClicked(false);
      isFromModal && closeModal();
      isFromModal && window.location.reload();
      setState({
        inputs: {
          campaignUrl: '',
          name: '',
          description: '',
          requestedRoyalty: '',
        },
      });

      console.log('save Result', savedCampaign);
      console.log(
        'save Result',
        state.inputs.name,
        state.inputs.description,
        beneficiary,
        state.inputs.campaignUrl,
        state.inputs.requestedRoyalty,
        CLPublicKey.fromHex(entityInfo.publicKey)
      );
    } catch (err) {
      if (err.message.includes('User Cancelled')) {
        VIToast.error('User Cancelled Signing');
        ReactGA.event({
          category: 'User Cancelation',
          action: 'Add campaign',
          label: `${entityInfo.publicKey}: Cancelled Signing`,
        });
      } else {
        VIToast.error(err.message);
        ReactGA.event({
          category: 'Error',
          action: 'Add campaign',
          label: `${entityInfo.publicKey}: ${err.message}`,
        });
      }
      setIsButtonClicked(false);
      return;
    }
  };

  return (
    <div className='section-full content-inner shop-account'>
      {/* <!-- Product --> */}
      <div className='container'>
        <div>
          <div className=' m-auto m-b30'>
            <Container>
              <Row>
                {!isFromModal && (
                  <Col>
                    <div className='required-field vinft-bg-gray'>
                      {beneficiaries ? (
                        <select
                          name='Beneficiary'
                          placeholder='Beneficiary'
                          className='form-control'
                          onChange={(e) => handleChange(e, true)}
                          value={
                            beneficiary
                              ? beneficiary
                              : beneficiaries?.filter(
                                  ({ isApproved }) => isApproved === 'true'
                                )[0]?.address
                          }
                        >
                          {beneficiaries
                            ?.filter(({ isApproved }) => isApproved === 'true')
                            .map(({ username, address }) => (
                              <option key={address} value={address}>
                                {' '}
                                {username}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <Spinner
                          animation='border'
                          variant='dark'
                          className='my-1'
                        />
                      )}
                      <span className='text-danger required-field-symbol'>
                        *
                      </span>
                    </div>
                  </Col>
                )}
                <Col>
                  <div className='required-field'>
                    <input
                      type='text'
                      placeholder='Name'
                      name='name'
                      className='form-control'
                      onChange={(e) => handleChange(e)}
                      value={state.inputs.name}
                    />{' '}
                    <span className='text-danger required-field-symbol'>*</span>
                  </div>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col>
                  <div className='required-field'>
                    <input
                      type='number'
                      placeholder='Requested Royalty'
                      name='requestedRoyalty'
                      className='form-control'
                      value={state.inputs.requestedRoyalty}
                      onChange={(e) => handleChange(e)}
                      min={0}
                    />{' '}
                    <span className='text-danger required-field-symbol'>*</span>
                    {(state.inputs.requestedRoyalty < 0 ||
                      state.inputs.requestedRoyalty > 100) && (
                      <span className='text-danger'>
                        Requested Royalty value must be more than 0 and less
                        than 100
                      </span>
                    )}
                  </div>
                </Col>
                <Col>
                  <input
                    type='text'
                    placeholder='URL'
                    name='campaignUrl'
                    className='form-control'
                    value={state.inputs.campaignUrl}
                    onChange={(e) => {
                      handleChange(e);
                      checkURLValidation(e.target.value);
                    }}
                  />
                  {showURLErrorMsg && (
                    <span className='text-danger'>Please enter Valid URL</span>
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
                    onChange={(e) => handleChange(e)}
                    value={state.inputs.description}
                  ></textarea>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col>
                  <p className='form-submit'>
                    <button
                      className='btn btn-success'
                      onClick={saveCampaign}
                      disabled={
                        state.inputs.name == '' ||
                        state.inputs.requestedRoyalty < 0 ||
                        state.inputs.requestedRoyalty > 100
                      }
                    >
                      {isButtonClicked ? (
                        <Spinner animation='border' variant='light' />
                      ) : data ? (
                        'Update'
                      ) : (
                        'Add'
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
  );
};

export default AddEditCampaignForm;
