import React from 'react'
import { RiDiscountPercentFill } from 'react-icons/ri';

const ListVoucher = () => {
    const vouchers = [
        {
            id: 1,
            name: "Giảm 20% chuyến đi",
            description: "Áp dụng cho tất cả các tuyến trong nước.",
            code: "20OFF",
            discount: "20%",
        },
        {
            id: 2,
            name: "Giảm 50.000đ",
            description: "Dành cho khách hàng mới lần đầu đặt vé.",
            code: "NEW50",
            discount: "50.000đ",
        },
        {
            id: 3,
            name: "Giảm 100.000đ",
            description: "Áp dụng cho chuyến đi từ 500.000đ trở lên.",
            code: "BIGSAVE",
            discount: "100.000đ",
        },
        {
            id: 4,
            name: "Giảm 15% chuyến xe khứ hồi",
            description: "Áp dụng cho vé khứ hồi trên tất cả tuyến.",
            code: "RETURN15",
            discount: "15%",
        },
        {
            id: 5,
            name: "Giảm 30.000đ giờ cao điểm",
            description: "Dành cho các chuyến đi trong khung giờ 7h-9h.",
            code: "PEAK30",
            discount: "30.000đ",
        },
        {
            id: 6,
            name: "Giảm 20.000đ mỗi tuần",
            description: "Áp dụng mỗi tuần cho tuyến bất kỳ.",
            code: "WEEKLY20",
            discount: "20.000đ",
        },
        {
            id: 7,
            name: "Giảm 200.000đ cho nhóm",
            description: "Nhóm từ 4 người trở lên sẽ nhận giảm giá lớn.",
            code: "GROUP200",
            discount: "200.000đ",
        },
    ];

    return (
        <div className='mx-auto max-md:w-[90%] w-[70%] mt-[50px]'>
            <p className='text-2xl font-semibold'>Khuyến Mãi Không Thể Bỏ Lỡ</p>
            <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                {vouchers.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="max-md:h-52 max-md:w-[220px] w-[300px] flex-shrink-0 rounded-lg shadow-lg bg-white flex flex-col overflow-hidden snap-start cursor-pointer pb-1"
                        >
                            <div className="w-full flex items-center justify-center text-4xl h-32 max-md:h-[160px] bg-[#fef32a]">
                                <RiDiscountPercentFill />
                            </div>
                            <div className='flex flex-col h-[100px] max-md:h-full md:justify-between'>
                                <p className='px-4 py-2 whitespace-normal'>{item.description}</p>
                                <p className='px-4 font-semibold whitespace-normal pb-1'>{item.name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ListVoucher
