import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';

import { useAuth } from '../../../contexts/AuthContext';
import { approveBeneficiary } from '../../../api/addBeneficiary';
import PromptLogin from '../PromptLogin';
import Layout from '../../Layout';
import VINFTsTooltip from '../../Element/Tooltip';
import { getDeployDetails } from '../../../api/universal';
import { profileClient } from '../../../api/profileInfo';

import bnr1 from './../../../images/banner/bnr1.jpg';
import plusIcon from './../../../images/icon/plus.png';

//Manage Beneficiaries page
const ManageBeneficiaries = () => {
  const { isLoggedIn, entityInfo } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState();

  const loadBeneficiaries = React.useCallback(async () => {
    let selectedList = [];
    let profiles = await profileClient.getProfilesList();

    profiles &&
      profiles.map((data) => {
        let lists = Object.values(data)[0];
        
    Object.keys(lists.beneficiary).length!==0&&selectedList.push(lists.beneficiary);
      });
      debugger;
    profiles && setBeneficiaries(selectedList);
  }, []);

  //getting beneficiary list
  React.useEffect(() => {
    !beneficiaries && loadBeneficiaries();
  }, [beneficiaries, loadBeneficiaries]);

  //saving new collection function
  const handleApproveBeneficiary = async (beneficiary) => {
    debugger;
    const approveBeneficiaryOut = await approveBeneficiary(
      beneficiary.address,
      beneficiary.approved === 'true' ? false : true,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );
    const deployResult = await getDeployDetails(approveBeneficiaryOut);
    console.log('......  saved successfully', deployResult);
    VIToast.success(
      `Beneficiary is ${
        beneficiary.approved === 'true' ? 'unapproved' : 'approved'
      } successfully`
    );

    window.location.reload();
  };

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
                        <table className='table'>
                          <thead>
                            <tr>
                              <th scope='col'></th>
                              <th scope='col'>Name</th>
                              <th scope='col'>Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {beneficiaries &&
                              beneficiaries?.map((beneficiary) => (
                                <tr key={beneficiary.address}>
                                  <th scope='row'>
                                    <button
                                      className='btn btn-success'
                                      onClick={() =>
                                        handleApproveBeneficiary(beneficiary)
                                      }
                                    >
                                      {beneficiary.approved == 'true'
                                        ? 'Unapprove'
                                        : 'Approve'}
                                    </button>
                                  </th>
                                  <td>{beneficiary.username}</td>
                                  <td>{beneficiary.address}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
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
