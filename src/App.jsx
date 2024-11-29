import { Route, Routes } from "react-router-dom"
import Layout from "./Layout.jsx"
import Home from "./Home.jsx"
import Login from "./Login/Login.jsx"
import Register from "./Login/Register.jsx"
import ForgotPass from "./Login/ForgotPass.jsx"
import UserStorage from "./UserStorage.jsx"
import RegisterSale from "./RegisterSale.jsx"

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout/>}>
        <Route path="" element={<Home/>}/>
        <Route path="/my-storage" element={<UserStorage/>}/>
        <Route path="/register-sale" element={<RegisterSale/>}/>
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/forgot-password" element={<ForgotPass/>}/>

    </Routes>
  )
}

export default App
