import { Route, Routes } from "react-router-dom"
import Layout from "./Layout.jsx"
import Home from "./Home.jsx"
import Login from "./Login/Login.jsx"
import Register from "./Login/Register.jsx"
import ForgotPass from "./Login/ForgotPass.jsx"
import UserStorage from "./UserStorage.jsx"
import RegisterSale from "./RegisterSale.jsx"
import RouteDetail from "./RouteDetail/RouteDetail.jsx"
import Payment from "./Payment.jsx"
import Manager from "./Manager/Manager.jsx"
import ListUser from "./Manager/ListUser.jsx"
import Search from "./Search.jsx"
import ListTicket from "./Manager/ListTicket.jsx"
import VoucherManage from "./Manager/VoucherManage.jsx"
import BusManager from "./Manager/BusManager.jsx"
import RouteManage from "./Manager/RouteManage.jsx"
import Schedule from "./Manager/Schedule.jsx"

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path="" element={<Search />}>
          <Route path="" element={<Home />} />
          <Route path="/route-details" element={<RouteDetail />} />
        </Route>
        <Route path="/payment" element={<Payment />} />
        <Route path="/my-storage" element={<UserStorage />} />
        <Route path="/register-sale" element={<RegisterSale />} />
        <Route path="/manager" element={<Manager />}>
          <Route path="/manager/users" element={<ListUser />} />
          <Route path="/manager/tickets" element={<ListTicket />} />
          <Route path="/manager/vouchers" element={<VoucherManage />} />
          <Route path="/manager/bus" element={<BusManager />} />
          <Route path="/manager/routes" element={<RouteManage />} />
          <Route path="/manager/schedules" element={<Schedule />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPass />} />
    </Routes>
  )
}

export default App
