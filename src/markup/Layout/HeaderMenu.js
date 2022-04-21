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
                <Link to={"#"}>
                Ukraine Gov <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    Stand With Ukraine{" "}
                    </Link>
                  </li>

                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    Refugees{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    Reconstruction{" "}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to={"#"}>
                Live Scripts <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    Ukraine Calligraphy{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    English Calligraphy{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    Arabic Calligraphy{" "}
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
                <Link to={"#"}>
                NFT Punks <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    Forever Keys{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    Never Forget{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                    A Hero’s Stand{" "}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
		  <li>
            <Link to={"#"}>
              My Collection <i className="fa fa-chevron-down"></i>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to={"./portfolio-full-width"}  className="dez-page">
                  My NFTs 
                </Link>
              </li>
              <li>
                <Link to={"./portfolio-full-width"}  className="dez-page">
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
