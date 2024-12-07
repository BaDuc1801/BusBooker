import React, { useEffect, useState } from 'react'
import ListRoutes from './ListRoutes.jsx';
import ListVoucher from './ListVoucher.jsx';
import ListBestComment from './ListBestComment.jsx';
import Flexin from './Flexin.jsx';
import Footer from './Footer.jsx';
// import Search from './Search.jsx';
import axios from 'axios';

const Home = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listRoutes, setListRoutes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const list = await axios.get(`${beUrl}/routes`);    
            setListRoutes(list.data);
        }
        fetchData()
    }, [])
    
    return (
        <div  className="max-md:mb-[100px]">
            {/* <Search listRoutes={listRoutes}/> */}
            <ListRoutes listRoutes={listRoutes}/>
            <ListVoucher />
            <ListBestComment />
            <Flexin />
            <Footer />
        </div>
    )
}

export default Home
