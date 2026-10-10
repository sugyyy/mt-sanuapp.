import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiCandleAssistant from './components/AiCandleAssistant';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Collections from './pages/Collections';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';

import { INITIAL_PRODUCTS } from './data/products';
import { Search, X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState(null);

  // Overlay Modals State
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart helper functions
  const handleAddToCart = (product, selectedSize = "100g", quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      // Find price for selected size
      const sizeObj = product.sizes?.find(s => s.size === selectedSize);
      const unitPrice = sizeObj ? sizeObj.price : product.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { ...product, price: unitPrice, selectedSize, quantity }];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (productId, selectedSize, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, selectedSize);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === selectedSize) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (productId, selectedSize) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize)));
  };

  const handleToggleWishlist = (product) => {
    setWishlistIds(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product, selectedSize = "100g", quantity = 1) => {
    handleAddToCart(product, selectedSize, quantity);
    setIsCartDrawerOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMood = (moodId) => {
    setSelectedMoodFilter(moodId);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Search Results
  const searchResults = searchQuery.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.fragrance.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF8F5] text-coffee-400">
      
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          if (page === 'shop') setSelectedMoodFilter(null);
          setCurrentPage(page);
        }}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        setIsCartOpen={() => setIsCartDrawerOpen(true)}
        setIsSearchOpen={() => setIsSearchOpen(true)}
        setIsAiOpen={() => setIsAiOpen(true)}
      />

      {/* Main Page Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            products={products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onNavigate={(page) => {
              if (page === 'shop') setSelectedMoodFilter(null);
              setCurrentPage(page);
            }}
            onSelectMood={handleSelectMood}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentPage === 'shop' && (
          <Shop
            products={products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            selectedMoodFilter={selectedMoodFilter}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onBuyNow={handleBuyNow}
            onBack={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'collections' && (
          <Collections
            onSelectCollection={(title) => {
              setCurrentPage('shop');
            }}
          />
        )}

        {currentPage === 'about' && (
          <About onExploreShop={() => setCurrentPage('shop')} />
        )}

        {currentPage === 'contact' && (
          <Contact />
        )}

        {currentPage === 'cart' && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onNavigate={setCurrentPage}
            onProceedToCheckout={() => setCurrentPage('checkout')}
          />
        )}

        {currentPage === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            onOrderComplete={() => setCartItems([])}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'wishlist' && (
          <Wishlist
            wishlistProducts={wishlistProducts}
            onRemoveWishlist={(id) => setWishlistIds(prev => prev.filter(item => item !== id))}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavClick={(page) => setCurrentPage(page)} />

      {/* ATHUS AI Candle Assistant Drawer */}
      <AiCandleAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onSelectProduct={handleProductClick}
      />

      {/* Quick Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-coffee-500/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-beige-200">
            
            <div className="p-6 bg-white border-b border-beige-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-semibold text-coffee-400">YOUR CART ({cartCount})</h3>
              </div>
              <button onClick={() => setIsCartDrawerOpen(false)} className="p-2 text-coffee-100 hover:text-coffee-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-beige-200 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-coffee-400">{item.name}</h4>
                      <span className="text-[10px] text-gold-500 font-bold block">{item.fragrance} ({item.selectedSize})</span>
                      <span className="text-[11px] text-coffee-100 font-medium">Qty: {item.quantity} &times; ₹{item.price}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveCartItem(item.id, item.selectedSize)}
                      className="p-1.5 text-coffee-100 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-coffee-100 text-xs space-y-2">
                  <p>Your cart is empty.</p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-beige-200 space-y-4">
                <div className="flex justify-between font-serif text-base font-bold text-coffee-400">
                  <span>Subtotal:</span>
                  <span className="text-gold-500">₹{cartSubtotal}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setCurrentPage('cart');
                    }}
                    className="flex-1 py-3 bg-cream-100 hover:bg-beige-100 text-coffee-400 text-xs font-semibold uppercase rounded-full border border-beige-200"
                  >
                    VIEW CART
                  </button>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      setCurrentPage('checkout');
                    }}
                    className="flex-1 py-3 bg-gold-300 hover:bg-gold-400 text-coffee-500 text-xs font-bold uppercase rounded-full shadow-glow flex items-center justify-center gap-1"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-coffee-500/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-beige-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">SEARCH ATHUS</span>
              <button onClick={() => setIsSearchOpen(false)} className="p-1 text-coffee-100 hover:text-coffee-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-coffee-100 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candle name, fragrance (e.g. Vanilla, Rose, Lavender)..."
                className="w-full pl-10 pr-4 py-3 bg-cream-100 border border-beige-200 rounded-full text-xs text-coffee-400 focus:outline-none"
              />
            </div>

            {searchQuery.trim() && (
              <div className="max-h-60 overflow-y-auto space-y-2 pt-2">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        handleProductClick(product);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-3 bg-cream-50 hover:bg-gold-100/50 rounded-2xl border border-beige-200 cursor-pointer flex items-center gap-3 transition"
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-semibold text-coffee-400">{product.name}</h4>
                        <span className="text-[10px] text-gold-500 uppercase font-bold">{product.fragrance}</span>
                      </div>
                      <span className="font-serif text-sm font-bold text-coffee-400">₹{product.price}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-coffee-100">No matching candles found for "{searchQuery}".</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
