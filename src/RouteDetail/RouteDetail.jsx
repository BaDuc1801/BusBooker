import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import ScheduleCard from './ScheduleCard'

const RouteDetail = () => {
    const beUrl = import.meta.env.VITE_APP_BE_URL;
    const { destiChoice, originChoice, startTime = null } = useContext(UserContext);
    const [route, setRoute] = useState([]);

    useEffect(() => {
        console.log("aa")
        const fetchData = async () => {
            let url = `${beUrl}/routes/find-schedule?origin=${originChoice}&destination=${destiChoice}`;

            if (startTime) {
                url += `&startTime=${startTime}`;
            }
            const data = await axios.get(url)
            setRoute(data.data)
        }
        fetchData();

    }, [startTime, destiChoice, originChoice])

    return (
        <div className="max-md:mb-[100px] py-5 flex items-center justify-center flex-col gap-5 bg-[#F2F4F7]">
            <p className='text-xl'>Có <span className='font-bold'>{route[0]?.schedules?.length}</span> chuyến xe đi từ <span className='font-bold'>{route[0]?.origin}</span> đến <span className='font-bold'>{route[0]?.destination}</span></p>
            {
                route.length > 0 && route[0].schedules.map((item, index) => {
                    return (
                        <ScheduleCard item={item} key={index} />
                    )
                })
            }
        </div>
    )
}

export default RouteDetail
