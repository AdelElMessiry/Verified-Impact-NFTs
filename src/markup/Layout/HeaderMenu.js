import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBeneficiariesCampaignsList } from '../../api/beneficiaryInfo';
import { getCreatorsCollectionsList } from '../../api/creatorInfo';
import { useAuth } from '../../contexts/AuthContext';

const HeaderMenu = () => {
  const { isLoggedIn } = useAuth();

  const [beneficiaries, setBeneficiaries] = useState();
  const [creators, setCreators] = useState();
  useEffect(() => {
    (async () => {
      let beneficiaryList =
        !beneficiaries && (await getBeneficiariesCampaignsList());
      !beneficiaries && setBeneficiaries(beneficiaryList);
      let creatorsList = !creators && (await getCreatorsCollectionsList());
      !creators && setCreators(creatorsList);
    })();
  }, [creators, beneficiaries]);
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
            {beneficiaries?.map((b, index) => (
              <li key={index}>
                <Link
                  to={`./BenefeiciaryNFTs?beneficiary=${b.name}`}
                  className='dez-page'
                >
                  {b.name} <i className='fa fa-angle-right'></i>
                </Link>
                <ul className='sub-menu'>
                  {b.campaigns?.map((c, key) => (
                    <li key={index}>
                      <Link
                        to={`./BenefeiciaryNFTs?beneficiary=${b.name}&campaign=${c.name}`}
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
            {creators?.map((c, index) => (
              <li key={index}>
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
