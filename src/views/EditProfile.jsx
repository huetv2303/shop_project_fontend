import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api.js'; // Đảm bảo bạn đã cấu hình file api.js phù hợp
import Header from './Header.jsx';
import HeaderAdmin from './admin/HeaderAdmin.jsx';
import HeaderUser from './user/HeaderUser.jsx';

const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(`Changed ${name} to ${value}`); // Debugging log
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← sửa lỗi chính tả ở đây
    try {
      const token = localStorage.getItem('token');
      const res = await api.put('/edit_profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(res.data?.message || "Cập nhật thông tin thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  return (
    <>
      {user.role === 'admin' ? (
        <HeaderAdmin />
      ) : (<HeaderUser />)}
      <div className="max-w-md mx-auto mt-8 bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Họ tên</label>
            <input
              type="text"
              name="name"
              className="w-full border px-3 py-2 rounded"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border px-3 py-2 rounded bg-gray-100"
              value={formData.email}
              disabled // Không cho sửa email
            />
          </div>

          <div>
            <label className="block font-semibold">Mật khẩu hiện tại</label>
            <input
              type="password"
              name="current_password"
              className="w-full border px-3 py-2 rounded"
              value={formData.current_password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-semibold">Mật khẩu mới</label>
            <input
              type="password"
              name="new_password"
              className="w-full border px-3 py-2 rounded"
              value={formData.new_password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-semibold">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="new_password_confirmation"
              className="w-full border px-3 py-2 rounded"
              value={formData.new_password_confirmation}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
