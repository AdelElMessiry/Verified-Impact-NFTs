import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { useNFTState } from '../../contexts/NFTContext';
import { useAuth } from '../../contexts/AuthContext';

import CampaignSingleRow from '../Element/campaignSingleRow';
import AddEditCampaignsModal from '../Element/AddEditCampaignsModal';
import { CLPublicKey } from 'casper-js-sdk';
import CollectionSingleRow from '../Element/collectionSingleRow';
import AddEditCollectionsModal from '../Element/AddEditCollectionsModal';

//Manage Beneficiaries page
const ManageCollections = ({ beneficiaryAddress,beneficiaryPKAddress }) => {
  const { collections } = useNFTState();
  const { entityInfo } = useAuth();
  const [showAddEditCollectionModal, setShowAddEditCollectionModal] =
    React.useState(false);
  const [creatorCollections, setCreatorCollections] = React.useState();

  useEffect(() => {
    const selectedCollections =
      collections &&
      collections?.filter(({ creator }) =>
      creator?.includes('Account')
          ? creator.slice(13).replace(')', '') ===
            CLPublicKey.fromHex(entityInfo.publicKey)
              .toAccountHashStr()
              .slice(13)
          : creator ===
            CLPublicKey.fromHex(entityInfo.publicKey)
              .toAccountHashStr()
              .slice(13)
      );
    collections && setCreatorCollections(selectedCollections);
    
  }, [collections, entityInfo.publicKey]);

  return (
    <div className='m-auto m-b30'>
      <Container>
        <Row className='mb-4'>
          <Col>
            <button
              type='button'
              className='btn btn-success'
              name='submit'
              onClick={() => setShowAddEditCollectionModal(true)}
            >
              Add New Collection
            </button>
            {showAddEditCollectionModal && (
              <AddEditCollectionsModal
                show={showAddEditCollectionModal}
                handleCloseParent={() => {
                  setShowAddEditCollectionModal(false);
                }}
                data={undefined}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {collections && collections?.length > 0 ? (
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'></th>
                    <th scope='col'>Name</th>
                    <th scope='col'>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorCollections?.map((collection) => (
                    <CollectionSingleRow
                      collection={collection}
                      key={collection.id}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <h4 className='text-muted text-center my-5'>
                No Collections Added Yet
              </h4>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageCollections;
