import { useEffect, useState } from "react";
import HeaderUser from "./HeaderUser"
import api from "../../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserDashboard({ }) {

    // // const user = JSON.parse(localStorage.getItem('admin')) || {};
    // if (!user || !user.role || user.role !== 'admin') {
    //     return <div className="text-red-500 text-center mt-8">Bạn không có quyền truy cập vào trang này.</div>;
    // }
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addCart, setAddCart] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {

        fetchProducts();
    }, []);

    const handleAddToCart = async (productId) => {
        setAddCart(productId);
        try {
            const res = await api.post('/cart', {
                product_id: productId,
                quantity: 1 // Giả sử mỗi lần thêm vào giỏ hàng là 1 sản phẩm
            });
            toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        } finally {
            setAddCart(false);
        }
    }

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products'); // Giả sử API trả về danh sách sản phẩm
            setProducts(response.data.data);
            console.log("Sản phẩm đã tải:", response.data.data);

        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <HeaderUser />
            <div>
                <div className="container mx-auto mt-8 bg-blue-100 p-6 shadow-md rounded-md items-center">


                    {loading ? (
                        <p>Đang tải sản phẩm...</p>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mt-4">Sản phẩm</h2>
                            <div className="flex gap-4 flex-wrap mt-4">
                                {products.map((product) => (
                                    <div key={product.id} className="h-80 w-72 bg-white rounded-md text-center shadow p-4">
                                        <div className="flex justify-center mb-2">
                                            <img
                                                src={`${apiBaseUrl}/images/${product.image}`}
                                                alt="Product"
                                                className="w-56 h-52 object-cover"
                                            />
                                        </div>
                                        <p className="font-semibold">{product.name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-gray-600">{product.price}đ</p>
                                            <button onClick={() => handleAddToCart(product.id)} className="bg-red-500 text-black rounded-lg px-4 py-2 hover:bg-red-600 transition-colors duration-300">
                                                Thêm giỏ hàng
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}