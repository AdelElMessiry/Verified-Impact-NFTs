import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

import { profileClient } from '../../api/profileInfo';
import { useAuth } from '../../contexts/AuthContext';
import { useNFTState } from '../../contexts/NFTContext';

import Layout from '../Layout';
import PromptLogin from './PromptLogin';
import ProfileForm from '../Element/profileForm';
import { ProfileFormsEnum } from '../../Enums/index';

import bnr1 from './../../images/banner/bnr1.jpg';
import ManageCampaigns from './ManageCampaigns';
import ReactGA from 'react-ga';
import { Spinner } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import ManageCollections from './ManageCollections';

const Profile = () => {
  const { beneficiaries, creators } = useNFTState();
  const { isLoggedIn, entityInfo } = useAuth();
  const [activeTab, setActiveTab] = useState('1');
  const [activeBeneficiaryTab, setActiveBeneficiaryTab] = useState('4');
  const [activeCreatorTab, setActiveCreatorTab] = useState('6');
  const [normalProfile, setNormalProfile] = useState();
  const [beneficiaryProfile, setBeneficiaryProfile] = useState();
  const [creatorProfile, setCreatorProfile] = useState();
  const [allProfile, setAllProfile] = useState();
  const [noProfilesForThisUser, setNoProfilesForThisUser] = useState(false);
  const [
    noBeneficiaryProfilesForThisUser,
    setNoBeneficiaryProfilesForThisUser,
  ] = useState(false);
  const [noCreatorProfilesForThisUser, setNoCreatorProfilesForThisUser] =
    useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleBeneficiaryTab = (tab) => {
    if (activeBeneficiaryTab !== tab) setActiveBeneficiaryTab(tab);
  };

  const toggleCreatorTab = (tab) => {
    if (activeCreatorTab !== tab) setActiveCreatorTab(tab);
  };

  const getUserProfiles = React.useCallback(async () => {
    try {
      const _beneficiaryProfile = beneficiaries?.find(
        ({ address }) => address === entityInfo.publicKey
      );

      const _creatorProfile = creators?.find(
        ({ address }) => address === entityInfo.publicKey
      );
     
      const userProfiles = await profileClient.getProfile(CLPublicKey.fromHex(entityInfo.publicKey)
      .toAccountHashStr()
      .slice(13),true);

      if (userProfiles) {
        let beneficiaryObject;
        let creatorObject;
        let normalObject;
        if (userProfiles.err === 'Address Not Found') {
          if (beneficiaries) {
            if (_beneficiaryProfile) {
              let beneficiary = {
                username: _beneficiaryProfile.name,
                bio: _beneficiaryProfile.description,
                address: '',
                tagline: '',
                imgUrl: '',
                nftUrl: '',
                firstName: '',
                lastName: '',
                externalLink: '',
                phone: '',
                twitter: '',
                instagram: '',
                facebook: '',
                medium: '',
                telegram: '',
                mail: '',
                sdgs_ids:_beneficiaryProfile.sdgs_ids.split(",")
              };
              setBeneficiaryProfile(beneficiary);
              beneficiaryObject = beneficiary;
              setNoBeneficiaryProfilesForThisUser(false);
            } else {
              setBeneficiaryProfile(null);
              beneficiaryObject = {};
              setNoBeneficiaryProfilesForThisUser(true);
            }
          }
          if (creators) {
            if (_creatorProfile) {
              let creator = {
                username: _creatorProfile.name,
                bio: _creatorProfile.description,
                address: '',
                tagline: '',
                imgUrl: '',
                nftUrl: '',
                firstName: '',
                lastName: '',
                externalLink: '',
                phone: '',
                twitter: '',
                instagram: '',
                facebook: '',
                medium: '',
                telegram: '',
                mail: '',
              };
              setCreatorProfile(creator);
              creatorObject = creator;
              setNoCreatorProfilesForThisUser(false);
            } else {
              setCreatorProfile(null);
              creatorObject = {};
              setNoCreatorProfilesForThisUser(true);
            }
          }
          setNoProfilesForThisUser(true);
          setNormalProfile(null);
          normalObject = {};
        } else {
          if (beneficiaries) {
            if (_beneficiaryProfile) {
              setNoBeneficiaryProfilesForThisUser(false);
            } else {
              setNoBeneficiaryProfilesForThisUser(true);
            }
          }
          if (creators) {
            if (_creatorProfile) {
              setNoCreatorProfilesForThisUser(false);
            } else {
              setNoCreatorProfilesForThisUser(true);
            }
          }
          let list = Object.values(userProfiles)[0];
          userProfiles &&
            setNormalProfile(
              Object.keys(list.normal).length === 0 ? null : list.normal
            );
          if (userProfiles) {
            normalObject =
              Object.keys(list.normal).length === 0 ? {} : list.normal;
            beneficiaryObject =
              Object.keys(list.beneficiary).length === 0
                ? {}
                : list.beneficiary;
            creatorObject =
              Object.keys(list.creator).length === 0 ? {} : list.creator;
          }
          userProfiles &&
            setBeneficiaryProfile(
              Object.keys(list.beneficiary).length === 0
                ? null
                : list.beneficiary
            );
          userProfiles &&
            setCreatorProfile(
              Object.keys(list.creator).length === 0 ? null : list.creator
            );
        }
        setAllProfile( {
            normal: normalObject,
            beneficiary: beneficiaryObject,
            creator: creatorObject,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [entityInfo.publicKey, beneficiaries, creators]);

  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname +"Profile");
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
                      {(normalProfile == null ||
                        normalProfile ||
                        noProfilesForThisUser)&&activeTab==='1' ? (
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
                          allProfileData={allProfile}
                          noProfilesForThisUser={noProfilesForThisUser}
                        />
                      ):(  <div className='d-flex justify-content-center'>
                      <Spinner animation='border' variant='success' />
                      </div>)}
                    </TabPane>
                    <TabPane tabId='2'>
                      {(creatorProfile || noCreatorProfilesForThisUser) &&
                      creators &&
                      activeTab === '2' ? (
                        <>
                          <div className="dlab-tabs choseus-tabs">
                            <ul
                              className="nav row justify-content-center"
                              id="creatorTab"
                              role="tablist"
                            >
                              <li>
                                <Link
                                  to={'#'}
                                  className={
                                    classnames({
                                      active: activeCreatorTab === '6',
                                    }) + ''
                                  }
                                  onClick={() => {
                                    toggleCreatorTab('6');
                                  }}
                                >
                                  <span className="title-head">
                                    Account Info
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to={'#'}
                                  className={
                                    classnames({
                                      active: activeCreatorTab === '7',
                                    }) + ''
                                  }
                                  onClick={() => {
                                    toggleCreatorTab('7');
                                  }}
                                >
                                  <span className="title-head">
                                    Manage Collections
                                  </span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="container">
                            <div className="tab-content chosesus-content">
                              <div
                                id="beneficiartMain"
                                className="tab-pane active py-5"
                              >
                                <TabContent activeTab={activeCreatorTab}>
                                  <TabPane tabId="6">
                                    <ProfileForm
                                      formName={ProfileFormsEnum.CreatorProfile}
                                      isProfileExist={
                                        noProfilesForThisUser ||
                                        (creatorProfile &&
                                          Object.keys(creatorProfile).length ===
                                            0)
                                          ? false
                                          : true
                                      }
                                      formData={creatorProfile}
                                      allProfileData={allProfile}
                                      noProfilesForThisUser={noProfilesForThisUser}
                                    />
                                  </TabPane>
                                  <TabPane tabId="7">
                                    {creatorProfile ? (
                                      <ManageCollections/>
                                    ) : (
                                      <h4 className="text-muted text-center my-5">
                                        Please Add Creator First
                                      </h4>
                                    )}
                                  </TabPane>
                                </TabContent>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-center">
                          <Spinner animation="border" variant="success" />
                        </div>
                      )}
                    </TabPane>
                    <TabPane tabId="3">
                      {(beneficiaryProfile ||
                        noBeneficiaryProfilesForThisUser) &&
                      beneficiaries &&
                      activeTab === '3' ? (
                        <>
                          <div className="dlab-tabs choseus-tabs">
                            <ul
                              className="nav row justify-content-center"
                              id="beneficiaryTab"
                              role="tablist"
                            >
                              <li>
                                <Link
                                  to={'#'}
                                  className={
                                    classnames({
                                      active: activeBeneficiaryTab === '4',
                                    }) + ''
                                  }
                                  onClick={() => {
                                    toggleBeneficiaryTab('4');
                                  }}
                                >
                                  <span className="title-head">
                                    Account Info
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to={'#'}
                                  className={
                                    classnames({
                                      active: activeBeneficiaryTab === '5',
                                    }) + ''
                                  }
                                  onClick={() => {
                                    toggleBeneficiaryTab('5');
                                  }}
                                >
                                  <span className="title-head">
                                    Manage Campaigns
                                  </span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="container">
                            <div className="tab-content chosesus-content">
                              <div
                                id="beneficiartMain"
                                className="tab-pane active py-5"
                              >
                                <TabContent activeTab={activeBeneficiaryTab}>
                                  <TabPane tabId="4">
                                    <ProfileForm
                                      formName={
                                        ProfileFormsEnum.BeneficiaryProfile
                                      }
                                      isProfileExist={
                                        noProfilesForThisUser ||
                                        (beneficiaryProfile &&
                                          Object.keys(beneficiaryProfile)
                                            .length === 0)
                                          ? false
                                          : true
                                      }
                                      formData={beneficiaryProfile}
                                      isVINftExist={
                                        !noBeneficiaryProfilesForThisUser
                                      }
                                      allProfileData={allProfile}
                                      noProfilesForThisUser={noProfilesForThisUser}
                                    />
                                  </TabPane>
                                  <TabPane tabId="5">
                                    {beneficiaryProfile ? (
                                      <ManageCampaigns
                                        beneficiaryAddress={
                                          beneficiaryProfile.address
                                        }
                                        beneficiaryPKAddress={
                                          entityInfo.publicKey
                                        }
                                      />
                                    ) : (
                                      <h4 className="text-muted text-center my-5">
                                        Please Add Beneficiary First
                                      </h4>
                                    )}
                                  </TabPane>
                                </TabContent>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-center">
                          <Spinner animation="border" variant="success" />
                        </div>
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
