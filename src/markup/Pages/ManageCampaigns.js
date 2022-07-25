import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { useNFTState } from '../../contexts/NFTContext';
import { useAuth } from '../../contexts/AuthContext';

import CampaignSingleRow from '../Element/campaignSingleRow';
import AddEditCampaignsModal from '../Element/AddEditCampaignsModal';
import { CLPublicKey } from 'casper-js-sdk';

//Manage Beneficiaries page
const ManageCampaigns = ({beneficiaryAddress}) => {
  const { campaigns } = useNFTState();
  const { entityInfo } = useAuth();
  const [showAddEditCampaignModal, setShowAddEditCampaignModal] =
    React.useState(false);
  const [beneficiaryCampaigns, setBeneficiaryCampaigns] = React.useState();
  useEffect(() => {
    const selectedCampaigns =
      campaigns &&
      campaigns?.filter(({ wallet_address }) => wallet_address.slice(13).replace(")", "") ===
          CLPublicKey.fromHex(entityInfo.publicKey).toAccountHashStr().slice(13));
    campaigns && setBeneficiaryCampaigns(selectedCampaigns);
  }, [campaigns]);
  return (
    <div className="m-auto m-b30">
      <Container>
        <Row className='mb-4'>
          <Col>
            <button
              type="button"
              className="btn btn-success"
              name="submit"
              onClick={() => setShowAddEditCampaignModal(true)}
            >
              Add New Campaign
            </button>
            {showAddEditCampaignModal && (
              <AddEditCampaignsModal
                show={showAddEditCampaignModal}
                handleCloseParent={() => {
                  setShowAddEditCampaignModal(false);
                }}
                data={undefined}
                beneficiaryAddress={beneficiaryAddress}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {campaigns && campaigns?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Requested Royalty</th>
                    <th scope="col">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaryCampaigns?.map((campaign) => (
                    <CampaignSingleRow campaign={campaign} key={campaign.id} beneficiaryAddress={beneficiaryAddress} />
                  ))}
                </tbody>
              </table>
            ) : (
              <h4 className="text-muted text-center my-5">
                No Campaigns Added Yet
              </h4>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageCampaigns;
