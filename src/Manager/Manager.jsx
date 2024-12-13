import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { FaTicket, FaUser } from 'react-icons/fa6';
import { UserContext } from '../Context/UserContext';

const Manager = () => {
    const { user } = useContext(UserContext);
    const nav = useNavigate();
    useEffect(() => {
        if (user?.role !== "Admin") {
            nav("/");
            return;
        }
        nav("/manager/users")
    }, []);

    const items = [
        {
            key: 'users',
            label: 'Danh sách người dùng',
            icon: <FaUser />
        },
        {
            key: 'sub2',
            label: 'Navigation Two',
        },
        {
            key: 'tickets',
            label: 'Quản lý vé',
            icon: <FaTicket />
        },
        {
            key: 'grp',
            label: 'Group',
        },
    ];
    const onClick = (e) => {
        nav(`/manager/${e.key}`);
    };
    return (
        <div className='h-[calc(100vh-72px)] flex'>
            <Menu
                onClick={onClick}
                style={{
                    width: 256, height: "100%"
                }}
                defaultSelectedKeys={['users']}
                mode="inline"
                items={items}
            />
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
    )
}

export default Manager
