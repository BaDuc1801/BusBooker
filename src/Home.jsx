import React from 'react'
import ListRoutes from './RouteDetail/ListRoutes.jsx';
import ListVoucher from './ListVoucher.jsx';
import ListBestComment from './ListBestComment.jsx';
import Flexin from './Flexin.jsx';
import Footer from './Footer.jsx';
import { useOutletContext } from 'react-router-dom';

const Home = () => {
    const {listRoutes} = useOutletContext();

    return (
        <div className="max-md:mb-[100px]">
            <ListRoutes listRoutes={listRoutes}/>
            <ListVoucher />
            <ListBestComment />
            <Flexin />
            <Footer />
        </div>
    )
}

export default Home
