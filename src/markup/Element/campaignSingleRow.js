import React from 'react';
import AddEditCampaignsModal from './AddEditCampaignsModal';
import editIcon from './../../images/icon/edit.png';

//Manage Beneficiaries page
const CampaignSingleRow = ({ campaign,beneficiaryAddress }) => {
  const [showAddEditCampaignModal, setShowAddEditCampaignModal] =
    React.useState(false);
  return (
    <tr key={campaign.address}>
      <td>
        <img
          src={editIcon}
          className="img img-fluid"
          width="40px"
          alt="plusIcon"
          onClick={() => setShowAddEditCampaignModal(true)}
        />
        {showAddEditCampaignModal && (
          <AddEditCampaignsModal
            show={showAddEditCampaignModal}
            handleCloseParent={() => {
              setShowAddEditCampaignModal(false);
            }}
            onClick={() => {
              setShowAddEditCampaignModal(true);
            }}
            data={campaign}
            beneficiaryAddress={beneficiaryAddress}
          />
        )}
      </td>
      <td>{campaign.name}</td>
      <td>{campaign.requested_royalty}</td>
      <td>{campaign.url}</td>
    </tr>
  );
};

export default CampaignSingleRow;
