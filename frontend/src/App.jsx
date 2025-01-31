import Dashboard from "./Pages/Dashboard"
import SignUp from "./Pages/SignUp"
import LogIn from "./Pages/LogIn"
import Settings from "./Pages/Settings"
import Analytics from "./Pages/Analytics"
import Links from "./Pages/Links"
import React from "react"
import Routing from "./Pages/Routing"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter } from "react-router-dom"


function App() {
  
  return (
    <BrowserRouter>

        <Routing/>

    </BrowserRouter>
  )
}

export default App
