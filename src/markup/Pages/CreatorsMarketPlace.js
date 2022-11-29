import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Spinner } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
import { useNFTState } from '../../contexts/NFTContext';
import Layout from '../Layout';
import bnr1 from './../../images/banner/bnr1.jpg';
import UserCard from '../Element/userCard';
import SDGsMultiSelect from '../Element/SDGsMultiSelect';
import { SDGsData } from '../../data/SDGsGoals';
import SDGsMultiSelectImages from '../Element/SDGsMultiSelectImages';
import VINftsTooltip from '../Element/Tooltip';
import unitedNation from '../../images/icon/unitedNation.png';

// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const options = {
  buttons: { showDownloadButton: false },
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };
const CreatorsMarketPlace = () => {
  const { profileCreators, nfts,collections } = useNFTState();
  const [SDGsGoals, setSDGsGoals] = React.useState([]);

  const [SDGsGoalsData, setSDGsGoalsData] = React.useState([]);
  const [isClearSDGs, setIsClearSDGs] = React.useState(false);
  const [searchText , setSearchText] = React.useState("")
  const [displayedProfileCreators, setDisplayedProfileCreators] =
    React.useState([]);

  const filterSDGByTag = React.useCallback((tag, filteredCreators) => {
    const AllSDGsTagsName =
      filteredCreators &&
      filteredCreators
        .map((el) => ({ value: el.sdgs_ids?.split(',') }))
        .flatMap(({ value }) => value);
    let sdgsTagsName = AllSDGsTagsName.filter(function (item, pos) {
      return AllSDGsTagsName.indexOf(item) == pos;
    });
    sdgsTagsName &&
      setSDGsGoalsData(
        SDGsData.filter(({ value }) => sdgsTagsName.includes(value.toString()))
      );
  }, []);
  const getFinalCreatorList = () => {
    let CreatorList = [];
    const selectedProfileCreator = profileCreators?.filter(
      (ele, ind) =>
        ind ===
        profileCreators.findIndex((elem) => elem.address === ele.address)
    );
    selectedProfileCreator?.forEach((eleCreator) => {
      const Creatornfts = nfts
        .filter(({ creator }) => eleCreator.address == creator)
        const CreatorCampaign =Creatornfts.map(({campaign})=>campaign)
        const CreatorBeneficiary =Creatornfts.map(({beneficiary})=>beneficiary)
      const CreatorSDGs = Creatornfts
        .map(({ sdgs_ids }) => sdgs_ids.split(','));
      const allSDGS = Object.values(CreatorSDGs)
        .flat()
        .filter((val, id, array) => {
          return array.indexOf(val) == id;
        });
      eleCreator['sdgs_ids'] = allSDGS.join(',');
      eleCreator['percentage']=Creatornfts.reduce(
        (xcreatorPercentage, { creatorPercentage }) => Number(xcreatorPercentage) + Number(creatorPercentage),
        0
      )/Creatornfts.length
      eleCreator['nftNumber']=Creatornfts?.length;
      eleCreator['collectionsNumber']=collections.filter(({creator})=>creator==eleCreator?.address)?.length;
      eleCreator['campaignsNumber']=CreatorCampaign?.filter((ele, ind) => ind === CreatorCampaign.findIndex(elem => elem.id === ele.id)).length;
      eleCreator['beneficiriesNumber']=CreatorBeneficiary?.filter((ele, ind) => ind === CreatorBeneficiary.findIndex(elem => elem.address === ele.address)).length;;
      
      CreatorList.push(eleCreator);
    });
    return CreatorList;
  };
  const getFilteredCreators = React.useCallback(async () => {
    if (nfts && profileCreators) {
      const CreatorList = getFinalCreatorList();
      profileCreators && filterSDGByTag({ name: 'All', id: '' }, CreatorList);
      profileCreators && setDisplayedProfileCreators(CreatorList);
    }
  }, [profileCreators, filterSDGByTag, nfts]);

  React.useEffect(() => {
    getFilteredCreators();
  }, [getFilteredCreators]);

  const handleChange = (e) => {
    setSearchText(e.target.value)
     getSDGsBasedOnTag(SDGsGoals ,e.target.value )
  }

  //filter sdg with search inputs
  const getSDGsBasedOnTag = React.useCallback(
    (selectedData = [], text) => {   
      const CreatorList = getFinalCreatorList();
      let allFilteredCreators = [];
      for (let index = 0; index < selectedData.length; index++) {
        const selectedNfts =
          profileCreators &&
          CreatorList?.filter(({ sdgs_ids, username }) =>
            text && text != ""?
            sdgs_ids?.split(',').includes(selectedData[index].toString())&&
              username.toLowerCase().includes(text?.toLowerCase())
              :
              sdgs_ids?.split(',').includes(selectedData[index].toString())
          );
          allFilteredCreators = [...allFilteredCreators, ...selectedNfts];
      }
      allFilteredCreators.length > 0
        ? setDisplayedProfileCreators(
            allFilteredCreators.filter(
              (ele, ind) =>
                ind ===
                allFilteredCreators.findIndex(
                  (elem) => elem.address === ele.address
                )
            )
          )
        : text != "" && selectedData.length > 0 ? 
        setDisplayedProfileCreators([]):
        text != "" ? 
        setDisplayedProfileCreators(CreatorList.filter(creator=>{return creator.username.toLowerCase().includes(text?.toLowerCase())})) :
        setDisplayedProfileCreators(CreatorList) 
    },

    [setDisplayedProfileCreators, profileCreators]
  );

  const handleSDGsChange = (data) => {
    setSDGsGoals(data);
    getSDGsBasedOnTag(data,searchText);
  };

  return (
    <Layout>
      <div className="page-content bg-white">
        {/* <!-- inner page banner --> */}
        <div
          className="dlab-bnr-inr overlay-primary bg-pt"
          style={{ backgroundImage: 'url(' + bnr1 + ')' }}
        >
          <div className="container">
            <div className="dlab-bnr-inr-entry">
              <h1 className="text-white d-flex align-items-center">
                <span className="mr-1">Discover Creators </span>
              </h1>
              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className="ml-1">Discover Creators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- inner page banner END --> */}
        {/* <!-- contact area --> */}
        <div className="section-full content-inner shop-account">
          {/* <!-- Product --> */}
          <div>
            <div>
              {SDGsGoalsData.length > 0 && (
                 <div className="site-filters  left mx-5   m-b40 d-flex">
                 <span> 
                  <VINftsTooltip title={"Click for more info"}>  
                    <a href='https://sdgs.un.org/goals' target='_blank'>
                        <img
                            src={unitedNation}
                            style={{ width: 40, pointerEvents: 'none', cursor: 'default' }}
                        />
                    </a>
                  </VINftsTooltip> SDGs Goals:<br/><span className='fz-10'>SDGs are filtered based on<br/> the SDGs chosen only</span></span>
                    <SDGsMultiSelectImages data={SDGsGoalsData}   SDGsChanged={(selectedData) => {
                      handleSDGsChange(selectedData); 
                    }} isClear={isClearSDGs}/>
                </div>
              )}
              {profileCreators ? (
                <>
                  <div className="site-filters left mx-5  required-field">
                    <form>
                      <input type="search" className='form-control' placeholder='Search...' onChange={(e) => handleChange(e)} />
                    </form>
                  </div>
                  <SimpleReactLightbox>
                    <SRLWrapper options={options}>
                      <div className="clearfix">
                        <ul
                          id="masonry"
                          className="dlab-gallery-listing gallery-grid-4 gallery mfp-gallery port-style1"
                        >
                          <Masonry
                            className={'my-gallery-class'} // default ''
                            options={masonryOptions} // default {}
                            disableImagesLoaded={false} // default false
                            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                            imagesLoadedOptions={imagesLoadedOptions} // default {}
                          >
                            {profileCreators &&
                              displayedProfileCreators.map((item, index) => (
                                <React.Fragment key={`${index}${item.address}`}>
                                  <li className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0 ">
                                    <UserCard item={item} type={"creator"} />
                                  </li>
                                </React.Fragment>
                              ))}
                          </Masonry>
                        </ul>
                      </div>
                    </SRLWrapper>
                  </SimpleReactLightbox>
                </>
              ) : (
                <div className="vinft-section-loader text-center my-5">
                  <Spinner animation="border" variant="success" />
                  <p>Fetching Creators Please wait...</p>
                </div>
              )}
            </div>
          </div>
          {/* <!-- Product END --> */}
        </div>
        {/* <!-- contact area  END --> */}
      </div>
    </Layout>
  );
};
export default CreatorsMarketPlace;
