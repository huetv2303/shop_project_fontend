import React, { use, useEffect, useState } from 'react'
import HeaderUser from './HeaderUser'
import api from "../../api";
import { toast } from 'react-toastify';
const Cart = () => {
    const [cartItems, setCartItems] = useState([]); // Giả sử bạn có một mảng sản phẩm trong giỏ hàng
    const [loading, setLoading] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Giả sử bạn có một hàm để lấy sản phẩm trong giỏ hàng
        fetchCartItems();
    }, []);

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

    return (
        <div>
            <HeaderUser />

            <div className='container mx-auto mt-8 bg-blue-100 p-6 shadow-md rounded-md items-center'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-xl font-semibold'>Giỏ hàng của bạn!</h2>
                </div>

                {/* Giả sử bạn có một mảng sản phẩm trong giỏ hàng */}
                {cartItems.length > 0 ? (
                    cartItems.map(item => (

                        <div key={item.id} className='flex gap-10 mt-4 h-40 w-[75%] bg-white rounded-md shadow p-4'>
                            <div>
                                <img
                                    src={`${apiBaseUrl}/images/${item.product.image}`}
                                    alt="Product"
                                    className="w-32 h-32 object-cover"
                                />
                            </div>
                            <div>
                                <p>Tên sản phẩm:  {item.product.name}</p>
                                <p>Giá:  {item.product.price}đ</p>
                                <div className='flex justify-between items-center mt-4'>
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
                    ))
                ) : (
                    <p className='mt-4'>Gỏ hàng của bạn trống.</p>
                )}

            </div>
        </div>
    )
}

export default Cart
