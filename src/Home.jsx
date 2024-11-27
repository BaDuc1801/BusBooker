import React from 'react'
import ListRoutes from './ListRoutes.jsx';
import ListVoucher from './ListVoucher.jsx';
import ListBestComment from './ListBestComment.jsx';
import Flexin from './Flexin.jsx';
import Footer from './Footer.jsx';

const Home = () => {
    return (
        <div>
            <ListRoutes />
            <ListVoucher />
            <ListBestComment />
            <Flexin />
            <Footer />
        </div>
    )
}

export default Home
