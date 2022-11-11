import React from 'react';
import { Col, Container, Row, Form, Spinner } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';

import { approveBeneficiary } from '../../api/addBeneficiary';
import { getDeployDetails } from '../../api/universal';
import { useAuth } from '../../contexts/AuthContext';
import { sendDiscordMessage } from '../../utils/discordEvents';
import { SendTweet } from '../../utils/VINFTsTweets';
import { profileClient } from '../../api/profileInfo';
import { updateProfiles, useNFTDispatch, useNFTState } from '../../contexts/NFTContext';
//Manage Beneficiaries page
const BeneficiarySingleRow = ({ beneficiary }) => {
  const { isLoggedIn, entityInfo } = useAuth();
  const [isApproveClicked, setIsApproveClicked] = React.useState(false);
  const { ...stateList } = useNFTState();
  const nftDispatch = useNFTDispatch();
  //saving new collection function
  const handleApproveBeneficiary = async (beneficiary) => {
    setIsApproveClicked(true);
    try {
      const approveBeneficiaryOut = await approveBeneficiary(
        beneficiary.address,
        beneficiary.address_pk,
        beneficiary?.isApproved === 'true' ? false : true,
        CLPublicKey.fromHex(entityInfo.publicKey)
      );
      const deployResult = await getDeployDetails(approveBeneficiaryOut);
      console.log('......  saved successfully', deployResult);
      VIToast.success(
        `Beneficiary is ${
          beneficiary?.isApproved === 'true' ? 'unapproved' : 'approved'
        } successfully`
      );
      const userProfiles = await profileClient.getProfile(beneficiary.address,true);
      if (userProfiles) {
        let list = Object.values(userProfiles)[0];
      const normalList=  Object.keys(list.normal).length === 0 ? {} : list.normal
      const beneficiaryList =
      Object.keys(list.beneficiary).length === 0
        ? {}
        : list.beneficiary;
    const creatorList =
      Object.keys(list.creator).length === 0 ? {} : list.creator;
      const isApproved=beneficiary?.isApproved === 'true' ? 'false' : 'true'
      let changedData = {};
        changedData = {
          [beneficiary.address]: {
            normal: normalList,
            beneficiary: Object.assign({}, beneficiaryList, {
             isApproved ,
            }),
            creator: creatorList,
          },
        };
      await updateProfiles(nftDispatch, stateList, changedData);

      }

      // beneficiary.approved state is checking on the passed beneficiary object from the parent with the old state before admin approval
      if (beneficiary?.isApproved === 'false') {
        let sdgs = beneficiary.sdgs_ids?.split(",")
        let s = []
          if (sdgs){            
            sdgs.map((sdg) => (
              s.push(`#SDG${sdg}`)
          ))}
        await sendDiscordMessage(
          process.env.REACT_APP_BENEFICIARIES_WEBHOOK_ID,
          process.env.REACT_APP_BENEFICIARIES_TOKEN,
          beneficiary.username,
          '',
          `Great news! [${beneficiary.username}] beneficiary has been added to #verified-impact-nfts [click here to know more about their cause. (${window.location.origin}/#/)] @vinfts @casper_network @devxdao`
        );
        await SendTweet(
          `Great news! ${beneficiary.username} beneficiary has been added to #verified_impact_nfts click here ${window.location.origin}/#/ to know more about their cause. @casper_network @devxdao ${s.toString().replaceAll(',', ' ')}`
        );
      }

      setIsApproveClicked(false);

      //window.location.reload();
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
          ) : beneficiary.isApproved === 'true' ? (
            'Unapprove'
          ) : (
            'Approve'
          )}
        </button>
      </th>
      <td>{beneficiary.username}</td>
      <td>{beneficiary.address_pk}</td>
    </tr>
  );
};

export default BeneficiarySingleRow;
