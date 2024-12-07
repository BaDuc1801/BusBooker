import { Tabs } from 'antd'
import Item from 'antd/es/list/Item'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DatePickerSpace from './DatePicker'
import axios from 'axios'

const RouteDetail = () => {
    const { id } = useParams()
    return (
        <div>
            {id}
        </div>
    )
}

export default RouteDetail
