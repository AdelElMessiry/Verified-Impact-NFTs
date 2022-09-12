import React from 'react'
import Modal from 'react-bootstrap/Modal';

export default function ReceiptModal({ show, handleCloseParent, data }) {
    const [showModal, setShowModal] = React.useState(show);
    // const handleChange = (e) => {
    //     const { value, name, checked, type } = e.target;
    //     const { inputs } = state;

    //     inputs[name] = type === 'checkbox' ? checked : value;
    //     setState({
    //         ...state,
    //         inputs,
    //     });
    // };
    const handleClose = () => {
        setShowModal(false);
        handleCloseParent();
    };
    const date = new Date().getFullYear()
    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            scrollable={true}
            size='lg'
            backdrop='static'
        >
            <Modal.Header closeButton>
                {/*  <Modal.Title>
                    501(c)(3) ORGANIZATION DONATION RECEIPT
                </Modal.Title>*/}
            </Modal.Header>
            <Modal.Body>
                <div className='form-group justify-content-center '>
                    <center>
                        <h3 className='align-self-center'>501(c)(3) ORGANIZATION DONATION RECEIPT</h3>
                    </center>

                    <div className='row form-group mr-2'>
                        <div>Date: </div>
                        <h6 className='col-4'>
                            {new Date().toLocaleString() + ""}
                        </h6>
                    </div>
                    <div className='row form-group '>
                        <div className='mr-2'>Name of Non-Profit Organization: </div>
                        <div>
                            <h6 className="ml-2">{data?.beneficiaryName}</h6>

                        </div>
                    </div>
                    <div className='row form-group'>
                        <div className=' mr-2'> Mailing Address: </div>
                        <div>
                            <input
                                type='text'
                                className='form-control'
                                name='address'
                                placeholder=''
                            />
                        </div>
                    </div>
                    <div className='row form-group'>
                        <div className=''> EIN: </div>

                        <div> <input
                            type='text'
                            className='form-control ml-2 col-12'
                            name='address'
                            placeholder=''
                        /></div>

                        <div className='ml-4'><h7>(Find on the IRS Website)</h7></div>
                    </div>
                    <center>
                        <h3>Donor Information</h3>
                    </center>
                    <div className='row form-group'>
                        <div className=' mr-2'>Donor's Name: </div>
                        <div>
                            <input
                                type='text'
                                className='form-control'
                                name='address'
                                placeholder=''
                            />
                        </div>
                    </div>
                    <div className='row form-group'>
                        <div className=' mr-2'>Donor's Address: </div>
                        <div>
                            <input
                                type='text'
                                className='form-control'
                                name='address'
                                placeholder=''
                            />
                        </div>
                    </div>
                    <center>
                        <h3>Donation Information</h3>
                    </center>
                    <div>Thank you for your donation with a value of  $250, made to the above-mentioned 501(c)(3) Non-Profit Organization.
                        <br /> Donation Description:<br />
                        I, the undersigned representative, declare (or certify, verify, or state) under penalty of perjury
                        under the laws of the United States of America that there were no goods or services provided as
                        part of this donation. Furthermore, as of the date of this receipt the above-mentioned
                        organization is a current and valid 501(c)(3) non-profit organization in accordance with the
                        standards and regulations of the Internal Revenue Service (IRS).
                    </div>

                    <div className='row form-group mr-2 mt-4'>
                        <h6>Representative’s Name</h6>
                        <div>
                            <input
                                type='text'
                                className='form-control ml-2'
                                name='address'
                                placeholder=''
                            />
                        </div>
                    </div>

                    <div className='row'>
                        <div>
                            <h6>Token ID: </h6>
                        </div>
                        <div className='ml-2'>
                            {data.tokenId}
                        </div>
                    </div>
                </div>
                <button className='btn btn-success'>
                    Generate Receipt
                </button>
            </Modal.Body>
        </Modal>
    )
}