import React, { useEffect } from 'react'
import ListRoutes from './RouteDetail/ListRoutes.jsx';
import ListVoucher from './ListVoucher.jsx';
import ListBestComment from './ListBestComment.jsx';
import Flexin from './Flexin.jsx';
import Footer from './Footer.jsx';
import { useOutletContext } from 'react-router-dom';

const Home = () => {
    const { listRoutes } = useOutletContext();

    useEffect(() => {
        localStorage.removeItem('startTime');
        localStorage.removeItem('endTime');
        localStorage.removeItem("chieuDi");
        localStorage.removeItem("giaChieuDi");
        localStorage.removeItem("chieuVe");
        localStorage.removeItem("giaChieuVe");
    }, [])

    return (
        <div className="max-md:mb-[100px]">
            <ListRoutes listRoutes={listRoutes} />
            <ListVoucher />
            <ListBestComment />
            <Flexin />
            <Footer />
        </div>
    )
}

export default Home
