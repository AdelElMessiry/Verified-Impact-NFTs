import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material';

import { useAuth } from '../../contexts/AuthContext';

import HeaderMenu from './HeaderMenu';
import VINftsTooltip from '../Element/Tooltip';

import logo from './../../images/logov.png';
import casper from './../../images/icon/casper.png';
import { profileClient } from '../../api/profileInfo';

const generateRandomCharacter = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const Header = ({ isNFTDetails = false }) => {
  const { isLoggedIn, entityInfo, balance, login } = useAuth();
  const [profileImage, setProfileImage] = useState();

  React.useEffect(() => {
    // sidebar open/close

    var NavIcon = document.querySelector('.navicon');
    var sidebarMenu = document.querySelector('.myNavbar ');

    function toggleFunc() {
      sidebarMenu.classList.toggle('show');
      //   NavIcon.classList.toggle('open');
    }
    NavIcon.addEventListener('click', toggleFunc);

    // Sidenav li open close
    var navUl = [].slice.call(
      document.querySelectorAll('.navbar-nav > li > a, .sub-menu > li > a')
    );
    for (var y = 0; y < navUl.length; y++) {
      navUl[y].addEventListener('click', function () {
        checkLi(this);
      });
    }

    function checkLi(current) {
      current.parentElement.parentElement
        .querySelectorAll('li')
        .forEach((el) =>
          current.parentElement !== el ? el.classList.remove('open') : ''
        );

      setTimeout(() => {
        current.parentElement.classList.toggle('open');
      }, 100);
    }
  }, []);

  const getUserProfiles = React.useCallback(async () => {
    try {
      const userProfiles = await profileClient.getProfile(entityInfo.publicKey);

      if (userProfiles) {
        if (userProfiles.err === 'Address Not Found') {
          setProfileImage(null);
        } else {
          let list = Object.values(userProfiles)[0];
         if(userProfiles) {
              Object.keys(list.normal).length > 0
                ? setProfileImage(list.normal.imgUrl)
                : Object.keys(list.beneficiary).length > 0
                ? setProfileImage(list.beneficiary.imgUrl)
                : Object.keys(list.creator).length > 0
                ? setProfileImage(list.creator.imgUrl)
                : setProfileImage(null)
         }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [entityInfo.publicKey]);

  React.useEffect(() => {
    entityInfo.publicKey && getUserProfiles();
  }, [entityInfo.publicKey, getUserProfiles]);

  return (
    <>
      <header
        className={`site-header header-transparent mo-left ${
          isNFTDetails ? 'bg-black' : ''
        }`}
        id='fix-header'
      >
        <div className='sticky-header main-bar-wraper navbar-expand-lg'>
          <div className='main-bar clearfix '>
            <div className='container clearfix'>
              <div className='logo-header mostion py-2'>
                <Link to={'./'} className='dez-page'>
                  <img src={logo} alt='logo' />
                </Link>
              </div>

              <button
                className='navbar-toggler collapsed navicon justify-content-end'
                type='button'
                data-toggle='collapse'
                data-target='#navbarNavDropdown'
                aria-controls='navbarNavDropdown'
                aria-expanded='false'
                aria-label='Toggle navigation'
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div
                className='header-nav navbar-collapse collapse myNavbar justify-content-center'
                id='navbarNavDropdown'
              >
                <div className='logo-header mostion d-md-block d-lg-none'>
                  <Link to={'./'} className='dez-page'>
                    <img src={logo} alt='logo2' />
                  </Link>
                </div>
                {/*  Header Menu Contents  */}
                <HeaderMenu />
                {/*  Header Menu Contents End */}
              </div>
              <div className='extra-nav'>
                <div className='extra-cell'>
                  {isLoggedIn && entityInfo ? (
                    <div className='m-2 float-left'>
                      {entityInfo.publicKey?.slice(0, 3)} ...
                      {entityInfo.publicKey?.slice(
                        entityInfo.publicKey.length - 2
                      )}
                    </div>
                  ) : (
                    <VINftsTooltip title='Connect signer' className='mx-4'>
                      <img
                        alt='casper'
                        src={casper}
                        className='img img-fluid'
                        width={'50px'}
                        onClick={login}
                      />
                    </VINftsTooltip>
                  )}
                  {isLoggedIn && entityInfo && (
                    <>
                      <VINftsTooltip title='Open settings'>
                        <>
                          <Avatar className='float-left' aria-label='avatar'>
                             { profileImage?<img src={profileImage}/>: generateRandomCharacter()}
                          </Avatar>
                          <span className='d-inline-block ml-2 mt-2'>
                            {balance} CSPR
                          </span>{' '}
                        </>
                      </VINftsTooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
