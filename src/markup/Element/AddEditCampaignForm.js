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
  updateCampaigns,
  useNFTDispatch,
  useNFTState,
} from '../../contexts/NFTContext';
import ReactGA from 'react-ga';
import SDGsMultiSelect from './SDGsMultiSelect';
import { SDGsData } from '../../data/SDGsGoals/index';
import { isValidWallet } from '../../utils/contract-utils';

//adding new campaign page
const AddEditCampaignForm = ({
  data = undefined,
  closeModal = undefined,
  isFromModal = false,
  beneficiaryAddress = undefined,
  beneficiaryPKAddress = undefined,
  handleUpdateCampaignSuccess = () => {},
}) => {
  const { entityInfo } = useAuth();
  const { ...stateList } = useNFTState();
  const { beneficiaries, nfts } = stateList;
  const nftDispatch = useNFTDispatch();
  const [beneficiary, setBeneficiary] = React.useState();
  const [isButtonClicked, setIsButtonClicked] = React.useState(false);
  const [showURLErrorMsg, setShowURLErrorMsg] = React.useState(false);
  const [SDGsGoals, setSDGsGoals] = React.useState(
    data ? data.sdgs_ids?.split(',') : []
  );
  const [SDGsGoalsData, setSDGsGoalsData] = React.useState([]);
  const [mandatorySDGs, setMandatorySDGs] = React.useState();
  const [campaignAddress, setCampaignAddress] = React.useState(
    data && (data.wallet_address_pk || data.w_pk)
      ? data.wallet_address_pk
        ? data.wallet_address_pk
        : data.w_pk
      : beneficiaryPKAddress
      ? beneficiaryPKAddress
      : ''
  );

  //getting beneficiary details
  const selectedBeneficiary = React.useCallback(async () => {
    const firstBeneficiary = beneficiaries?.filter(
      ({ isApproved }) => isApproved === 'true'
    );
    firstBeneficiary &&
      setBeneficiary(
        beneficiaryAddress ? beneficiaryAddress : firstBeneficiary[0]?.address
      );
    firstBeneficiary &&
      setSDGsGoalsData(
        beneficiaryAddress
          ? SDGsData.filter(({ value }) =>
              beneficiaries
                .find((b) => b.address === beneficiaryAddress)
                ?.sdgs_ids?.split(',')
                .includes(value.toString())
            )
          : SDGsData.filter(({ value }) =>
              firstBeneficiary[0]?.sdgs_ids
                ?.split(',')
                .includes(value.toString())
            )
      );
    !data &&
      firstBeneficiary &&
      setCampaignAddress(
        beneficiaryPKAddress
          ? beneficiaryPKAddress
          : firstBeneficiary[0]?.address_pk
      );
  }, [beneficiaries, beneficiaryPKAddress, beneficiaryAddress, data]);

  React.useEffect(() => {
    !beneficiary && selectedBeneficiary();
  }, [beneficiary, selectedBeneficiary]);

  //getting beneficiary details
  const getSavedSDGs = React.useCallback(async () => {
    const selectedNFTs =
      data && nfts && nfts.filter(({ campaign }) => campaign == data.id);
    if (selectedNFTs && selectedNFTs.length > 0) {
      const sdgsNFTs = selectedNFTs
        .map(({ sdgs_ids }) => sdgs_ids?.split(','))
        ?.flat();
      const campaignArray = data?.sdgs_ids?.split(',');
      var savedSDGs = sdgsNFTs?.filter(function (obj) {
        return campaignArray?.indexOf(obj) > -1;
      });
      setMandatorySDGs(savedSDGs);
    }
  }, [data, nfts]);

  React.useEffect(() => {
    !mandatorySDGs && data && getSavedSDGs();
  }, [mandatorySDGs, getSavedSDGs, data]);

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
      let selectedBeneficiary = beneficiaries.find(
        ({ address }) => address === e.target.value
      );
      setSDGsGoalsData(
        SDGsData.filter(({ value }) =>
          selectedBeneficiary.sdgs_ids?.split(',').includes(value.toString())
        )
      );
      if (!data) {
        setCampaignAddress(selectedBeneficiary.address_pk);
      }
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

  const handleSDGsChange = (data) => {
    setSDGsGoals(data);
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
        CLPublicKey.fromHex(campaignAddress).toAccountHashStr().slice(13),
        campaignAddress,
        state.inputs.campaignUrl,
        state.inputs.requestedRoyalty,
        CLPublicKey.fromHex(entityInfo.publicKey),
        SDGsGoals.map((str) => {
          return Number(str);
        }),
        data ? 'UPDATE' : 'ADD',
        data ? data.id : undefined,
        beneficiaryAddress ? beneficiaryAddress : beneficiary
      );
      ReactGA.event({
        category: 'Success',
        action: 'Add campaign',
        label: `${entityInfo.publicKey}: added new campaign ${state.inputs.name}`,
      });
      const deployResult = await getDeployDetails(savedCampaign);
      if (data?.id) {
        const changedCampaign = {
          beneficiary_address: beneficiaryAddress
            ? beneficiaryAddress
            : beneficiary, //hash,
          collection_ids: '0',
          description: state.inputs.description,
          id: data.id,
          name: state.inputs.name,
          requested_royalty: state.inputs.requestedRoyalty,
          sdgs_ids: SDGsGoals.join(','),
          url: state.inputs.campaignUrl,
          w_pk: campaignAddress,
          wallet_address: CLPublicKey.fromHex(campaignAddress)
            .toAccountHashStr()
            .slice(13),
          wallet_address_pk: campaignAddress,
        };
        await updateCampaigns(nftDispatch, stateList, changedCampaign);
        
        handleUpdateCampaignSuccess(changedCampaign);
      }
      console.log('...... Campaign saved successfully', deployResult);
      VIToast.success('Campaign saved successfully');
      setIsButtonClicked(false);
      isFromModal && closeModal();
      //isFromModal && window.location.reload();
      await refreshCampaigns(nftDispatch, stateList);
      
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
                            .map(({ username, address, index }) => (
                              <option
                                key={`${address}_${index}`}
                                value={address}
                              >
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
                      placeholder='Campaign Address'
                      name='campaignAddress'
                      className='form-control'
                      onChange={(e) => setCampaignAddress(e.target.value)}
                      value={campaignAddress}
                    />
                    <span className='text-danger required-field-symbol'>*</span>
                    {campaignAddress !== '' &&
                      !isValidWallet(campaignAddress) && (
                        <span className='text-danger'>
                          Please Enter Valid Public Address
                        </span>
                      )}
                  </div>
                </Col>
              </Row>
              <Row className='mt-4'>
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
                    {state.inputs.requestedRoyalty === 0 &&
                      state.inputs.requestedRoyalty !== '' && (
                        <span className='text-danger'>
                          Requested Royalty equal to 0 means your beneficiary
                          will not have any proportion
                        </span>
                      )}
                  </div>
                </Col>
              </Row>

              <Row className='mt-4'>
                {' '}
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
                {SDGsGoalsData.length > 0 && (
                  <Col>
                    <SDGsMultiSelect
                      data={SDGsGoalsData}
                      SDGsChanged={(selectedData) => {
                        handleSDGsChange(selectedData);
                      }}
                      defaultValues={
                        SDGsGoalsData.length > 0 && data?.sdgs_ids !== ''
                          ? data?.sdgs_ids
                          : ''
                      }
                      mandatorySDGs={mandatorySDGs}
                      isClear={undefined}
                    />
                  </Col>
                )}
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
                        state.inputs.name === '' ||
                        state.inputs.requestedRoyalty < 0 ||
                        state.inputs.requestedRoyalty > 100 ||
                        (SDGsGoalsData?.length > 0 && SDGsGoals?.length <= 0) ||
                        !isValidWallet(campaignAddress)
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
