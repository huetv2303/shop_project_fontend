// resources/js/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import api from '../api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })


    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password != form.password_confirmation) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            const res = await api.post('/register', {
                name: form.name,
                email: form.email,
                password: form.password,
                password_confirmation: form.password_confirmation
            });
            toast.success("Sign up successfully!");
            setForm({ name: '', email: '', password: '', password_confirmation: '' })
        } catch (error) {
            if (error.response) {
                console.error('Lỗi chi tiết từ Laravel:', error.response.data.errors);
            } else {
                console.error('Lỗi:', error.message);
            }
        }finally{
            navigate('/login');
        }
    }
        return (
            <div className="max-w-md mx-auto p-4">
                <h2 className="text-xl font-bold mb-4">Đăng ký</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="name" placeholder="Tên" className="w-full border p-2" value={form.name} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" className="w-full border p-2" value={form.email} onChange={handleChange} />
                    <input type="password" name="password" placeholder="Mật khẩu" className="w-full border p-2" value={form.password} onChange={handleChange} />
                    <input type="password" name="password_confirmation" placeholder="Mật khẩu" className="w-full border p-2" value={form.password_confirmation} onChange={handleChange} />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Đăng ký</button>
                </form>
            </div>
        );
    }
