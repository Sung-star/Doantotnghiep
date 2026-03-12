import React from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductCard from '../../components/product/ProductCard';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Danh sách yêu thích của bạn ({wishlistItems.length})</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Bạn chưa yêu thích sản phẩm nào.</p>
          <Link to="/" className="btn btn-dark">Khám phá sản phẩm ngay</Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
          {wishlistItems.map(product => (
            <div className="col" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;