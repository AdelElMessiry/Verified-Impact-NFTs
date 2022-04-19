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
              Beneficiary <i className="fa fa-chevron-down"></i>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to={"#"}>
                  Campaigns <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                      Campaign 1{" "}
                    </Link>
                  </li>

                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                      Campaign 2{" "}
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
                  Collections <i className="fa fa-angle-right"></i>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
                      Collection 1 {" "}
                    </Link>
                  </li>

                  <li>
                    <Link to={"./portfolio-full-width"} className="dez-page">
					Collection 2{" "}
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
            </ul>
          </li>
        </ul>
      </>
    );
  }
}
export default HeaderMenu;
