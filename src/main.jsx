import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { ConfigProvider } from 'antd'
import { UserProvider } from './Context/UserContext.jsx'
dayjs.locale('vi');

createRoot(document.getElementById('root')).render(
    <UserProvider>
      <BrowserRouter>
        <ConfigProvider locale={viVN}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </UserProvider>
)
