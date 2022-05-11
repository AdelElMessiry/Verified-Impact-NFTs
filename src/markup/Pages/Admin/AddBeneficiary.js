import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../../Layout/Header1";
import Footer from "../../Layout/Footer1";
import PageTitle from "../../Layout/PageTitle";

import bnr1 from "./../../../images/banner/bnr1.jpg";
import { Col, Container, Row } from "react-bootstrap";

const AddBeneficiary = () => {
  return (
    <>
      <Header />

      <div className="page-content bg-white">
        {/* <!-- inner page banner --> */}
        <div
          className="dlab-bnr-inr overlay-primary bg-pt"
          style={{ backgroundImage: "url(" + bnr1 + ")" }}
        >
          <PageTitle
            motherMenu="Add Beneficiary"
            activeMenu="Add Beneficiary"
          />
        </div>
        {/* <!-- inner page banner END --> */}
        {/* <!-- contact area --> */}
        <div className="section-full content-inner shop-account">
          {/* <!-- Product --> */}
          <div className="container">
            <div>
              <div className=" m-auto m-b30">
                <Container>
                  <Row>
                    <Col>
                      <input
                        type="text"
                        value="Name"
                        name="Name"
                        placeholder="Name"
                        className="form-control"
                      />
                    </Col>
                    <Col>
                      <input
                        type="text"
                        value="address"
                        placeholder="Address"
                        name="address"
                        className="form-control"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <textarea
                        rows={4}
                        name="description"
                        placeholder="Description"
                        className="form-control"
                      ></textarea>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      {" "}
                      <p className="form-submit">
                        <input
                          type="button"
                          value="Create"
                          className="btn btn-success"
                          name="submit"
                        />
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </div>
          {/* <!-- Product END --> */}
        </div>

        {/* <!-- contact area  END --> */}
      </div>

      <Footer />
    </>
  );
};

export default AddBeneficiary;
