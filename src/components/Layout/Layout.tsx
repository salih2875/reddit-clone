import React from 'react';

import Navbar from '../Navbar/Navbar';
import SearchInput from '../Navbar/SearchInput';

interface Props {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {

    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}

export default Layout;



