import React from 'react';
import {
  faDiscord,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class Footer extends React.Component {
  render() {
    return (
      <>
        <footer className='site-footer text-uppercase'>
          <div className='footer-bottom'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6 text-left '>
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
                <div className='col-lg-6 col-md-6 col-sm-6 text-left'>
                  <ul className="list-inline d-flex ">
                    <li className='text-success mr-3 align-items-center'>FOllow us</li>
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
