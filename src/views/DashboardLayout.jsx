import React from 'react'
import Navbar from './Navbar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
const DashboardLayout = ({user, setUser}) => {
  return (
    <div>
        <Header user={user}/>
        <Navbar setUser={setUser} user={user}/>
         <main className="p-4">
             <Outlet /> {/* Nơi hiển thị nội dung từng page */}
        </main>
    </div>
  )
}

export default DashboardLayout
