import { BsTicketPerforatedFill } from "react-icons/bs"
import { FaPhoneAlt } from "react-icons/fa"
import { IoBus, IoSearch } from "react-icons/io5"
import { LuTicket } from "react-icons/lu"
import { MdManageAccounts } from "react-icons/md"
import { RiAccountCircleLine } from "react-icons/ri"
import { TiThMenu } from "react-icons/ti"
import { Outlet } from "react-router-dom"

const Layout = () => {

    return (
        <div>
            <div className="flex justify-between bg-[#1677ff] text-white text-[16px] p-4  font-semibold">
                <div className="flex items-center text-3xl gap-1 cursor-pointer">
                    <TiThMenu className="hidden max-md:block max-md:mr-4" />
                    <IoBus className="text-yellow-300" />
                    BusBooker
                </div>
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
                    <button className="flex items-center bg-white text-blue-900 py-2 px-3 rounded-md">
                        Đăng nhập
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-around fixed w-full z-50 py-2 border-grey border-t-2 bottom-0 bg-white font-semibold md:hidden">
                <button className="flex flex-col items-center">
                    <IoSearch className="text-2xl"/>
                    Tìm kiếm
                </button>
                <button className="flex flex-col items-center">
                    <LuTicket className="text-2xl"/>
                    Vé của tôi
                </button>
                <button className="flex flex-col items-center">
                    <RiAccountCircleLine className="text-2xl"/>
                    Tài khoản
                </button>
            </div>
            <div className="mb-[100px]">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout