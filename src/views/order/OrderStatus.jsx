import React, { useEffect, useState } from 'react'

import { Link } from "react-router-dom";
import api from '../../api';
import HeaderAdmin from '../admin/HeaderAdmin';

const OrderStatus = () => {
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await api.get('/admin/orders/');
            console.log(res.data.data);
            if (res.data.length === 0) {
                console.log("Không có đơn hàng nào");
            }

            setOrder(res.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    }
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
                        <th className='px-4 py-2 border'>Số điện thoại</th>
                        <th className='px-4 py-2 border'>Trạng thái</th>
                        <th className='px-4 py-2 border'>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading && order.map((item, index) => (
                        <tr key={item.id} className='hover:bg-gray-100'>
                            <td className='px-4 py-2 border'>{index + 1}</td>
                            <td className='px-4 py-2 border'>{item.id}</td>
                            <td className='px-4 py-2 border'>{item.user.name}</td>
                            <td className='px-4 py-2 border'>{item.address.address}</td>
                            <td className='px-4 py-2 border'>{item.address.phone}</td>
                            <td className='px-4 py-2 border'>{item.status}</td>
                           
                        </tr>
                    ))}

                    {(!loading && order.length === 0) && (
                        <tr>
                            <td colSpan="4" className='text-center py-4'>Không có đơn hàng nào.</td>
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
    )
}

export default OrderStatus
