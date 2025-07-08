import React, { use, useEffect, useState } from 'react'
import HeaderUser from './HeaderUser'
import api from "../../api";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
const Cart = () => {
    const [cartItems, setCartItems] = useState([]); // Giả sử bạn có một mảng sản phẩm trong giỏ hàng
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState([]);
    const [form, setForm] = useState({
        address_id: '',
    });
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Giả sử bạn có một hàm để lấy sản phẩm trong giỏ hàng
        fetchCartItems();
        fetchAddress();
    }, []);

    const handleOrder = async () => {
        setLoading(true);
        try {
            const response = await api.post('/order', {
                address_id: form.address_id,
                cart_items: cartItems.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity
                })),
                payment_method: form.payment_method,
            });

            toast.success("Đặt hàng thành công!");
        } catch (error) {
            toast.error("Không thể đặt hàng!");
        } finally {
            setLoading(false);
        }
    };
    const fetchAddress = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/address`); // Giả sử API trả về địa chỉ của người dùng
            setAddress(response.data.data);
            console.log("Địa chỉ giao hàng:", response.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy địa chỉ giao hàng:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/cart`); // Giả sử API trả về danh sách sản phẩm trong giỏ hàng
            setCartItems(response.data.data);
            console.log("Sản phẩm trong giỏ hàng:", response.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleQuantityChange = async (cartItemId, change) => {
        const item = cartItems.find(i => i.id === cartItemId);
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + change);

        try {
            // Gọi API cập nhật số lượng
            await api.put(`/cart/${cartItemId}`, {
                quantity: newQuantity
            });

            // Cập nhật lại giao diện
            setCartItems(prevItems =>
                prevItems.map(i =>
                    i.id === cartItemId ? { ...i, quantity: newQuantity } : i
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
            toast.error("Không thể cập nhật số lượng!");
        }
    }

    const handleRemoveItem = async (cartItemId) => {
        try {
            // Gọi API xóa sản phẩm khỏi giỏ hàng
            await api.delete(`/cart/${cartItemId}`);

            // Cập nhật lại giao diện
            setCartItems(prevItems => prevItems.filter(i => i.id !== cartItemId));
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
            toast.error("Không thể xóa sản phẩm khỏi giỏ hàng!");
        }
    }

    const handleChange = (e) => {
        console.log("Form sau khi nhập:", { ...form, [e.target.name]: e.target.value });
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setForm(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước

        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };



    return (
        <div>
            <HeaderUser />

            <div className='container mx-auto mt-8 bg-blue-100 p-6 shadow-md rounded-md items-center'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Giỏ hàng của bạn!</h2>
                </div>
                <div className='flex'>
                    {/* Giả sử bạn có một mảng sản phẩm trong giỏ hàng */}
                    <div className='w-3/5 bg-blue-200 p-4 radius-md shadow-md mr-4'>
                        {loading ? (
                            <h1>Đang tải...</h1>
                        ) : cartItems.length > 0 ? (
                            cartItems.map(item => (

                                <div key={item.id} className='flex justify-between gap-10 mt-4 h-40 bg-white rounded-md shadow p-4'>
                                    <div className='flex gap-3 items-center '>
                                        <div className=''>
                                            <img
                                                src={`${apiBaseUrl}/images/${item.product.image}`}
                                                alt="Product"
                                                className="w-32 h-32 object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p >Tên sản phẩm:  {item.product.name}</p>
                                            <p>Giá:  {item.product.price}đ</p>
                                            <div className='flex justify-between items-center '>
                                                <div>
                                                    Chọn số lượng:
                                                </div>
                                                <div className='cart-number-minus-plus flex gap-2 items-center'>
                                                    <button onClick={() => handleQuantityChange(item.id, -1)} className='number-minus bg-gray-200 px-2 py-1 rounded'>-</button>
                                                    <span className='text-lg'>{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.id, 1)} className='number-plus bg-gray-200 px-2 py-1 rounded'>+</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => handleRemoveItem(item.id)} className='bg-red-500 text-white px-4 py-2 rounded'>Xóa</button>
                                        <p className='text-red-500 mt-16 text-sm font-bold'>Tổng tiền: {item.product.price * item.quantity}đ</p>
                                    </div>
                                </div>


                            ))
                        ) : (
                            <p className='mt-4'>Gỏ hàng của bạn trống.</p>
                        )}
                    </div>
                    <div className="w-2/5 bg-blue-200 p-4">
                        <div className='mb-4 bg-white p-4 rounded-md shadow '>
                            <div className='flex justify-between items-center mb-2'>
                                <h3 className='text-lg font-semibold'>Địa chỉ</h3>
                                <Link to="/address" className='cursor-pointer text-black-500 bg-gray-300 rounded-md p-1  items-center hover:bg-gray-400'> + Thêm địa chỉ</Link>
                            </div>

                            <p className='text-sm'>Điền địa chỉ giao hàng của bạn.</p>
                            <select
                                name="address_id"
                                onChange={handleChange}
                                value={form.address_id}
                            >
                                <option value="">-- Chọn địa chỉ --</option>
                                {address.map(addr => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.address} - {addr.phone}
                                    </option>
                                ))}
                            </select>

                            {form.address_id && (
                                <Link to={`/address/${form.address_id}`}>Sửa</Link>
                            )}

                        </div>
                        <div className=' bg-white p-4 rounded-md shadow mb-10'>
                            <p>Tổng tiền: {cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}đ</p>
                            <p>Phí giao hàng: </p>
                            <p className='w-full'>--------------------------------------------</p>
                            <p className='text-red-500 font-bold'>Tổng cộng: {cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}đ</p>
                            <select
                                name="payment_method"
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn phương thức thanh toán --</option>
                                <option>
                                    Thanh toán khi nhận hàng
                                </option>
                                <option>
                                    Thanh toán qua chuyển khoản
                                </option>
                                <option>
                                    Thanh toán qua ví điện tử
                                </option>
                            </select>
                        </div>
                        <div className='w-full'>
                            <button onClick={handleOrder} className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 right-0'>Thanh toán</button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Cart
