import React from 'react';
import { getBeneficiariesList } from '../api/beneficiaryInfo';
import { cep47 } from '../lib/cep47';
import { getCampaignsList } from '../api/campaignInfo';
import { getCreatorsList } from '../api/creatorInfo';
import { getUniqueCollectionsList } from '../api/collectionInfo';
import { getCachedNFTsList, updateCachedNFT } from '../api/nftInfo';
import { profileClient } from '../api/profileInfo';
import { getCachedCreatorsList, updateCachedCreator } from '../api/creatorInfo';
import { removeCollectionFromCache } from '../api/addCollection';
import {
  getCachedCollectionsList,
  updateCachedCollection,
} from '../api/collectionInfo';
import {
  getCachedCampaignsList,
  updateCachedCampaign,
} from '../api/campaignInfo';
import {
  getCachedBeneficiariesList,
  updateCachedBeneficiary,
} from '../api/beneficiaryInfo';

export enum NFTActionTypes {
  LOADING = 'loading',
  UNLOADING = 'unloading',
  SUCCESS = 'success',
}

interface NFTState {
  nfts?: [];
  beneficiaries?: [];
  profileCreators?: [];
  campaigns?: [];
  collections?: [];
  uniqueCollections?: [];
  creators?: [];
  vINFTsBeneficiaries?: [];
  isLoading: boolean;
  beneficiaryCount?: Number;
  campaignsCount?: Number;
  creatorsCount?: Number;
  collectionsCount?: Number;
}

type NFTDispatch = (action: NFTAction) => void;
type NFTAction =
  | { type: NFTActionTypes.LOADING }
  | { type: NFTActionTypes.UNLOADING }
  | { type: NFTActionTypes.SUCCESS; payload: any };

const NFTStateContext = React.createContext<NFTState | undefined>(undefined);
const NFTDispatchContext =
  React.createContext<NFTDispatch | undefined>(undefined);

function nftReducer(state: NFTState, action: NFTAction): NFTState {
  switch (action.type) {
    case NFTActionTypes.LOADING: {
      return { isLoading: true };
    }
    case NFTActionTypes.UNLOADING: {
      return { isLoading: false };
    }
    case NFTActionTypes.SUCCESS: {
      return {
        isLoading: false,
        nfts: action.payload.nfts,
        beneficiaries: action.payload.beneficiaries,
        profileCreators: action.payload.profileCreators,
        campaigns: action.payload.campaigns,
        creators: action.payload.creators,
        collections: action.payload.collections,
        uniqueCollections: action.payload.uniqueCollections,
        beneficiaryCount: action.payload.beneficiaryCount,
        campaignsCount: action.payload.campaignsCount,
        creatorsCount: action.payload.creatorsCount,
        collectionsCount: action.payload.collectionsCount,
        vINFTsBeneficiaries: action.payload.vINFTsBeneficiaries,
      };
    }
    default: {
      throw new Error('Invalid action type');
    }
  }
}

export const NFTProvider: React.FC<{}> = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(nftReducer, { isLoading: true });

  const getList = React.useCallback(async () => {
    dispatch({ type: NFTActionTypes.LOADING });

    const nftsList = await getCachedNFTsList();
    const campaignsCount = await cep47.totalCampaigns();
    const creatorsCount = await cep47.totalCreators();
    const collectionsCount = await cep47.totalCollections();

    dispatch({
      type: NFTActionTypes.SUCCESS,
      payload: {
        nfts: nftsList,
        beneficiaryCount: undefined,
        campaignsCount: parseInt(campaignsCount.toString()) || 0,
        creatorsCount: parseInt(creatorsCount.toString()) || 0,
        collectionsCount: parseInt(collectionsCount.toString()) || 0,
        collections: undefined,
        uniqueCollections: undefined,
        creators: undefined,
        campaigns: undefined,
        beneficiaries: undefined,
        profileCreators: undefined,
        vINFTsBeneficiaries: undefined,
      },
    });

    let selectedBeneficiaryList: any = [];
    let selectedCreatorsList: any = [];
    //let profiles = await profileClient.getProfilesList();
    let profiles = await profileClient.getCachedProfilesList();
    const profilesAddList = profiles.flatMap(Object.keys);

    profiles &&
      profiles.forEach(
        (item: any, i: number) =>
          typeof item != 'string' &&
          Object.keys(profilesAddList[i]) &&
          Object.keys(item[profilesAddList[i]]?.beneficiary)?.length &&
          selectedBeneficiaryList.push(item[profilesAddList[i]]?.beneficiary)
      );

    profiles &&
      profiles.forEach(
        (item: any, i: number) =>
          typeof item != 'string' &&
          Object.keys(item[profilesAddList[i]]?.creator)?.length &&
          selectedCreatorsList.push(item[profilesAddList[i]]?.creator)
      );

    profiles &&
      profiles.forEach((data: any) => {
        if (typeof data != 'string') {
          let lists: any = Object.values(data)[0];
          Object.keys(lists?.beneficiary)?.length !== 0 &&
            selectedBeneficiaryList.push(lists.beneficiary);
          Object.keys(lists.creator).length !== 0 &&
            selectedCreatorsList.push(lists.creator);
        }
      });
    const beneficiariesList = profiles && selectedBeneficiaryList;
    const profileCreatorsList = profiles && selectedCreatorsList;

    // const beneficiariesVINFTsList = await getBeneficiariesList();
    const beneficiariesVINFTsList = await getCachedBeneficiariesList();
    const beneficiariesCount = beneficiariesVINFTsList?.filter(
      ({ isApproved }: any) => isApproved === 'true'
    )?.length;

    // const campaignsList = await getCampaignsList();
    const campaignsList = await getCachedCampaignsList();
    // const creatorsList = await getCreatorsList();
    const creatorsList = await getCachedCreatorsList();
    // const collectionsList = await getUniqueCollectionsList();
    const collectionsList = await getCachedCollectionsList();

    const mappedNFTS = nftsList?.map((nft: any) => ({
      ...nft,
      campaignName:
        campaignsList.find(({ id }: any) => nft.campaign === id)?.name || '',
      creatorName:
        profileCreatorsList.find(({ address }: any) => nft.creator === address)
          ?.username || '',
      creatorEvmWallet:
        profileCreatorsList.find(({ address }: any) => nft.creator === address)
          ?.evm_wallet || '',
      beneficiaryName:
        beneficiariesList.find(
          ({ address }: any) => nft.beneficiary === address
        )?.username || '',
      beneficiaryEvmWallet:
        beneficiariesList.find(
          ({ address }: any) => nft.beneficiary === address
        )?.evm_wallet || '',
      collectionName:
        collectionsList.find(({ id }: any) => nft.collection === id)?.name ||
        '',
    }));

    mappedNFTS &&
      dispatch({
        type: NFTActionTypes.SUCCESS,
        payload: {
          nfts: mappedNFTS,
          beneficiaryCount: beneficiariesCount,
          campaignsCount: parseInt(campaignsCount.toString()),
          creatorsCount: parseInt(creatorsCount.toString()),
          collectionsCount: parseInt(collectionsCount.toString()),
          collections: collectionsList,
          uniqueCollections: collectionsList.uniqueCollections,
          creators: creatorsList,
          profileCreators: profileCreatorsList,
          campaigns: campaignsList,
          beneficiaries: beneficiariesList,
          vINFTsBeneficiaries: beneficiariesVINFTsList,
        },
      });
  }, []);

  React.useEffect(() => {
    getList();
  }, [getList]);

  return (
    <NFTStateContext.Provider value={state}>
      <NFTDispatchContext.Provider value={dispatch}>
        {children}
      </NFTDispatchContext.Provider>
    </NFTStateContext.Provider>
  );
};

export const updateNFTs = async (dispatch: any, state: any, nft: any) => {
  const updatedNFTs = await updateCachedNFT(nft, state.nfts);
  const { campaigns, creators, beneficiaries, collections } = state;

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      nfts: updatedNFTs?.map((nft: any) => ({
        ...nft,
        campaignName:
          campaigns.find(({ id }: any) => nft.campaign === id)?.name || '',
        creatorName:
          creators.find(({ address }: any) => nft.creator === address)?.name ||
          '',
        beneficiaryName:
          beneficiaries.find(({ address }: any) => nft.beneficiary === address)
            ?.username || '',
        collectionName:
          collections.find(({ id }: any) => nft.collection === id)?.name || '',
      })),
    },
  });
};

export const updateBeneficiaries = async (
  dispatch: any,
  state: any,
  beneficiary: any
) => {
  const updateCachedBeneficiaries = await updateCachedBeneficiary(
    beneficiary,
    state.beneficiaries
  );

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      beneficiaries: updateCachedBeneficiaries,
    },
  });
};

export const updateCollections = async (
  dispatch: any,
  state: any,
  collection: any
) => {
  const updateCachedCollections = await updateCachedCollection(
    collection,
    state.collections
  );

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      collections: updateCachedCollections,
    },
  });
};

export const removeCollections = async (
  dispatch: any,
  state: any,
  collectionId: string
) => {
  const updateCachedCollections = await removeCollectionFromCache(collectionId);

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      collections: updateCachedCollections,
    },
  });
};

export const updateCampaigns = async (
  dispatch: any,
  state: any,
  campaign: any
) => {
  const updateCachedCampaigns = await updateCachedCampaign(
    campaign,
    state.campaigns
  );

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      campaigns: updateCachedCampaigns,
    },
  });
};

export const updateCreators = async (
  dispatch: any,
  state: any,
  creator: any
) => {
  const updateCachedCreators = await updateCachedCreator(
    creator,
    state.creators
  );

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      creators: updateCachedCreators,
    },
  });
};

export const updateProfiles = async (
  dispatch: any,
  state: any,
  profile: any
) => {
  const updatedProfiles = await profileClient.updateCachedProfile(profile);

  const profilesAddList = updatedProfiles.flatMap(Object.keys);
  const cachedBeneficiaries: any = [];
  const cachedCreators: any = [];
  updatedProfiles.forEach((item: any, i: number) => {
    if (item[profilesAddList[i]]?.beneficiary) {
        Object.keys(item[profilesAddList[i]].beneficiary)?.length &&
        cachedBeneficiaries.push(item[profilesAddList[i]].beneficiary)
    }
});

  updatedProfiles.forEach(
    (item: any, i: number) =>{
      if (item[profilesAddList[i]]?.creator) {
        Object.keys(item[profilesAddList[i]]?.creator)?.length &&
      cachedCreators.push(item[profilesAddList[i]]?.creator)
      }
    }      
  );

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      profileCreators: cachedCreators,
      beneficiaries: cachedBeneficiaries,
    },
  });
};

export const refreshProfiles = async (dispatch: any, state: any) => {
  const cachedProfiles = await profileClient.getCachedProfilesList();

  const profilesAddList = cachedProfiles.flatMap(Object.keys);
  const cachedBeneficiaries: any = [];
  const cachedCreators: any = [];

  cachedProfiles.forEach(
    (item: any, i: number) =>
      Object.keys(item[profilesAddList[i]]?.beneficiary)?.length &&
      cachedBeneficiaries.push(item[profilesAddList[i]]?.beneficiary)
  );

  cachedProfiles.forEach(
    (item: any, i: number) =>
      Object.keys(item[profilesAddList[i]]?.creator)?.length &&
      cachedCreators.push(item[profilesAddList[i]]?.creator)
  );

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      profileCreators: cachedCreators,
      beneficiaries: cachedBeneficiaries,
    },
  });
};

export const refreshNFTs = async (dispatch: any, state: any) => {
  const cachedNFTs = await getCachedNFTsList(state.nfts);
  const { campaigns, creators, beneficiaries, collections } = state;

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      nfts: cachedNFTs?.map((nft: any) => ({
        ...nft,
        campaignName:
          campaigns.find(({ id }: any) => nft.campaign === id)?.name || '',
        creatorName:
          creators.find(({ address }: any) => nft.creator === address)?.name ||
          '',
        beneficiaryName:
          beneficiaries.find(({ address }: any) => nft.beneficiary === address)
            ?.username || '',
        collectionName:
          collections.find(({ id }: any) => nft.collection === id)?.name || '',
      })),
    },
  });
};

export const refreshBeneficiaries = async (dispatch: any, state: any) => {
  const cachedProfiles = await profileClient.getCachedProfilesList();
  const beneficiariesAddList = cachedProfiles.flatMap(Object.keys);
  const cachedBeneficiaries: any = [];
  cachedProfiles.forEach(
    (item: any, i: number) =>
      Object.keys(item[beneficiariesAddList[i]]?.beneficiary)?.length &&
      cachedBeneficiaries.push(item[beneficiariesAddList[i]]?.beneficiary)
  );

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      beneficiaries: cachedBeneficiaries,
    },
  });
};

export const refreshCollections = async (dispatch: any, state: any) => {
  const cachedCollections = await getCachedCollectionsList();

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      collections: cachedCollections,
    },
  });
};

export const refreshCampaigns = async (dispatch: any, state: any) => {
  const cachedCampaigns = await getCachedCampaignsList();

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      campaigns: cachedCampaigns,
    },
  });
};

export const refreshCreators = async (dispatch: any, state: any) => {
  const cachedCreators = await getCachedCreatorsList();

  dispatch({
    type: NFTActionTypes.SUCCESS,
    payload: {
      ...state,
      creators: cachedCreators,
    },
  });
};

export const useNFTState = () => {
  const nftStateContext = React.useContext(NFTStateContext);
  if (nftStateContext === undefined) {
    throw new Error('useNFTState must be used within a NFTProvider');
  }
  return nftStateContext;
};

export const useNFTDispatch = () => {
  const nftDispatchContext = React.useContext(NFTDispatchContext);
  if (nftDispatchContext === undefined) {
    throw new Error('useNFTDispatch must be used within a NFTProvider');
  }
  return nftDispatchContext;
};
