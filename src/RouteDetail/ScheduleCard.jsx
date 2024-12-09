import { Timeline } from 'antd';
import React from 'react'
import { FaCircleDot, FaLocationDot } from 'react-icons/fa6';

const ScheduleCard = ({ item }) => {
    const formattedDate = (date) => {
        const getDate = new Date(date);
        return getDate.toLocaleDateString('vi-VN');
    }
    // const beUrl = import.meta.env.VITE_APP_BE_URL;

    // useEffect(() => {

    //     const fetchData = async () => {
    //         let url = `${beUrl}/routes/find-schedule?origin=${originChoice}&destination=${destiChoice}`;

    //         if (startTime) {
    //             url += `&startTime=${startTime}`;
    //         }
    //         const data = await axios.get(url)
    //         setRoute(data.data)
    //     }
    //     fetchData();

    // }, [startTime, destiChoice, originChoice])
    const formattedTime = (date) => {
        const getDate = new Date(date);
        const hours = getDate.getHours();
        const minutes = getDate.getMinutes();
        const rs = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        return rs;
    }

    return (
        <div className='bg-white flex gap-5 px-3 pt-3 rounded-md shadow-md'>
            <img src={item?.busId?.img[3]} className='w-40 h-40'></img>
            <div className='font-semibold'>
                <p className='text-lg'>{item?.busId?.owner}</p>
                <p className='text-gray-600'>Limousine {item?.busId?.totalSeats} chỗ </p>
                <p className='text-gray-600 my-2'>{formattedDate(item?.startTime)}</p>
                <Timeline
                    items={[
                        {
                            children: <p className='text-lg'>{formattedTime(item?.startTime)}</p>,
                            dot: <FaCircleDot  className='text-md mt-1'/>
                        },
                        {
                            children: <p  className='text-lg'>{formattedTime(item?.endTime)}</p>,
                            dot: <FaLocationDot className='text-lg mt-1'/>
                        },
                    ]}
                />
            </div>
            <div className='flex justify-between flex-col mb-12 items-end'>
                <p className='text-[#1677ff] font-bold text-xl'>Từ {item?.busId?.seats[0]?.price.toLocaleString()}đ</p>
                <div className='flex flex-col items-end gap-2'>
                    <p className='font-semibold text-gray-600'>Còn {item?.busId?.availableSeats} chỗ trống</p>
                    <div className='flex gap-4 items-center'>
                        <p className='text-[#1677ff] cursor-pointer underline'>Thông tin chi tiết</p>
                        <button className='bg-yellow-400 hover:bg-yellow-300 font-semibold p-2 rounded-md text-md'>Chọn chuyến</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleCard
