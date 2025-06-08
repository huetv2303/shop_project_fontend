import React, { useEffect, useState } from 'react';
import api from '../../../api.js';
import { Link } from "react-router-dom";
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCategories();
  }, [search]);

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/categories?search=' + search);
      setCategories(response.data.data);
      console.log("Danh sách danh mục:", response.data.data);

    } catch (err) {
      console.error("Lỗi khi lấy danh sách danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cate) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục: ${cate.name}?`)) {
      api.delete('/admin/categories/' + cate.slug)
      getCategories();
      console.log(`Xóa danh mục: ${cate.slug}`);
    }
  }

  return (
    <div className='overflow-x-auto '>
      <div className="flex justify-end my-3">
         <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='border px-3 py-2 rounded w-1/2'
        />
        <Link to={'/admin/category/new'} className='bg-blue-500 p-3 hover:bg-blue-700 shadow rounded font-semibold'>Thêm mới</Link>
      </div>
      <table className='min-w-full border border-gray-200 my-10'>
        <thead className='bg-gray-300'>
          <tr>
            <th className='px-4 py-2 border'>STT</th>
            <th className='px-4 py-2 border'>Tên danh mục</th>
            <th className='px-4 py-2 border'>Mô tả</th>
            <th className='px-4 py-2 border'>Slug</th>
            <th className='px-4 py-2 border'>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {!loading && categories.map((category, index) => (
            <tr key={category.id} className='hover:bg-gray-100'>
              <td className='px-4 py-2 border'>{index + 1}</td>
              <td className='px-4 py-2 border'>{category.name}</td>
              <td className='px-4 py-2 border'>{category.description}</td>
              <td className='px-4 py-2 border'>{category.slug}</td>
              <td className='px-4 py-2 border '>
                <Link to={'/admin/category/' + category.slug} className='bg-green-500 text-white px-3 py-1 rounded mx-2'>Sửa</Link>
                <button
                  className='bg-red-500 text-white px-3 py-1 rounded'
                  onClick={ev => handleDelete(category)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {(!loading && categories.length === 0) && (
            <tr>
              <td colSpan="4" className='text-center py-4'>Không có danh mục nào.</td>
            </tr>
          )}

          {loading && (
            <tr>
              <td colSpan="4" className='text-center py-4'>Đang tải...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
