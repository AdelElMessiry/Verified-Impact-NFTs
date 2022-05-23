import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Index4 from './Pages/Index4';
import NFTDetail from './Pages/NFTDetail';
import SingleCollection from './Pages/singleCollection';

import ScrollToTop from './Element/ScrollToTop';
import { HashRouter } from 'react-router-dom';
import BenefeiciaryNFTs from './Pages/NFTs/BenefeiciaryNFTs';
import CreatorNFTs from './Pages/NFTs/CreatorNFTs';
import MyNFTs from './Pages/NFTs/MyNFTs';
import AddBeneficiary from './Pages/Admin/AddBeneficiary';
import AddCampaign from './Pages/Admin/AddCampaign';
import MyCreations from './Pages/NFTs/MyCreations';
import MintNFT from './Pages/Admin/MintNFT';
import Profile from './Pages/Profile';

class Markup extends Component {
  render() {
    return (
      <AuthProvider>
        <HashRouter>
          <div className='page-wraper'>
            <Switch>
              <Route path='/' exact component={Index4} />
              <Route path='/nft-detail' exact component={NFTDetail} />
              <Route
                path='/BenefeiciaryNFTs'
                exact
                component={BenefeiciaryNFTs}
              />
              <Route path='/CreatorNFTs' exact component={CreatorNFTs} />
              <Route path='/collection' exact component={SingleCollection} />
              <Route path='/my-NFTs' exact component={MyNFTs} />
              <Route
                path='/admin_beneficiary'
                exact
                component={AddBeneficiary}
              />
              <Route path='/admin_campaign' exact component={AddCampaign} />
              <Route path='/my-creations' exact component={MyCreations} />
              <Route path='/mint-nft' exact component={MintNFT} />
              <Route path='/profile' exact component={Profile} />
            </Switch>
          </div>
          <ScrollToTop />
          {/* <ThemeButton /> */}
        </HashRouter>
      </AuthProvider>
    );
  }
}

export default Markup;
