import { DatePicker, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaCircleDot, FaLocationDot } from 'react-icons/fa6';
import { FaRegCalendarAlt } from 'react-icons/fa';
dayjs.extend(customParseFormat);

const DatePickerSpace = (props) => {
    const { RangePicker } = DatePicker;
    const { check, listRoutes } = props;

    const [originLocation, setOriginLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [selectedDates, setSelectedDates] = useState(null);

    const handleOriginChange = (value) => {
        setOriginLocation(value);
    };

    const handleDestinationChange = (value) => {
        setDestinationLocation(value);
    };

    const handleDateChange = (_dates, dateStrings) => {
        setSelectedDates(dateStrings);
    };

    const handleSearch = () => {
        console.log("Nơi xuất phát đã chọn:", originLocation);
        console.log("Nơi đến đã chọn:", destinationLocation);
        console.log("Khoảng thời gian đã chọn:", selectedDates);
    };

    const getUniqueOrigins = listRoutes.reduce((acc, route) => {
        if (!acc.some(r => r.origin === route.origin)) {
            acc.push(route);
        }
        return acc;
    }, []);

    const disabledDate = (current) => {
        return current && current < dayjs().endOf('day');
    };

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
                    onChange={handleOriginChange}
                    >
                    {getUniqueOrigins && getUniqueOrigins.map((route, index) =>
                        route.origin !== destinationLocation ? (
                            <Select.Option key={index} value={route.origin}>
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
                    onChange={handleDestinationChange}
                    >
                    {listRoutes &&
                        listRoutes.map((route, index) =>
                            route.origin !== originLocation ? (
                                <Select.Option key={index} value={route.destination}>
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
