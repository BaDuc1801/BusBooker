import { Button, Input, Modal, Table, Tabs } from 'antd'
import Item from 'antd/es/list/Item'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IoInformationCircle } from 'react-icons/io5'
import { FiXCircle } from 'react-icons/fi'

const ListTicket = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listTicket, setListTicket] = useState([]);

    const [waitingTickets, setWaitingTickets] = useState([]);
    const [completedTickets, setCompletedTickets] = useState([]);
    const [cancelledTickets, setCancelledTickets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await axios.get(`${beUrl}/tickets/all`)
            setListTicket(data.data);
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
        const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' };
        const rs = getDate.toLocaleTimeString('vi-VN', options);
        return rs
    }

    const formattedDate = date => {
        const getDate = new Date(date)
        return getDate.toLocaleDateString('vi-VN')
    }

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
            title: 'ID Vé',
            dataIndex: '_id',
            key: '_id',
            // width: 300
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
            title: 'Loại Vé',
            dataIndex: 'returnTrip',
            key: 'returnTrip',
            render: (text) => {
                if (text.seatNumbers.length === 0) {
                    return <span>1 chiều</span>;
                } else {
                    return <span>2 chiều</span>;
                }
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
        ...(activeTab === '1' ? [{
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
            const { _id, username, email, phoneNumber } = ticket;
            return (
                _id.includes(searchQuery) || 
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
                                {selectedTicket.returnTrip.seatNumbers.length !== 0 && <p className='text-lg'>Chiều đi: </p>}
                                <div className='pl-4'>
                                    <p>Thời gian: {formattedDate(selectedTicket?.departureTrip?.scheduleId?.startTime)} - {formattedTime(selectedTicket?.departureTrip?.scheduleId?.startTime)}</p>
                                    <p>Địa điểm: {selectedTicket?.departureTrip?.scheduleId?.routeId?.origin}</p>
                                    <p>Xe: {selectedTicket?.departureTrip?.scheduleId?.busId?.licensePlate}</p>
                                    <p>Loại xe: {selectedTicket?.departureTrip?.scheduleId?.busId?.totalSeats} chỗ</p>
                                    <p>Số ghế: {selectedTicket?.departureTrip?.seatNumbers.join(', ')}</p>
                                </div>
                            </div>
                            {
                                selectedTicket?.returnTrip?.seatNumbers.length !== 0 && (
                                    <div>
                                        <p className='text-xl'>Chiều về: </p>
                                        <div className='pl-4'>
                                            <p>Thời gian: {formattedDate(selectedTicket?.returnTrip?.scheduleId?.startTime)} - {formattedTime(selectedTicket?.returnTrip?.scheduleId?.startTime)}</p>
                                            <p>Địa điểm: {selectedTicket?.returnTrip?.scheduleId?.routeId?.destination}</p>
                                            <p>Xe: {selectedTicket?.returnTrip?.scheduleId?.busId?.licensePlate}</p>
                                            <p>Loại xe: {selectedTicket?.returnTrip?.scheduleId?.busId?.totalSeats} chỗ</p>
                                            <p>Số ghế: {selectedTicket?.returnTrip?.seatNumbers.join(', ')}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className='text-end w-full mt-3 text-lg'>Tổng thanh toán: {selectedTicket?.price.toLocaleString()}đ</div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default ListTicket
