import { Route, Routes } from "react-router-dom"
import Layout from "./Layout.jsx"
import Home from "./Home.jsx"

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout/>}>
        <Route path="" element={<Home/>}/>
      </Route>
    </Routes>
  )
}

export default App
