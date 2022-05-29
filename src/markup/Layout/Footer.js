import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <>
        <footer className='site-footer text-uppercase'>
          <div className='footer-bottom'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 text-left '>
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
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }
}

export default Footer;
