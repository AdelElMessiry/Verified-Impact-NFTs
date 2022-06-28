import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';

import PromptLogin from '../PromptLogin';
import PageTitle from '../../Layout/PageTitle';

import Layout from '../../Layout';
import ProfileForm from '../../Element/profileForm';
import { ProfileFormsEnum } from '../../../Enums/index';

import bnr1 from './../../../images/banner/bnr1.jpg';

//add new beneficiary page
const AddFullBeneficiary = () => {
  const { isLoggedIn } = useAuth();

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
              motherMenu="Add Beneficiary"
              activeMenu="Add Beneficiary"
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
                      <ProfileForm
                        formName={ProfileFormsEnum.BeneficiaryProfile}
                        isProfileExist={false}
                        formData={null}
                        isAdmin={true}
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
