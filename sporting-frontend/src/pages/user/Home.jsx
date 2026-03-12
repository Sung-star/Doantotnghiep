import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import cái này
import productApi from '../../api/productApi';
import ProductCard from '../../components/product/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // 2. Khai báo hook chuyển trang

   // FILE: Home.jsx
useEffect(() => {
    const fetchProducts = async () => {
        try {
            // SỬA: Gọi API với size=12 để lấy đủ sản phẩm hiển thị
            const res = await productApi.getAll(0, 12); 
            
            // SỬA: Lấy dữ liệu từ .content thay vì res.data trực tiếp
            setProducts(res.data.content || []); 
        } catch (err) {
            console.error("Lỗi lấy sản phẩm:", err);
            setProducts([]); 
        } finally {
            setLoading(false);
        }
    };
    fetchProducts();
}, []);

    if (loading) return <div className="text-center mt-5">Đang tải sản phẩm...</div>;

    // Chia danh sách
    const bestSellers = products.slice(0, 4); 
    const newArrivals = products.slice(4, 12);

    return (
        <div className="container mt-4 mb-5">
            {/* SẢN PHẨM BÁN CHẠY */}
            <div className="mb-5">
                <h2 className="mb-4 text-center text-danger fw-bold">🔥 SẢN PHẨM BÁN CHẠY</h2>
                <div className="row g-4">
                    {bestSellers.map(product => (
                        <div className="col-6 col-md-3" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* SẢN PHẨM MỚI VỀ */}
            <div>
                <h2 className="mb-4 text-center text-primary fw-bold">✨ SẢN PHẨM MỚI VỀ</h2>
                <div className="row g-4">
                    {newArrivals.map(product => (
                        <div className="col-6 col-md-3" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* NÚT XEM TẤT CẢ (ĐÃ SỬA) */}
                <div className="text-center mt-4">
                    <button 
                        className="btn btn-outline-dark px-4 py-2"
                        // Khi bấm sẽ chuyển sang trang /products (Trang chứa toàn bộ SP)
                        onClick={() => navigate('/products')} 
                    >
                        Xem tất cả sản phẩm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;