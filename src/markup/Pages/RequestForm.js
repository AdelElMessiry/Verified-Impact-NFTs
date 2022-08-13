import React, { Fragment, useState } from 'react';
import validator from 'validator';
import { Col, Row, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';

import Layout from '../Layout';
import bnr1 from '../../images/banner/bnr1.jpg';
import PageTitle from '../Layout/PageTitle';
const RequestForm = () => {
  const IntialInputs = () => ({
    inputs: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  const [state, setState] = useState(IntialInputs());
  const [showErrors, setShowErrors] = useState();
  const [loader, setLoader] = useState();

  const handleChange = (e) => {
    const { value, name, type, checked } = e.target;
    const { inputs } = state;
    inputs[name] = type === 'checkbox' ? checked : value;
    setState({
      ...state,
      inputs,
    });
  };

  const handleSend = async () => {
    setShowErrors(true);
    const { name, email, subject, message } = state.inputs;

    if (name !== '' && email !== '' && subject !== '' && message !== '') {
      setLoader(true);
      await fetch(process.env.REACT_APP_REQUEST_FORM_SHEET, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Subject: subject,
          Message: message,
        }),
      })
        .then((r) => r.json())
        .then((response) => {
          debugger;
          setLoader(false);
          VIToast.success('Your Request Saved Successfully');
          setState(IntialInputs());
          setShowErrors(false);
        })
        .catch((error) => {
          debugger;
          setLoader(false);
          VIToast.error('An error occured');
        });
    }
  };

  return (
    <Layout>
      <div className="page-content bg-white">
        {/* <!-- inner page banner --> */}
        <div
          className="dlab-bnr-inr overlay-primary bg-pt"
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <PageTitle motherMenu="Privacy Policy" activeMenu="Privacy Policy" />
        </div>
        <div className="section-full content-inner shop-account">
          {/* <!-- Product --> */}
          <div className="container">
            <div className=" m-auto m-b30">
              {/* contact page content */}
              <div className="container">
                <div className="contact-form py-4">
                  <Row className='justify-content-center'>
                    <Col lg={8} md={9} xs={12}>
                      <Row className='mb-4'>
                        <Col>
                          <div className="required-field vinft-bg-gray">
                            <input
                              type="text"
                              name="name"
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.name}
                              placeholder="Full Name"
                              className="form-control"
                            />

                            <span className="text-danger required-field-symbol">
                              *
                            </span>
                            {showErrors === true &&
                              validator.isEmpty(state.inputs.name) && (
                                <div className="text-danger">Required</div>
                              )}
                          </div>
                        </Col>
                      </Row>
                      <Row className='mb-4'>
                        <Col>
                          <div className="required-field vinft-bg-gray">
                            <input
                              type="email"
                              name="email"
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.email}
                              placeholder="Email"
                              className="form-control"
                            />

                            <span className="text-danger required-field-symbol">
                              *
                            </span>
                            {showErrors === true &&
                              validator.isEmpty(state.inputs.email) && (
                                <div className="text-danger">Required</div>
                              )}
                          </div>
                        </Col>{' '}
                      </Row>
                      <Row className='mb-4'>
                        <Col>
                          <div className="required-field vinft-bg-gray">
                            <input
                              type="text"
                              name="subject"
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.subject}
                              placeholder="Subject"
                              className="form-control"
                            />

                            <span className="text-danger required-field-symbol">
                              *
                            </span>
                            {showErrors === true &&
                              validator.isEmpty(state.inputs.subject) && (
                                <div className="text-danger">Required</div>
                              )}
                          </div>
                        </Col>
                      </Row>
                      <Row className='mb-4'>
                        <Col>
                          <div className="required-field vinft-bg-gray">
                          <textarea
                              rows={4}
                              name="message"
                              onChange={(e) => handleChange(e)}
                              value={state.inputs.message}
                              placeholder="Message"
                              className="form-control"
                            />

                            <span className="text-danger required-field-symbol">
                              *
                            </span>
                            {showErrors === true &&
                              validator.isEmpty(state.inputs.message) && (
                                <div className="text-danger">Required</div>
                              )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <button
                            onClick={() => handleSend()}
                            type="button"
                            className="btn btn-success float-right"
                          >
                            {loader ? (
                              <Spinner
                                as="span"
                                animation="border"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              <span>Send</span>
                            )}
                            <span className="ti-arrow-right" />
                          </button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestForm;
