import { Link } from "react-router-dom";
import api from '../../api';
import { toast } from "react-toastify";

export default function HeaderAdmin() {

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
    <div className="flex justify-between items-center">
      {/* Nội dung dashboard */}
      <div className=" flex gap-9 items-center">
        <Link to="/admin_dashboard">Admin Dashboard</Link>
        <Link to="/user_profile">Thông tin cá nhân</Link>
        <Link to="/admin/category">Quản lý danh mục</Link>
        <Link to="/admin/product">Quản lý sản phẩm</Link>
        <Link to="/admin/order">Quản lý đơn hàng</Link>
      </div>
      <div>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  );
}
