import React from 'react'
import Search from './Search.jsx';
import ListRoutes from './ListRoutes.jsx';
import ListVoucher from './ListVoucher.jsx';

const Home = () => {
    return (
        <div>
            <Search />
            <ListRoutes />
            <ListVoucher/>
        </div>
    )
}

export default Home
