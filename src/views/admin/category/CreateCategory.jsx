import React, { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import HeaderAdmin from '../HeaderAdmin';

const CreateCategory = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        id: null,
        name: '',
        description: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            setLoading(true);
            api.get('/admin/categories/' + slug)
                .then(({ data }) => {
                    setForm({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        slug: data.slug
                    });
                })
                .catch(err => {
                    console.error("Không thể lấy dữ liệu:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [slug]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (form.slug) {
                // Update existing category
                await api.put('/admin/categories/' + form.slug, form);
                navigate('/admin/category/');
            } else {
                // Create new category
                await api.post('/admin/categories', form);
                navigate('/admin/category/');
            }
            alert("Category saved successfully!");
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Error saving category");
        } finally {
            setLoading(false);
        }
    }



    return (
        <>
            <HeaderAdmin />
            <div>
                {form.slug && <h1>Update Category: {form.name}</h1>}
                {!form.slug && <h1>New category</h1>}
                <div className="card animated fadeInDown">
                    {loading && <div className="text-center">Loading...</div>}
                    {!loading && (
                        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
                            <input onChange={handleChange} value={form.name} name='name' placeholder="Tên danh mục" />
                            <input onChange={handleChange} value={form.description} type="text" name='description' placeholder="Mô tả" />
                            <button className='bg-blue-500 text-white px-3 py-1 rounded '>Save</button>
                        </form>
                    )}
                </div>
            </div>
        </>
    )
}

export default CreateCategory
