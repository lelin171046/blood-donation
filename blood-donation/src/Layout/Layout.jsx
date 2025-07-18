import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();

    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('sign-in');

    return (
        <div>
            {/* Navbar */}
            {noHeaderFooter || <Navbar />}

            {/* Outlet */}
            <div className={`min-h-[calc(100vh-306px)] ${!noHeaderFooter ? 'mt-16' : ''}`}>
                <Outlet />
            </div>

            {/* Footer */}
            {noHeaderFooter || <Footer />}
        </div>
    );
};

export default Layout;
