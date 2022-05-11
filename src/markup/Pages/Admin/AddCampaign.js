import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Layout/Header1';
import Footer from '../../Layout/Footer1';
import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { getBeneficiariesList } from '../../../api/beneficiaryInfo';
import { createCampaign } from '../../../api/createCampaign';
import { CLPublicKey } from 'casper-js-sdk';

const AddCampaign = () => {
  const { entityInfo, refreshAuth } = useAuth();
  const [beneficiaries, setBeneficiaries] = React.useState([]);
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
  const [state, setState] = useState({
    inputs: {
      url: '',
      name: '',
      description: '',
      walletAddress: '',
      requestedRoyalty: '',
    },
  });
  const getBeneficiaries = React.useCallback(async () => {
    const beneficiaries = await getBeneficiariesList();
    setBeneficiaries(beneficiaries);
  }, [beneficiaries]);

  React.useEffect(() => {
    !beneficiaries && getBeneficiaries();
  }, [beneficiaries]);
  const saveCampaign = async () => {
    const savedCampaign = await createCampaign(
      state.inputs.name,
      state.inputs.description,
      state.inputs.walletAddress,
      state.inputs.url,
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
                        {beneficiaries.map(({ name, address }) => (
                          <option value={address}> {name}</option>
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
                        name='name'
                        className='form-control'
                        value={state.inputs.requestedRoyalty}
                        onChange={(e) => handleChange(e)}
                      />
                    </Col>
                    <Col>
                      <input
                        type='text'
                        placeholder='URL'
                        name='name'
                        className='form-control'
                        value={state.inputs.url}
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

        {/* <!-- contact area  END --> */}
      </div>

      <Footer />
    </>
  );
};

export default AddCampaign;
