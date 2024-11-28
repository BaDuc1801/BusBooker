import { Route, Routes } from "react-router-dom"
import Layout from "./Layout.jsx"
import Home from "./Home.jsx"
import Login from "./Login.jsx"

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout/>}>
        <Route path="" element={<Home/>}/>
      </Route>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  )
}

export default App
