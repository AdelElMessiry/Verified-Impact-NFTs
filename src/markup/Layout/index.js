import React, { Fragment } from 'react';
import Footer from './Footer1';

const Layout = ({ children }) => {
  return (
    <>
      <div className="min-h-100vh">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
