import api from '../../api';
import HeaderUser from './HeaderUser'
import { useEffect, useState } from 'react';

const OrderSuccess = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data);
      console.log("đơn hàng:", res.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }

  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}?`)) {
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
        return <span className='text-red-600 font-bold'>Chờ xác nhận</span>;
      case 'confirmed':
        return <span className='text-blue-600 font-bold'>Đơn hàng đã được xác nhận.</span>;
      case 'shipping':
        return <span className='text-blue-600 font-bold'>Đơn hàng đang được giao.</span>;
      case 'delivered':
        return <span className='text-green-700 font-bold'>Giao thành công.</span>;
      case 'canceled':
        return <span className='text-red-600 font-bold'>Đã hủy!</span>;
      default:
        return <span className='text-gray-500'>Không xác định</span>;
    }
  };


  return (
    <div>
      <HeaderUser />
      <div className="container mx-auto mt-8 bg-blue-100 p-6 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Đơn hàng của bạn!</h1>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <>
            {orders.map((order) => (
              <div key={order.id} className="border-b border-gray-300 py-4">
                <div className='flex justify-between items-center mb-4'>
                  <p className='text-xl font-semibold'>Mã đơn hàng: #{order.id}</p>
                  <p className="text -xl font-semibold">Trạng thái: {renderButton(order)}</p>
                </div>
                <div className='flex justify-between items-center mb-4'>
                  <p className="text-gray-600">Người đặt: {order.user.name}</p>
                  <p className="text-gray-600">Ngày đặt hàng: {order.created_at}</p>
                </div>

                <p className="text-gray-600">Địa chỉ: {order.address.address}</p>
                <p className="text-gray-600">Số điện thoại: {order.address.phone}</p>
                <p className='text-gray-600 mt-4'>Chi tiết đơn hàng:</p>
                {order.orderItems.map((orderItem) => (
                  <div key={orderItem.id} className="flex items-center mt-2">
                    <img src={`${apiBaseUrl}/images/${orderItem.product.image}`} alt={orderItem.product.name} className="w-20 h-20 object-cover" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">{orderItem.product.name}</h3>
                      <p className="text-gray-600">Số lượng: {orderItem.product.quantity}</p>
                      <p className="text-gray-600">Giá: {orderItem.product.price} VNĐ</p>
                    </div>
                  </div>
                ))}
                <div className='flex justify-between items-center mt-4'>
                  <div>

                    {
                      order.status === 'canceled' ? (
                        <p className="text-gray-600">Ngày hủy: {order.updated_at}</p>
                      ) : order.status === 'delivered' ? (
                        <p className="text-gray-600">Ngày đã giao: {order.updated_at}</p>
                      ) : null
                    }

                    <p className="text-gray-600">Phương thức thanh toán: {order.payment_method}</p>
                  </div>
                  <p className="text-lg font-bold mt-2">Tổng: {order.total_price} VNĐ</p>

                </div>
                <div className='flex justify-between items-center mt-4'>
                  <div></div>
                  {order.status === 'pending' && (
                    <button onClick={() => handleUpdateStatus(order.id, 'canceled')} className='bg-red-600 text-white px-4 py-2 rounded-md'>Hủy đơn hàng</button>
                  )}
                </div>
              </div>

            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default OrderSuccess
