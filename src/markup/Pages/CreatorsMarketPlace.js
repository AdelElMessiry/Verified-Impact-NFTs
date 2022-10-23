import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext'
import { useNFTState } from '../../contexts/NFTContext';
import Layout from '../Layout';
import PromptLogin from './PromptLogin';
import bnr1 from './../../images/banner/bnr1.jpg';
import MarketPlaceSingleRow from '../Element/marketPlaceSingleRow';
import { profileClient } from '../../api/profileInfo';
 const CreatorsMarketPlace = () => {
  const { isLoggedIn } = useAuth();
  const { creators } = useNFTState();
  const [profileDetails, setProfileDetails] = React.useState([]);

  const getProfile = React.useCallback(() => {
    creators?.map(async(creator)=>{
      let userProfiles = await profileClient.getProfile(creator.address, true);
      if (userProfiles) {
        if (userProfiles.err === 'Address Not Found') {
          setProfileDetails(null);
        } else {
          let list = Object.values(userProfiles)[0];
          //setMyArray(oldArray => [...oldArray, newElement]);
          userProfiles &&
            setProfileDetails(profileDetails => [...profileDetails, list.creator]);
        }
      }
    })
    console.log(profileDetails , "profileDetails ");
  }, [creators]);
  React.useEffect(()=>{
    console.log(creators , "creators creators")
   creators&& getProfile()
  },[creators])
  return (
    <Layout>
    <div className='page-content bg-white'>
      {/* <!-- inner page banner --> */}
      <div
        className='dlab-bnr-inr overlay-primary bg-pt'
        style={{ backgroundImage: 'url(' + bnr1 + ')' }}
      >
        <div className='container'>
          <div className='dlab-bnr-inr-entry'>
            <h1 className='text-white d-flex align-items-center'>
              <span className='mr-1'>
                Discover Creators{' '}
              </span>
            </h1>

            <div className='breadcrumb-row'>
              <ul className='list-inline'>
                <li>
                  <Link to={'#'}>Home</Link>
                </li>
                <li className='ml-1'>Discover Creators</li>
              </ul>
            </div>
          </div>
        </div>
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
                  <Row>
                    <Col>
                      {profileDetails && creators ? (
                        <table className='table'>
                          <thead>
                            <tr>
                              <th scope='col'></th>
                              <th scope='col'>Name</th>
                              <th scope='col'>Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {profileDetails.length > 0 ? (
                              profileDetails?.map((creator) => (
                                <MarketPlaceSingleRow
                                  type={"creators"}
                                  item={creator}
                                  key={creator.address}
                                />
                              ))
                            ) : (
                              <h4 className='text-muted text-center my-5'>
                                No Creators registered yet
                              </h4>
                            )}
                          </tbody>
                        </table>
                      ) : (
                        <div className='vinft-section-loader text-center my-5'>
                          <Spinner animation='border' variant='success' />
                          <p>Fetching Creators Please wait...</p>
                        </div>
                      )}
                    </Col>
                  </Row>
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
  )
}
export default CreatorsMarketPlace