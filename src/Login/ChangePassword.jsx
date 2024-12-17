import { Button, Form, Input, notification } from 'antd';
import axios from 'axios';
import React from 'react'

const ChangePassword = () => {
    const { form } = Form.useForm();
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const token = localStorage.getItem("accessToken")

    const onFinish = async (value) => {
        try {
            await axios.put(`${beUrl}/users/change-password`, {
                oldP: value.oldP,
                newP: value.newP
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            notification.success({ message: 'Đổi mật khẩu thành công' });
        } catch (error) {
            notification.error({ message: 'Mật khẩu cũ không tồn tại' });
        }
    }

    return (
        <div className='bg-blue-100 h-[calc(100vh-72px)] flex items-center justify-center'>
            <Form
                form={form}
                onFinish={onFinish}
                className='bg-white w-[400px] p-5 rounded-lg'
                layout='vertical'
            >
                <p className='text-center mb-4 text-xl font-semibold text-[#1677ff]'>Đổi mật khẩu</p>
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldP"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder='Nhập email của bạn' className='p-2' />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="newP"
                    rules={[
                        {
                            required: true,
                        },
                        {
                            min: 6,
                            message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                        },
                    ]}
                >
                    <Input.Password placeholder='Nhập email của bạn' className='p-2' />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newP']}
                    hasFeedback
                    className=' mb-10'
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newP') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password className='p-2' placeholder='Xác nhận mật khẩu' />
                </Form.Item>
                <Button type="primary" htmlType="submit" className='w-full py-4'>
                    Thay đổi
                </Button>
            </Form>
        </div>
    )
}

export default ChangePassword
