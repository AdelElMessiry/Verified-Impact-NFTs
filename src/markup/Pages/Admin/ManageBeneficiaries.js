import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext';
import PromptLogin from '../PromptLogin';
import Layout from '../../Layout';
import VINFTsTooltip from '../../Element/Tooltip';

import bnr1 from './../../../images/banner/bnr1.jpg';
import plusIcon from './../../../images/icon/plus.png';
import { useNFTState } from '../../../contexts/NFTContext';
import BeneficiarySingleRow from '../../Element/beneficiarySingleRow';
import ReactGA from 'react-ga';
//Manage Beneficiaries page
const ManageBeneficiaries = () => {
  const { isLoggedIn } = useAuth();
  const { beneficiaries } = useNFTState();
  React.useEffect(()=>{
    ReactGA.pageview(window.location.pathname +"/manage-beneficiaries");
  },[])
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
                  Manage Beneficiaries{' '}
                  <VINFTsTooltip title={`Add New Beneficiary`}>
                    <Link to={'./admin_beneficiary'}>
                      <img
                        alt='plusIcon'
                        src={plusIcon}
                        className='img img-fluid'
                        width='40px'
                      />
                    </Link>
                  </VINFTsTooltip>
                </span>
              </h1>

              <div className='breadcrumb-row'>
                <ul className='list-inline'>
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className='ml-1'>Manage Beneficiaries</li>
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
                        {beneficiaries ? (
                          <table className='table'>
                            <thead>
                              <tr>
                                <th scope='col'></th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Address</th>
                              </tr>
                            </thead>
                            <tbody>
                              {beneficiaries.length > 0 ? (
                                beneficiaries?.map((beneficiary,index) => (
                                  <BeneficiarySingleRow
                                    beneficiary={beneficiary}
                                    key={`${beneficiary.address}_${index}`}
                                  />
                                ))
                              ) : (
                                <h4 className='text-muted text-center my-5'>
                                  No Beneficiaries registered yet
                                </h4>
                              )}
                            </tbody>
                          </table>
                        ) : (
                          <div className='vinft-section-loader text-center my-5'>
                            <Spinner animation='border' variant='success' />
                            <p>Fetching Beneficiaries Please wait...</p>
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
  );
};

export default ManageBeneficiaries;
