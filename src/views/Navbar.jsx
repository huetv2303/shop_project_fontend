// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import api from '../api';
import { toast } from 'react-toastify';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const onLogout = async (e) => {
    e.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      try {
        await api.post('/logout');
        toast.success("Đăng xuất thành công");
      } catch (err) {
        toast.error("Đăng xuất thất bại");

      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        navigate('/login');

      }
    }
  };

  return (
    <nav className="bg-gray-200 p-4 flex justify-between">
      <div className="space-x-4">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin_dashboard">Admin Dashboard</Link>
            <Link to="/user_profile">Thông tin cá nhân</Link>
            <Link to="/admin/category">Quản lý danh mục</Link>
            <Link to="/admin/product">Quản lý sản phẩm</Link>
          </>
        ) : (
          <>
            {/* <Link to="/user_dashboard">User Dashboard</Link>
            <Link to="/edit_profile">Thông tin cá nhân</Link> */}
          </>
        )}
      </div>
      <a onClick={onLogout} className="text-red-500 cursor-pointer">Đăng xuất</a>
    </nav>
  );
}
