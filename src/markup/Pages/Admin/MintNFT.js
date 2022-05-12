import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Layout/Header1";
import Footer from "../../Layout/Footer1";
import PageTitle from "../../Layout/PageTitle";

import bnr1 from "./../../../images/banner/bnr1.jpg";
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { getBeneficiariesList } from "../../../api/beneficiaryInfo";
import { getCampaignsList } from "../../../api/campaignInfo";
import { createCampaign } from "../../../api/createCampaign";
import { CLPublicKey } from "casper-js-sdk";
import ImageUploader from "react-images-upload";
import { toast as VIToast } from "react-toastify";
import { uploadImg } from "../../../api/imageCDN";
import { Form } from "react-bootstrap";
import { mint, NFTReference } from "../../../api/mint";
import { getDeployDetails } from "../../../api/universal";
import { numberOfNFTsOwned } from "../../../api/userInfo";

const MintNFT = () => {
  const { entityInfo, refreshAuth } = useAuth();
  const [beneficiaries, setBeneficiaries] = React.useState([]);
  const [campaigns, setCampaigns] = React.useState([]);
  const [image, setImage] = useState([]);
  const [collectionState, setCollectionState] = useState(1);
  const [collections, setCollections] = useState([]);
  const [uploadedImageURL, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadingToCloud, setUploadingToCloud] = useState(false);
  const [validID, setValidID] = useState(false);

  const handleChange = (e) => {
    const { value, name, checked, type } = e.target;
    const { inputs } = state;

    inputs[name] = type === "checkbox" ? checked : value;
    setState({
      ...state,
      inputs,
    });
  };
  const [state, setState] = useState({
    inputs: {
      imageUrl: "",
      name: "",
      description: "",
      beneficiary: "",
      campaign: "",
      price: "",
      isForSale: false,
      category: "",
      currency: "",
      creator: "",
      creatorPercentage: "",
      collectionName: "",
      beneficiary: "",
      beneficiaryPercentage: "",
      collection: "",
      isImageURL:false
    },
  });
  const getBeneficiaries = React.useCallback(async () => {
    const beneficiaries = await getBeneficiariesList();
    setBeneficiaries(beneficiaries);
  }, [beneficiaries]);

  React.useEffect(() => {
    !beneficiaries && getBeneficiaries();
  }, [beneficiaries]);
  const getCampaigns = React.useCallback(async () => {
    const campaigns = await getCampaignsList();
    setCampaigns(campaigns);
  }, [beneficiaries]);

  React.useEffect(() => {
    !campaigns && getCampaigns();
  }, [campaigns]);

  const onDrop = (picture) => {
    setImage(picture);
  };

  async function mintNFT() {
    if (!uploadedImageURL) {
      return VIToast.error("Please upload image or enter direct URL");
    }
    if (!validID) {
      return VIToast.error("Please enter an id that is not already occupied");
    }

    let cloudURL = uploadedImageURL;
    if (!state.inputs.directImgURL && uploadedFile) {
      console.log("Img", uploadedFile);
      console.log("Img url", uploadedImageURL);
      setUploadingToCloud(true);
      try {
        cloudURL = await uploadImg(uploadedFile);
      } catch (err) {
        console.log(err);
        VIToast.error("Image couldn't be uploaded to cloud CDN !");
        setUploadingToCloud(false);
        return;
      }
      VIToast.success("Image uploaded to cloud CDN successfully !");
      setUploadingToCloud(false);
    }
    mintNewNFT(cloudURL);
  }

  async function mintNewNFT(imgURL) {
    if (!uploadedImageURL) {
      return VIToast.error("Please upload image or enter direct URL");
    }

    if (entityInfo.publicKey) {
      console.log("Your pub key: ", entityInfo.publicKey);

      // setMintStage(MintingStages.STARTED);

      let mintDeployHash;

      try {
        mintDeployHash = await mint(CLPublicKey.fromHex(entityInfo.publicKey), {
          title: state.inputs.name,
          description: state.inputs.description,
          image: image,
          price: state.inputs.price,
          isForSale: state.inputs.isForSale,
          campaign: state.inputscampaign,
          category: state.inputs.category,
          currency: state.inputs.currency,
          collectionName:
            collectionState == 1
              ? state.inputs.collection
              : state.inputs.collectionName,
          creator: state.inputs.creator,
          creatorPercentage: state.inputs.creatorPercentage,
          beneficiary: state.inputs.beneficiary,
          beneficiaryPercentage: state.inputs.beneficiaryPercentage,
        });
      } catch (err) {
        if (err.message.includes("User Cancelled")) {
          // setErrStage(MintingStages.STARTED);
        }
        return;
      }

      //setMintStage(MintingStages.TX_PENDING);

      try {
        const deployResult = await getDeployDetails(mintDeployHash);
        console.log("...... Token minted successfully", deployResult);
      } catch (err) {
        //   setErrStage(MintingStages.TX_PENDING);
      }
      //  setMintStage(MintingStages.TX_SUCCESS);
      setState({
        inputs: {
          title: "",
          description: "",
          directImgURL: false,
          price: "",
          isForSale: false,
          category: "",
          currency: "",
          campaign: "",
          creator: "",
          creatorPercentage: "",
          collectionName: "",
          beneficiary: "",
          beneficiaryPercentage: "",
        },
      });
      refreshAuth();

      const newBalance = await numberOfNFTsOwned(entityInfo.publicKey);
      console.log("...... No. of NFTs in your account: ", newBalance);
    }
  }

  return (
    <>
      <Header />

      <div className="page-content bg-white">
        {/* <!-- inner page banner --> */}
        <div
          className="dlab-bnr-inr overlay-primary bg-pt"
          style={{ backgroundImage: "url(" + bnr1 + ")" }}
        >
          <PageTitle motherMenu="Mint NFT" activeMenu="Mint NFT" />
        </div>
        {/* <!-- inner page banner END --> */}
        {/* <!-- contact area --> */}
        <div className="section-full content-inner shop-account">
          {/* <!-- Product --> */}
          <div className="container">
            <div>
              <div className=" m-auto m-b30">
                <Container>
                  <Row className="form-group align-items-center">
                  <Col>
                      <Form.Check
                        type={"checkbox"}
                        id={"isImageURL"}
                        label={`Already hosted image, enter direct url ?`}
                        onChange={(e)=>handleChange(e)}
                        value={state.inputs.isImageURL}
                        name="isImageURL"
                      />
                    </Col>
                    <Col>
                    {state.inputs.isImageURL?  <input
                        type="text"
                        placeholder="Image URl"
                        name="imageUrl"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.imageUrl}
                      />:
                      <ImageUploader
                        singleImage
                        withIcon={true}
                        buttonText="Choose images"
                        onChange={onDrop}
                        imgExtension={[".jpg", ".gif", ".png"]}
                        maxFileSize={20209230}
                        withPreview={true}
                        label={"Max file size: 20mb, accepted: jpg|gif|png"}
                      />}
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                    <label>Beneficiary</label>
                      <select
                        name="Beneficiary"
                        placeholder="Beneficiary"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.beneficiary}
                      >
                        {beneficiaries.map(({ name, address }) => (
                          <option value={address}> {name}</option>
                        ))}
                      </select>
                    </Col>
                    <Col>
                    <label>Campaign</label>
                      <select
                        name="Campaign"
                        placeholder="Campaign"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.campaign}
                      >
                        {campaigns.map(({ name, address }) => (
                          <option value={address}> {name}</option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <Form.Check
                        type={"radio"}
                        label="Exist Collection"
                        onChange={() => {
                          setCollectionState(1);
                        }}
                        name="radio-buttons-group"
                        value="1"
                        id="existCollection"
                        checked={collectionState===1}
                      />
                      <Form.Check
                        type={"radio"}
                        label="New Collection"
                        onChange={() => {
                          setCollectionState(2);
                        }}
                        name="radio-buttons-group"
                        value="2"
                        id="newCollection"
                        checked={collectionState===2}
                      />
                    </Col>{" "}
                    <Col>
                      {collectionState == 1 ? (
                        <select
                          label="Collection"
                          value={state.inputs.collection}
                          onChange={(e) => handleChange(e)}
                          className="form-control"
                        >
                          {collections.map(({ name, address }) => (
                            <option key={address} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      ) : (
                   <> <label>Collection</label>
                        <input
                          value={state.inputs.collectionName}
                          onChange={(e) => handleChange(e)}
                          className="form-control"
                        /></>
                      )}
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.name}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type={"checkbox"}
                        id={"isForSale"}
                        label={`Is For Sale`}
                        onChange={(e)=>handleChange(e)}
                        value={state.inputs.isForSale}
                        name="isForSale"
                      />
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <textarea
                        rows={4}
                        name="description"
                        placeholder="Description"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        value={state.inputs.description}
                      ></textarea>
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <p className="form-submit">
                        <input
                          type="button"
                          value="Mint"
                          className="btn btn-success"
                          name="submit"
                          onClick={mintNFT}
                        />
                      </p>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </div>
          {/* <!-- Product END --> */}
        </div>

        {/* <!-- contact area  END --> */}
      </div>

      <Footer />
    </>
  );
};

export default MintNFT;
