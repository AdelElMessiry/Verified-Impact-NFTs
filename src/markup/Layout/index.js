import React from 'react';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <div className='min-h-100vh'>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
