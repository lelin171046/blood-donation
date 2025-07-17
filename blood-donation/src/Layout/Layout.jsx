import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();

    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('sign-in');

    return (
        <div>
            {/*Navber*/}
            {noHeaderFooter || <Navbar></Navbar>}
                        {/*outlet*/}
            <div className="min-h-[calc(100vh-306px)]">
                <Outlet></Outlet>
            </div>
            {/*Footer*/}
            {noHeaderFooter || <Footer></Footer>}
        </div>
    );
};

export default Layout;