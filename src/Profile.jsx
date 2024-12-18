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
            changedValues.phoneNumber !== user?.phoneNumber ||
            changedValues.avatar !== user?.avatar
        );
    }

    const onFinish = async (value) => {
        try {
            let formData = new FormData();
            if (selectedImage) {
                formData.append('avatar', selectedImage);
                let newAvatar = await axios.put(`${beUrl}/users/up-avatar?email=` + value.email, formData);
            }
            await axios.put(`${beUrl}/users/update-user`, value);
            setUser({
                avatar : selectedImage ? imagePreview : user?.avatar,
                ...value,
            });
            notification.success({ message: 'Cập nhật thông tin thành công' });
        } catch (error) {
            notification.error({ message: 'Lỗi' });
        }
    }

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.avatar);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileSelectClick = () => {
        document.getElementById('file-input').click();
    };

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
                    <Col span={12} className='flex justify-center items-center'>
                        <div className='flex justify-center items-center'>
                            <div className="w-[150px] h-[150px]" onClick={handleFileSelectClick}>
                                <img src={imagePreview || user?.avatar} style={{ width: '100%', height: '100%' }} />
                            </div>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                id="file-input"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e);
                                    onValuesChange(e);
                                }} name='avatar'
                            />
                        </div>
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
                            <Input disabled />
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
