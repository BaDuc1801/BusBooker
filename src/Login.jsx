import { Button, Checkbox, Form, Input } from 'antd'
import React from 'react'
import { IoBus } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Login = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
    };
    return (
        <div className='bg-blue-100 h-screen flex items-center justify-center'>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
                className='bg-white w-[400px] p-5 rounded-lg'
            >
                <p className='text-center font-bold text-3xl mb-4 text-[#1677ff] flex justify-center items-center gap-2'> <IoBus className="text-yellow-300 text-3xl" />BusBooker</p>
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
                        },
                    ]}
                >
                    <Input placeholder='Nhập email của bạn' className='p-2' />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu của bạn!',
                        },
                        {
                            min: 6,
                            message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu của bạn" className='p-2' />
                </Form.Item>
                <Form.Item name="remember" valuePropName="checked" label={null}>
                    <div className='flex w-full items-center justify-between'>
                    <Checkbox>Remember me</Checkbox>
                    <Link>Quên mật khẩu?</Link>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full py-4'>
                        Đăng nhập
                    </Button>
                </Form.Item>
                <div className='flex items-center justify-center gap-2'>
                    <p>Bạn chưa có tài khoản?</p><Link className='text-[#1677ff]'>Đăng ký</Link>
                </div>
            </Form>
        </div>
    )
}

export default Login
