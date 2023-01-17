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

const BeneficiariesMarket = () => {
  const { beneficiaries,campaigns,nfts } = useNFTState();
  const [SDGsGoals, setSDGsGoals] = React.useState([]);

  const [SDGsGoalsData, setSDGsGoalsData] = React.useState([]);
  const [isClearSDGs, setIsClearSDGs] = React.useState(false);
  const [displayedBenficiaries, setDisplayedBenficiaries] = React.useState([]);
  const [searchText, setSearchText] = React.useState("")

  const getFinalBeneficiariesList = () => {
    let beneficiaryList=[];
    beneficiaries?.forEach((eleBeneficiary) => {
      const BeneficiaryNfts = nfts
        .filter(({ beneficiary }) => eleBeneficiary.address == beneficiary)
        const beneficiaryCollections =BeneficiaryNfts.map(({collection})=>collection)
        const beneficiaryCreators =BeneficiaryNfts.map(({creator})=>creator)
        eleBeneficiary['nftNumber']=BeneficiaryNfts?.length;
        eleBeneficiary['campaignsNumber']=campaigns?.filter(({beneficiary_address}) => beneficiary_address==eleBeneficiary?.address).length;
        eleBeneficiary['collectionsNumber']=beneficiaryCollections?.filter((ele, ind) => ind === beneficiaryCollections.findIndex(elem => elem.collection === ele.collection)).length;
        eleBeneficiary['creatorsNumber']=beneficiaryCreators?.filter((ele, ind) => ind === beneficiaryCreators.findIndex(elem => elem.creator === ele.creator)).length;
      
      beneficiaryList.push(eleBeneficiary);
    });
    return beneficiaryList;
  };

  const filterSDGByTag = React.useCallback((tag, filteredBeneficiaries) => {
    const AllSDGsTagsName =
      filteredBeneficiaries &&
      filteredBeneficiaries
        .map((nft) => ({ value: nft.sdgs_ids?.split(',') }))
        .flatMap(({ value }) => value);
    let sdgsTagsName = AllSDGsTagsName.filter(function (item, pos) {
      return AllSDGsTagsName.indexOf(item) == pos;
    });
    sdgsTagsName &&
      setSDGsGoalsData(
        SDGsData.filter(({ value }) => sdgsTagsName.includes(value.toString()))
      );
  }, []);

  const getFilteredBeneficiaries = React.useCallback(async () => {
    const BeneficiaryList = getFinalBeneficiariesList();
    const approvedBen = BeneficiaryList?.filter(
      (beneficiary) => beneficiary.isApproved == 'true'
    )
    const filtBeneficiaries = beneficiaries && approvedBen.filter((ele, ind) => ind === approvedBen.findIndex(elem => elem.address === ele.address))
    beneficiaries && filterSDGByTag({ name: 'All', id: '' }, filtBeneficiaries);
    beneficiaries && setDisplayedBenficiaries(filtBeneficiaries);
  }, [beneficiaries, filterSDGByTag]);

  React.useEffect(() => {
    getFilteredBeneficiaries();
  }, [getFilteredBeneficiaries]);

  const getSDGsBasedOnTag = React.useCallback(
    (selectedData = [], text) => {
      let allFilteredBeneficiaries = [];
      for (let index = 0; index < selectedData.length; index++) {
        const selectedNfts =
          beneficiaries &&
          beneficiaries.filter(
            (beneficiary) => beneficiary.isApproved == 'true'
          ).filter(({ sdgs_ids, username }) =>
            text && text != "" ?
              sdgs_ids?.split(',').includes(selectedData[index].toString()) &&
              username.toLowerCase().includes(text?.toLowerCase())
              :
              sdgs_ids?.split(',').includes(selectedData[index].toString())
          );
        allFilteredBeneficiaries = [
          ...allFilteredBeneficiaries,
          ...selectedNfts,
        ];
      }
      const approvedBen = beneficiaries.filter(
        (beneficiary) => beneficiary.isApproved == 'true'
      )
      allFilteredBeneficiaries.length > 0 ?
        setDisplayedBenficiaries(allFilteredBeneficiaries.filter((ele, ind) => ind === allFilteredBeneficiaries.findIndex(elem => elem.address === ele.address)))
        : text != "" && selectedData.length > 0 ?
          setDisplayedBenficiaries([])
          : text != "" ?
          setDisplayedBenficiaries(approvedBen.filter(bene => { return bene.username.toLowerCase().includes(text?.toLowerCase()) })) :
            setDisplayedBenficiaries(approvedBen.filter((ele, ind) => ind === approvedBen.findIndex(elem => elem.address === ele.address)));
    },

    [setDisplayedBenficiaries, beneficiaries]
  );

  const handleSDGsChange = (data) => {
    setSDGsGoals(data);
    getSDGsBasedOnTag(data, searchText);
  };
  const handleChange = (e) => {
    setSearchText(e.target.value)
    getSDGsBasedOnTag(SDGsGoals, e.target.value)
  }
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
                <span className="mr-1">Discover Beneficiaries </span>
              </h1>

              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={'#'}>Home</Link>
                  </li>
                  <li className="ml-1">Discover Beneficiaries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- inner page banner END --> */}
        {/* <!-- contact area --> */}
        <div className="section-full content-inner-1 portfolio text-uppercase">
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
              {beneficiaries ? (
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
                            {displayedBenficiaries
                              .filter(
                                (beneficiary) => beneficiary.isApproved == 'true'
                              )
                              .map((item, index) => (
                                <React.Fragment key={`${index}${item.address}`}>
                                  <li className="web design card-container col-lg-3 col-md-6 col-xs-12 col-sm-6 p-a0 ">
                                    <UserCard item={item} />
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
                  <p>Fetching Beneficiaries Please wait...</p>
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
export default BeneficiariesMarket;
