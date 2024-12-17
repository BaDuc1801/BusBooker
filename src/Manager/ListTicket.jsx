import { Button, Input, Modal, Table, Tabs } from 'antd'
import Item from 'antd/es/list/Item'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { IoInformationCircle } from 'react-icons/io5'
import { FiXCircle } from 'react-icons/fi'
import { UserContext } from '../Context/UserContext'

const ListTicket = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listTicket, setListTicket] = useState([]);
    const { user } = useContext(UserContext);

    const [waitingTickets, setWaitingTickets] = useState([]);
    const [completedTickets, setCompletedTickets] = useState([]);
    const [cancelledTickets, setCancelledTickets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await axios.get(`${beUrl}/tickets/all`)
            if (user?.role === "Operator") {
                const filteredData = data.data.filter(ticket => {
                    const isDepartureValid = ticket?.scheduleId?.busId?.owner === user?.owner;
                    const isReturnValid = ticket?.scheduleId?.busId?.owner === user?.owner;
                    return isDepartureValid || isReturnValid;
                });
                setListTicket(filteredData);
                return;
            } else {
                setListTicket(data.data)
            }
        }
        fetchData()
    }, []);

    useEffect(() => {
        if (listTicket.length) {
            const waiting = listTicket.filter(ticket => ticket.status === 'waiting' || ticket.status === 'booked');
            const completed = listTicket.filter(ticket => ticket.status === 'completed');
            const cancelled = listTicket.filter(ticket => ticket.status === 'cancelled');
            setWaitingTickets(waiting);
            setCompletedTickets(completed);
            setCancelledTickets(cancelled);
        }
    }, [listTicket]);

    const formattedTime = (date) => {
        const getDate = new Date(date);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' };
        const rs = getDate.toLocaleTimeString('vi-VN', options);
        return rs
    }

    const formattedTimeFromDB = (date) => {
        const getDate = new Date(date);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' };
        const rs = getDate.toLocaleTimeString('UTC', options);
        return rs
    }

    const formattedDate = (date) => {
        const getDate = new Date(date);
        return getDate.toLocaleDateString('vi-VN', { timeZone: 'UTC' });
    };

    const [modal, setModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    const columns = [
        {
            title: "Thời gian đặt",
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                return <p>{formattedDate(text)} - {formattedTime(text)}</p>
            }
        },
        {
            title: 'Điểm xuất phát',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text) => {
                return <p>{text?.routeId?.origin}</p>
            }
        },
        {
            title: 'Điểm đến',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text) => {
                return <p>{text?.routeId?.destination}</p>
            }
        },
        {
            title: 'Thời gian khởi hành',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text) => {
                return <p>{formattedDate(text?.startTime)} - {formattedTimeFromDB(text?.startTime)}</p>
            }
        },
        {
            title: 'Thời gian dự kiến đến nơi',
            dataIndex: 'scheduleId',
            key: '_id',
            render: (text) => {
                return <p>{formattedDate(text?.endTime)} - {formattedTimeFromDB(text?.endTime)}</p>
            }
        },
        {
            title: "Tên khách",
            dataIndex: 'username',
            key: 'username',
            render: (text) => {
                return <p>{text}</p>
            }
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
            render: (text) => {
                return <p>{text}</p>
            }
        },
        {
            title: "Số điện thoại",
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text) => {
                return <p>{text}</p>
            }
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                if (text === "waiting") {
                    return <p className='text-orange-400 font-semibold'>Thanh toán trực tiếp</p>
                } else if (text === "booked") {
                    return <p className='text-green-500 font-semibold'>Đã thanh toán</p>
                } else if (text === "completed") {
                    return <p className='text-green-500 font-semibold'>Đã hoàn thành</p>
                } else {
                    return <p className='text-red-400 font-semibold'>Đã hủy</p>
                }
            }
        },
        {
            title: 'Chi tiết',
            dataIndex: '_id',
            key: '_id',
            render: (_blank, record) => {
                return (
                    <p
                        className="cursor-pointer text-xl text-blue-900"
                        onClick={() => {
                            setSelectedTicket(record);
                            setModal(true);
                        }}
                    >
                        <IoInformationCircle />
                    </p>
                );
            },
        },
        ...((user?.role !== "Operator" && activeTab === '1') ? [{
            title: 'Hủy vé',
            dataIndex: 'status',
            render: (_text, record) => {
                return <p
                    className="cursor-pointer text-xl text-red-500"
                    onClick={() => {
                        setSelectedTicket(record);
                        setConfirm(true);
                    }}
                >
                    <FiXCircle />
                </p>
            }
        }] : []),
    ];

    const handleClose = () => {
        setModal(false);
        setSelectedTicket(null);
    };

    const handleCancelTicket = async () => {
        await axios.put(`${beUrl}/tickets/cancel`, { ticketId: selectedTicket._id });
        setConfirm(false);
        const fetchData = async () => {
            const { data } = await axios.get(`${beUrl}/tickets/userId/${user?._id}`);
            setListTicket(data);
        };
        fetchData();
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredTickets = (tickets) => {
        return tickets.filter(ticket => {
            const { username, email, phoneNumber } = ticket;
            return (
                username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div className=' bg-[#F2F4F7] max-md:pb-[100px]'>
            <Input
                placeholder="Tìm kiếm "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-3"
            />
            <Tabs defaultActiveKey='1'
                onChange={setActiveTab}
                className='bg-white rounded-md px-4 w-full pb-4'>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Hiện tại</p>} key='1'>
                    {listTicket && <Table dataSource={filteredTickets(waitingTickets)} columns={columns} pagination={{ pageSize: 8 }} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Đã đi</p>} key='2'>
                    {listTicket && <Table dataSource={filteredTickets(completedTickets)} columns={columns} pagination={{ pageSize: 8 }} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Đã hủy</p>} key='3'>
                    {listTicket && <Table dataSource={filteredTickets(cancelledTickets)} columns={columns} pagination={{ pageSize: 8 }} />}
                </Item>
            </Tabs>
            <Modal
                title="Xác nhận hủy vé"
                open={confirm}
                onCancel={() => setConfirm(false)}
                footer={[
                    <Button key="cancel" onClick={() => setConfirm(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={handleCancelTicket}
                    >
                        Xác nhận
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy vé này không?</p>
            </Modal>
            <Modal
                title="Chi tiết Vé"
                open={modal}
                footer={[
                    <Button key="ok" type="primary" onClick={handleClose}>
                        Xong
                    </Button>,
                ]}
            >
                {selectedTicket && (
                    <>
                        <div className='flex items-center justify-center gap-5'>
                            <div>
                                <div className='pl-4'>
                                    <p>Thời gian: {formattedDate(selectedTicket?.scheduleId?.startTime)} - {formattedTime(selectedTicket?.scheduleId?.startTime)}</p>
                                    <p>Địa điểm: {selectedTicket?.scheduleId?.routeId?.origin}</p>
                                    <p>Xe: {selectedTicket?.scheduleId?.busId?.licensePlate}</p>
                                    <p>Loại xe: {selectedTicket?.scheduleId?.busId?.totalSeats} chỗ</p>
                                    <p>Số ghế: {selectedTicket?.seatNumbers.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='text-end w-full mt-3 text-lg'>Tổng thanh toán: {selectedTicket?.price.toLocaleString()}đ</div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default ListTicket
