import { Tabs } from 'antd'
import Item from 'antd/es/list/Item'
import React from 'react'
import DatePickerSpace from './DatePicker'
import { HiCheckBadge, HiReceiptPercent } from 'react-icons/hi2'
import { TfiHeadphoneAlt } from 'react-icons/tfi'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import { Outlet, useOutletContext } from 'react-router-dom'
import ImgHome from "./assets/image.jpg"

const Search = () => {
    const { listRoutes } = useOutletContext();
    return (
        <div>
            <div className='relative h-[350px]  max-md:h-[400px]'>
                <img src={ImgHome} className='w-full h-full absolute -z-10'></img>
                <div className='flex justify-center items-center h-[298px] max-md:h-[400px]'>
                    <Tabs defaultActiveKey='1'
                        className='bg-white rounded-md px-4 w-[70%] pb-4'>
                        <Item tab={<p className='w-1/2 font-semibold text-lg'>Một chiều</p>} key='1'>
                            <DatePickerSpace check={true} listRoutes={listRoutes} />
                        </Item>
                        <Item tab={<p className='w-1/2 font-semibold text-lg'>Hai chiều</p>} key='2'>
                            <DatePickerSpace check={false} listRoutes={listRoutes} />
                        </Item>
                    </Tabs>
                </div>
                <div className='absolute bottom-0 bg-black bg-opacity-50 flex justify-around w-full text-yellow-400 font-semibold py-3 max-md:hidden'>
                    <p className='flex items-center gap-2 text-lg'><HiCheckBadge />
                        Chắc chắn có chỗ</p>
                    <p className='flex items-center gap-2 text-lg'><TfiHeadphoneAlt />
                        Hỗ trợ 24/7</p>
                    <p className='flex items-center gap-2 text-lg'><HiReceiptPercent />
                        Nhiều ưu đãi</p>
                    <p className='flex items-center gap-2 text-lg'><RiMoneyDollarCircleFill />
                        Thanh toán đa dạng</p>
                </div>
            </div>
            <Outlet context={listRoutes}/>
        </div>
    )
}

export default Search
