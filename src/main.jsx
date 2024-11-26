import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { ConfigProvider } from 'antd'
dayjs.locale('vi');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={viVN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
