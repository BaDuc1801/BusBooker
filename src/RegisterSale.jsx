import { Button, Col, Form, Input, Row } from 'antd'
import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';

const RegisterSale = () => {
    const { form } = Form.useForm();

    const onFinish = (value) => {
        console.log(value)
    }

    const { setVisible } = useOutletContext();
    useEffect(() => {
        setVisible(true);
        return () => {
            setVisible(false);
        };
    }, [setVisible]);

    return (
        <div className='bg-blue-100 h-[calc(100vh-72px)] flex'>
            <div className='flex flex-col items-center w-1/2 m-auto max-md:hidden'>
                <p className='text-4xl text-center font-semibold'>Tăng 30% lượng khách đặt vé khi mở bán online trên Vexere.com ngay hôm nay!</p>
                <p className='mt-10 font-semibold text-xl'>Đăng ký miễn phí và chỉ mất 1 phút để hoàn tất</p>
            </div>
            <Form
                form={form}
                onFinish={onFinish}
                layout='vertical'
                className='bg-white p-5 w-[400px] rounded-lg m-auto'
            >
                <Row gutter={[16, 8]}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên của bạn!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập họ tên" className="p-2" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại liên hệ"
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                                {
                                    type: 'number',
                                    message: 'Vui lòng nhập số!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" className="p-2" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={12}>
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
                                }
                            ]}
                        >
                            <Input placeholder="Nhập email" className="p-2" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Tên nhà xe"
                            name="garage"
                        >
                            <Input placeholder="Nhập tên nhà xe" className="p-2" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="Thành phố (Tỉnh) / Tuyến đường"
                    name="routes"
                >
                    <Input placeholder="Nhập tuyến đường" className="p-2" />
                </Form.Item>
                <Button type="primary" htmlType="submit" className='w-full py-4'>
                    Gửi
                </Button>
            </Form>
        </div>
    )
}

export default RegisterSale
