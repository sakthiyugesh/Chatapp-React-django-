import { useState } from 'react'
import './App.css'
// import Home from './components/Home'
import Homepage from './pages/Homepage'
import ChatPage from './pages/ChatPage'
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import OTPLogin from './pages/OTPLogin'
import SearchPage from './pages/SearchPage'



function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    {/* <Homepage/> */}
    {/* <ChatPage/> */}

    <Router>
      <Routes>
        <Route path='/' exact element={<Homepage/>}/>
        <Route path='/chat/:id/:sender/:receiver/:userid' element={<ChatPage/>}/>
        <Route path='/otp-login' element={<OTPLogin/>}/>
        {/* <Route path='/search' element={<SearchPage/>}/> */}
      </Routes>
    </Router>
    
    </>
   
  )
}

export default App
