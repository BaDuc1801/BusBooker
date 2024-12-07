import { Tabs } from 'antd'
import Item from 'antd/es/list/Item'
import React, { useContext, useEffect } from 'react'
import { UserContext } from './Context/UserContext'
import { useOutletContext } from 'react-router-dom'

const UserStorage = () => {
    const {user} = useContext(UserContext);
    const {setVisible} = useOutletContext();
    useEffect(() => {
        // Hide div when navigating to this page
        setVisible(true); // Show the div when the page is active
        return () => {
          setVisible(false); // Hide div when navigating away
        };
      }, [setVisible]);
    return (
        <div className='flex justify-center items-center h-[calc(100vh-72px)] bg-[#F2F4F7] max-md:pb-[100px]'>
            <Tabs defaultActiveKey='1'
                className='bg-white rounded-md px-4 w-[70%] pb-4'>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Hiện tại</p>} key='1'>
                    {/* <DatePickerSpace check={true}/> */}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Đã đi</p>} key='2'>
                    {/* <DatePickerSpace check={false}/> */}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Đã hủy</p>} key='3'>
                    {/* <DatePickerSpace check={false}/> */}
                </Item>
            </Tabs>
        </div>
    )
}

export default UserStorage
