import React, { Component } from 'react';

class Footer1 extends Component {
  render() {
    return (
      <>
        <footer className='site-footer text-uppercase'>
          <div className='footer-bottom bg-primary'>
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
                    >
                      Alphafin
                    </a>{' '}
                    and{' '}
                    <a
                      href='https://nftpunks.org/'
                      className='text-success'
                      target='_blank'
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

export default Footer1;
