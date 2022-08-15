import React from 'react';
// import { Col, Container, Row } from 'react-bootstrap';
// import { CLPublicKey } from 'casper-js-sdk';
// import { toast as VIToast } from 'react-toastify';

import { useAuth } from '../../../contexts/AuthContext';
// import { getDeployDetails } from '../../../api/universal';
// import { createCampaign } from '../../../api/createCampaign';

import Layout from '../../Layout';
import AddEditCampaignForm from '../../Element/AddEditCampaignForm';
import PageTitle from '../../Layout/PageTitle';
import PromptLogin from '../PromptLogin';

import bnr1 from './../../../images/banner/bnr1.jpg';
import AddEditCampaignForm from '../../Element/AddEditCampaignForm';
import ReactGA from 'react-ga';
//adding new campaign page
const AddCampaign = () => {
  const { isLoggedIn } = useAuth();
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname + '/admin_campaign');
  }, []);
  return (
    <Layout>
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
        {!isLoggedIn ? <PromptLogin /> : <AddEditCampaignForm />}
        {/* <!-- contact area  END --> */}
      </div>
    </Layout>
  );
};

export default AddCampaign;
