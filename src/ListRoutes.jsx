import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ListRoutes = ({ listRoutes }) => {
    const nav = useNavigate(); 

    const handleClick = (itemId) => {
        nav(`/route-details/${itemId}`);
    };

    return (
        <div className='mx-auto max-md:w-[90%] w-[70%] mt-[50px]'>
            <p className='text-2xl font-semibold'>Tuyến đường phổ biến</p>
            <div className="flex overflow-x-auto whitespace-nowrap gap-4 p-4 snap-x snap-mandatory">
                {listRoutes && listRoutes.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="h-68 max-md:h-48 max-md:w-[210px] w-[350px] flex-shrink-0 rounded-lg shadow-lg bg-white flex flex-col overflow-hidden snap-start cursor-pointer pb-1"
                            onClick={() => handleClick(item._id)}
                        >
                            <img
                                src={item?.img}
                                alt={`${item.origin} - ${item.destination}`}
                                className="w-full h-44 object-cover max-md:h-[100px]"
                            />
                            <div className="p-2 flex flex-col justify-between h-full">
                                <p className="font-semibold text-lg text-gray-800">
                                    {item?.origin} - {item?.destination}
                                </p>
                                <p className="text-gray-600 text-md">
                                    Từ{" "}
                                    {item?.afterDiscount ?
                                        (<>
                                            <span className="text-red-500 font-bold text-lg">
                                                {item?.afterDiscount?.toLocaleString("vi-VN")} đ
                                            </span>
                                            <span className="line-through text-gray-400 text-md ml-2">
                                                {item?.basisPrice?.toLocaleString("vi-VN")} đ
                                            </span></>)
                                        : <span className="text-red-500 font-bold text-lg">
                                            {item?.basisPrice?.toLocaleString("vi-VN")} đ
                                        </span>
                                    }
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
