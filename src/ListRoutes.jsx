import React from 'react'

const ListRoutes = () => {
    const routes = [
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/5/img_hero.png?v1",
            from: "Sài Gòn",
            to: "Nha Trang",
            price: 140000,
            originalPrice: 250000
        },
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/24/img_hero.png",
            from: "Hà Nội",
            to: "Hải Phòng",
            price: 100000,
            originalPrice: 110000
        },
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/3/img_hero.png",
            from: "Sài Gòn",
            to: "Đà Lạt",
            price: 240000,
            originalPrice: 270000
        },
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/22/img_hero.png",
            from: "Sài Gòn",
            to: "Phan Thiết",
            price: 150000,
            originalPrice: null
        },
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/25/img_hero.png",
            from: "Hà Nội",
            to: "Đà Nẵng",
            price: 320000,
            originalPrice: null
        },
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/20/img_card.png",
            from: "Sài Gòn",
            to: "Cần Thơ",
            price: 120000,
            originalPrice: null
        },
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/5/img_hero.png?v1",
            from: "Hà Nội",
            to: "Sapa",
            price: 280000,
            originalPrice: null
        },
        {
            img: "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/destination/images/27/img_hero.png",
            from: "Hà Nội",
            to: "Thanh Hóa",
            price: 200000,
            originalPrice: null
        }
    ];

    return (
        <div className='mx-auto max-md:w-[90%] w-[70%] mt-[50px]'>
            <p className='text-2xl font-semibold'>Tuyến đường phổ biến</p>
            <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                {routes.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="h-68 max-md:h-48 max-md:w-[200px] w-[350px] flex-shrink-0 rounded-lg shadow-lg bg-white flex flex-col overflow-hidden snap-start cursor-pointer pb-1"
                        >
                            <img
                                src={item.img}
                                alt={`${item.from} - ${item.to}`}
                                className="w-full h-44 object-cover max-md:h-[100px]"
                            />
                            <div className="p-2 flex flex-col justify-between h-full">
                                <p className="font-semibold text-lg text-gray-800">
                                    {item.from} - {item.to}
                                </p>
                                <p className="text-gray-600 text-md">
                                    Từ{" "}
                                    <span className="text-red-500 font-bold text-lg">
                                        {item.price.toLocaleString("vi-VN")} đ
                                    </span>
                                    {item.originalPrice && (
                                        <span className="line-through text-gray-400 text-md ml-2">
                                            {item.originalPrice.toLocaleString("vi-VN")} đ
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ListRoutes
