import React, { Component } from "react";
import { Link } from "react-router-dom";

class HeaderMenu extends Component {
  render() {
    return (
      <>
        <ul className="nav navbar-nav">
          <li>
            <Link to={"./"}>
              <span className="ti-home"></span> Home
            </Link>
          </li>
          <li>
            <Link to={"#"}>
              Beneficiaries <i className="fa fa-chevron-down"></i>
            </Link>
            <ul className="sub-menu">
              <li>
              <Link to={"./NFTs?beneficiary=Ukraine Gov"} className="dez-page">
                Ukraine Gov <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./NFTs?beneficiary=Ukraine Gov&campaign=Stand With Ukraine"} className="dez-page">
                    Stand With Ukraine{" "}
                    </Link>
                  </li>

                  <li>
                    <Link to={"./NFTs?beneficiary=Ukraine Gov&campaign=Refugees"} className="dez-page">
                    Refugees{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./NFTs?beneficiary=Ukraine Gov&campaign=Reconstruction"} className="dez-page">
                    Reconstruction{" "}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
		  <li>
            <Link to={"#"}>
              Creators <i className="fa fa-chevron-down"></i>
            </Link>
            <ul className="sub-menu">
             
            <li>
            <Link to={"./NFTs?creator=Script Culture"} className="dez-page">
            Script Culture <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./NFTs?creator=Script Culture&campaign=Ukraine Calligraphy"} className="dez-page">
                    Ukraine Calligraphy{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./NFTs?creator=Script Culture&campaign=English Calligraphy"} className="dez-page">
                    English Calligraphy{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./NFTs?creator=Script Culture&campaign=Arabic Calligraphy"} className="dez-page">
                    Arabic Calligraphy{" "}
                    </Link>
                  </li>
                </ul>
              </li>
            <li>
            <Link to={"./NFTs?creator=NFT Punks"} className="dez-page">
                NFT Punks <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./NFTs?creator=NFT Punks&campaign=Forever Keys"} className="dez-page">
                    Forever Keys{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./NFTs?creator=NFT Punks&campaign=Never Forget"} className="dez-page">
                    Never Forget{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./NFTs?creator=NFT Punks&campaign=A Hero’s Stand"} className="dez-page">
                    A Hero’s Stand{" "}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
            <Link to={"./NFTs?creator=Vic Guiza"} className="dez-page">
            Vic Guiza <i className="fa fa-angle-right"></i>
                </Link>
              </li>
            </ul>
          </li>
		  <li>
            <Link to={"#"}>
              My Collection <i className="fa fa-chevron-down"></i>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to={"./NFTs"}  className="dez-page">
                  My NFTs 
                </Link>
              </li>
              <li>
                <Link to={"./NFTs"}  className="dez-page">
                  My Creations
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </>
    );
  }
}
export default HeaderMenu;
