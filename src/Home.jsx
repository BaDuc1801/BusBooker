import React from 'react'
import ListRoutes from './ListRoutes.jsx';
import ListVoucher from './ListVoucher.jsx';
import ListBestComment from './ListBestComment.jsx';

const Home = () => {
    return (
        <div>
            <ListRoutes />
            <ListVoucher />
            <ListBestComment/>
        </div>
    )
}

export default Home
