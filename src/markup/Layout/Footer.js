import React from 'react';
import {
  faDiscord,
  faMediumM,
  faTwitter,
  faTelegram
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";
import VINftsTooltip from '../Element/Tooltip';
class Footer extends React.Component {
   sendMail = () => {
    const mailto = `mailto:verifiedimpactnfts@gmail.com ?subject=New &body=`;
    window.open(mailto, '_blank');
  }
  render() {
    return (
      <>
        <footer className='site-footer text-uppercase'>
          <div className='footer-bottom'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6 text-left d-flex align-items-center'>
                  {' '}
                  <span>
                    Developed with &#10084; by{' '}
                    <a
                      href='https://alphafin.io/'
                      className='text-success'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Alphafin
                    </a>{' '}
                    and{' '}
                    <a
                      href='https://nftpunks.org/'
                      className='text-success'
                      target='_blank'
                      rel='noreferrer'
                    >
                      NFTPunks
                    </a>{' '}
                  </span>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 text-right'>
                  <ul className="list-inline">
                    <li className='text-success mr-3 align-items-center'><p>FOllow us</p></li>
                    <li  className='mr-3'>
                      <a href={process.env.REACT_APP_DISCORD_INVITE_LINK} target="_blank">
                        <FontAwesomeIcon icon={faDiscord} size="2x" />
                      </a>
                    </li>
                    <li className='mr-3'>
                      <a href={process.env.REACT_APP_TWITTER_ACCOUNT_LINK} target="_blank">
                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                      </a>
                    </li>
                    <li className='mr-3'>
                      <a href={process.env.REACT_APP_MEDUIM_ACCOUNT_LINK} target="_blank">
                        <FontAwesomeIcon icon={faMediumM} size="2x" />
                      </a>
                    </li>
                    <li className='mr-3'>
                      <a href={process.env.REACT_APP_MEDUIM_ACCOUNT_LINK} target="_blank">
                        <FontAwesomeIcon icon={faTelegram} size="2x" />
                      </a>
                    </li>
                    <li className='mr-3'>
                    <VINftsTooltip title={"Contact Us"}>
                      <a target="_blank" onClick={()=>this.sendMail()}>
                        <FontAwesomeIcon icon={faEnvelopeOpenText} size="2x" />
                      </a>
                      </VINftsTooltip>
                    </li>
                    <li className='text-success mr-3 align-items-center'><Link to={"/terms-of-services"}>Terms Of Services</Link></li>
                    <li className='text-success mr-3 align-items-center'><Link to={"/privacy"}>Privacy</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }
}

export default Footer;
