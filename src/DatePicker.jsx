import { DatePicker, Select } from 'antd'
import React from 'react'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaCircleDot, FaLocationDot } from 'react-icons/fa6';
import { FaRegCalendarAlt } from 'react-icons/fa';
dayjs.extend(customParseFormat);

const DatePickerSpace = (props) => {
    const { RangePicker } = DatePicker;
    const { check } = props
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
                    options={[
                        {
                            value: 'jack',
                            label: 'Jack',
                        },
                        {
                            value: 'lucy',
                            label: 'Lucy',
                        },
                        {
                            value: 'tom',
                            label: 'Tom',
                        },
                    ]}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p className='flex items-center gap-2 font-semibold'><FaLocationDot className='text-red-500' />Nơi đến</p>
                <Select
                    className='flex-1'
                    showSearch
                    size='large'
                    placeholder="Chọn nơi đến"
                    optionFilterProp="label"
                    options={[
                        {
                            value: 'jack',
                            label: 'Jack',
                        },
                        {
                            value: 'lucy',
                            label: 'Lucy',
                        },
                        {
                            value: 'tom',
                            label: 'Tom',
                        },
                    ]}
                />
            </div>
            {
                check ?
                    <div className='flex flex-col gap-2'>
                        <p className='flex items-center gap-2 font-semibold'><FaRegCalendarAlt className='text-blue-600' />Ngày đi</p>
                        <DatePicker size='large'
                            className='flex-1' disabledDate={disabledDate} />
                    </div>
                    :
                    <div className='flex flex-col gap-2'>
                        <p className='flex items-center gap-2 font-semibold'><FaRegCalendarAlt className='text-blue-600' />Ngày đi và về</p>
                        <RangePicker size='large'
                            className='flex-1' disabledDate={disabledDate} />
                    </div>
            }
            <div className='h-full flex items-end'>
                <button className='bg-yellow-400 hover:bg-yellow-300 w-full h-[39.6px] rounded-md text-md font-semibold'>
                    Tìm kiếm
                </button>
            </div>
        </div>
    )
}

export default DatePickerSpace
