import React from 'react'
import { Link } from 'react-router-dom'
import api from "../../api";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBoxOpen, faCartArrowDown, faCoffee, faLongArrowAltRight, faReceipt, faUser } from '@fortawesome/free-solid-svg-icons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons/faRightToBracket';
const HeaderUser = () => {

  const handleLogout = async (e) => {
    e.preventDefault();
    try{
     await api.post('/logout');
      toast.success("Đăng xuất thành công");
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login'; // Redirect to login page
    }catch (error) {
      toast.error("Đăng xuất không thành công");
    }
  }
  return (
    <div className='container mx-auto mt-8 bg-blue p-6 shadow-md rounded-md flex justify-between items-center'>
      <Link to="/user_dashboard" className='logo font-bold text-2xl '>JUNE</Link>

      <div class="category flex justify-between items-center gap-20">
  
      </div>
      <div className='flex gap-4 items-center'>
        <Link to="/cart"><FontAwesomeIcon icon={faCartArrowDown} /></Link>
        <Link to="/edit_profile"><FontAwesomeIcon icon={faUser} /></Link>
        <Link to="/order"><FontAwesomeIcon icon={faReceipt} /></Link>

        <Link to="/notification"><FontAwesomeIcon icon={faBell} /></Link>
        <div onClick={handleLogout} className='cursor-pointer'><FontAwesomeIcon icon={faRightToBracket} /></div>

      </div>
    </div>
  )
}

export default HeaderUser
