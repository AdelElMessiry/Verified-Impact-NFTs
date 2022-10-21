import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';

import { AuthProvider } from '../contexts/AuthContext';
import { NFTProvider } from '../contexts/NFTContext';

import Dashboard from './Pages/Dashboard';
import NFTDetail from './Pages/NFTDetail';
import BeneficiaryNFTs from './Pages/NFTs/BeneficiaryNFTs';
import CreatorNFTs from './Pages/NFTs/CreatorNFTs';
import MyNFTs from './Pages/NFTs/MyNFTs';
import AddBeneficiary from './Pages/Admin/AddBeneficiary';
import AddCampaign from './Pages/Admin/AddCampaign';
import MintNFT from './Pages/Admin/MintNFT';
import Profile from './Pages/Profile';
import ManageBeneficiaries from './Pages/Admin/ManageBeneficiaries';

import Header from './Layout/Header';
import ScrollToTop from './Element/ScrollToTop';
import MyCollections from './Pages/MyCollections';
import AddCollection from './Pages/Admin/AddEditCollection';
import SignUpAsBeneficiary from './Pages/SignUpAsBeneficiary';
import TermsOfServices from './Pages/TermsAndConditions';
import NFTCardURL from './Element/NFTCardURL';
import Privacy from './Pages/Privacy';
import RequestForm from './Pages/RequestForm';
import SDGGoalNFTs from './Pages/NFTs/SDGGoalNFTs';

const Markup = () => {
  return (
    <AuthProvider>
      <NFTProvider>
        <HashRouter>
          <div className='page-wraper'>
            {!window.location.hash.includes('nft-card') && <Header />}
            <Switch>
              <Route path='/' exact component={Dashboard} />
              <Route path='/nft-detail' exact component={NFTDetail} />
              <Route
                path='/BeneficiaryNFTs'
                exact
                component={BeneficiaryNFTs}
              />
              <Route path='/CreatorNFTs' exact component={CreatorNFTs} />
              <Route path='/my-NFTs' exact component={MyNFTs} />
              <Route
                path='/admin_beneficiary'
                exact
                component={AddBeneficiary}
              />
              <Route path='/admin_campaign' exact component={AddCampaign} />
              <Route path='/mint-nft' exact component={MintNFT} />
              <Route path='/profile' exact component={Profile} />
              <Route path='/my-collections' exact component={MyCollections} />
              <Route path='/add-collection' exact component={AddCollection} />
              <Route
                path='/manage-beneficiaries'
                exact
                component={ManageBeneficiaries}
              />
              <Route
                path='/signup-as-beneficiary'
                exact
                component={SignUpAsBeneficiary}
              />
              <Route
                path='/terms-of-services'
                exact
                component={TermsOfServices}
              />
              <Route path='/nft-card' exact component={NFTCardURL} />
              <Route path='/privacy' exact component={Privacy} />
              <Route path='/request-form' exact component={RequestForm} />
              <Route
                path='/SDGGoalNFTs'
                exact
                component={SDGGoalNFTs}
              />
            </Switch>
          </div>
          <ScrollToTop />
        </HashRouter>
      </NFTProvider>
    </AuthProvider>
  );
};

export default Markup;
