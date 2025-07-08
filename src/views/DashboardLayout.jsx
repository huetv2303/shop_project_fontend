
import { Outlet } from 'react-router-dom'
const DashboardLayout = ({user, setUser}) => {
  return (
    <div>
        {/* <Header user={user}/> */}
        {/* <Navbar setUser={setUser} user={user}/> */}
         <main className="p-4">
             <Outlet /> 
        </main>
    </div>
  )
}

export default DashboardLayout
