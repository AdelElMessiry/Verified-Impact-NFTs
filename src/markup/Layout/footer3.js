import React, { Component } from 'react';

class Footer3 extends Component {
  render() {
    return (
      <>
        <footer className='site-footer ap-footer text-white'>
          <div className='footer-top'>
            <div className='container'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-lg-12'>
                  <div className='footer-bottom text-left row'>
                    <div className='col-md-12 col-sm-12 text-left p-lr30'>
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
            </div>
          </div>
        </footer>
      </>
    );
  }
}

export default Footer3;
