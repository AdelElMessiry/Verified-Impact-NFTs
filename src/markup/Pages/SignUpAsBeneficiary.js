import React from 'react';
import { Container } from 'react-bootstrap';

import { useAuth } from '../../contexts/AuthContext';

import PromptLogin from './PromptLogin';
import PageTitle from '../Layout/PageTitle';

import Layout from '../Layout';
import ProfileForm from '../Element/profileForm';
import { ProfileFormsEnum } from '../../Enums/index';

import bnr1 from '../../images/banner/bnr1.jpg';
import ReactGA from 'react-ga';

//add new beneficiary page
const SignUpAsBeneficiary = () => {
  const { isLoggedIn } = useAuth();
React.useEffect(()=>{
  ReactGA.pageview(window.location.pathname +"signup-as-beneficiary");
},[])
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
              motherMenu='SignUp As Beneficiary'
              activeMenu='SignUp As Beneficiary'
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
                        isProfileExist={false}
                        formData={ null }
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

export default SignUpAsBeneficiary;
