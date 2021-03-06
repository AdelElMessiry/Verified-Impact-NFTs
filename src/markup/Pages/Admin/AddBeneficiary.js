import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';

import { getDeployDetails } from '../../../api/universal';
import { addBeneficiary } from '../../../api/addBeneficiary';
import { useAuth } from '../../../contexts/AuthContext';
import PromptLogin from '../PromptLogin';


import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { toast as VIToast } from 'react-toastify';
import Layout from '../../Layout';


/**
 * Add beneficiary to verified-impact-nft's contract from admin side.
 *
 * @type {React.FC<Props>}
 * @returns {React.ReactElement} UI page
 */
//add new beneficiary page
const AddBeneficiary = () => {
  const { isLoggedIn, entityInfo } = useAuth();

  const [beneficiaryInputs, setBeneficiaryInputs] = useState({
    BeneficiaryInputs: { name: '', description: '', address: '' },
  });

  useEffect(() => {
    (async () => {
      setBeneficiaryInputs({
        name: '',
        description: '',
        address: '',
      });
    })();
  }, [entityInfo.publicKey]);

  //saving new beneficiary function
  const saveBeneficiary = async () => {
    const savedBeneficiary = await addBeneficiary(
      beneficiaryInputs.name,
      beneficiaryInputs.description,
      beneficiaryInputs.address,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );

    const deployResult = await getDeployDetails(savedBeneficiary);
    console.log('...... Beneficiary saved successfully', deployResult);
    VIToast.success("Beneficiary saved successfully");

    setBeneficiaryInputs({
      name: '',
      description: '',
      address: '',
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
                      </Col>
                      <Col>
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
                        {' '}
                        <p className='form-submit'>
                          <input
                            type='button'
                            value='Create'
                            className='btn btn-success'
                            name='submit'
                            onClick={saveBeneficiary}
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

      </Layout>
    </>
  );
};

export default AddBeneficiary;
