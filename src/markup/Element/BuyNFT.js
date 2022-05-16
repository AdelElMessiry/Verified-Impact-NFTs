import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { transferFees } from '../../utils/contract-utils';
import { transfer } from '../../api/transfer';
import { approve } from '../../api/approve';
import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';
import { CLPublicKey } from 'casper-js-sdk';
import { Row, Col } from "react-bootstrap";
import { isTemplateExpression } from "typescript";

//buying NFT Modal
const BuyNFTModal = ({ show, handleCloseParent,data }) => {
    const IntialInputs = () => ({
        inputs: {
          address: "",
        },
      });
  const { entityInfo } = useAuth();
  const [toAddress, setToAddress] = React.useState("");
  const [showModal, setShowModal] = useState(show);
  const [state, setState] = useState(IntialInputs());
  if (!data) return <></>;

  //transfer NFT Function
  const makeTransfer = async () => {
    const nftID = data.id;

    const approveTransfer = await approve(
      CLPublicKey.fromHex(toAddress),
      nftID
    );

    try {
      const deployApproveResult = await getDeployDetails(approveTransfer);
      console.log(
        "...... Token approve transferred successfully",
        deployApproveResult
      );

      const transferDeployHash = await transfer(
        CLPublicKey.fromHex(entityInfo.publicKey),
        CLPublicKey.fromHex(toAddress),
        nftID
      );
      const deployTransferResult = await getDeployDetails(transferDeployHash);
      console.log(
        "...... Token fees transferred successfully",
        deployTransferResult
      );
    } catch (err) {
      console.log("Transfer Err " + err);
    }

    try {
      const transferFeesHash = await transferFees(entityInfo.publicKey, nftID);
      const deployFeesResult = await getDeployDetails(transferFeesHash);

      console.log("...... Token transferred successfully", deployFeesResult);
    } catch (err) {
      console.log("Transfer Err " + err);
    }
  };

//handle closing modal
  const handleClose = () => {
    setShowModal(false);
    handleCloseParent();
  };

  //handling changing in controls
  const handleChange = (e) => {
    const { value, name, checked, type } = e.target;
    const { inputs } = state;

    inputs[name] = type === "checkbox" ? checked : value;
    setState({
      ...state,
      inputs,
    });
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      scrollable={true}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Buy {data.name} NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="reserve-form">
            <Row>
                <Col>
                <h5>{data.name}</h5>
                <p className="text-muted">{data.description}</p>
                </Col>
            </Row>
          <div className="row form-group justify-content-center">
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="Transfer To*"
                onChange={(e) => handleChange(e)}
                value={state.inputs.address}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn" onClick={handleClose}>
          Close
        </button>
        <button className="btn btn-success" onClick={() => makeTransfer()}>
          Buy
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyNFTModal;
