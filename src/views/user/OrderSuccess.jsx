import React from 'react'
import HeaderUser from './HeaderUser'

const OrderSuccess = () => {
  return (
    <div>
        <HeaderUser />
        <div className="container mx-auto mt-8 bg-blue-100 p-6 shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">Bạn đã đặt hàng thành công!</h1>
            <p>Đơn hàng của bạn sẽ sớm được giao.</p>
            {/* Thêm logic để hiển thị danh sách đơn hàng */}
        </div>
    </div>
  )
}

export default OrderSuccess
