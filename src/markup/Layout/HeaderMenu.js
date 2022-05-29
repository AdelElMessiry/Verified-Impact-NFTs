import React from 'react';
import { Link } from 'react-router-dom';

import { _getBeneficiariesCampaignsList } from '../../api/beneficiaryInfo';
import { _getCreatorsCollectionsList } from '../../api/creatorInfo';
import { useAuth } from '../../contexts/AuthContext';
import { useNFTState } from '../../contexts/NFTContext';

const HeaderMenu = () => {
  const { isLoggedIn } = useAuth();
  const { beneficiaries, campaigns, collections, creators } = useNFTState();

  const [beneficiariesList, setBeneficiariesList] = React.useState();
  const [creatorsList, setCreatorsList] = React.useState();

  const loadSubMenu = React.useCallback(async () => {
    const beneficiaryList =
      beneficiaries &&
      !beneficiariesList &&
      (await _getBeneficiariesCampaignsList(beneficiaries, campaigns));
    beneficiaryList && setBeneficiariesList(beneficiaryList);

    const creatorList =
      creators &&
      collections &&
      !creatorsList &&
      (await _getCreatorsCollectionsList(creators, collections));
    creatorList && setCreatorsList(creatorList);
  }, [
    beneficiaries,
    creatorsList,
    beneficiariesList,
    collections,
    campaigns,
    creators,
  ]);

  React.useEffect(() => {
    (!creatorsList || !beneficiariesList) && loadSubMenu();
  }, [creatorsList, beneficiariesList, loadSubMenu]);

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
                  to={`./BeneficiaryNFTs?beneficiary=${b.name}`}
                  className='dez-page'
                >
                  {b.name} <i className='fa fa-angle-right'></i>
                </Link>
                <ul className='sub-menu'>
                  {b.campaigns?.map((c, index) => (
                    <li key={index}>
                      <Link
                        to={`./BeneficiaryNFTs?beneficiary=${b.name}&campaign=${c.name}`}
                        className='dez-page'
                      >
                        {c.name}{' '}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
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
                  to={`./CreatorNFTs?creator=${c.name}`}
                  className='dez-page'
                >
                  {c.name} <i className='fa fa-angle-right'></i>
                </Link>
                <ul className='sub-menu'>
                  {c.collections?.map((col, index) => (
                    <li key={index}>
                      <Link
                        to={`./CreatorNFTs?creator=${c.name}&collection=${col.name}`}
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
                  <Link to={'./my-creations'} className='dez-page'>
                    My Creations
                  </Link>
                </li>
              </ul>
            </>
          )}
        </li>
      </ul>
    </>
  );
};
export default HeaderMenu;
