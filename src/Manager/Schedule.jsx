import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select, Table, Tabs } from 'antd';
import Item from 'antd/es/list/Item';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { RiEditFill } from 'react-icons/ri';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import utc from 'dayjs/plugin/utc';
import { UserContext } from '../Context/UserContext';
dayjs.extend(utc);

const Schedule = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [listSchedule, setListSchedule] = useState([]);
    const [listRoute, setListRoute] = useState([]);
    const [listBus, setListBus] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await axios.get(`${beUrl}/schedule/all`);
                let scheduleData = response1.data;
                const response2 = await axios.get(`${beUrl}/routes`);
                const routeData = response2.data;
                const response3 = await axios.get(`${beUrl}/bus`);
                let busData = response3.data;

                if (user?.role === "Operator") {
                    busData = busData.filter(bus => bus.owner === user.owner);
                    let busIds = busData.map(bus => bus._id); 
                    scheduleData = scheduleData.filter(schedule => busIds.includes(schedule.busId._id));
                }

                setListBus(busData);
                setListSchedule(scheduleData);
                setListRoute(routeData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [scheduleForm, setScheduleForm] = useState({
        startTime: '',
        endTime: '',
    });

    const handleEdit = (schedule) => {
        setSelectedSchedule(schedule);
        setScheduleForm({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (schedule) => {
        setScheduleIdToDelete(schedule);
        setConfirmDelete(true);
    };

    const confirmDeleteSchedule = async () => {
        try {
            await axios.delete(`${beUrl}/schedule/${scheduleIdToDelete}`);
            setListSchedule(listSchedule.filter((schedule) => schedule._id !== scheduleIdToDelete));
            setConfirmDelete(false);
            notification.success({ message: 'Xóa lịch trình thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi khi xóa lịch trình' });
        }
    };

    const cancelDeleteSchedule = () => {
        setConfirmDelete(false);
        setScheduleIdToDelete(null);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedSchedule = await axios.put(
                `${beUrl}/schedule/update/${selectedSchedule._id}`,
                scheduleForm
            );
            setListSchedule(listSchedule.map(schedule =>
                schedule._id === selectedSchedule._id
                    ? {
                        ...schedule,
                        startTime: updatedSchedule.data.startTime,
                        endTime: updatedSchedule.data.endTime,
                    }
                    : schedule
            ));
            setIsEditModalVisible(false);
            notification.success({ message: 'Cập nhật lịch trình thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi cập nhật lịch trình' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setScheduleForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const formattedTime = (date) => {
        const getDate = new Date(date);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' };
        const rs = getDate.toLocaleTimeString('vi-VN', options);
        return rs
    }

    const formattedDate = (date) => {
        const getDate = new Date(date);
        return getDate.toLocaleDateString('vi-VN', { timeZone: 'UTC' });
    };

    const columns = [
        {
            title: 'Điểm đi',
            dataIndex: 'routeId',
            key: 'origin',
            render: (text) => {
                return (text.origin && <p>{text?.origin}</p>);
            },
        },
        {
            title: 'Điểm đi',
            dataIndex: 'routeId',
            key: 'destination',
            render: (text) => {
                return <p>{text?.destination}</p>;
            },
        },
        {
            title: 'Xe',
            dataIndex: 'busId',
            key: 'licensePlate',
            render: (text) => {
                return <p>{text.licensePlate}</p>
            }
        },
        {
            title: 'Thời gian đi',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (text) => {
                return <p>{formattedDate(text)} - {formattedTime(text)}</p>
            }
        },
        {
            title: 'Thời gian đến',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text) => {
                return <p>{formattedDate(text)} - {formattedTime(text)}</p>
            }
        },
        {
            title: 'Tổng số ghế',
            dataIndex: 'busId',
            key: 'busId',
            render: (text) => {
                return <p>{text.totalSeats}</p>
            }
        },
        {
            title: 'Số ghế còn lại',
            dataIndex: 'availableSeats',
            key: 'availableSeats',
            render: (text) => {
                return <p>{text}</p>
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

    const formatDateToUTC = (date) => {
        if (!date) return null;
        const localTime = dayjs(date);
        const utcTime = localTime.utcOffset(0, true);
        return utcTime.toISOString();
    };

    const onFinish = async (values) => {
        try {
            const formattedStartTime = formatDateToUTC(values.startTime);
            const formattedEndTime = formatDateToUTC(values.endTime);
            const response = await axios.post(`${beUrl}/schedule`, {
                routeId: values.routeId,
                busId: values.busId,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                price: {
                    front: values.front,
                    middle: values.middle,
                    back: values.back
                }
            });
            notification.success({ message: 'Tạo lịch trình thành công' });
            setListSchedule([...listSchedule, response.data]);
        } catch (error) {
            notification.error({ message: 'Error creating voucher', description: error.message });
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredRoute = (schedule) => {
        return schedule.filter(schedule => {
            const { routeId, busId, endTime, startTime } = schedule;
            return (
                routeId?.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                routeId?.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                busId?.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                endTime?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                startTime?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    const { Option } = Select;

    return (
        <div>
            <Tabs defaultActiveKey='1'
                className='bg-white rounded-md px-4 w-full pb-4'>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Danh sách lịch trình</p>} key='1'>
                    <Input
                        placeholder="Tìm kiếm "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 mb-3"
                    />
                    {listSchedule && <Table dataSource={filteredRoute(listSchedule)} columns={columns} pagination={{ pageSize: 6 }} />}
                </Item>
                <Item tab={<p className='w-1/3 font-semibold text-lg'>Thêm lịch trình</p>} key='2'>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout='vertical'
                        className='w-1/2 m-auto border-2 shadow-md rounded-md px-5 pt-4'
                    >
                        <Form.Item
                            label="Tuyến đường:"
                            name="routeId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập điểm đi!',
                                }
                            ]}
                        >
                            <Select size='large' showSearch
                                filterOption={(input, option) => {
                                    const children = React.Children.toArray(option.children).join('');
                                    return children.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {listRoute && listRoute.map((item, index) => {
                                    return (
                                        <Option key={index} value={item?._id}>
                                            {item?.origin} - {item?.destination}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Xe:"
                            name="busId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn xe!',
                                }
                            ]}
                        >
                            <Select size='large' showSearch
                                filterOption={(input, option) => {
                                    const children = React.Children.toArray(option.children).join('');
                                    return children.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {listBus && listBus.map((item, index) => {
                                    return (
                                        <Option key={index} value={item?._id}>
                                            {item?.licensePlate}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Thời gian xuất phát:"
                            name="startTime"
                            rules={[
                                {
                                    required: true,
                                    message: '',
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD HH:mm"
                                showTime={{
                                    defaultValue: dayjs('00:00', 'HH:mm'),
                                }}
                                size='large' className='w-full'></DatePicker>
                        </Form.Item>
                        <Form.Item
                            label="Thời gian đến:"
                            name="endTime"
                            rules={[
                                {
                                    required: true,
                                    message: '',
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD HH:mm"
                                showTime={{
                                    defaultValue: dayjs('00:00', 'HH:mm'),
                                }}
                                size='large' className='w-full'></DatePicker>
                        </Form.Item>
                        <Row gutter={[16, 8]}>
                            <Col span={8}>
                                <Form.Item
                                    label="Giá ghế trước:"
                                    name="front"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá cho tuyến Front!' }]}
                                >
                                    <InputNumber min={0} size='large' className='w-full' />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Giá ghế giữa:"
                                    name="middle"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá cho tuyến Middle!' }]}
                                >
                                    <InputNumber min={0} size='large' className='w-full' />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Giá ghế sau:"
                                    name="back"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá cho tuyến Back!' }]}
                                >
                                    <InputNumber min={0} size='large' className='w-full' />
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
                title="Chỉnh sửa lịch trình"
                open={isEditModalVisible}
                onOk={handleSaveChanges}
                onCancel={() => setIsEditModalVisible(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <div>
                    <div className="mb-3">
                        <label htmlFor="code">Thời gian đi:</label>
                        <Input
                            id="startTime"
                            name="startTime"
                            value={scheduleForm.startTime}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='name'>THời gian đến:</label>
                        <Input
                            id="endTime"
                            name="endTime"
                            value={scheduleForm.endTime}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa voucher"
                open={confirmDelete}
                onOk={confirmDeleteSchedule}
                onCancel={cancelDeleteSchedule}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa mã khuyến mãi này không?</p>
            </Modal>
        </div>
    )
}

export default Schedule
