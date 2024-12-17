import { Button, Col, Form, Input, notification, Row } from 'antd'
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { UserContext } from './Context/UserContext';

const Profile = () => {
    const [form] = Form.useForm();
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const { user, setUser } = useContext(UserContext);
    const [isChanged, setIsChanged] = useState(false); 

    const onValuesChange = (changedValues) => {
        setIsChanged(
            changedValues.username !== user?.username ||
            changedValues.email !== user?.email ||
            changedValues.phoneNumber !== user?.phoneNumber
        );
    }
    
    const onFinish = async (value) => {
        try {
            await axios.put(`${beUrl}/users/email`, value);
            setUser({
                ...user,
                ...value, 
            });
            notification.success({ message: 'Cập nhật thông tin thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi' });
        }
    }

    return (
        <div className='flex items-center justify-center h-[calc(100vh-72px)]'>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
                className='w-[40%] border-2 shadow-md rounded-md p-5'
                initialValues={{
                    username: user?.username,
                    email: user?.email,
                    phoneNumber: user?.phoneNumber,
                }}
                onValuesChange={onValuesChange}
            >
                <p className='text-2xl text-center text-[#1677ff] font-bold pb-5'>Hồ sơ cá nhân</p>
                <Row gutter={[16, 8]}>
                    <Col span={12} className='flex justify-center'>
                        <img src={user?.avatar} className='w-[60%] h-[60%] mt-5'></img>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Họ tên:"
                            name="username"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Email:"
                            name="email"
                        >
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại:"
                            name="phoneNumber"
                        >
                            <Input placeholder='Nhập số điện thoại' />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full py-4' disabled={!isChanged}>
                        Lưu thông tin
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Profile
