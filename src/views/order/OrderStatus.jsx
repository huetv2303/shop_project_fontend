import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import api from '../../api';
import HeaderAdmin from '../admin/HeaderAdmin';

const OrderStatus = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders/');
            setOrders(res.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        if(!window.confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}?`)) {
            return;
        }
        try {
            const res = await api.patch(`/orders/${orderId}/status`, {
                status: newStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Cập nhật lại giao diện sau khi cập nhật thành công
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert('Cập nhật trạng thái thành công');
        } catch (err) {
            console.error(err);
            alert('Cập nhật thất bại');
        }
    };

    const renderButton = (order) => {
        switch (order.status) {
            case 'pending':
                return (
                    <>
                        <button onClick={() => handleUpdateStatus(order.id, 'confirmed')} className='bg-orange-500 text-white px-2 py-1 rounded mx-2'>Xác nhận</button>
                        <button onClick={() => handleUpdateStatus(order.id , 'canceled')} className='bg-red-500 text-white px-2 py-1 rounded'>Hủy</button>
                    </>
                );
            case 'confirmed':
                return <button onClick={() => handleUpdateStatus(order.id, 'shipping')} className='bg-blue-500 text-white px-2 py-1 rounded'>Giao hàng</button>;
            case 'shipping':
                return <button onClick={() => handleUpdateStatus(order.id, 'delivered')} className='bg-green-500 text-white px-2 py-1 rounded'>Đã giao</button>;
            case 'delivered':
                return <span className='text-green-700 font-bold'>Giao thành công.</span>;
            case 'canceled':
                return <span className='text-red-600 font-bold'>Đã hủy!</span>;
            default:
                return null;
        }
    };

    return (
        <div>
            <HeaderAdmin />

            <table className='min-w-full border border-gray-200 my-10'>
                <thead className='bg-gray-300'>
                    <tr>
                        <th className='px-4 py-2 border'>STT</th>
                        <th className='px-4 py-2 border'>Mã đơn hàng</th>
                        <th className='px-4 py-2 border'>Tên khách hàng</th>
                        <th className='px-4 py-2 border'>Địa chỉ</th>
                        <th className='px-4 py-2 border'>SĐT</th>
                        <th className='px-4 py-2 border'>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading && orders.map((item, index) => (
                        <tr key={item.id} className='hover:bg-gray-100'>
                            <td className='px-4 py-2 border text-center'>{index + 1}</td>
                            <td className='px-4 py-2 border text-center'>{item.id}</td>
                            <td className='px-4 py-2 border text-center'>{item.user.name}</td>
                            <td className='px-4 py-2 border text-center'>{item.address.address}</td>
                            <td className='px-4 py-2 border text-center'>{item.address.phone}</td>
                            <td className='px-4 py-2 border text-center'>
                                {renderButton(item)}
                            </td>
                        </tr>
                    ))}

                    {!loading && orders.length === 0 && (
                        <tr>
                            <td colSpan="7" className='text-center py-4'>Không có đơn hàng nào.</td>
                        </tr>
                    )}

                    {loading && (
                        <tr>
                            <td colSpan="7" className='text-center py-4'>Đang tải...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderStatus;
