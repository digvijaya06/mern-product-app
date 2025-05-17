import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    console.log('addToCart called with product:', product);
    setCart((prev) => {
      const existingProductIndex = prev.findIndex(item => (item._id === product._id) || (item.id === product.id));
      if (existingProductIndex !== -1) {
        // Product exists, increment quantity
        const updatedCart = [...prev];
        const existingProduct = updatedCart[existingProductIndex];
        updatedCart[existingProductIndex] = {
          ...existingProduct,
          quantity: (existingProduct.quantity || 1) + 1
        };
        console.log('Updated cart:', updatedCart);
        return updatedCart;
      } else {
        const newCart = [...prev, { ...product, quantity: 1 }];
        console.log('New cart:', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => (item._id !== id) && (item.id !== id)));
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
