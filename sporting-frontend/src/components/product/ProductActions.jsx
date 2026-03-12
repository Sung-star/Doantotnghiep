import React from 'react';
import { addToCart, addToWishlist } from '../../api/cartApi';

const ProductActions = ({ product }) => {
    
    const onAddToCart = async () => {
        try {
            await addToCart(product.id, 1);
            alert("Đã thêm vào giỏ hàng!");
        } catch (err) {
            alert("Lỗi: Bạn cần đăng nhập");
        }
    };

    return (
        <div className="flex gap-2">
            <button onClick={onAddToCart} className="btn btn-primary">
                Thêm vào giỏ
            </button>
            <button onClick={() => addToWishlist(product.id)} className="btn btn-outline-danger">
                ❤ Wishlist
            </button>
        </div>
    );
};

export default ProductActions;