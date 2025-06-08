import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api.js';
import { toast } from 'react-toastify';
export default function Login({setUser}) {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const [error,setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');

       try{
        const res = await api.post('/login', form, {

        });

        const {token, user} = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        setUser(user);
        if(user.role === 'admin'){
            navigate('/admin_dashboard');
            toast.success("Logged in successfully!");
        }else{
            navigate('/user_dashboard');
        }
       }catch(err){
         setError("Tài khoản hoặc mật khẩu không đúng");
       }
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Log in your account</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" className="w-full border p-2" value={form.email} onChange={handleChange}/>
                <input type="password" name="password" placeholder="Mật khẩu" className="w-full border p-2" value={form.password} onChange={handleChange}/>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Đăng nhập</button>
            </form>
        </div>
    );
}