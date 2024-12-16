import { Button, Form, Input, Modal, notification, Select, Table, Tabs, Upload } from 'antd';
import Item from 'antd/es/list/Item';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';
import { MdOutlineFileUpload } from 'react-icons/md';

const BusManager = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listBus, setListBus] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${beUrl}/bus`);
                setListBus(response.data);
            } catch (error) {
                console.error('Error fetching buss:', error);
            }
        };
        fetchData();
    }, []);

    function getUniqueOwners(listBus) {
        const owners = listBus.map(bus => bus.owner);
        const uniqueOwners = [...new Set(owners)];
        return uniqueOwners;
    }

    const uniqueOwners = getUniqueOwners(listBus);

    const [selectedBus, setSelectedBus] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [busIdToDelete, setBusIdToDelete] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [busForm, setbusForm] = useState({
        status: '',
    });

    const handleEdit = (bus) => {
        setSelectedBus(bus);
        setbusForm({
            status: bus.status
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (bus) => {
        setBusIdToDelete(bus);
        setConfirmDelete(true);
    };

    const confirmDeletebus = async () => {
        try {
            await axios.delete(`${beUrl}/bus/${busIdToDelete}`);
            setListBus(listBus.filter((bus) => bus._id !== busIdToDelete));
            setConfirmDelete(false);
            notification.success({ message: 'Xóa bus thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi khi xóa bus' });
        }
    };

    const cancelDeletebus = () => {
        setConfirmDelete(false);
        setBusIdToDelete(null);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedbus = await axios.put(
                `${beUrl}/bus/update/${selectedBus._id}`,
                busForm
            );
            setListBus(
                listBus.map((bus) =>
                    bus._id === selectedBus._id ? updatedbus.data : bus
                )
            );
            setIsEditModalVisible(false);
            notification.success({ message: 'Cập nhật bus thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi cập nhật bus' });
        }
    };

    const handleInputChange = (value, name) => {
        setbusForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
            render: (text) => {
                return <p>{text}</p>;
            },
        },
        {
            title: 'Nhà xe',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Số ghế',
            dataIndex: 'totalSeats',
            key: 'totalSeats',
            render: (text) => {
                return <p>{text}</p>
            }
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return (
                    text === "active" ? <p className='text-green-500'>{text}</p>
                        : <p className='text-red-500'>{text}</p>)
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

    const onFinish = async (values) => {
        try {
            const response = await axios.post(`${beUrl}/bus/add`, {
                totalSeats: values.totalSeats,
                owner: values.owner,
                licensePlate: values.licensePlate
            });

            const busId = response.data._id;
            const files = form.getFieldValue('img');

            const formData = new FormData();
            files.forEach((file) => {
                formData.append('img', file.originFileObj);
            });
            await axios.put(`${beUrl}/bus/img/${busId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            notification.success({ message: 'Tạo xe thành công' });
            form.resetFields();
            setListBus([...listBus, response.data])
        } catch (error) {
            console.error('Lỗi khi tạo xe:', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredBus = (bus) => {
        return bus.filter(bus => {
            const { licensePlate, owner } = bus;
            return (
                licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                owner?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div>
            <Tabs defaultActiveKey='1'
                className='bg-white rounded-md px-4 w-full pb-4'>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Danh sách xe</p>} key='1'>
                    <Input
                        placeholder="Tìm kiếm "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 mb-3"
                    />
                    {listBus && <Table dataSource={filteredBus(listBus)} columns={columns} pagination={{ pageSize: 6 }} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Tạo mới xe</p>} key='2'>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout='vertical'
                        className='w-1/2 m-auto border-2 shadow-md rounded-md px-5 pt-4'
                    >
                        <Form.Item
                            label="Số lượng chỗ ngồi:"
                            name="totalSeats"
                            rules={[
                                {
                                    required: true,
                                    message: '',
                                }
                            ]}
                        >
                            <Select size='large'>
                                <Option value="9">
                                    9
                                </Option>
                                <Option value="11">
                                    11
                                </Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Nhà xe:"
                            name="owner"
                            rules={[
                                {
                                    required: true,
                                    message: '',
                                }
                            ]}
                        >
                            <Select size='large'>
                                {
                                    uniqueOwners.map((item, index) => {
                                        return (
                                            <Option value={item} key={index}>
                                                {item}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Biển số xe:"
                            name="licensePlate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập biển số xe!',
                                }
                            ]}
                        >
                            <Input placeholder='Nhập biển số xe' className='p-2' />
                        </Form.Item>
                        <Form.Item
                            rules={[{required: true}]}
                        >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            maxCount={4}
                            multiple
                            onChange={({ fileList }) => form.setFieldsValue({ img: fileList })}
                        >
                            <Button icon={<MdOutlineFileUpload />}>Upload (Max: 4)</Button>
                        </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='w-full mt-6'>
                                Thêm mới
                            </Button>
                        </Form.Item>
                    </Form>
                </Item>
            </Tabs>
            <Modal
                title="Cập nhật bus"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <div>
                    <div className="">
                        <label htmlFor="status">Tình trạng:</label>
                        <Select size='large' key='status' className='w-40 ml-5'
                            onSelect={(value) => handleInputChange(value, 'status')}
                        >
                            <Option value="active">
                                Hoạt động
                            </Option>
                            <Option value="inactive">
                                Bảo trì
                            </Option>
                        </Select>
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa bus"
                open={confirmDelete}
                onOk={confirmDeletebus}
                onCancel={cancelDeletebus}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa mã khuyến mãi này không?</p>
            </Modal>
        </div>
    )
}

export default BusManager
