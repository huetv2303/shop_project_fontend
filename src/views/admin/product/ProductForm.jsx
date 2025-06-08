import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';

const ProductForm = () => {
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const [categories, setCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        quantity: '',
        category_id: '',
        status: 'active',
    });

    // Nếu đang chỉnh sửa, gọi API để lấy dữ liệu sản phẩm hiện tại
    useEffect(() => {
        // console.log("Dữ liệu gửi đi:", form);
        getCategory();
        if (slug) {
            setLoading(true);
            api.get(`/admin/products/${slug}`)
                .then(({ data }) => {
                    setForm({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        quantity: data.quantity,
                        category_id: data.category_id,
                        image: data.image, // Không cần thiết phải lưu ảnh ở đây, chỉ cần lưu slug
                        slug: data.slug,
                        status: data.status || 'active',
                    });
                    if (data.image) {
                        setPreviewImage(`${import.meta.env.VITE_API_BASE_URL}/images/${data.image}`);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    const getCategory = async () => {
        try {
            const response = await api.get('admin/getCate');
            const categoryData = response.data;
            setCategories(categoryData);
            console.log("Danh sách danh mục:", categoryData);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách danh mục:", err);
            setCategories([]); // fallback nếu lỗi
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    for (const key in form) {
        if (form[key] !== undefined && form[key] !== null) {
            formData.append(key, form[key]);
        }
    }

    try {
        if (form.slug) {
            await api.post(`/admin/products/${form.slug}?_method=PUT`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            await api.post('/admin/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        alert('Product saved successfully!');
        navigate('/admin/product');
    } catch (error) {
        console.error('❌ Error saving product:', error.response?.data || error.message);
        alert('Lỗi khi lưu sản phẩm!');
    } finally {
        setLoading(false);
    }
};
    return (
        <div>
            <h1>{slug ? `Update Product: ${form.name}` : 'New Product'}</h1>
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {!loading && (
                    <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
                        <input
                            onChange={handleChange}
                            value={form.name}
                            name="name"
                            placeholder="Tên sản phẩm"
                        />
                        <input
                            onChange={handleChange}
                            value={form.description}
                            name="description"
                            placeholder="Mô tả"
                        />
                        <input
                            onChange={handleChange}
                            value={form.price}
                            name="price"
                            type="number"
                            placeholder="Giá"
                        />
                        <input
                            onChange={handleChange}
                            value={form.quantity}
                            name="quantity"
                            type="number"
                            placeholder="Số lượng"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={handleChange}
                        />

                        {previewImage && (
                            <div>
                                <p>Ảnh hiện tại:</p>
                                <img src={previewImage} alt="Preview" style={{ width: '150px', marginTop: '10px' }} />
                            </div>
                        )}

                        <select
                            name="category_id"
                            onChange={handleChange}
                            value={form.category_id}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>

                        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                            Lưu
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductForm;
