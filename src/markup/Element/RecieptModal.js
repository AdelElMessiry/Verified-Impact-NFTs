import React, { useRef } from 'react'
import Modal from 'react-bootstrap/Modal';
import ReactToPrint from 'react-to-print';
import { CLPublicKey } from 'casper-js-sdk';
import { setIsTokenHasReceipt } from '../../api/nftInfo';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import {
    useNFTState,
    useNFTDispatch,
    updateNFTs,
    NFTActionTypes,
  } from '../../contexts/NFTContext';

export default function ReceiptModal({ show, handleCloseParent, data }) {
    const [showModal, setShowModal] = React.useState(show);
    const { ...stateList } = useNFTState();
    const nftDispatch = useNFTDispatch();
    const { beneficiaries,refreshNFTs } = stateList;
    const [ beneficiaryData , setBeneficiaryData ] =  React.useState()  
    const [receiptData, setReceiptData] = React.useState(
        {
            inputs: {
                donorName: "",
                donorAddress: "",
                repName: ""
            }
        }
    )
    const [confirm, setConfirm] = React.useState(false)
    const [loading , setLoading] = React.useState(false)
    const componentRef = useRef();
    let hasReceipt = data.hasReceipt == "true"
    const [confirmGenerateReceipt , setConfirmGenerateReceipt] = React.useState(hasReceipt)
    const { entityInfo } = useAuth();
    const handleChange = (e) => {
        const { value, name} = e.target;
        const { inputs } = receiptData;

        inputs[name] = value;
        setReceiptData({
            ...receiptData,
            inputs,
        });
    };
    const handleClose = () => {
        setShowModal(false);
        handleCloseParent();
    };
    const handelBeforePrint= ()=>{
            setConfirm(true);
            return Promise.resolve();
    }
    const extractNftReceipt = async()=>{
        setConfirm(true);
        setLoading(true);
        try{
            const changeReceiptStatus = await setIsTokenHasReceipt(
                true,
                data.tokenId,
                CLPublicKey.fromHex(entityInfo.publicKey)
            )
               //update listed/unlisted nft to radis
        const changedNFT={
            tokenId: data.tokenId,
            title: data.title,
            description: data.description,
            image: data.image,
            price: data.price,
            isForSale: data.isForSale,
            campaign: data.campaign,
            currency: data.currency,
            collection: data.collection,
            creator: data.creator,
            creatorPercentage: data.creatorPercentage,
            beneficiary: data.beneficiary,
            beneficiaryPercentage: data.beneficiaryPercentage,
            sdgs_ids: data.sdgs_ids,
            hasReceipt: "true",
          }
            updateNFTs(nftDispatch, { ...stateList },changedNFT);
            const updatedNFTsList = await refreshNFTs();
            nftDispatch({
              type: NFTActionTypes.SUCCESS,
              payload: {
                ...stateList,
                nfts: updatedNFTsList,
              },
            });
            setLoading(false);
            setConfirmGenerateReceipt(true);
        }catch(error){
            setLoading(false)
            console.log(error)
        }
    }
  //getting beneficiary details

  const getBeneficiaries = React.useCallback(async () => {
    const setSelectedBeneficiary =
      beneficiaries &&
      beneficiaries.find(({ address }) => data.beneficiary === address);
      setSelectedBeneficiary &&
      setBeneficiaryData(setSelectedBeneficiary)
  }, [ beneficiaries ]);

  React.useEffect(() => {
    (!beneficiaryData) && getBeneficiaries();
  }, [beneficiaryData, getBeneficiaries ]);
    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            scrollable={true}
            size='lg'
            backdrop='static'
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Donation RECEIPT
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='form-group justify-content-center m-5' ref={componentRef}>
                    <center>
                        <h3 className='align-self-center'>501(c)(3) ORGANIZATION DONATION RECEIPT</h3>
                    </center>

                    <div className='row form-group'>
                        <div className='mr-2'>Date: </div>
                        <h6>
                            {new Date().toLocaleString() + ""}
                        </h6>
                    </div>
                    <div className='row form-group '>
                        <div className='mr-2'>Name of Non-Profit Organization: </div>
                        <div>
                            <h6 className="ml-2">{data?.beneficiaryName}</h6>
                        </div>
                    </div>
                    {beneficiaryData?.mail && (
                    <div className='row form-group'>
                        <div className=' mr-2'> Mailing Address: </div>
                        <div>
                            <h6>
                                {beneficiaryData.mail}
                            </h6>
                        </div>
                    </div>
                    )}
                    <div className='row form-group'>
                        <div className=''> EIN: </div>

                        <div className=' mr-2'>
                            <h6 className='ml-2'>
                                {beneficiaryData?.ein}
                            </h6>
                        </div>

                        <div className='ml-4'><h6>(Find on the IRS Website)</h6></div>
                    </div>
                    <center>
                        <h3>Donor Information</h3>
                    </center>
                    <div className='row form-group'>
                        <div className=' mr-2 justify-content-center align-self-center'>
                            Donor's Name:
                        </div>
                        <div>
                            {!confirm ? (
                                <input
                                    type='text'
                                    className='form-control'
                                    name='donorName'
                                    placeholder=''
                                    onChange={(e) => handleChange(e)}
                                />
                            ) : (
                                <h6 >
                                    {receiptData.inputs.donorName}
                                </h6>
                            )}
                        </div>
                    </div>
                    <div className='row form-group'>
                        <div className=' mr-2 justify-content-center align-self-center'>Donor's Address: </div>
                        <div>
                            {!confirm ? (
                                <input
                                    type='text'
                                    className='form-control'
                                    name='donorAddress'
                                    placeholder=''
                                    onChange={(e) => handleChange(e)}
                                />
                            ) : (
                                <h6 className='col-4'>
                                    {receiptData.inputs.donorAddress}
                                </h6>
                            )}

                        </div>
                    </div>
                    <center>
                        <h3>Donation Information</h3>
                    </center>
                    <div>Thank you for your donation with a value of  ${data.price}, made to the above-mentioned 501(c)(3) Non-Profit Organization.
                        <br /> Donation Description:<br />
                        I, the undersigned representative, declare (or certify, verify, or state) under penalty of perjury
                        under the laws of the United States of America that there were no goods or services provided as
                        part of this donation. Furthermore, as of the date of this receipt the above-mentioned
                        organization is a current and valid 501(c)(3) non-profit organization in accordance with the
                        standards and regulations of the Internal Revenue Service (IRS).
                    </div>

                    <div className='row form-group mr-2 mt-4 '>
                        <h6 className=' justify-content-center align-self-center mt-1'>Representative’s Name: </h6>
                        <div>
                            {!confirm ? (
                                <input
                                    type='text'
                                    className='form-control ml-2'
                                    name='repName'
                                    placeholder=''
                                    onChange={(e) => handleChange(e)}
                                />
                            ) : (
                                <h6 className='ml-2'>
                                    {receiptData.inputs.repName}
                                </h6>
                            )}
                        </div>
                    </div>
                    <div className='row'>
                        <div>
                            <h6>Token ID: </h6>
                        </div>
                        <div className='ml-2'>
                            {data?.tokenId}
                        </div>
                    </div>
                </div>
                {!confirmGenerateReceipt? (
                    <button className='btn btn-success' 
                    disabled={
                        receiptData.inputs.donorName  == "" ||
                        receiptData.inputs.donorAddress  == "" ||
                        receiptData.inputs.repName  == "" 
                }
                onClick={()=>extractNftReceipt()}
                    >
                        {!loading ?
                        ("Generate NFT Receipt"):
                        (
                            <Spinner animation="border" variant="light" />
                          ) 
                        }
                    </button>
                ) : (
                    <ReactToPrint
                        // onBeforeGetContent={() => setConfirm(true)}
                        trigger={() => <button className='btn btn-success'
                            disabled={
                                receiptData.inputs.donorName == "" ||
                                receiptData.inputs.donorAddress == "" ||
                                receiptData.inputs.repName == ""
                            }
                        >Print this out!</button>}
                        content={() => componentRef.current}
                        onBeforeGetContent={() =>
                            handelBeforePrint()
                        }
                        onAfterPrint={()=>
                            hasReceipt? handleClose():
                            window.location.reload()
                        }
                    />
                )}                
            </Modal.Body>
        </Modal>
    )
}