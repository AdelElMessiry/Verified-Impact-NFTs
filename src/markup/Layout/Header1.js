import React, { Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './../../images/logov.png';
import logo2 from './../../images/logo-black.png';
import HeaderMenu from './HeaderMenu';
import casper from './../../images/icon/casper.png';
import { useAuth } from '../../contexts/AuthContext';

const Header1 =() =>{
    const { isLoggedIn, entityInfo, balance, login, logout } = useAuth();
useEffect(()=>{	
        // sidebar open/close
		
        var Navicon = document.querySelector('.navicon');
        var sidebarmenu = document.querySelector('.myNavbar ');

        function toggleFunc() {
            sidebarmenu.classList.toggle('show');
         //   Navicon.classList.toggle('open');
        }
        Navicon.addEventListener('click', toggleFunc);


        // Sidenav li open close
        var navUl = [].slice.call(document.querySelectorAll('.navbar-nav > li > a, .sub-menu > li > a'));
        for (var y = 0; y < navUl.length; y++) {
            navUl[y].addEventListener('click', function () { checkLi(this) });
        }
		
		
        function checkLi(current) {
            current.parentElement.parentElement.querySelectorAll( "li" ).forEach( el =>
				(current.parentElement !== el) ? el.classList.remove('open') : ''
			);
			
			setTimeout(() => {
				current.parentElement.classList.toggle('open');
				
			}, 100);			
        }
    },[])	
	
 
        return (
            <>
                <header className="site-header header-transparent mo-left" id="fix-header">

                    <div className="sticky-header main-bar-wraper navbar-expand-lg" >
                        <div className="main-bar clearfix ">
                            <div className="container clearfix">
                                <div className="logo-header mostion">
                                    <Link to={'./'} className="dez-page"><img src={logo} alt="" /></Link>
                                </div>

                                <button className="navbar-toggler collapsed navicon justify-content-end" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>

                               

                                <div className="header-nav navbar-collapse collapse myNavbar justify-content-end" id="navbarNavDropdown">
									<div className="logo-header mostion d-md-block d-lg-none">
										<Link to={'./'} className="dez-page"><img src={logo2} alt="" /></Link>
									</div>
									{/*  Header Menu Contents  */}
										<HeaderMenu />
									{/*  Header Menu Contents End */}
                                </div>
                                <div className="extra-nav">
                                    <div className="extra-cell">
                                    <img src={casper} className="img img-fluid" width={"50px"} onClick={login}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </>
        )
    }


	
export default Header1;