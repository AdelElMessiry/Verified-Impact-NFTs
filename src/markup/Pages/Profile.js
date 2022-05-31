import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import pic6 from './../../images/icon/icon1.png';
import pic7 from './../../images/icon/plus.png';
import pic8 from './../../images/main-slider/slide6.jpg';
import Layout from '../Layout';
import bnr1 from './../../images/banner/bnr1.jpg';
import PromptLogin from './PromptLogin';
import { useAuth } from '../../contexts/AuthContext';
import { Row,Col } from 'react-bootstrap';
import ProfileForm from '../Element/profileForm';


const Profile = () => {
  const [activeTab, setActiveTab] = useState('1');
  const { isLoggedIn } = useAuth();
  //setting initial values of controls
  const [state, setState] = useState({
    inputs: {
		userName:"",
shortTagLine:"",
profileImageURL:"",
profileNFT:"",
firstName:"",
lastName:"",
eullBio:"",
externalSiteLink:"",
phone:"",
twitter:"",
instagram:"",
facebook:"",
medium:"",
email:"",
telegram:"",
    },
  });

  const toggle = (tab) => {
    debugger;
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleChange = (e, isBeneficiary = false) => {
      const { value, name, checked, type } = e.target;
      const { inputs } = state;

      inputs[name] = type === 'checkbox' ? checked : value;
      setState({
        ...state,
        inputs,
      });
  };

  return (
    <Layout>
      <div className="page-content bg-white">
        {/*  banner  */}
        <div
          className="dlab-bnr-inr dlab-bnr-inr-sm overlay-primary bg-pt"
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <div className="container">
            <div className="dlab-bnr-inr-entry">
              <h1 className="text-white d-flex align-items-center">
                <span className="mr-1">Profile</span>
              </h1>

              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className="ml-1">Profile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {!isLoggedIn ? (
          <PromptLogin />
        ) : (
          <>
            <div className="container-fluid mt-5">
              <div className="dlab-tabs choseus-tabs">
                <ul
                  className="nav row justify-content-center"
                  id="myTab"
                  role="tablist"
                >
                  <li>
                    <Link
                      to={'#'}
                      className={classnames({ active: activeTab === '1' }) + ''}
                      onClick={() => {
                        toggle('1');
                      }}
                    >
                      <span className="title-head">User Profile</span>
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
                      <span className="title-head">
                        Creator Profile
                      </span>
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
                      <span className="title-head">
                        Beneficiary Profile
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="container">
              <div className="tab-content chosesus-content">
                <div id="cost" className="tab-pane active py-5">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
					<ProfileForm/>
                    </TabPane>
                    <TabPane tabId="2">
                     <ProfileForm isCollection={true}/>
                    </TabPane>
                    <TabPane tabId="3">
                      <ProfileForm/>
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
