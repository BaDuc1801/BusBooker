import { Button, Col, Form } from 'antd'
import React from 'react'

const RegisterSale = () => {
    const { form } = Form.useForm();

    const onFinish = (value) => {
        console.log(value)
    }
    return (
        <div className='bg-blue-100 h-[calc(100vh-72px)] flex'>
            <div className='flex flex-col items-center w-1/2 px-40'>
                <p className='text-4xl text-center font-semibold'>Tăng 30% lượng khách đặt vé khi mở bán online trên Vexere.com ngay hôm nay!</p>
                <p className='mt-10 font-semibold text-xl'>Đăng ký miễn phí và chỉ mất 1 phút để hoàn tất</p>
            </div>
            <Form
                form={form}
                onFinish={onFinish}
                className='md:w-1/2 bg-white p-5 w-[400px] rounded-lg'
            >
                <Button type="primary" htmlType="submit" className='w-full py-4'>
                    Gửi
                </Button>
            </Form>
        </div>
    )
}

export default RegisterSale
