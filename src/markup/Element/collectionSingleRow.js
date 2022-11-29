import React from 'react';
import AddEditCampaignsModal from './AddEditCampaignsModal';
import editIcon from './../../images/icon/edit.png';
import AddEditCollectionsModal from './AddEditCollectionsModal';

//Manage Beneficiaries page
const CollectionSingleRow = ({ collection}) => {
  const [showAddEditCollectionModal, setShowAddEditCollectionModal] =
    React.useState(false);
  return (
    <tr key={collection.id}>
      <td>
        <img
          src={editIcon}
          className="img img-fluid"
          width="40px"
          alt="plusIcon"
          onClick={() => setShowAddEditCollectionModal(true)}
        />
        {showAddEditCollectionModal && (
          <AddEditCollectionsModal
            show={showAddEditCollectionModal}
            handleCloseParent={() => {
              setShowAddEditCollectionModal(false);
            }}
            onClick={() => {
              setShowAddEditCollectionModal(true);
            }}
            data={collection}
          />
        )}
      </td>
      <td>{collection.name}</td>
      <td>{collection.url}</td>
    </tr>
  );
};

export default CollectionSingleRow;
