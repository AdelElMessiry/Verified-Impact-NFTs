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

// Masonry section
const masonryOptions = {
  transitionDuration: 0,
};

const options = {
  buttons: { showDownloadButton: false },
};

const imagesLoadedOptions = { background: '.my-bg-image-el' };

const BeneficiariesMarket = () => {
  const { beneficiaries } = useNFTState();
  const [SDGsGoals, setSDGsGoals] = React.useState([]);

  const [SDGsGoalsData, setSDGsGoalsData] = React.useState([]);
  const [isClearSDGs, setIsClearSDGs] = React.useState(false);
  const [displayedBenficiaries, setDisplayedBenficiaries] = React.useState([]);

  const filterSDGByTag = React.useCallback((tag, filteredBeneficiaries) => {
    const AllSDGsTagsName =
    filteredBeneficiaries &&
    filteredBeneficiaries
        .map((nft) => ({ value: nft.sdgs_ids?.split(',') }))
        .flatMap(({ value }) => value);
        debugger;
    let sdgsTagsName = AllSDGsTagsName.filter(function (item, pos) {
      return AllSDGsTagsName.indexOf(item) == pos;
    });
    sdgsTagsName &&
      setSDGsGoalsData(
        SDGsData.filter(({ value }) => sdgsTagsName.includes(value.toString()))
      );
  }, []);

  const getFilteredBeneficiaries = React.useCallback(async () => {
    const filtBeneficiaries=beneficiaries && beneficiaries.filter(
      (beneficiary) => beneficiary.isApproved == 'true'
    ).filter( (ele, ind) => ind === beneficiaries.findIndex( elem => elem.address === ele.address))
    beneficiaries && filterSDGByTag({ name: 'All', id: '' },filtBeneficiaries);
    beneficiaries && setDisplayedBenficiaries(filtBeneficiaries);
  }, [beneficiaries, filterSDGByTag]);

  React.useEffect(() => {
    getFilteredBeneficiaries();
  }, [getFilteredBeneficiaries]);

  const getSDGsBasedOnTag = React.useCallback(
    (selectedData = []) => {
      let allFilteredBeneficiaries = [];
      for (let index = 0; index < selectedData.length; index++) {
        const selectedNfts =
          beneficiaries &&
          beneficiaries.filter(
            (beneficiary) => beneficiary.isApproved == 'true'
          ).filter(({ sdgs_ids }) =>
            sdgs_ids?.split(',').includes(selectedData[index].toString())
          );
          debugger;
        allFilteredBeneficiaries = [
          ...allFilteredBeneficiaries,
          ...selectedNfts,
        ];
      }
      allFilteredBeneficiaries.length > 0
        ? setDisplayedBenficiaries(allFilteredBeneficiaries.filter( (ele, ind) => ind === allFilteredBeneficiaries.findIndex( elem => elem.address === ele.address)))
        : setDisplayedBenficiaries(beneficiaries.filter(
          (beneficiary) => beneficiary.isApproved == 'true'
        ).filter( (ele, ind) => ind === beneficiaries.findIndex( elem => elem.address === ele.address)));
    },

    [setDisplayedBenficiaries,beneficiaries]
  );

  const handleSDGsChange = (data) => {
    debugger;
    setSDGsGoals(data);
    getSDGsBasedOnTag(data);
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
                <div className="site-filters clearfix  left mx-5   m-b40">
                  SDGs Goals:{' '}
                  <SDGsMultiSelect
                    data={SDGsGoalsData}
                    SDGsChanged={(selectedData) => {
                      handleSDGsChange(selectedData);
                    }}
                    isClear={isClearSDGs}
                  />
                </div>
              )}
              {beneficiaries ? (
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
