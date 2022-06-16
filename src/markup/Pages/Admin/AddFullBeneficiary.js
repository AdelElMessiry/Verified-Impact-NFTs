import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';

import { getDeployDetails } from '../../../api/universal';
import { addBeneficiary } from '../../../api/addBeneficiary';
import { useAuth } from '../../../contexts/AuthContext';

import PromptLogin from '../PromptLogin';
import PageTitle from '../../Layout/PageTitle';

import Layout from '../../Layout';
import ProfileForm from '../../Element/profileForm';
import { ProfileFormsEnum } from '../../../Enums/index';

import bnr1 from './../../../images/banner/bnr1.jpg';

//add new beneficiary page
const AddFullBeneficiary = () => {
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
    VIToast.success('Beneficiary saved successfully');

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
                      <ProfileForm
                        formName={ProfileFormsEnum.BeneficiaryProfile}
                      />
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

export default AddFullBeneficiary;
