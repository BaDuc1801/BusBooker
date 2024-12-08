import { BsTicketPerforatedFill } from "react-icons/bs"
import { FaPhoneAlt } from "react-icons/fa"
import { IoBus, IoSearch } from "react-icons/io5"
import { LuTicket } from "react-icons/lu"
import { MdManageAccounts } from "react-icons/md"
import { RiAccountCircleLine, RiMoneyDollarCircleFill } from "react-icons/ri"
import { TiThMenu } from "react-icons/ti"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Drawer, Dropdown, Menu, Tabs, Tooltip } from "antd"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./Context/UserContext.jsx"
import Item from "antd/es/list/Item.js"
import DatePickerSpace from "./DatePicker.jsx"
import axios from "axios"
import ImgHome from "./assets/image.jpg"
import { HiCheckBadge, HiReceiptPercent } from "react-icons/hi2"
import { TfiHeadphoneAlt } from "react-icons/tfi"

const Layout = () => {
    const nav = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
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

    const itemsDrop = [
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
            key: '0',
        },
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: <Link onClick={() => logout()} to='/login'>Đăng xuất</Link>,
            key: '3',
        },
    ];

    const { user, authenticated, logout } = useContext(UserContext);
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listRoutes, setListRoutes] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const list = await axios.get(`${beUrl}/routes`);
            setListRoutes(list.data);
            setVisible(false);
        }
        fetchData()
    }, [])

    return (
        <div>
            <div className="flex justify-between bg-[#1677ff] text-white text-[16px] p-4 font-semibold">
                <Link className="flex items-center text-3xl gap-1 cursor-pointer" to="">
                    <TiThMenu onClick={toggleMenu} className="hidden max-md:block max-md:mr-4" />
                    <IoBus className="text-yellow-300" />
                    BusBooker
                </Link>
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
                    <Link to="/my-storage" className="flex items-center gap-2 cursor-pointer max-md:hidden">
                        <BsTicketPerforatedFill className="text-xl" />
                        Đơn hàng của tôi
                    </Link>
                    <Link to="register-sale" className="flex items-center gap-2 cursor-pointer max-md:hidden">
                        Mở bán vé trên BusBooker
                    </Link>
                    {
                        true ? <></> :
                            <div className="flex items-center gap-1 cursor-pointer max-md:hidden">
                                <MdManageAccounts className="text-xl" />
                                Quản lý
                            </div>
                    }
                    <Tooltip placement="bottomRight"
                        title={<div className="text-black">
                            <p>
                                <span className="cursor-poiter text-blue-600">0981155865</span> - Để đặt vé qua điện thoại (24/7)</p>
                            <p>
                                <span className="cursor-poiter text-blue-600">0985511568</span> - Để phản hồi về dịch vụ và xử lý sự cố</p>
                        </div>}
                        color="white"
                        trigger={"click"}
                    >
                        <button className="flex items-center max-md:hidden bg-white text-blue-900 py-2 px-3 rounded-md gap-2">
                            <FaPhoneAlt />
                            Hotline 24/7
                        </button>
                    </Tooltip>
                    {authenticated ?
                        <Dropdown
                            menu={{ items: itemsDrop }}
                            trigger={['click', 'hover']} >
                            <img src={user?.avatar} className="w-10 h-10 rounded-full"></img>
                        </Dropdown>
                        :
                        <button className="flex items-center bg-white text-blue-900 py-2 px-3 rounded-md"
                            onClick={() => { nav("/login") }}>
                            Đăng nhập
                        </button>
                    }
                </div>
            </div>
            <div className="flex items-center justify-around fixed w-full z-40 py-2 border-grey border-t-2 bottom-0 bg-white font-semibold md:hidden">
                <button className="flex flex-col items-center">
                    <IoSearch className="text-2xl" />
                    Tìm kiếm
                </button>
                <Link to="/my-storage">
                    <button className="flex flex-col items-center">
                        <LuTicket className="text-2xl" />
                        Vé của tôi
                    </button>
                </Link>
                <button className="flex flex-col items-center">
                    <RiAccountCircleLine className="text-2xl" />
                    Tài khoản
                </button>
            </div>
            {
                !visible ? <>
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
                </>
                    : <></>

            }
            <div>
                <Outlet context={{ setVisible, listRoutes }} />
            </div>
        </div>
    )
}

export default Layout