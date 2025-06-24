import React, { use, useEffect, useState } from 'react'
import api from '../../../api';
import { Link } from 'react-router-dom';
import HeaderAdmin from '../HeaderAdmin';

const ProductList = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    getProducts();
  }, [search]);




  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/products?search=' + search)
      setProducts(res.data.data);
      console.log("Danh sách sản phẩm:", res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    } finally {
      setLoading(false);
    }

  }

  const handleDelete = async (pro) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục: ${pro.name}?`)) {
      api.delete('/admin/products/' + pro.slug)
      getProducts();
      console.log(`Xóa danh mục: ${pro.slug}`);
    }
  }
  return (
    <>
      <HeaderAdmin />
    <div className='overflow-x-auto '>
      <div className="flex justify-end my-3">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='border px-3 py-2 rounded w-1/2'
        />
        <Link to={'/admin/product/new'} className='bg-blue-500 p-3 hover:bg-blue-700 shadow rounded font-semibold'>Thêm mới</Link>
      </div>
      <table className='min-w-full border border-gray-200 my-10'>
        <thead className='bg-gray-300'>
          <tr>
            <th className='px-4 py-2 border'>STT</th>
            <th className='px-4 py-2 border'>Tên danh mục</th>
            <th className='px-4 py-2 border'>Mô tả</th>
            <th className='px-4 py-2 border'>Slug</th>
            <th className='px-4 py-2 border'>Giá</th>
            <th className='px-4 py-2 border'>Số lượng</th>
            <th className='px-4 py-2 border'>Mã danh mục</th>
            <th className='px-4 py-2 border'>Hình ảnh</th>
            <th className='px-4 py-2 border'>Trạng thái</th>
            <th className='px-4 py-2 border'>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {!loading && products.map((product, index) => (
            <tr key={product.id} className='hover:bg-gray-100'>
              <td className='px-4 py-2 border'>{index + 1}</td>
              <td className='px-4 py-2 border'>{product.name}</td>
              <td className='px-4 py-2 border'>{product.description}</td>
              <td className='px-4 py-2 border'>{product.slug}</td>
              <td className='px-4 py-2 border'>{product.price}</td>
              <td className='px-4 py-2 border'>{product.quantity}</td>
              <td className='px-4 py-2 border'>{product.category_id}</td>
              <td className='px-4 py-2 border'><img
                src={`${apiBaseUrl}/images/${product.image}`}
                alt="Product"
                className="w-20 h-20 object-cover"
              /></td>
              <td className='px-4 py-2 border'>{product.status}</td>
              <td className='px-4 py-2 border '>
                <Link to={'/admin/product/' + product.slug} className='bg-green-500 text-white px-3 py-1 rounded mx-2'>Sửa</Link>
                <button
                  className='bg-red-500 text-white px-3 py-1 rounded'
                  onClick={ev => handleDelete(product)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {(!loading && products.length === 0) && (
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
    </>
  )
}

export default ProductList
