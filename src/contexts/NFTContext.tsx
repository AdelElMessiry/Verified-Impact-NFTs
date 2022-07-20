import React from 'react';
import { CLPublicKey } from 'casper-js-sdk';
import { getBeneficiariesList } from '../api/beneficiaryInfo';
import { cep47 } from '../lib/cep47';
import { getCampaignsList } from '../api/campaignInfo';
import { getCreatorsList } from '../api/creatorInfo';
import { getUniqueCollectionsList } from '../api/collectionInfo';
import { getNFTsList } from '../api/nftInfo';
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

    const nftsList = await getNFTsList();
    const beneficiaryCount = await cep47.totalBeneficiaries();
    const campaignsCount = await cep47.totalCampaigns();
    const creatorsCount = await cep47.totalCreators();
    const collectionsCount = await cep47.totalCollections();

    dispatch({
      type: NFTActionTypes.SUCCESS,
      payload: {
        nfts: nftsList,
        beneficiaryCount: parseInt(beneficiaryCount.toString()) || 0,
        campaignsCount: parseInt(campaignsCount.toString()) || 0,
        creatorsCount: parseInt(creatorsCount.toString()) || 0,
        collectionsCount: parseInt(collectionsCount.toString()) || 0,
        collections: [],
        uniqueCollections: [],
        creators: [],
        campaigns: [],
        beneficiaries: [],
      },
    });

    let selectedList: any = [];
    let profiles = await profileClient.getProfilesList();

    profiles &&
      profiles.map((data: any) => {
        let lists: any = Object.values(data)[0];

        Object.keys(lists.beneficiary).length !== 0 &&
          selectedList.push(lists.beneficiary);
      });
    debugger;
    const beneficiariesList = profiles &&selectedList;
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
            ({ address }: any) =>
              CLPublicKey.fromHex(nft.beneficiary).toAccountHashStr() ===
              address
          )?.name || '',
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
          beneficiaryCount: parseInt(beneficiaryCount.toString()),
          campaignsCount: parseInt(campaignsCount.toString()),
          creatorsCount: parseInt(creatorsCount.toString()),
          collectionsCount: parseInt(collectionsCount.toString()),
          collections: collectionsList.collectionsList,
          uniqueCollections: collectionsList.uniqueCollections,
          creators: creatorsList,
          campaigns: campaignsList,
          beneficiaries: beneficiariesList,
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
