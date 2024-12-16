import { Button, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select, Table, Tabs } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Item from 'antd/es/list/Item';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';

const VoucherManage = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listVoucher, setListVoucher] = useState([]);

    const formattedDate = date => {
        const getDate = new Date(date)
        return getDate.toLocaleDateString('vi-VN')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${beUrl}/vouchers`);
                setListVoucher(response.data);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        };
        fetchData();
    }, []);

    const [selectedvoucher, setSelectedvoucher] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [voucherIdToDelete, setvoucherIdToDelete] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [voucherForm, setvoucherForm] = useState({
        code: '',
        name: '',
        description: '',
        expiryDate: ''
    });

    const handleEdit = (voucher) => {
        setSelectedvoucher(voucher);
        setvoucherForm({
            code: voucher.code,
            name: voucher.name,
            description: voucher.description,
            expiryDate: voucher.expiryDate
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (voucher) => {
        setvoucherIdToDelete(voucher);
        setConfirmDelete(true);
    };

    const confirmDeletevoucher = async () => {
        try {
            await axios.delete(`${beUrl}/vouchers/${voucherIdToDelete}`);
            setListVoucher(listVoucher.filter((voucher) => voucher._id !== voucherIdToDelete));
            setConfirmDelete(false);
            notification.success({ message: 'Xóa voucher thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi khi xóa voucher' });
        }
    };

    const cancelDeletevoucher = () => {
        setConfirmDelete(false);
        setvoucherIdToDelete(null);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedvoucher = await axios.put(
                `${beUrl}/vouchers/${selectedvoucher._id}`,
                voucherForm
            );
            setListVoucher(
                listVoucher.map((voucher) =>
                    voucher._id === selectedvoucher._id ? updatedvoucher.data : voucher
                )
            );
            setIsEditModalVisible(false);
            notification.success({ message: 'Cập nhật voucher thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi cập nhật voucher' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setvoucherForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Mã Voucher',
            dataIndex: 'code',
            key: 'code',
            render: (text) => {
                return <p>{text}</p>;
            },
        },
        {
            title: 'Giảm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Nội dung',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Số lượng',
            dataIndex: 'count',
            key: 'count'
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            render: (text) => {
                return <p>{formattedDate(text)}</p>
            }
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (text) => {
                return <p>{text.username}</p>
            }
        },
        {
            title: 'Chỉnh sửa',
            render: (_text, record) => (
                <div className="flex cursor-pointer text-lg gap-5">
                    <p onClick={() => handleEdit(record)}>
                        <RiEditFill />
                    </p>
                    <p
                        className="text-red-500"
                        onClick={() => handleDelete(record._id)}
                    >
                        <FaTrash />
                    </p>
                </div>
            ),
        }
    ]

    const [form] = Form.useForm();

    const token = localStorage.getItem("accessToken")

    const onFinish = async (values) => {
        try {
            const formattedExpiryDate = formattedDatePicker(values.expiryDate);
            const response = await axios.post(`${beUrl}/vouchers/create`, {
                ...values,
                expiryDate: formattedExpiryDate,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            notification.success({ message: 'Tạo khuyến mãi thành công' });
            form.resetFields();
            setListVoucher([...listVoucher, response.data]);
        } catch (error) {
            notification.error({ message: 'Error creating voucher', description: error.message });
        }
    };


    const formattedDatePicker = (date) => {
        const getDate = new Date(date);
        const year = getDate.getFullYear();
        const month = String(getDate.getMonth() + 1).padStart(2, '0');
        const day = String(getDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };


    const [searchQuery, setSearchQuery] = useState('');

    const filteredVoucher = (voucher) => {
        return voucher.filter(user => {
            const { code } = user;
            return (
                code?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div>
            <Tabs defaultActiveKey='1'
                className='bg-white rounded-md px-4 w-full pb-4'>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Danh sách khuyến mãi</p>} key='1'>
                    <Input
                        placeholder="Tìm kiếm "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 mb-3"
                    />
                    {listVoucher && <Table dataSource={filteredVoucher(listVoucher)} columns={columns} pagination={{ pageSize: 6 }} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Thêm khuyến mãi</p>} key='2'>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout='vertical'
                        className='w-1/2 m-auto border-2 shadow-md rounded-md px-5 pt-4'
                    >
                        <Form.Item
                            label="Mã Code:"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã code!',
                                }
                            ]}
                        >
                            <Input placeholder='Nhập mã code' className='p-2' />
                        </Form.Item>

                        <Form.Item
                            label="Tiêu đề:"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiêu đề!',
                                }
                            ]}
                        >
                            <Input placeholder='Nhập tiêu đề' className='p-2' />
                        </Form.Item>
                        <Row className='flex gap-2 items-center'>
                            <Form.Item
                                label="Giảm:"
                                name="discount"
                                rules={[
                                    {
                                        required: true,
                                        message: '',
                                    }
                                ]}
                            >
                                <InputNumber size='large' />
                            </Form.Item>
                            <Form.Item
                                label="Đơn vị:"
                                name="discountType"
                                rules={[
                                    {
                                        required: true,
                                        message: '',
                                    }
                                ]}
                            >
                                <Select size='large'>
                                    <Option value="percent">
                                        %
                                    </Option>
                                    <Option value="fixed">
                                        k
                                    </Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Số lượng:"
                                name="count"
                                rules={[
                                    {
                                        required: true,
                                        message: '',
                                    }
                                ]}
                            >
                                <InputNumber size='large' />
                            </Form.Item>
                            <Form.Item
                                label="Ngày hết hạn:"
                                name="expiryDate"
                                rules={[
                                    {
                                        required: true,
                                        message: '',
                                    }
                                ]}
                            >
                                <DatePicker size='large'></DatePicker>
                            </Form.Item>
                        </Row>
                        <Form.Item
                            label="Nội dung:"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: '',
                                }
                            ]}
                        >
                            <TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='w-full'>
                                Tạo mới
                            </Button>
                        </Form.Item>
                    </Form>
                </Item>
            </Tabs>
            <Modal
                title="Chỉnh sửa voucher"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <div>
                    <div className="mb-3">
                        <label htmlFor="code">Code:</label>
                        <Input
                            id="code"
                            name="code"
                            value={voucherForm.code}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='name'>Giảm:</label>
                        <Input
                            id="name"
                            name="name"
                            value={voucherForm.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description">Nội dung:</label>
                        <Input
                            id="description"
                            name="description"
                            value={voucherForm.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="expiryDate">Ngày hết hạn:</label>
                        <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formattedDate(voucherForm.expiryDate)}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa voucher"
                open={confirmDelete}
                onOk={confirmDeletevoucher}
                onCancel={cancelDeletevoucher}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa mã khuyến mãi này không?</p>
            </Modal>
        </div>
    )
}

export default VoucherManage
