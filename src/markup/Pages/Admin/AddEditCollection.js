import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';
import { CLPublicKey } from 'casper-js-sdk';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import validator from 'validator';

import { getDeployDetails } from '../../../api/universal';
import { addCollection, updateCollection } from '../../../api/addCollection';
import { useAuth } from '../../../contexts/AuthContext';
import PromptLogin from '../PromptLogin';
import {
  refreshCollections,
  updateCollections,
  useNFTDispatch,
  useNFTState,
} from '../../../contexts/NFTContext';

import Layout from '../../Layout';
import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { sendDiscordMessage } from '../../../utils/discordEvents';
import { SendTweet } from '../../../utils/VINFTsTweets';
import ReactGA from 'react-ga';
import AddEditCollectionForm from '../../Element/AddEditCollectionForm';

//add new beneficiary page
const AddCollection = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const collectionId = queryParams.get('id');
  const { ...stateList } = useNFTState();
  const { collections } = stateList;

  const [selectedCollection, setSelectedCollection] = React.useState();

  const getSelectedCollection = React.useCallback(async () => {
    const collectionData =
      collections && collections.find(({ id }) => id === collectionId);
    collections && setSelectedCollection(collectionData);
  }, [collections, collectionId]);

  //getting list of NFTs
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname + '/add-collection');
    if (collectionId !== '0' && collectionId !== null) {
      getSelectedCollection();
    } else {
      setSelectedCollection(undefined);
    }
  }, [collectionId, getSelectedCollection]);

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
              motherMenu={`${
                collectionId !== '0' && collectionId !== null ? 'Edit' : 'Add'
              } Collection`}
              activeMenu={`${
                collectionId !== '0' && collectionId !== null ? 'Edit' : 'Add'
              } Collection`}
            />
          </div>
          {/* <!-- inner page banner END --> */}
          {/* <!-- contact area --> */}
          {!isLoggedIn ? (
            <PromptLogin />
          ) : (
            <AddEditCollectionForm data={selectedCollection} />
          )}
          {/* <!-- contact area  END --> */}
        </div>
      </Layout>
    </>
  );
};

export default AddCollection;
