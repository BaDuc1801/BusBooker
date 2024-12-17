import { Button, Form, Input, Modal, Rate, Table, Tabs } from 'antd'
import Item from 'antd/es/list/Item'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './Context/UserContext'
import axios from 'axios'
import { IoInformationCircle } from 'react-icons/io5'
import { FiXCircle } from 'react-icons/fi'
import { GoCodeReview } from 'react-icons/go'

const UserStorage = () => {
    const { user } = useContext(UserContext);
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listTicket, setListTicket] = useState([]);

    const [waitingTickets, setWaitingTickets] = useState([]);
    const [completedTickets, setCompletedTickets] = useState([]);
    const [cancelledTickets, setCancelledTickets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await axios.get(`${beUrl}/tickets/userId/${user?._id}`)
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

    const formattedDate = date => {
        const getDate = new Date(date)
        return getDate.toLocaleDateString('vi-VN')
    }

    const [modal, setModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [review, setReview] = useState(false);
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
            render: (text, record) =>
                text === 'waiting' ? (
                    <p
                        className="cursor-pointer text-xl text-red-500"
                        onClick={() => {
                            setSelectedTicket(record);
                            setConfirm(true);
                        }}
                    >
                        <FiXCircle />
                    </p>
                ) : null,
        }] : []),
        ...(activeTab === '2' ? [{
            title: 'Đánh giá',
            dataIndex: 'hasReviewed',
            render: (text, record) => {
                return (!text ? <p onClick={() => {
                    setSelectedTicket(record);
                    setReview(true);
                }}><GoCodeReview className='text-xl cursor-pointer' /></p> : "")
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


    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');

    const handleReviewSubmit = async () => {
        const newReview = {
            rating: rating,
            content: reviewContent,
            ticketId: selectedTicket._id,
            userId: user._id,
            busId: selectedTicket.scheduleId.busId._id
        };

        await axios.post(`${beUrl}/tickets/review`, newReview);
        setReview(false);
        const fetchData = async () => {
            const { data } = await axios.get(`${beUrl}/tickets/userId/${user?._id}`);
            setListTicket(data);
        };
        fetchData();
    };

    return (
        <div className='flex justify-center items-center h-[calc(100vh-72px)] bg-[#F2F4F7] max-md:pb-[100px]'>
            <Tabs defaultActiveKey='1'
                onChange={setActiveTab}
                className='bg-white rounded-md px-4 w-[70%] pb-4'>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Hiện tại</p>} key='1'>
                    {listTicket && <Table dataSource={waitingTickets} columns={columns} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Đã đi</p>} key='2'>
                    {listTicket && <Table dataSource={completedTickets} columns={columns} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Đã hủy</p>} key='3'>
                    {listTicket && <Table dataSource={cancelledTickets} columns={columns} />}
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
                title="Đánh giá chuyến đi"
                open={review}
                onCancel={() => setReview(false)}
                footer={[
                    <Button key="cancel" onClick={() => setReview(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={handleReviewSubmit}
                    >
                        Đăng
                    </Button>,
                ]}
            >
                <Form layout="vertical" onFinish={handleReviewSubmit}>
                    <Form.Item label="Đánh giá sao" name="rating">
                        <Rate value={rating} onChange={setRating} />
                    </Form.Item>
                    <Form.Item label="Nhận xét" name="review">
                        <Input.TextArea
                            rows={4}
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                        />
                    </Form.Item>
                </Form>
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
                                    <p>Địa điểm: {selectedTicket?.scheduleId?.routeId?.origin} - {selectedTicket?.scheduleId?.routeId?.destination}</p>
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

export default UserStorage
