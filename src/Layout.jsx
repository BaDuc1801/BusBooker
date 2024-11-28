import { BsTicketPerforatedFill } from "react-icons/bs"
import { FaPhoneAlt } from "react-icons/fa"
import { IoBus, IoSearch } from "react-icons/io5"
import { LuTicket } from "react-icons/lu"
import { MdManageAccounts } from "react-icons/md"
import { RiAccountCircleLine } from "react-icons/ri"
import { TiThMenu } from "react-icons/ti"
import { Outlet, useNavigate } from "react-router-dom"
import Search from "./Search"
import { Drawer, Menu } from "antd"
import { useState } from "react"

const Layout = () => {
    const nav = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);  // Trạng thái menu

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);  // Đổi trạng thái của menu khi bấm vào TiThMenu
    };
    const items = [
        {
            key: 'sub1',
            label: 'Navigation One',
            children: [
                {
                    key: 'g1',
                    label: 'Item 1',
                    type: 'group',
                    children: [
                        {
                            key: '1',
                            label: 'Option 1',
                        },
                        {
                            key: '2',
                            label: 'Option 2',
                        },
                    ],
                },
                {
                    key: 'g2',
                    label: 'Item 2',
                    type: 'group',
                    children: [
                        {
                            key: '3',
                            label: 'Option 3',
                        },
                        {
                            key: '4',
                            label: 'Option 4',
                        },
                    ],
                },
            ],
        },
        {
            key: 'sub2',
            label: 'Navigation Two',
            children: [
                {
                    key: '5',
                    label: 'Option 5',
                },
                {
                    key: '6',
                    label: 'Option 6',
                },
                {
                    key: 'sub3',
                    label: 'Submenu',
                    children: [
                        {
                            key: '7',
                            label: 'Option 7',
                        },
                        {
                            key: '8',
                            label: 'Option 8',
                        },
                    ],
                },
            ],
        },
        {
            type: 'divider',
        },
        {
            key: 'sub4',
            label: 'Navigation Three',
            children: [
                {
                    key: '9',
                    label: 'Option 9',
                },
                {
                    key: '10',
                    label: 'Option 10',
                },
                {
                    key: '11',
                    label: 'Option 11',
                },
                {
                    key: '12',
                    label: 'Option 12',
                },
            ],
        },
        {
            key: 'grp',
            label: 'Group',
            type: 'group',
            children: [
                {
                    key: '13',
                    label: 'Option 13',
                },
                {
                    key: '14',
                    label: 'Option 14',
                },
            ],
        },
    ];
    return (
        <div>
            <div className="flex justify-between bg-[#1677ff] text-white text-[16px] p-4 font-semibold">
                <div className="flex items-center text-3xl gap-1 cursor-pointer">
                    <TiThMenu onClick={toggleMenu} className="hidden max-md:block max-md:mr-4" />
                    <IoBus className="text-yellow-300" />
                    BusBooker
                </div>
                {menuVisible ?
                    <Drawer
                        placement="left"
                        closable={true}
                        onClose={toggleMenu}
                        open={menuVisible}
                        width={'100%'}
                        style={{ top: 80 }}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            className="w-full !border-white"
                            items={items}
                        />
                    </Drawer>
                    : ""
                }
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 cursor-pointer max-md:hidden">
                        <BsTicketPerforatedFill className="text-xl" />
                        Vé của tôi
                    </div>
                    {
                        true ? <></> :
                            <div className="flex items-center gap-1 cursor-pointer max-md:hidden">
                                <MdManageAccounts className="text-xl" />
                                Quản lý
                            </div>
                    }
                    <button className="flex items-center max-md:hidden bg-white text-blue-900 py-2 px-3 rounded-md gap-2">
                        <FaPhoneAlt />
                        Hotline 24/7
                    </button>
                    <button className="flex items-center bg-white text-blue-900 py-2 px-3 rounded-md"
                        onClick={() => { nav("/login") }}>
                        Đăng nhập
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-around fixed w-full z-40 py-2 border-grey border-t-2 bottom-0 bg-white font-semibold md:hidden">
                <button className="flex flex-col items-center">
                    <IoSearch className="text-2xl" />
                    Tìm kiếm
                </button>
                <button className="flex flex-col items-center">
                    <LuTicket className="text-2xl" />
                    Vé của tôi
                </button>
                <button className="flex flex-col items-center">
                    <RiAccountCircleLine className="text-2xl" />
                    Tài khoản
                </button>
            </div>
            <Search />
            <div className="max-md:mb-[100px]">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout