import React from 'react';
import Header from './Header';
import HeaderMobile from './HeaderMobile';
import Footer from './Footer';
import { isMobile } from 'react-device-detect';

const Layout = ({ children }) => {
    if (isMobile) {
        return (
            <div className="layout">
                <HeaderMobile />
                <main className="content">{children}</main>
                <Footer />
            </div>
        );
    }
    return (
        <div className="layout">
            <Header />
            <main className="content">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;

