import React from 'react';
import { Col, Container, Row, Form, Spinner } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';

import { approveBeneficiary } from '../../api/addBeneficiary';
import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';

//Manage Beneficiaries page
const BeneficiarySingleRow = ({beneficiary}) => {
  const { isLoggedIn, entityInfo } = useAuth();

  const [isApproveClicked, setIsApproveClicked] = React.useState(false);

  //saving new collection function
  const handleApproveBeneficiary = async (beneficiary) => {
    setIsApproveClicked(true);
    try {
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
      setIsApproveClicked(false);

      window.location.reload();
    } catch (err) {
      if (err.message.includes('User Cancelled')) {
        VIToast.error('User Cancelled Signing');
      } else {
        VIToast.error(err.message);
      }
      setIsApproveClicked(false);
      return;
    }
  };

  return (
    <tr key={beneficiary.address}>
      <th scope="row">
        <button
          className="btn btn-success"
          onClick={() => handleApproveBeneficiary(beneficiary)}
        >
          {isApproveClicked ? (
            <Spinner animation="border" variant="light" />
          ) : beneficiary.approved == 'true' ? (
            'Unapprove'
          ) : (
            'Approve'
          )}
        </button>
      </th>
      <td>{beneficiary.username}</td>
      <td>{beneficiary.address}</td>
    </tr>
  );
};

export default BeneficiarySingleRow;
