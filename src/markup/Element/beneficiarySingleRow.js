import React from 'react';
import { Col, Container, Row, Form, Spinner } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';

import { approveBeneficiary } from '../../api/addBeneficiary';
import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';
import { sendDiscordMessage } from '../../utils/discordEvents';
import { SendTweet } from '../../utils/VINFTsTweets';
//Manage Beneficiaries page
const BeneficiarySingleRow = ({ beneficiary }) => {
  const { isLoggedIn, entityInfo } = useAuth();

  const [isApproveClicked, setIsApproveClicked] = React.useState(false);

  //saving new collection function
  const handleApproveBeneficiary = async (beneficiary) => {
    setIsApproveClicked(true);
    try {
      const approveBeneficiaryOut = await approveBeneficiary(
        beneficiary.address,
        (beneficiary) =>
          beneficiary?.approved === 'true' || beneficiary?.isApproved === 'true'
            ? false
            : true,
        CLPublicKey.fromHex(entityInfo.publicKey)
      );
      const deployResult = await getDeployDetails(approveBeneficiaryOut);
      console.log('......  saved successfully', deployResult);
      VIToast.success(
        `Beneficiary is ${(beneficiary) =>
          beneficiary?.approved === 'true' || beneficiary?.isApproved === 'true'
            ? 'unapproved'
            : 'approved'} successfully`
      );
      // beneficiary.approved state is checking on the passed beneficiary object from the parent with the old state before admin approval
      if (
        beneficiary?.approved === 'false' ||
        beneficiary?.isApproved === 'false'
      ) {
        await sendDiscordMessage(
          process.env.REACT_APP_BENEFICIARIES_WEBHOOK_ID,
          process.env.REACT_APP_BENEFICIARIES_TOKEN,
          beneficiary.username,
          '',
          `Great news! [${beneficiary.username}] beneficiary has been added to #verified-impact-nfts [click here to know more about their cause. (${window.location.origin}/#/)] @vinfts @casper_network @devxdao`
        );
        await SendTweet(
          `Great news! ${beneficiary.username} beneficiary has been added to #verified_impact_nfts click here ${window.location.origin}/#/ to know more about their cause. @vinfts @casper_network @devxdao `
        );
      }

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
      <th scope='row'>
        <button
          className='btn btn-success'
          onClick={() => handleApproveBeneficiary(beneficiary)}
        >
          {isApproveClicked ? (
            <Spinner animation='border' variant='light' />
          ) : beneficiary?.approved === 'true' ||
            beneficiary?.isApproved === 'true' ? (
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
