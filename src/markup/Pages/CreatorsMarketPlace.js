import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Spinner } from 'react-bootstrap';
import Carousel from 'react-elastic-carousel';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import { useNFTState } from '../../contexts/NFTContext';
import Layout from '../Layout';
import bnr1 from './../../images/banner/bnr1.jpg';
import { profileClient } from '../../api/profileInfo';
import UserCard from '../Element/userCard';
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 992, itemsToShow: 4 },
  { width: 1200, itemsToShow: 4 },
];

const options = {
  buttons: { showDownloadButton: false },
};
const CreatorsMarketPlace = () => {
  const { creators } = useNFTState();
  const [profileDetails, setProfileDetails] = React.useState([]);

  const getProfile = React.useCallback(() => {
    creators?.map(async (creator) => {
      let userProfiles = await profileClient.getProfile(creator.address, true);
      if (userProfiles) {
        if (userProfiles.err === 'Address Not Found') {
          setProfileDetails(null);
        } else {
          let list = Object.values(userProfiles)[0];
          userProfiles &&
            setProfileDetails(profileDetails => [...profileDetails, list.creator]);
        }
      }
    })
  }, [creators]);
  React.useEffect(() => {
    creators && getProfile()
  }, [creators])
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
        <div className='section-full content-inner shop-account'>
          {/* <!-- Product --> */}
          <div>
            <div>
              <div className=' m-auto m-b30'>
                <Row>
                  <Col>
                    {profileDetails.length > 0 ? (
                      <SimpleReactLightbox>
                        <SRLWrapper options={options}>
                          <div className='clearfix portfolio nfts-slider'>
                            <ul
                              id='masonry'
                              className='dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1'
                            >
                              {profileDetails &&
                                <Carousel itemsToShow={3} breakPoints={breakPoints}>
                                  {profileDetails.map((item, index) => (
                                    <React.Fragment key={`${index}${item.address}`}>
                                      <li className='web design card-container p-a0'>
                                        <UserCard item={item} type={"creators"} />
                                      </li>
                                    </React.Fragment>
                                  ))}
                                </Carousel>
                              }
                            </ul>
                          </div>
                        </SRLWrapper>
                      </SimpleReactLightbox>
                    ) : (
                      <div className='vinft-section-loader text-center my-5'>
                        <Spinner animation='border' variant='success' />
                        <p>Fetching Creators Please wait...</p>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          {/* <!-- Product END --> */}
        </div>
        {/* <!-- contact area  END --> */}
      </div>
    </Layout>
  )
}
export default CreatorsMarketPlace