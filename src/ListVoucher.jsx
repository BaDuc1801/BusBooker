import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RiDiscountPercentFill } from 'react-icons/ri';

const ListVoucher = () => {
    const [listVouchers, setListVouchers] = useState([]);
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    useEffect(() => {
        const fetchData = async () => {
            const v = await axios.get(`${beUrl}/vouchers`);
            setListVouchers(v.data)
        }
        fetchData()
    }, [])
    return (
        <div className='mx-auto max-md:w-[90%] w-[70%] mt-[50px]'>
            <p className='text-2xl font-semibold'>Khuyến mãi không thể bỏ lỡ</p>
            <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                {listVouchers && listVouchers.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="max-md:h-40 max-md:w-[220px] w-[300px] flex-shrink-0 rounded-lg shadow-lg bg-white flex flex-col overflow-hidden snap-start cursor-pointer pb-1"
                        >
                            <div className="w-full flex items-center justify-center text-4xl h-32 max-md:h-[160px] bg-[#fef32a]">
                                <RiDiscountPercentFill />
                            </div>
                            <div className='flex flex-col h-[80px] max-md:h-full md:justify-between'>
                                <p className='px-4 py-2 whitespace-normal'>{item?.description}</p>
                                <p className='px-4 font-semibold whitespace-normal pb-1'>{item?.name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ListVoucher
