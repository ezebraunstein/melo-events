import React from 'react';
import Header from './Header';
import HeaderRRPP from './HeaderRRPP';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isRRPPRoute = location.pathname.includes("/rrpp-events");

    return (
        <div className="layout">
            {isRRPPRoute ? <HeaderRRPP /> : <Header />}
            <main className="content">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
