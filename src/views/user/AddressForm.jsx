import React, { useEffect, useState } from 'react'
import HeaderUser from './HeaderUser'
import api from "../../api";
import { data, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdEmail } from 'react-icons/md';
const AddressForm = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        user_id: null,
        name: '',
        address: '',
        phone: '',
        type_address: '',
        note: ''
    });


    useEffect(() => {
        if (id) {
            setLoading(true);
            api.get('/address/' + id)
                .then(({ data }) => {
                    setFormData({
                        id: data.id,
                        user_id: data.user_id,
                        name: data.name,
                        address: data.address,
                        phone: data.phone,
                        type_address: data.type_address,
                        note: data.note
                    });
                    console.log("Dữ liệu từ API:", data);

                })
                
                .catch(err => {
                    console.error("Không thể lấy dữ liệu:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(formData.id) {
                // Cập nhật địa chỉ
                await api.put(`/address/${formData.id}`, formData);
                console.log('Cập nhật địa chỉ:', formData);
                toast.success('Cập nhật địa chỉ thành công!');
            } else {
                await api.post(`/address`, formData);
                console.log('Thêm địa chỉ mới:', formData);
                toast.success('Thêm địa chỉ mới thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error);
        }
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log("Form sau khi nhập:", { ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div>
            <HeaderUser />

            {loading && <div className='text-center mt-10 font-bold size-16'>Loading...</div>}
            {!loading && (
            <form onSubmit={handleSubmit} className='max-w-md mx-auto mt-8 bg-white p-6 shadow-md rounded-md'>
                {formData.id && <h1>Update Address: {formData.name}</h1>}
                {!formData.id && <h1>New Address</h1>}

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2' htmlFor='name'>Thành phố/Tỉnh</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                        placeholder='Nhập thành phố/tỉnh của bạn'
                    />
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2' htmlFor='address'>Địa chỉ</label>
                    <input
                        type='text'
                        id='address'
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                        placeholder='Nhập địa chỉ của bạn'
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2' htmlFor='phone'>Số điện thoại</label>
                    <input
                        type='tel'
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                        placeholder='Nhập số điện thoại của bạn'
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2' htmlFor='type_address'>Loại địa chỉ</label>
                    <input
                        type='text'
                        id='type_address'
                        name='type_address'
                        value={formData.type_address}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                        placeholder='Nhập loại địa chỉ của bạn'
                    />
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2' htmlFor='note'>Ghi chú</label>
                    <input
                        type='text'
                        id='note'
                        name='note'
                        value={formData.note}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                        placeholder='Nhập ghi chú của bạn'
                    />
                </div>
                <button

                    disabled={!formData.address || !formData.phone || !formData.type_address}
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200'
                >
                    Cập nhật
                </button>
            </form>
            )}
        </div>
    )
}

export default AddressForm
