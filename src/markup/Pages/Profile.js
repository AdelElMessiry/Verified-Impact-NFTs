import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

import Layout from '../Layout';
import PromptLogin from './PromptLogin';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from '../Element/profileForm';
import { ProfileFormsEnum } from '../../Enums/index';
import { profileClient } from '../../api/profileInfo';

import bnr1 from './../../images/banner/bnr1.jpg';

const Profile = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const [activeTab, setActiveTab] = useState('1');
  const [normalProfile, setNormalProfile] = useState();
  const [beneficiaryProfile, setBeneficiaryProfile] = useState();
  const [creatorProfile, setCreatorProfile] = useState();
  const [noProfilesForThisUser, setNoProfilesForThisUser] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const getUserProfiles = React.useCallback(async () => {
    try {
      const userProfiles = await profileClient.getProfile(entityInfo.publicKey);
      console.log(userProfiles);
      if (userProfiles) {
        if (userProfiles.err === 'Address Not Found') {
          setNoProfilesForThisUser(true);
        } else {
          let list = Object.values(userProfiles)[0];

          userProfiles && setNormalProfile(list.normal);
          userProfiles && setBeneficiaryProfile(list.beneficiary);
          userProfiles && setCreatorProfile(list.creator);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [entityInfo.publicKey]);

  React.useEffect(() => {
    entityInfo.publicKey && getUserProfiles();
  }, [entityInfo.publicKey, getUserProfiles]);

  return (
    <Layout>
      <div className='page-content bg-white'>
        {/*  banner  */}
        <div
          className='dlab-bnr-inr dlab-bnr-inr-sm overlay-primary bg-pt'
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <div className='container'>
            <div className='dlab-bnr-inr-entry'>
              <h1 className='text-white d-flex align-items-center'>
                <span className='mr-1'>Profile</span>
              </h1>

              <div className='breadcrumb-row'>
                <ul className='list-inline'>
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className='ml-1'>Profile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {!isLoggedIn ? (
          <PromptLogin />
        ) : (
          <>
            <div className='container-fluid mt-5'>
              <div className='dlab-tabs choseus-tabs'>
                <ul
                  className='nav row justify-content-center'
                  id='myTab'
                  role='tablist'
                >
                  <li>
                    <Link
                      to={'#'}
                      className={classnames({ active: activeTab === '1' }) + ''}
                      onClick={() => {
                        toggle('1');
                      }}
                    >
                      <span className='title-head'>User Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={'#'}
                      className={classnames({ active: activeTab === '2' }) + ''}
                      onClick={() => {
                        toggle('2');
                      }}
                    >
                      <span className='title-head'>Creator Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={'#'}
                      className={classnames({ active: activeTab === '3' }) + ''}
                      onClick={() => {
                        toggle('3');
                      }}
                    >
                      <span className='title-head'>Beneficiary Profile</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='container'>
              <div className='tab-content chosesus-content'>
                <div id='cost' className='tab-pane active py-5'>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId='1'>
                      {(normalProfile || noProfilesForThisUser) && (
                        <ProfileForm
                          formName={ProfileFormsEnum.NormalProfile}
                          isProfileExist={
                            noProfilesForThisUser ||
                            (normalProfile &&
                              Object.keys(normalProfile).length === 0)
                              ? false
                              : true
                          }
                          formData={
                            noProfilesForThisUser ? null : normalProfile
                          }
                        />
                      )}
                    </TabPane>
                    <TabPane tabId='2'>
                      {(creatorProfile || noProfilesForThisUser) && (
                        <ProfileForm
                          formName={ProfileFormsEnum.CreatorProfile}
                          isProfileExist={
                            noProfilesForThisUser ||
                            (creatorProfile &&
                              Object.keys(creatorProfile).length === 0)
                              ? false
                              : true
                          }
                          formData={
                            noProfilesForThisUser ? null : creatorProfile
                          }
                        />
                      )}
                    </TabPane>
                    <TabPane tabId='3'>
                      {(beneficiaryProfile || noProfilesForThisUser) && (
                        <ProfileForm
                          formName={ProfileFormsEnum.BeneficiaryProfile}
                          isProfileExist={
                            noProfilesForThisUser ||
                            (beneficiaryProfile &&
                              Object.keys(beneficiaryProfile).length === 0)
                              ? false
                              : true
                          }
                          formData={
                            noProfilesForThisUser ? null : beneficiaryProfile
                          }
                        />
                      )}
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
export default Profile;
