import React from 'react'
import { Link } from 'react-router-dom'

const HeaderUser = () => {
  return (
    <div className='container mx-auto mt-8 bg-blue p-6 shadow-md rounded-md flex justify-between items-center'>
      <Link to="/user_dashboard" className='logo font-bold text-2xl '>JUNE</Link>

      <div class="category flex justify-between items-center gap-20">
        <a href="">Áo nam</a>
        <a href="">Quần nam</a>
        <a href="">Áo nữ</a>
        <a href="">Quần nữ</a>
      </div>
      <div className='flex gap-4 items-center'>
        <Link to="/cart">Giỏ hàng</Link>
        <div>Đăng xuất</div>

      </div>
    </div>
  )
}

export default HeaderUser
