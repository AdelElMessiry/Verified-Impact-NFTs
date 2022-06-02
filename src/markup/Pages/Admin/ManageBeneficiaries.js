import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';

import { useAuth } from '../../../contexts/AuthContext';
import { getBeneficiariesList } from '../../../api/beneficiaryInfo';
import PromptLogin from '../PromptLogin';

import PageTitle from '../../Layout/PageTitle';

import bnr1 from './../../../images/banner/bnr1.jpg';
import Layout from '../../Layout';

//Manage Beneficiaries page
const ManageBeneficiaries = () => {
  const { isLoggedIn } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState();
  const [masterChecked, setMasterChecked] = useState(true);
  const [selectedList, setSelectedList] = useState([]);

  //getting beneficiary list
  useEffect(() => {
    (async () => {
      let newList = [];
      let beneficiaryList = !beneficiaries && (await getBeneficiariesList());
      !beneficiaries &&
        beneficiaryList.forEach(async (element) => {
          element['isApproved'] = true;
          newList.push(element);
        });
      !beneficiaries && setBeneficiaries(newList);
    })();
  }, [beneficiaries]);

  // Select/ UnSelect Table rows
  const onMasterCheck = (e) => {
    let tempList = beneficiaries;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    setMasterChecked(e.target.checked);
    setBeneficiaries(tempList);
    setSelectedList(beneficiaries.filter((e) => e.selected));
  };

  // Update List Item's state and Master Checkbox State
  const onItemCheck = (e, item) => {
    let tempList = beneficiaries;
    tempList.map((beneficiary) => {
      if (beneficiary.id === item.id) {
        beneficiary.selected = e.target.checked;
      }
      return beneficiary;
    });

    //To Control Master Checkbox State
    const totalItems = beneficiaries.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;

    // Update State
    setMasterChecked(totalItems === totalCheckedItems);
    setBeneficiaries(tempList);
    setSelectedList(beneficiaries.filter((e) => e.selected));
  };

  // Event to get selected rows(Optional)
  const getSelectedRows = () => {
    setSelectedList(beneficiaries.filter((e) => e.selected));
  };

  return (
    <Layout>
      <div className="page-content bg-white">
        {/* <!-- inner page banner --> */}
        <div
          className="dlab-bnr-inr overlay-primary bg-pt"
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <PageTitle
            motherMenu="Manage Beneficiaries"
            activeMenu="ManageBeneficiaries"
          />
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
                                  value={masterChecked}
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
                                      value={beneficiary.isApproved}
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
