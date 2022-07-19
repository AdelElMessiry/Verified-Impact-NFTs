import React from 'react';
import { Link } from 'react-router-dom';

import { _getBeneficiariesCampaignsList } from '../../api/beneficiaryInfo';
import { _getCreatorsCollectionsList } from '../../api/creatorInfo';
import { profileClient } from '../../api/profileInfo';
import { useAuth } from '../../contexts/AuthContext';
import { useNFTState } from '../../contexts/NFTContext';

const HeaderMenu = () => {
  const { isLoggedIn } = useAuth();
  const { beneficiaries, campaigns, collections, creators } = useNFTState();

  const [beneficiariesList, setBeneficiariesList] = React.useState();
  const [creatorsList, setCreatorsList] = React.useState();

  const loadBeneficiaries = React.useCallback(async () => {
    let selectedList = [];
    debugger;
    let profiles = await profileClient.getProfilesList();

    profiles &&
      profiles.map((data) => {
        let lists = Object.values(data)[0];
        selectedList.push(lists.creator);
      });
      const beneficiaryList =
      selectedList &&
      campaigns &&
      (await _getBeneficiariesCampaignsList(selectedList, campaigns));
    beneficiaryList && setBeneficiariesList(beneficiaryList);
  }, []);

  //getting beneficiary list
  React.useEffect(() => {
    !beneficiaries && loadBeneficiaries();
  }, [
    beneficiaries,
    loadBeneficiaries
  ]);

  const loadSubMenu = React.useCallback(async () => {
    const creatorList =
      creators &&
      collections &&
      (await _getCreatorsCollectionsList(creators, collections));
    creatorList && setCreatorsList(creatorList);
  }, [beneficiaries, campaigns, collections, creators]);

  React.useEffect(() => {
    loadSubMenu();
  }, [loadSubMenu]);

  return (
    <>
      <ul className='nav navbar-nav'>
        <li>
          <Link to={'./'}>
            <span className='ti-home'></span> Home
          </Link>
        </li>
        <li>
          <Link to={'#'}>
            Beneficiaries <i className='fa fa-chevron-down'></i>
          </Link>
          <ul className='sub-menu'>
            {beneficiariesList?.map((b, index) => (
              <li key={`#${index}`}>
                <Link
                  to={`./BeneficiaryNFTs?beneficiary=${b.address}`}
                  className='dez-page'
                >
                  {b.name} <i className='fa fa-angle-right'></i>
                </Link>
                <ul className='sub-menu'>
                  {b.campaigns?.map((c, index) => (
                    <li key={index}>
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${b.address}&campaign=${c.id}`}
                        className='dez-page'
                      >
                        {c.name}{' '}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <Link to={`./signup-as-beneficiary`} className='dez-page'>
              Signup As Beneficiary
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to={'#'}>
            Creators <i className='fa fa-chevron-down'></i>
          </Link>
          <ul className='sub-menu'>
            {creatorsList?.map((c, index) => (
              <li key={`#${index}`}>
                <Link
                  to={`./CreatorNFTs?creator=${c.address}`}
                  className='dez-page'
                >
                  {c.name} <i className='fa fa-angle-right'></i>
                </Link>
                <ul className='sub-menu'>
                  {c.collections?.map((col, index) => (
                    <li key={index}>
                      <Link
                        to={`./CreatorNFTs?creator=${c.address}&collection=${col.id}`}
                        className='dez-page'
                      >
                        {col.name}{' '}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
        <li>
          {isLoggedIn && (
            <>
              <Link to={'#'}>
                My Collection <i className='fa fa-chevron-down'></i>
              </Link>
              <ul className='sub-menu'>
                <li>
                  <Link to={'./my-NFTs'} className='dez-page'>
                    My NFTs
                  </Link>
                </li>
                <li>
                  <Link to={'./my-collections'} className='dez-page'>
                    My Creations
                  </Link>
                </li>
                <li>
                  <Link to={'./profile'} className='dez-page'>
                    Profile
                  </Link>
                </li>
                {/* commented untill compelete phase2 */}
                {/* <li>
                  <Link to={'./profile'} className='dez-page'>
                    Profile
                  </Link>
                </li> */}
              </ul>
            </>
          )}
        </li>
      </ul>
    </>
  );
};
export default HeaderMenu;
