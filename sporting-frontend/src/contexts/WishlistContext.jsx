import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('clothing_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('clothing_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Thêm hoặc Xóa khỏi wishlist (Toggle)
  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        // Nếu đã có thì xóa đi
        return prev.filter(item => item.id !== product.id);
      }
      // Nếu chưa có thì thêm vào
      return [...prev, product];
    });
  };

  // Kiểm tra xem sản phẩm có trong wishlist không
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);