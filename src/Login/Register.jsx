import { Button, Checkbox, Form, Input } from 'antd'
import React from 'react'
import { IoBus } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div className='bg-blue-100 max-md:bg-white h-screen flex items-center justify-center'>
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
        <Form.Item
          name="confirm"
          label="Xác nhận mật khẩu"
          dependencies={['password']}
          hasFeedback
          className=' mb-10'
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password className='p-2' placeholder='Xác nhận mật khẩu'/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className='w-full py-4' onClick={() => nav("/login")}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register