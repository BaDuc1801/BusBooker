import { DatePicker, Select } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaCircleDot, FaLocationDot } from 'react-icons/fa6';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { UserContext } from './Context/UserContext';
import { useNavigate } from 'react-router-dom';
dayjs.extend(customParseFormat);

const DatePickerSpace = (props) => {
    const { RangePicker } = DatePicker;
    const { check, listRoutes } = props;
    const nav = useNavigate()
    const [originLocation, setOriginLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [selectedDates, setSelectedDates] = useState(null);

    const { originChoice, destiChoice,  setOriginChoice, setDestiChoice, setStartTime} = useContext(UserContext)
    const [originUI, setOriginUI] = useState(originChoice)
    const [destiUI, setDestiUI] = useState(destiChoice)

    const handleOriginChange = (value) => {
        setOriginLocation(value);
        setOriginUI(value);
        setOriginChoice(value);
    };

    const handleDestinationChange = (value) => {
        setDestinationLocation(value);
        setDestiUI(value);
        setDestiChoice(value);
    };

    const handleDateChange = (_dates, dateStrings) => {
        setSelectedDates(dateStrings)
    };

    const handleSearch = () => {
        setOriginChoice(originChoice);
        setDestiChoice(destiChoice);
        setStartTime(selectedDates);
        console.log(originChoice, destiChoice)
        nav('/route-details')
    };

    const getUniqueOrigins = listRoutes && listRoutes.reduce((acc, route) => {
        if (!acc.some(r => r.origin === route.origin)) {
            acc.push(route);
        }
        return acc;
    }, []);

    const disabledDate = (current) => {
        return current && current < dayjs().endOf('day');
    };

    useEffect(() => {
        setOriginUI(originChoice)
        setDestiUI(destiChoice)
    }, [originChoice, destiChoice])

    return (
        <div className='grid grid-cols-1 md:grid-cols-[2fr_2fr_3fr_1fr] gap-4'>
            <div className='flex flex-col gap-2'>
                <p className='flex items-center gap-2 font-semibold'><FaCircleDot className='text-blue-500' />Nơi xuất phát</p>
                <Select
                    className='flex-1'
                    size='large'
                    showSearch
                    placeholder="Chọn nơi xuất phát"
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleOriginChange}
                    value={originUI}
                >
                    {getUniqueOrigins && getUniqueOrigins.map((route, index) =>
                        route.origin !== destinationLocation ? (
                            <Select.Option key={index} value={route.origin} label={route.origin}>
                                {route.origin}
                            </Select.Option>
                        ) : null
                    )}
                </Select>
            </div>
            <div className='flex flex-col gap-2'>
                <p className='flex items-center gap-2 font-semibold'><FaLocationDot className='text-red-500' />Nơi đến</p>
                <Select
                    className='flex-1'
                    showSearch
                    size='large'
                    placeholder="Chọn nơi đến"
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleDestinationChange}
                    value={destiUI}
                >
                    {listRoutes &&
                        listRoutes.map((route, index) =>
                            route.destination !== originLocation ? (
                                <Select.Option key={index} value={route.destination} label={route.destination}>
                                    {route.destination}
                                </Select.Option>
                            ) : null
                        )}
                </Select>
            </div>
            {
                check ?
                    <div className='flex flex-col gap-2'>
                        <p className='flex items-center gap-2 font-semibold'><FaRegCalendarAlt className='text-blue-600' />Ngày đi</p>
                        <DatePicker size='large'
                            className='flex-1' disabledDate={disabledDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    :
                    <div className='flex flex-col gap-2'>
                        <p className='flex items-center gap-2 font-semibold'><FaRegCalendarAlt className='text-blue-600' />Ngày đi và về</p>
                        <RangePicker size='large'
                            className='flex-1' disabledDate={disabledDate}
                            onChange={handleDateChange}
                        />
                    </div>
            }
            <div className='h-full flex items-end'>
                <button className='bg-yellow-400 hover:bg-yellow-300 w-full h-[39.6px] rounded-md text-md font-semibold'
                    onClick={handleSearch}>
                    Tìm kiếm
                </button>
            </div>
        </div>
    )
}

export default DatePickerSpace
