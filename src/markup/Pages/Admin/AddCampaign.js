import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';

import { useAuth } from '../../../contexts/AuthContext';
import { getDeployDetails } from '../../../api/universal';
import { getBeneficiariesList } from '../../../api/beneficiaryInfo';
import { createCampaign } from '../../../api/createCampaign';
import PromptLogin from '../PromptLogin';

import Header from '../../Layout/Header1';
import Footer from '../../Layout/Footer1';
import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { toast as VIToast } from 'react-toastify';

const AddCampaign = () => {
  const { entityInfo, isLoggedIn } = useAuth();

  const [beneficiary, setBeneficiary] = React.useState();

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

  //setting initial values of controls
  const [state, setState] = useState({
    inputs: {
      campaignUrl: '',
      name: '',
      description: '',
      requestedRoyalty: '',
    },
  });

  const [beneficiaries, setBeneficiaries] = useState();
  //getting beneficiary list
  useEffect(() => {
    (async () => {
      let beneficiaryList = !beneficiaries && (await getBeneficiariesList());
      !beneficiaries && setBeneficiaries(beneficiaryList);
      !beneficiaries && setBeneficiary(beneficiaryList[0]?.address);
    })();
  }, [beneficiaries]);

  //saving new campaign related to beneficiary component
  const saveCampaign = async () => {
    const savedCampaign = await createCampaign(
      state.inputs.name,
      state.inputs.description,
      beneficiary,
      state.inputs.campaignUrl,
      state.inputs.requestedRoyalty,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );

    const deployResult = await getDeployDetails(savedCampaign);
    console.log('...... Campaign saved successfully', deployResult);
    VIToast.success("Campaign saved successfully");

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
  };

  return (
    <>
      <Header />

      <div className='page-content bg-white'>
        {/* <!-- inner page banner --> */}
        <div
          className='dlab-bnr-inr overlay-primary bg-pt'
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <PageTitle motherMenu='Add Campaign' activeMenu='Add Campaign' />
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
                        <select
                          name='Beneficiary'
                          placeholder='Beneficiary'
                          className='form-control'
                          onChange={(e) => handleChange(e, true)}
                          value={beneficiary}
                        >
                          {beneficiaries?.map(({ name, address }) => (
                            <option key={address} value={address}>
                              {' '}
                              {name}
                            </option>
                          ))}
                        </select>
                      </Col>
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
                    <Row className='mt-4'>
                      <Col>
                        <input
                          type='text'
                          placeholder='Requested Royalty'
                          name='requestedRoyalty'
                          className='form-control'
                          value={state.inputs.requestedRoyalty}
                          onChange={(e) => handleChange(e)}
                        />
                      </Col>
                      <Col>
                        <input
                          type='text'
                          placeholder='URL'
                          name='campaignUrl'
                          className='form-control'
                          value={state.inputs.campaignUrl}
                          onChange={(e) => handleChange(e)}
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
                          onChange={(e) => handleChange(e)}
                          value={state.inputs.description}
                        ></textarea>
                      </Col>
                    </Row>
                    <Row className='mt-4'>
                      <Col>
                        <p className='form-submit'>
                          <input
                            type='button'
                            value='Create'
                            className='btn btn-success'
                            name='submit'
                            onClick={saveCampaign}
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
        )}
        {/* <!-- contact area  END --> */}
      </div>

      <Footer />
    </>
  );
};

export default AddCampaign;
