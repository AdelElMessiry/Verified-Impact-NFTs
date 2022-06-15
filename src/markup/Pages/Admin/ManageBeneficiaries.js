import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext';
import { getBeneficiariesList } from '../../../api/beneficiaryInfo';
import PromptLogin from '../PromptLogin';
import Layout from '../../Layout';
import VINFTsTooltip from '../../Element/Tooltip';

import bnr1 from './../../../images/banner/bnr1.jpg';
import plusIcon from './../../../images/icon/plus.png';


//Manage Beneficiaries page
const ManageBeneficiaries = () => {
  const { isLoggedIn } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState();
  const [masterChecked, setMasterChecked] = useState(false);
  const [selectedList, setSelectedList] = useState([]);

  //getting beneficiary list
  useEffect(() => {
    (async () => {
      let newList = [];
      let beneficiaryList = !beneficiaries && (await getBeneficiariesList());
      !beneficiaries &&
        beneficiaryList.forEach(async (element) => {
          element['isApproved'] = false;
          newList.push(element);
        });
      !beneficiaries && setBeneficiaries(newList);
    })();
  }, [beneficiaries]);

  // Select/ UnSelect Table rows
  const onMasterCheck = (e) => {
    let tempList = beneficiaries;
    // Check/ UnCheck All Items
    tempList.map((beneficiary) => (beneficiary.isApproved = e.target.checked));

    //Update State
    setMasterChecked(e.target.checked);
    setBeneficiaries(tempList);
    setSelectedList(beneficiaries.filter((beneficiary) => beneficiary.isApproved));
  };

  // Update List Item's state and Master Checkbox State
  const onItemCheck = (e, item) => {
    let tempList = beneficiaries;
    tempList.map((beneficiary) => {
      if (beneficiary.id === item.id) {
        beneficiary.isApproved = e.target.checked;
      }
      return beneficiary;
    });

    //To Control Master Checkbox State
    const totalItems = beneficiaries.length;
    const totalCheckedItems = tempList.filter((beneficiary) => beneficiary.isApproved).length;

    // Update State
    setMasterChecked(totalItems === totalCheckedItems);
    setBeneficiaries(tempList);
    setSelectedList(beneficiaries.filter((beneficiary) => beneficiary.isApproved));
  };

  // Event to get selected rows(Optional)
  const getSelectedRows = () => {
    setSelectedList(beneficiaries.filter((beneficiary) => beneficiary.isApproved));
  };

  return (
    <Layout>
      <div className="page-content bg-white">
       {/* <!-- inner page banner --> */}
       <div
          className='dlab-bnr-inr overlay-primary bg-pt'
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
                <div className="container">
            <div className="dlab-bnr-inr-entry">
              <h1 className="text-white d-flex align-items-center">
                <span className="mr-1">
                  Manage Beneficiaries{' '}
                  <VINFTsTooltip title={`Add New Beneficiary`}>
                    <Link to={'./add-beneficiary'}>
                      <img
                        src={plusIcon}
                        className="img img-fluid"
                        width="40px"
                      />
                    </Link>
                  </VINFTsTooltip>
                </span>
              </h1>

              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className="ml-1">Manage Beneficiaries</li>
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
          <div className="section-full content-inner shop-account">
            {/* <!-- Product --> */}
            <div className="container">
              <div>
                <div className=" m-auto m-b30">
                  <Container>
                    <Row className='mb-4'>
                      <Col>
                      <button disabled={selectedList.length<=0} className='btn btn-success'> Approve {selectedList.length} Beneficiaries </button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">
                                <Form.Check
                                  type={'checkbox'}
                                  id={"mastercheck"}
                                  onChange={(e) => onMasterCheck(e)}
                                  checked={masterChecked}
                                  label={""}
                                  name="masterChecked"
                                />
                              </th>
                              <th scope="col">Name</th>
                              <th scope="col">Address</th>
                              <th scope="col">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {beneficiaries &&
                              beneficiaries?.map((beneficiary) => (
                                <tr
                                  key={beneficiary.address}
                                  className={
                                    beneficiary.isApproved ? 'selected' : ''
                                  }
                                >
                                  <th scope="row">
                                    <Form.Check
                                      type={"checkbox"}
                                      checked={beneficiary.isApproved}
                                      id={`rowcheck${beneficiary.address}`}
                                      onChange={(e) =>
                                        onItemCheck(e, beneficiary)
                                      }
                                      label={""}
                                      name="isApproved"
                                    />
                                  </th>
                                  <td>{beneficiary.name}</td>
                                  <td>{beneficiary.address}</td>
                                  <td>{beneficiary.description}</td>
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
