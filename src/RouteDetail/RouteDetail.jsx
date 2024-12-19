import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ScheduleCard from './ScheduleCard'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const RouteDetail = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const [route, setRoute] = useState([]);
    const endTime = localStorage.getItem('endTime');
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const origin = localStorage.getItem('originChoice');
            const desti = localStorage.getItem('destiChoice');
            const startTime = localStorage.getItem('startTime');
            const formattedDate = (date) => {
                const getDate = new Date(date);
                const year = getDate.getFullYear();
                const month = String(getDate.getMonth() + 1).padStart(2, '0');
                const day = String(getDate.getDate()).padStart(2, '0');

                return `${year}-${month}-${day}`;
            };
            if (startTime) {
                let url = `${beUrl}/routes/find-schedule?origin=${origin}&destination=${desti}&startTime=${startTime}`;
                const data = await axios.get(url)
                setRoute(data.data)
            } else {
                const defaultDate = dayjs().add(1, 'day');
                localStorage.setItem('startTime', formattedDate(defaultDate));
                let url = `${beUrl}/routes/find-schedule?origin=${origin}&destination=${desti}&startTime=${formattedDate(defaultDate.toISOString())}`;
                const data = await axios.get(url)
                setRoute(data.data)
            }

        }
        fetchData();
    }, [location])

    const [text, setText] = useState("Chiều đi");

    return (
        <div className="max-md:mb-[60px] pb-12 pt-5 flex items-center justify-center flex-col gap-5 bg-[#F2F4F7]">
            {endTime !== "null" && <p>{text}</p>}
            <p className='text-xl'>Có <span className='font-bold'>{route[0]?.schedules?.length}</span> chuyến xe đi từ <span className='font-bold'>{route[0]?.origin}</span> đến <span className='font-bold'>{route[0]?.destination}</span></p>
            {
                route.length > 0 && route[0]?.schedules.map((item, index) => {
                    return (
                        <ScheduleCard item={item} key={index} setText={setText} endTime={endTime} />
                    )

                })
            }
        </div>
    )
}

export default RouteDetail
