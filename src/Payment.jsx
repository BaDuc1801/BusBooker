import { Button, Radio, Input, Form } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BsShieldFillCheck } from 'react-icons/bs';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { Link, useLocation, useOutletContext } from 'react-router-dom';

const Payment = () => {
    const { setVisible } = useOutletContext();
    const location = useLocation()
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listVoucher, setListVoucher] = useState([])

    useEffect(() => {
        if (location.pathname !== "/payment") {
            setVisible(false);
        } else {
            setVisible(true);
            const fetchData = async () => {
                const data = await axios.get(`${beUrl}/vouchers`);
                setListVoucher(data.data);
            }
            fetchData()
        }
        return () => {
            setVisible(false);
        };
    }, [location.pathname, setVisible]);

    const formattedDate = date => {
        const getDate = new Date(date)
        return getDate.toLocaleDateString('vi-VN')
    }

    const formattedTime = (date) => {
        const getDate = new Date(date);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' };
        const rs = getDate.toLocaleTimeString('vi-VN', options);
        return rs
    }

    const originChoice = localStorage.getItem("originChoice");
    const chieuDi = JSON.parse(localStorage.getItem("chieuDi"));
    const giaChieuDi = parseInt(localStorage.getItem("giaChieuDi"))

    const destiChoice = localStorage.getItem("destiChoice");
    const chieuVe = JSON.parse(localStorage.getItem("chieuVe"));
    const giaChieuVe = parseInt(localStorage.getItem("giaChieuVe"))

    const totalPrice = (isNaN(giaChieuDi) ? 0 : giaChieuDi) + (isNaN(giaChieuVe) ? 0 : giaChieuVe);

    const { form } = Form.useForm();

    const onFinish = (value) => {
        console.log([value, { voucher: selectedVoucher?.code }])
    }

    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [total, setTotalPrice] = useState(totalPrice);

    const applyVoucher = (voucher) => {
        if (!voucher) return;

        let newTotal = totalPrice;

        if (voucher.discountType === 'percent') {
            newTotal -= (newTotal * (voucher.discount / 100));
        }

        if (voucher.discountType === 'fixed') {
            newTotal -= voucher.discount;
        }

        if (newTotal < 0) newTotal = 0;

        setSelectedVoucher(voucher);
        setTotalPrice(newTotal);
    };

    return (
        <div className='bg-[#F2F4F7] flex justify-center gap-10 pt-10 max-md:flex-col-reverse max-md:pb-[100px] max-md:gap-3 max-md:pt-3 max-md:px-3 md:pb-[50px]'>
            <div className='flex-flex-col'>
                <div className='bg-white pt-5 px-5 rounded-md shadow-md'>
                    <p className='text-xl font-semibold text-center'>Thông tin liên hệ</p>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout='vertical'
                        className='bg-white md:w-[500px] p-5 rounded-lg'
                    >
                        <Form.Item
                            label="Họ và tên"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên của bạn!',
                                }
                            ]}
                        >
                            <Input placeholder='Nhập họ tên của bạn' className='p-2' />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email của bạn!',
                                },
                                {
                                    type: 'email',
                                    message: 'Vui lòng nhập một địa chỉ email hợp lệ!',
                                }
                            ]}
                        >
                            <Input placeholder="Nhập email" className="p-2" />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng số điện thoại của bạn!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại của bạn" className='p-2' />
                        </Form.Item>
                        <div className='flex items-center gap-3 border-2 border-green-500 rounded-md px-3 py-2 bg-green-50'>
                            <BsShieldFillCheck className='text-green-500 text-2xl' />
                            <p className='font-semi'>Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và liên hệ khi cần thiết.</p>
                        </div>
                        <Form.Item
                            className='mt-5'
                            label="Lựa chọn phương thức thanh toán"
                            name="paymentMethod"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn phương thức thanh toán!',
                                }
                            ]}
                        >
                            <Radio.Group className='flex flex-col gap-3 mt-2'>
                                <Radio value="direct">Thanh toán trực tiếp</Radio>
                                <Radio value="bank">Chuyển khoản ngân hàng</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='w-full py-4'>
                                Thanh toán
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
            <div className='bg-white pt-5 px-5 rounded-md shadow-md flex flex-col gap-2 md:w-[350px]'>
                <p className='text-xl font-semibold'>Thông tin chi tiết chuyến đi</p>
                <div>
                    <p className='text-lg'>Chiều đi: </p>
                    <div className='pl-4'>
                        <p>Thời gian: {formattedDate(chieuDi?.startTime)} - {formattedTime(chieuDi?.startTime)}</p>
                        <p>Địa điểm: {originChoice}</p>
                        <p>Xe: {chieuDi?.licensePlate}</p>
                        <p>Loại xe: {chieuDi?.totalSeats} chỗ</p>
                        <p>Số ghế: {chieuDi?.seatNumber.join(', ')}</p>
                        <p className='font-semibold '>Tổng:<span className='text-blue-500 ml-2'>{giaChieuDi?.toLocaleString()}đ</span> </p>
                    </div>
                </div>
                {
                    chieuVe && (
                        <div>
                            <p className='text-xl'>Chiều về: </p>
                            <div className='pl-4'>
                                <p>Thời gian: {formattedDate(chieuVe?.startTime)} - {formattedTime(chieuVe?.startTime)}</p>
                                <p>Địa điểm: {destiChoice}</p>
                                <p>Xe: {chieuVe.licensePlate}</p>
                                <p>Loại xe: {chieuVe.totalSeats} chỗ</p>
                                <p>Số ghế: {chieuVe.seatNumber.join(', ')}</p>
                                <p className='font-semibold '>Tổng:<span className='text-blue-500 ml-2'>{giaChieuVe.toLocaleString()}đ</span> </p>
                            </div>
                        </div>
                    )
                }
                <div>
                    <div className='border-t-2 py-2 flex items-center justify-between'>
                        <p className='font-semibold'>Tổng tiền:</p>
                        <p className='text-blue-500 font-semibold text-lg'>{totalPrice.toLocaleString()}đ</p>
                    </div>
                    <div className='border-t-2 py-2 flex items-center justify-between'>
                        <p className='font-semibold'>Mã áp dụng:</p>
                        <p className='font-semibold'>{selectedVoucher?.code}</p>
                    </div>
                    <div className='border-t-2 py-2 flex items-center justify-between'>
                        <p className='font-semibold'>Tổng tiền:</p>
                        <p className='text-blue-500 font-semibold text-xl'>{total.toLocaleString()}đ</p>
                    </div>
                </div>
                <div>
                    <p className='text-xl font-semibold border-t-2 pt-2'>Danh sách khuyến mãi</p>
                    <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                        {listVoucher && listVoucher.map((item, index) => {
                            return (
                                <div key={index} className={`border-2 rounded-md shadow-md p-1 cursor-pointer ${selectedVoucher === item
                                    ? 'border-4 border-blue-500'
                                    : ''
                                    }`}
                                    onClick={() => applyVoucher(item)}>
                                    <div className="flex items-center justify-center h-full">
                                        <div className='bg-[#fef32a] w-[70px] h-full rounded-md flex items-center justify-center'>
                                            <RiDiscountPercentFill className='text-4xl' />
                                        </div>
                                        <div className='text-sm pl-2 pr-1'>
                                            <p className='text-blue-600 font-semibold'>Thanh toán</p>
                                            <p className='font-bold text-md'>{item.name}</p>
                                            <p>HSD: <span className='font-semibold'>{formattedDate(item.expiryDate)}</span> </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
