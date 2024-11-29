import React from 'react'
import ListRoutes from './ListRoutes.jsx';
import ListVoucher from './ListVoucher.jsx';
import ListBestComment from './ListBestComment.jsx';
import Flexin from './Flexin.jsx';
import Footer from './Footer.jsx';
import Search from './Search.jsx';

const Home = () => {
    return (
        <div  className="max-md:mb-[100px]">
            <Search />
            <ListRoutes />
            <ListVoucher />
            <ListBestComment />
            <Flexin />
            <Footer />
        </div>
    )
}

export default Home
