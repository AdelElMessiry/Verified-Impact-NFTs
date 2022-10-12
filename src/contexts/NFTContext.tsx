import React from 'react';

import { getBeneficiariesList } from '../api/beneficiaryInfo';
import { cep47 } from '../lib/cep47';
import { getCampaignsList } from '../api/campaignInfo';
import { getCreatorsList } from '../api/creatorInfo';
import { getUniqueCollectionsList } from '../api/collectionInfo';
import {
  getNFTsList,
  getCachedNFTsList,
  updateCachedNFT,
} from '../api/nftInfo';
import { profileClient } from '../api/profileInfo';

export enum NFTActionTypes {
  LOADING = 'loading',
  UNLOADING = 'unloading',
  SUCCESS = 'success',
}

interface NFTState {
  nfts?: [];
  beneficiaries?: [];
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
  refreshNFTs?: () => void;
}

type NFTDispatch = (action: NFTAction) => void;
type NFTAction =
  | { type: NFTActionTypes.LOADING }
  | { type: NFTActionTypes.UNLOADING }
  | { type: NFTActionTypes.SUCCESS; payload: any };

const NFTStateContext = React.createContext<NFTState | undefined>(undefined);
const NFTDispatchContext = React.createContext<NFTDispatch | undefined>(
  undefined
);

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
        campaigns: action.payload.campaigns,
        creators: action.payload.creators,
        collections: action.payload.collections,
        uniqueCollections: action.payload.uniqueCollections,
        beneficiaryCount: action.payload.beneficiaryCount,
        campaignsCount: action.payload.campaignsCount,
        creatorsCount: action.payload.creatorsCount,
        collectionsCount: action.payload.collectionsCount,
        vINFTsBeneficiaries: action.payload.vINFTsBeneficiaries,
        refreshNFTs: getCachedNFTsList,
      };
    }
    default: {
      throw new Error('Invalid action type');
    }
  }
}

export const NFTProvider: React.FC<{}> = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(nftReducer, { isLoading: true });

  // const [beneficiaries, setBeneficiaries] = React.useState();
  // const [campaigns, setCampaigns] = React.useState();
  // const [creators, setCreators] = React.useState();
  // const [collections, setCollections] = React.useState();
  // // const [uniqueCollections, setUniqueCollections] = React.useState();
  // const [nfts, setNFTs] = React.useState();

  const getList = React.useCallback(async () => {
    dispatch({ type: NFTActionTypes.LOADING });

    // const nftsList = await getNFTsList();
    const nftsList = await getCachedNFTsList();
    // const beneficiaryCount = await cep47.totalBeneficiaries();
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
        vINFTsBeneficiaries: undefined,
      },
    });

    let selectedList: any = [];
    let profiles = await profileClient.getProfilesList();

    profiles &&
      profiles.forEach((data: any) => {
        let lists: any = Object.values(data)[0];

        Object.keys(lists.beneficiary).length !== 0 &&
          selectedList.push(lists.beneficiary);
      });
    const beneficiariesList = profiles && selectedList;

    const beneficiariesVINFTsList = await getBeneficiariesList();
    const beneficiariesCount = beneficiariesVINFTsList?.filter(
      ({ isApproved }: any) => isApproved === 'true'
    )?.length;

    // beneficiariesList && setBeneficiaries(beneficiariesList);

    const campaignsList = await getCampaignsList();
    // campaignsList && setCampaigns(campaignsList);

    const creatorsList = await getCreatorsList();
    // creatorsList && setCreators(creatorsList);

    const collectionsList = await getUniqueCollectionsList();
    // collectionsList &&
    // collectionsList.collectionsList &&
    // setCollections(collectionsList.collectionsList);

    const mappedNFTS =
      // beneficiariesList &&
      // campaignsList &&
      // creatorsList &&
      // collectionsList?.collectionsList &&
      // nftsList &&
      nftsList?.map((nft: any) => ({
        ...nft,
        campaignName:
          campaignsList.find(({ id }: any) => nft.campaign === id)?.name || '',
        creatorName:
          creatorsList.find(({ address }: any) => nft.creator === address)
            ?.name || '',
        beneficiaryName:
          beneficiariesList.find(
            ({ address }: any) => nft.beneficiary === address
          )?.username || '',
        collectionName:
          collectionsList.collectionsList.find(
            ({ id }: any) => nft.collection === id
          )?.name || '',
      }));
    // &&
    // setNFTs(nftsList);

    // mappedNFTS && setNFTs(mappedNFTS);

    // beneficiariesList &&
    //   campaignsList &&
    //   creatorsList &&
    //   collectionsList?.collectionsList &&
    mappedNFTS &&
      dispatch({
        type: NFTActionTypes.SUCCESS,
        payload: {
          nfts: mappedNFTS,
          // beneficiaryCount: parseInt(beneficiaryCount.toString()),
          beneficiaryCount: beneficiariesCount,
          campaignsCount: parseInt(campaignsCount.toString()),
          creatorsCount: parseInt(creatorsCount.toString()),
          collectionsCount: parseInt(collectionsCount.toString()),
          collections: collectionsList.collectionsList,
          uniqueCollections: collectionsList.uniqueCollections,
          creators: creatorsList,
          campaigns: campaignsList,
          beneficiaries: beneficiariesList,
          vINFTsBeneficiaries: beneficiariesVINFTsList,
        },
      });
  }, []);

  React.useEffect(() => {
    // (!beneficiaries || !campaigns || !creators || !collections || !nfts) &&
    getList();
  }, [getList]);
  // }, [beneficiaries, campaigns, creators, collections, nfts, getList]);

  return (
    <NFTStateContext.Provider value={state}>
      <NFTDispatchContext.Provider value={dispatch}>
        {children}
      </NFTDispatchContext.Provider>
    </NFTStateContext.Provider>
  );
};

export const updateNFTs = async (dispatch: any, state: any, nft: any) => {
  const updatedNFTs = await updateCachedNFT(nft);
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

export const refreshNFTs = async (dispatch: any, state: any) => {
  const cachedNFTs = await getCachedNFTsList();
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
