import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./Shop.css";

const Toast = ({ message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div className="toast">
      <span>✨</span>
      {message}
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="amazon-product-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text" style={{ width: '60%' }} />
    <div className="skeleton skeleton-btn" style={{ marginTop: 'auto' }} />
  </div>
);

export default function ShopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addingToCart, setAddingToCart] = useState({});
  const [cartBounce, setCartBounce] = useState(false);

  // Handle checkout message from payment page
  useEffect(() => {
    if (location.state?.checkoutMessage) {
      addToast(location.state.checkoutMessage);
      setCart({});
      setShippingAddress("");
    }
  }, [location.state]);

  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (search) params.search = search;

        const response = await api.get("orders/products/", { params });
        setProducts(response.data);
      } catch (err) {
        setError(err?.response?.data?.detail || "Unable to load products.");
      }
    };

    fetchProducts();
  }, [selectedCategory, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("orders/categories/");
        setCategories(response.data);
      } catch (err) {
        console.warn("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const addToCart = async (product, quantityToAdd = 1) => {
    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    
    // Trigger cart bounce
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);

    setCart((prev) => {
      const existing = prev[product.id] || { ...product, quantity: 0 };
      const newQuantity = existing.quantity + quantityToAdd;
      return {
        ...prev,
        [product.id]: { ...existing, quantity: newQuantity },
      };
    });

    addToast(`Added ${product.name} to cart!`);
    
    setTimeout(() => {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 1000);
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return {
        ...prev,
        [productId]: { ...existing, quantity },
      };
    });
  };

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartItemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  const handleCheckout = () => {
    if (!shippingAddress?.trim()) {
      setError("Please enter a shipping address.");
      return;
    }
    navigate("/payment", {
      state: { cartItems, cartTotal, shippingAddress },
    });
  };

  return (
    <div className="shop-page-container">
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#111' }}>
          SmartCart <span style={{ color: '#febd69' }}>Fresh</span>
        </h1>
        
        <div className={`cart-icon-container ${cartBounce ? 'cart-bounce' : ''}`} style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
          🛒
          {cartItemCount > 0 && <div className="cart-badge">{cartItemCount}</div>}
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fresh groceries..."
          />
        </div>
      </div>

      <div className="category-filters">
        <button 
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Items
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {!products ? (
          Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          products.map((product, index) => {
            const quantity = quantities[product.id] || 1;
            const isAdding = addingToCart[product.id];
            
            return (
              <div
                key={product.id}
                className="amazon-product-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="product-image-container">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="product-image" />
                  )}
                </div>
                
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{product.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: 12, flex: 1 }}>
                  {product.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{product.price}</span>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(1, Number(e.target.value) || 1),
                      }))
                    }
                    style={{ width: 50, padding: '4px 8px', borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>

                <button
                  type="button"
                  className={`add-to-cart-btn ${isAdding ? 'btn-success' : ''}`}
                  onClick={() => addToCart(product, quantity)}
                  disabled={isAdding}
                >
                  {isAdding ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {cartItems.length > 0 && (
        <div style={{ 
          marginTop: 40, 
          padding: 24, 
          background: 'white', 
          borderRadius: 12, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          animation: 'fadeUp 0.6s forwards'
        }}>
          <h2 style={{ marginTop: 0 }}>Your Shopping Cart</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>{item.name} (x{item.quantity})</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontWeight: 600 }}>₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, 0)}
                    style={{ background: 'none', border: 'none', color: '#e84a25', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total: ₹{cartTotal.toFixed(2)}</span>
            <button 
              className="add-to-cart-btn" 
              style={{ padding: '12px 32px' }}
              onClick={() => setIsCheckoutOpen(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: 'blur(4px)',
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16, zIndex: 3000,
        }}>
          <div className="auth-card" style={{ maxWidth: 500, padding: 32, animation: 'slideIn 0.3s forwards' }}>
            <h2 style={{ marginTop: 0 }}>Confirm Your Order</h2>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Shipping Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
                placeholder="Where should we send your fresh items?"
                style={{ width: "100%", padding: 12, borderRadius: 8, border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="add-to-cart-btn" style={{ flex: 1 }} onClick={handleCheckout}>
                Place Order
              </button>
              <button 
                style={{ flex: 1, background: '#eee', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                onClick={() => setIsCheckoutOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
