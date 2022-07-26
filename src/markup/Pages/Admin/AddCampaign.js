import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CLPublicKey } from 'casper-js-sdk';
import { toast as VIToast } from 'react-toastify';

import { useAuth } from '../../../contexts/AuthContext';
import { getDeployDetails } from '../../../api/universal';
import { createCampaign } from '../../../api/createCampaign';

import Layout from '../../Layout';
import PageTitle from '../../Layout/PageTitle';
import PromptLogin from '../PromptLogin';

import bnr1 from './../../../images/banner/bnr1.jpg';
import { useNFTState } from '../../../contexts/NFTContext';
import AddEditCampaignForm from '../../Element/AddEditCampaignForm';

//adding new campaign page
const AddCampaign = () => {
  const { beneficiaries } = useNFTState();
  const { entityInfo, isLoggedIn } = useAuth();
  const [beneficiary, setBeneficiary] = React.useState();
  //getting beneficiary details
  const selectedBeneficiary = React.useCallback(async () => {
    const firstBeneficiary = beneficiaries?.filter(
      ({ approved }) => approved === 'true'
    );
 firstBeneficiary&&setBeneficiary(firstBeneficiary[0]?.address);
  }, [beneficiary,beneficiaries]);

  React.useEffect(() => {
    !beneficiary && selectedBeneficiary();
  }, [beneficiary, selectedBeneficiary]);
  //setting initial values of controls
  const [state, setState] = React.useState({
    inputs: {
      campaignUrl: '',
      name: '',
      description: '',
      requestedRoyalty: '',
    },
  });

  const handleChange = (e, isBeneficiary = false) => {
    if (isBeneficiary) {
      setBeneficiary(e.target.value);
    } else {
      const { value, name, checked, type } = e.target;
      const { inputs } = state;

      inputs[name] = type === 'checkbox' ? checked : value;
      setState({
        ...state,
        inputs,
      });
    }
  };

  //saving new campaign related to beneficiary function
  const saveCampaign = async () => {
    const savedCampaign = await createCampaign(
      state.inputs.name,
      state.inputs.description,
      beneficiary,
      state.inputs.campaignUrl,
      state.inputs.requestedRoyalty,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );

    const deployResult = await getDeployDetails(savedCampaign);
    console.log('...... Campaign saved successfully', deployResult);
    VIToast.success('Campaign saved successfully');

    setState({
      inputs: {
        campaignUrl: '',
        name: '',
        description: '',
        requestedRoyalty: '',
      },
    });

    console.log('save Result', savedCampaign);
    console.log(
      'save Result',
      state.inputs.name,
      state.inputs.description,
      beneficiary,
      state.inputs.campaignUrl,
      state.inputs.requestedRoyalty,
      CLPublicKey.fromHex(entityInfo.publicKey)
    );
  };

  return (
    <Layout>
      <div className='page-content bg-white'>
        {/* <!-- inner page banner --> */}
        <div
          className='dlab-bnr-inr overlay-primary bg-pt'
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <PageTitle motherMenu='Add Campaign' activeMenu='Add Campaign' />
        </div>
        {/* <!-- inner page banner END --> */}
        {/* <!-- contact area --> */}
        {!isLoggedIn ? (
          <PromptLogin />
        ) : (
         <AddEditCampaignForm/>
        )}
        {/* <!-- contact area  END --> */}
      </div>
    </Layout>
  );
};

export default AddCampaign;
