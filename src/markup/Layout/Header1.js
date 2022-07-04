import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './../../images/logov.png';
import HeaderMenu from './HeaderMenu';
import casper from './../../images/icon/casper.png';
import { useAuth } from '../../contexts/AuthContext';
import VINFTsTooltip from '../Element/Tooltip';
import { Avatar } from '@mui/material';

const Header1 = ({ isNFTDetails = false }) => {
  const { isLoggedIn, entityInfo, balance, login } = useAuth();
  const generateRandomCharacter = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };
  useEffect(() => {
    // sidebar open/close

    var Navicon = document.querySelector('.navicon');
    var sidebarmenu = document.querySelector('.myNavbar ');

    function toggleFunc() {
      sidebarmenu.classList.toggle('show');
      //   Navicon.classList.toggle('open');
    }
    Navicon?.addEventListener('click', toggleFunc);

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
                className='header-nav navbar-collapse collapse myNavbar justify-content-end'
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
                    <VINFTsTooltip title='Connect signer' className='mx-4'>
                      <img
                        alt='casper'
                        src={casper}
                        className='img img-fluid'
                        width={'50px'}
                        onClick={login}
                      />
                    </VINFTsTooltip>
                  )}
                  {isLoggedIn && entityInfo && (
                    <>
                      <VINFTsTooltip title='Open settings'>
                        <>
                          <Avatar className='float-left' aria-label='avatar'>
                            {generateRandomCharacter()}
                          </Avatar>
                          <span className='d-inline-block ml-2 mt-2'>
                            {balance} CSPR
                          </span>{' '}
                        </>
                      </VINFTsTooltip>
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

export default Header1;
