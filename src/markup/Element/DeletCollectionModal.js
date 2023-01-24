import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Row, Col, Spinner } from 'react-bootstrap';
import { toast as VIToast } from 'react-toastify';
import { CLPublicKey } from 'casper-js-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { removeCollection } from '../../api/addCollection';
import { useAuth } from '../../contexts/AuthContext';
import { getDeployDetails } from '../../api/universal';


//buying NFT Modal
const DeleteCollectionModal = ({
    show,
    handleCloseParent,
    data,
    deleteCollection = () => {},
}) => {
    const [showModal, setShowModal] = React.useState(show);
    const [loadingIndex, setLoadingIndex] = React.useState(-1)
    const { entityInfo } = useAuth();
    const [emptyColl , setEmptyColl] = React.useState(data)
    //handle closing modal
    const handleClose = () => {
        setShowModal(false);
        handleCloseParent();
    };
    const removeEmptyCollection = async(collection, index) => {
        //console.log(collection)        
        setLoadingIndex(index)
        const res = await removeCollection(collection.id , CLPublicKey.fromHex(entityInfo.publicKey)).catch((err)=>{
            console.log(err)
            setLoadingIndex(-1);
            VIToast.error(err)

        })
        if(res){
            const deployResult = await getDeployDetails(res).catch((err)=>{
               // console.log(err)
                setLoadingIndex(-1);
                VIToast.error(err)
            });
            if(deployResult){
                let newArr = emptyColl
                newArr.splice(index, 1);
                setEmptyColl(newArr)
                VIToast.success("Collection removed successfully..");
                setLoadingIndex(-1)
                deleteCollection(collection)
             }else{
                setLoadingIndex(-1);
                VIToast.error("Something went wrong!!")
             }
        }
    }
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
                    Empty Collections
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='empty-collections'>
                    {data && data.length > 0 ? (
                        <>
                            {emptyColl &&
                                emptyColl.length > 0 &&
                                emptyColl.map((collection, index) => (
                                    <Row className='empty-collection-cell' key={index}>
                                        <Col>
                                            <h4>{collection.name}</h4>
                                        </Col>
                                        {loadingIndex  === index ? (
                                            <Spinner
                                                animation='border'
                                                variant='success'    
                                            />
                                        ) : (
                                            <Col 
                                            onClick={() => removeEmptyCollection(collection, index)} 
                                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'flex-end', pointerEvents: loadingIndex != -1 ? 'none': "auto" }}
                                            //disabled={loadingIndex != -1}

                                            >
                                                <FontAwesomeIcon icon={faTrashCan} size='2x' color='red' />
                                            </Col>
                                        )}
                                    </Row>
                                ))}
                        </>
                    ) : (
                        <div>Empty</div>
                    )
                    }

                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteCollectionModal;