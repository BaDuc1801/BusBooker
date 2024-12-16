import { Button, Col, Form, Input, Modal, notification, Row, Table, Tabs } from 'antd';
import Item from 'antd/es/list/Item';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';

const RouteManage = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listRoute, setListRoute] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${beUrl}/routes`);
                setListRoute(response.data);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        };
        fetchData();
    }, []);

    const [selectedRoute, setSelectedRoute] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [routeIdToDelete, setRouteIdToDelete] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [routeForm, setRouteForm] = useState({
        origin: '',
        destination: '',
        basisPrice: '',
        afterDiscount: '',
    });

    const handleEdit = (route) => {
        setSelectedRoute(route);
        setRouteForm({
            origin: route.origin,
            destination: route.destination,
            basisPrice: route.basisPrice,
            afterDiscount: route.afterDiscount,
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (route) => {
        setRouteIdToDelete(route);
        setConfirmDelete(true);
    };

    const confirmDeleteRoute = async () => {
        try {
            await axios.delete(`${beUrl}/routes/${routeIdToDelete}`);
            setListRoute(listRoute.filter((route) => route._id !== routeIdToDelete));
            setConfirmDelete(false);
            notification.success({ message: 'Xóa tuyến đường thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi khi xóa tuyến đường' });
        }
    };

    const cancelDeleteRoute = () => {
        setConfirmDelete(false);
        setRouteIdToDelete(null);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedRoute = await axios.put(
                `${beUrl}/routes/${selectedRoute._id}`,
                routeForm
            );
            setListRoute(listRoute.map(route =>
                route._id === selectedRoute._id ? updatedRoute.data : route
            ));
            setIsEditModalVisible(false);
            notification.success({ message: 'Cập nhật tuyến đường thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi cập nhật tuyến đường' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRouteForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Điểm đi',
            dataIndex: 'origin',
            key: 'origin',
            render: (text) => {
                return <p>{text}</p>;
            },
        },
        {
            title: 'Điểm đến',
            dataIndex: 'destination',
            key: 'destination',
        },
        {
            title: 'Giá gốc',
            dataIndex: 'basisPrice',
            key: 'basisPrice',
        },
        {
            title: 'Giá sau giảm',
            dataIndex: 'afterDiscount',
            key: 'afterDiscount'
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
            const response = await axios.post(`${beUrl}/routes`, {
                ...values, img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/25/img_hero.png"
            });
            notification.success({ message: 'Tạo tuyến đường thành công' });
            form.resetFields();
            setListRoute([...listRoute, response.data]);
        } catch (error) {
            notification.error({ message: 'Error creating voucher', description: error.message });
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredRoute = (route) => {
        return route.filter(route => {
            const { origin, destination } = route;
            return (
                origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                destination?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    return (
        <div>
            <Tabs defaultActiveKey='1'
                className='bg-white rounded-md px-4 w-full pb-4'>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Danh sách tuyến đường</p>} key='1'>
                    <Input
                        placeholder="Tìm kiếm "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 mb-3"
                    />
                    {listRoute && <Table dataSource={filteredRoute(listRoute)} columns={columns} pagination={{ pageSize: 6 }} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Thêm tuyến đường</p>} key='2'>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout='vertical'
                        className='w-1/2 m-auto border-2 shadow-md rounded-md px-5 pt-4'
                    >
                        <Row gutter={[16, 8]}>
                            <Col span={12}>
                                <Form.Item
                                    label="Điểm đi:"
                                    name="origin"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập điểm đi!',
                                        }
                                    ]}
                                >
                                    <Input placeholder='Nhập điểm đi' className='p-2' />
                                </Form.Item>
                                <Form.Item
                                    label="Giá gốc:"
                                    name="basisPrice"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập giá gốc!',
                                        }
                                    ]}
                                >
                                    <Input placeholder='Nhập giá gốc' className='p-2' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Điểm đến:"
                                    name="destination"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng điểm đến!',
                                        }
                                    ]}
                                >
                                    <Input placeholder='Nhập điểm đến' className='p-2' />
                                </Form.Item>
                                <Form.Item
                                    label="Giá sau giảm:"
                                    name="afterDiscount"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập giá sau giảm!',
                                        }
                                    ]}
                                >
                                    <Input placeholder='Nhập giá sau giảm' className='p-2' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='w-full'>
                                Tạo mới
                            </Button>
                        </Form.Item>
                    </Form>
                </Item>
            </Tabs>
            <Modal
                title="Chỉnh sửa tuyến đường"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <div>
                    <div className="mb-3">
                        <label htmlFor="code">Điểm đi:</label>
                        <Input
                            id="origin"
                            name="origin"
                            value={routeForm.origin}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='name'>Điểm đến:</label>
                        <Input
                            id="destination"
                            name="destination"
                            value={routeForm.destination}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="basisPrice">Giá gốc:</label>
                        <Input
                            id="basisPrice"
                            name="basisPrice"
                            value={routeForm.basisPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="expiryDate">Giá sau giảm:</label>
                        <Input
                            id="afterDiscount"
                            name="afterDiscount"
                            value={routeForm.afterDiscount}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa voucher"
                open={confirmDelete}
                onOk={confirmDeleteRoute}
                onCancel={cancelDeleteRoute}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa mã khuyến mãi này không?</p>
            </Modal>
        </div>
    )
}

export default RouteManage
