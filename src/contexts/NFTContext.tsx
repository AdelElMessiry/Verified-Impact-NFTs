import React from 'react';

import { getBeneficiariesList } from '../api/beneficiaryInfo';
import { getCampaignsList } from '../api/campaignInfo';
import { getCreatorsList } from '../api/creatorInfo';
import { getUniqueCollectionsList } from '../api/collectionInfo';
import { getNFTsList } from '../api/nftInfo';

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
  isLoading: boolean;
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
        campaigns: action.payload.campaigns,
        creators: action.payload.creators,
        collections: action.payload.collections,
        uniqueCollections: action.payload.uniqueCollections,
      };
    }
    default: {
      throw new Error('Invalid action type');
    }
  }
}

export const NFTProvider: React.FC<{}> = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(nftReducer, { isLoading: true });

  const [beneficiaries, setBeneficiaries] = React.useState();
  const [campaigns, setCampaigns] = React.useState();
  const [creators, setCreators] = React.useState();
  const [collections, setCollections] = React.useState();
  const [uniqueCollections, setUniqueCollections] = React.useState();
  const [nfts, setNFTs] = React.useState();

  const getList = React.useCallback(async () => {
    dispatch({ type: NFTActionTypes.LOADING });

    const beneficiariesList = !beneficiaries
      ? await getBeneficiariesList()
      : beneficiaries;
    beneficiariesList && setBeneficiaries(beneficiariesList);

    const campaignsList = !campaigns ? await getCampaignsList() : campaigns;
    campaignsList && setCampaigns(campaignsList);

    const creatorsList = !creators ? await getCreatorsList() : creators;
    creatorsList && setCreators(creatorsList);

    const collectionsList = !collections
      ? await getUniqueCollectionsList()
      : collections;
    collectionsList &&
      collectionsList.collectionsList &&
      setCollections(collectionsList.collectionsList);
    collectionsList &&
      collectionsList.uniqueCollections &&
      setUniqueCollections(collectionsList.uniqueCollections);

    const nftsList = !nfts ? await getNFTsList() : nfts;

    const mappedNFTS =
      beneficiariesList &&
      campaignsList &&
      creatorsList &&
      collectionsList?.collectionsList &&
      nftsList &&
      nftsList.map((nft: any) => ({
        ...nft,
        campaignName: campaignsList.find(({ id }: any) => nft.campaign === id)
          .name,
        creatorName: creatorsList.find(
          ({ address }: any) => nft.creator === address
        ).name,
        beneficiaryName: beneficiariesList.find(
          ({ address }: any) => nft.beneficiary === address
        ).name,
        collectionName: collectionsList.collectionsList.find(
          ({ id }: any) => nft.collection === id
        ).name,
      }));
    // &&
    // setNFTs(nftsList);

    mappedNFTS && setNFTs(mappedNFTS);

    beneficiariesList &&
      campaignsList &&
      creatorsList &&
      collectionsList?.collectionsList &&
      mappedNFTS &&
      dispatch({
        type: NFTActionTypes.SUCCESS,
        payload: {
          nfts: mappedNFTS,
          collections: collectionsList.collectionsList,
          uniqueCollections: collectionsList.uniqueCollections,
          creators: creatorsList,
          campaigns: campaignsList,
          beneficiaries: beneficiariesList,
          // beneficiaries: beneficiariesList,
          // campaigns: campaignsList,
          // creators: creatorsList,
          // collections: collectionsList,
          // nfts: nftsList,
        },
      });
  }, [beneficiaries, campaigns, creators, collections, nfts]);

  React.useEffect(() => {
    (!beneficiaries || !campaigns || !creators || !collections || !nfts) &&
      getList();
  }, [beneficiaries, campaigns, creators, collections, nfts, getList]);

  return (
    <NFTStateContext.Provider value={state}>
      <NFTDispatchContext.Provider value={dispatch}>
        {children}
      </NFTDispatchContext.Provider>
    </NFTStateContext.Provider>
  );
};

export const useNFTState = () => {
  const nftStateContext = React.useContext(NFTStateContext);
  if (nftStateContext === undefined) {
    throw new Error('useNFTState must be used within a NFTProvider');
  }
  return nftStateContext;
};

export const useNFTDispatch = () => {
  const nftDispatchContext = React.useContext(NFTStateContext);
  if (nftDispatchContext === undefined) {
    throw new Error('useNFTDispatch must be used within a NFTProvider');
  }
  return nftDispatchContext;
};
