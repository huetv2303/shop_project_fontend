import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Signup from './views/Signup';
import Login from './views/Login';
import AdminDashboard from './views/admin/AdminDashboard';
import UserDashboard from './views/user/UserDashboard';
import api from './api.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './views/DashboardLayout.jsx';
import EditProfie from './views/EditProfile.jsx';
import CategoryList from './views/admin/category/CategoryList.jsx';
import CreateCategory from './views/admin/category/CreateCategory.jsx';
import ProductList from './views/admin/product/ProductList.jsx';
import ProductForm from './views/admin/product/ProductForm.jsx';
import Cart from './views/user/Cart.jsx';
import OrderSuccess from './views/user/OrderSuccess.jsx';
import OrderStatus from './views/order/orderStatus.jsx';
import AddressForm from './views/user/AddressForm.jsx';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra người dùng đã đăng nhập hay chưa
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await api.get('/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        console.log(res.data);

      } catch (error) {
        console.log('Không thể lấy thông tin người dùng', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/" element={<h1>Trang chủ</h1>} />

          {/* Protected routes */}
          {user && (
            <Route element={<DashboardLayout user={user} setUser={setUser} />}>
              {user.role === 'admin' && (
                <>
                  <Route path="/admin_dashboard" element={<AdminDashboard />} />
                  <Route path="/user_profile" element={<EditProfie user={user} />} />
                  <Route path="/admin/category" element={<CategoryList />} />
                  <Route path="/admin/category/new" element={<CreateCategory />} />
                  <Route path="/admin/category/:slug" element={<CreateCategory />} />
                  <Route path="/admin/product" element={<ProductList />} />
                  <Route path="/admin/product/new" element={<ProductForm />} />
                  <Route path="/admin/product/:slug" element={<ProductForm />} />
                  <Route path="/admin/order" element={<OrderStatus />} />
                </>

              )}
              {user.role === 'user' && (
                <>
                  <Route path="/user_dashboard" element={<UserDashboard />} />
                  <Route path="/edit_profile" element={<EditProfie user={user} />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/order" element={<OrderSuccess />} />
                  <Route path="/address" element={<AddressForm />} />
                  <Route path="/address/:id" element={<AddressForm />} />
                </>
              )}
            </Route>
          )}

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
