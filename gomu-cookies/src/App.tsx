/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  MessageCircle, 
  Instagram, 
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── CONSTANTS ───

const PRODUCTS = [
  { id: 1, name: "Original",    price: 15000, image: "original.jpeg",   description: "GOMU's Signature Original Cookie with premium chocolate chips and artisanal dough." },
  { id: 2, name: "Smores",      price: 18000, image: "snores.jpeg",      description: "GOMU's Signature Smores Cookie with gooey marshmallow filling and rich chocolate chunks." },
  { id: 3, name: "Red Velvet",  price: 20000, image: "red_velvet.jpeg",  description: "GOMU's Signature Red Velvet Cookie with creamy white chocolate chips and a vibrant cocoa base." },
];

const WHATSAPP_NUMBER = "6281370380333"; 

const formatPrice = (n: number) => `Rp ${n.toLocaleString("id-ID").replace(/,/g, '.')}`;

// External Video for Hero (Pexels cookie baking video)
const HERO_VIDEO_URL = "https://player.vimeo.com/external/494252666.sd.mp4?s=734914a2754641c88820c74f884a203f491ecb55&profile_id=165&oauth2_token_id=57447761";

// ─── TYPES ───

type CartItem = {
  productId: number;
  quantity: number;
};

type Page = "home" | "checkout";

// ─── COMPONENTS ───

export default function App() {
  // Root state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart operations
  const addToCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, type: 'cookie' | 'logo' = 'cookie') => {
    const target = e.currentTarget;
    if (type === 'logo') {
      target.src = "https://images.unsplash.com/photo-1544433422-25dece6663f7?auto=format&fit=crop&q=80&w=200"; // Generic aesthetic logo placeholder
    } else {
      // Different cookies based on search terms if possible, or just a nice baked good
      target.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800";
    }
  };

  if (currentPage === "checkout") {
    return (
      <CheckoutPage 
        cart={cart} 
        onBack={() => {
          setCurrentPage("home");
          setIsCartOpen(true);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] font-sans selection:bg-[#202A36]/10">
      {/* ─── SECTION: NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <button 
            onClick={() => scrollTo('home')}
            className="flex items-center gap-3 group"
          >
            <img 
              src="logo.png" 
              alt="GOMU logo" 
              onError={(e) => handleImageError(e, 'logo')}
              className="h-10 w-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold text-[#202A36] tracking-tight">GOMU Cookies</span>
          </button>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('home')} className="text-sm font-medium text-gray-700 hover:text-[#202A36] transition-colors">Home</button>
            <button onClick={() => scrollTo('menu')} className="text-sm font-medium text-gray-700 hover:text-[#202A36] transition-colors">Menu</button>
            <button onClick={() => scrollTo('story')} className="text-sm font-medium text-gray-700 hover:text-[#202A36] transition-colors">Our Story</button>
            <button onClick={() => scrollTo('faq')} className="text-sm font-medium text-gray-700 hover:text-[#202A36] transition-colors">FAQ</button>
          </div>

          {/* Right: Cart & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#202A36] hover:bg-[#202A36]/5 rounded-full transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0 -right-0 bg-[#202A36] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#202A36] hover:bg-[#202A36]/5 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-full left-0 right-0 px-4 mt-2"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                <button onClick={() => scrollTo('home')} className="text-left text-lg font-medium text-gray-700">Home</button>
                <button onClick={() => scrollTo('menu')} className="text-left text-lg font-medium text-gray-700">Menu</button>
                <button onClick={() => scrollTo('story')} className="text-left text-lg font-medium text-gray-700">Our Story</button>
                <button onClick={() => scrollTo('faq')} className="text-left text-lg font-medium text-gray-700">FAQ</button>
                <button 
                  onClick={() => scrollTo('menu')}
                  className="mt-2 w-full py-3 bg-[#202A36] text-white rounded-full font-semibold shadow-md active:scale-95 transition-all"
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── SECTION: HERO ─── */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          src={HERO_VIDEO_URL} 
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center px-6 mt-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-semibold tracking-[0.2em] text-white/80 uppercase mb-4"
          >
            GOODIES & MUNCHIES
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl md:text-7xl lg:text-8xl font-light text-white/70 leading-none tracking-tighter">Pure Joy.</span>
            <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tighter -mt-2">Freshly Baked.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base md:text-lg text-white/80 mt-6 mb-10 max-w-md mx-auto leading-relaxed"
          >
            Your daily dose of happiness, delivered fresh to your doorstep.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => scrollTo('menu')}
              className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/40 hover:bg-white/30 font-medium transition-all group"
            >
              Explore Menu
            </button>
            <button 
              onClick={() => scrollTo('menu')}
              className="px-8 py-3 rounded-full bg-[#202A36] text-white hover:bg-[#1a2229] font-semibold transition-all shadow-xl"
            >
              Shop Now
            </button>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ─── SECTION: PRODUCT GALLERY ─── */}
      <section id="menu" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 px-4">
            <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase mb-3">OUR MENU</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#202A36]">Made with love, baked with care.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {PRODUCTS.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100/50"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (product.name.includes("Smores")) target.src = "https://images.unsplash.com/photo-1558961312-50346c09f4d2?auto=format&fit=crop&q=80&w=800";
                      else if (product.name.includes("Red Velvet")) target.src = "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&q=80&w=800";
                      else handleImageError(e, 'cookie');
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#202A36] shadow-sm">
                    Premium
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#202A36] mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#202A36]">{formatPrice(product.price)}</span>
                    <button 
                      onClick={() => addToCart(product.id)}
                      className="p-3 bg-[#202A36] text-white rounded-full hover:bg-[#1a2229] active:scale-90 transition-all shadow-lg"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: ABOUT US ─── */}
      <section id="story" className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left — Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase mb-3">OUR STORY</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#202A36] mb-8 leading-tight">The GOMU Story:<br />Goodies & Munchies.</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  GOMU Cookies was born from a simple belief — that the best moments in life are often the sweetest ones. 
                  Guided by our playful mascot, the GOMU Poodle, we use only premium, carefully sourced ingredients to craft cookies that bring genuine joy with every bite.
                </p>
                <p>
                  From our kitchen to your door, every GOMU cookie is made with intention, warmth, and a whole lot of love.
                  Available across Jabodetabek, we're here to make your day a little more delicious with treats that are as cute as they are tasty!
                </p>
              </div>
              <button 
                onClick={() => scrollTo('menu')}
                className="mt-10 flex items-center gap-2 text-[#202A36] font-bold border-b-2 border-[#202A36] pb-1 hover:gap-3 transition-all"
              >
                Join the munchies <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* Right — Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 bg-[#FDEBD0] rounded-full blur-3xl opacity-50 -z-10" />
              <div className="bg-[#FDEBD0] rounded-full p-10 md:p-14 inline-block shadow-inner">
                <img 
                  src="logo.png" 
                  alt="GOMU Story" 
                  onError={(e) => handleImageError(e, 'logo')}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl ring-8 ring-white"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: FAQ & CONTACT ─── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase mb-3">HAVE QUESTIONS?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#202A36]">Frequently Asked</h2>
          </div>

          <div className="space-y-4 mb-24">
            <FAQItem 
              question="Bagaimana cara menyimpan GOMU Cookies?" 
              answer="Simpan dalam wadah kedap udara di suhu ruangan. Tahan hingga 5 hari. Untuk kesegaran optimal, konsumsi dalam 2 hari pertama."
            />
            <FAQItem 
              question="Area pengiriman di mana saja?" 
              answer="Kami melayani pengiriman ke seluruh wilayah Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi)."
            />
            <FAQItem 
              question="Berapa minimum order?" 
              answer="Tidak ada minimum order. Kamu bisa order dari 1 box sekalipun!"
            />
            <FAQItem 
              question="Apakah tersedia untuk acara/event?" 
              answer="Tentu! Kami menerima pesanan dalam jumlah besar untuk hampers, event kantor, dan ulang tahun. Hubungi kami via WhatsApp."
            />
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 md:p-16 text-center shadow-sm border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-[#202A36] mb-4">Find Us Here</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">Keep in touch with us for the latest menu updates and special promos!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#" 
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-gray-200 text-[#202A36] font-bold hover:border-[#202A36] hover:bg-[#202A36]/5 transition-all"
              >
                <Instagram size={20} />
                <span>Follow us</span>
              </a>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#202A36] text-white font-bold hover:bg-[#1a2229] transition-all shadow-lg"
              >
                <MessageCircle size={20} />
                <span>Chat with us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400 font-medium">
          © {new Date().getFullYear()} GOMU Cookies · Goodies & Munchies · Made with ❤️ in Jakarta
        </p>
      </footer>

      {/* ─── SECTION: CART DRAWER ─── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#202A36]">Your Cart</h2>
                  <span className="bg-[#202A36]/5 text-[#202A36] text-xs font-bold px-2 py-1 rounded-lg">{cartCount} items</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#202A36] hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length > 0 ? (
                  cart.map((item) => {
                    const product = PRODUCTS.find(p => p.id === item.productId)!;
                    return (
                      <div key={item.productId} className="flex gap-4 group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (product.name.includes("Smores")) target.src = "https://images.unsplash.com/photo-1558961312-50346c09f4d2?auto=format&fit=crop&q=80&w=800";
                              else if (product.name.includes("Red Velvet")) target.src = "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&q=80&w=800";
                              else handleImageError(e, 'cookie');
                            }}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-[#202A36] truncate pr-2">{product.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.productId)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-[#202A36] mb-4">{formatPrice(product.price)}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 bg-gray-50 rounded-full p-1 border border-gray-100">
                              <button 
                                onClick={() => updateQuantity(item.productId, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#202A36] shadow-sm hover:bg-gray-50 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.productId, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#202A36] shadow-sm hover:bg-gray-50"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-[#202A36]">{formatPrice(product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 bg-[#FFF8F3] rounded-full flex items-center justify-center text-[#202A36]/20 mb-6">
                      <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-[#202A36] mb-2">Your cart is empty</h3>
                    <p className="text-sm text-gray-500 mb-8">Looks like you haven't added any cookies to your cart yet.</p>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        scrollTo('menu');
                      }}
                      className="px-8 py-3 bg-[#202A36] text-white rounded-full font-bold shadow-lg shadow-[#202A36]/20 active:scale-95 transition-all"
                    >
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium tracking-wide">Subtotal</span>
                    <span className="text-2xl font-black text-[#202A36]">{formatPrice(cartTotal)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setCurrentPage("checkout");
                      setIsCartOpen(false);
                      window.scrollTo(0,0);
                    }}
                    className="w-full py-4 rounded-full bg-[#202A36] text-white font-bold text-lg hover:bg-[#1a2229] active:scale-[0.98] transition-all shadow-xl shadow-[#202A36]/10 flex items-center justify-center gap-3"
                  >
                    Checkout <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── HELPER COMPONENTS ───

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-100 bg-white rounded-2xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-bold text-[#202A36] md:text-lg pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[#202A36]"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-gray-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckoutPage({ cart, onBack }: { cart: CartItem[], onBack: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "QRIS"
  });

  const cartTotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const buildWhatsAppMessage = () => {
    const itemLines = cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.productId)!;
      return `• ${product.name} x${item.quantity} = ${formatPrice(product.price * item.quantity)}`;
    }).join("\n");

    const totalStr = formatPrice(cartTotal);

    return encodeURIComponent(
      `Halo GOMU Cookies! Saya ingin memesan:\n\n${itemLines}\n\nTotal: ${totalStr}\n\nData Pengiriman:\nNama: ${formData.name}\nAlamat: ${formData.address}\nNo. HP: ${formData.phone}\nMetode Pembayaran: ${formData.paymentMethod}`
    );
  };

  const isFormValid = formData.name && formData.address && formData.phone;

  return (
    <div className="min-h-screen bg-[#FFF8F3] font-sans selection:bg-[#202A36]/10 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#202A36] font-bold hover:gap-3 transition-all mb-10"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl md:text-5xl font-black text-[#202A36] mb-12">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Order Form */}
          <div className="space-y-10">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#202A36] mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#202A36] text-white flex items-center justify-center text-sm">1</span>
                Delivery Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#202A36] focus:ring-4 focus:ring-[#202A36]/5 focus:outline-none text-base transition-all bg-gray-50/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#202A36] focus:ring-4 focus:ring-[#202A36]/5 focus:outline-none text-base transition-all bg-gray-50/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Full Address</label>
                  <textarea 
                    rows={3}
                    placeholder="Street, area, city, postal code"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#202A36] focus:ring-4 focus:ring-[#202A36]/5 focus:outline-none text-base transition-all bg-gray-50/30 resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#202A36] mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#202A36] text-white flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {['QRIS', 'ShopeePay', 'GoPay', 'OVO'].map((method) => (
                  <label 
                    key={method}
                    className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === method 
                        ? 'border-[#202A36] bg-[#202A36]/5 ring-1 ring-[#202A36]' 
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      className="hidden"
                      checked={formData.paymentMethod === method}
                      onChange={() => setFormData({ ...formData, paymentMethod: method })}
                    />
                    <div className="w-12 h-8 flex items-center justify-center overflow-hidden rounded bg-white p-1">
                      <img 
                        src={`${method.toLowerCase()}.png`} 
                        alt={method}
                        className="w-full h-full object-contain"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                    <span className="font-bold text-[#202A36] text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="sticky top-12 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100/50">
              <h2 className="text-2xl font-black text-[#202A36] mb-8">Order Summary</h2>
              <div className="space-y-6 mb-8">
                {cart.map((item) => {
                  const product = PRODUCTS.find(p => p.id === item.productId)!;
                  return (
                    <div key={item.productId} className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#202A36]">{product.name}</span>
                        <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-[#202A36]">{formatPrice(product.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Total Amount</span>
                  <span className="text-3xl font-black text-[#202A36]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl flex gap-3 mb-10">
                <div className="text-orange-500 flex-shrink-0 mt-0.5">⚠️</div>
                <p className="text-xs text-orange-800 leading-relaxed">
                  Pengiriman hanya untuk area <strong>Jabodetabek</strong>. Pesanan di luar area ini akan dibatalkan secara otomatis.
                </p>
              </div>

              <a 
                href={isFormValid ? `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}` : "#"}
                onClick={(e) => !isFormValid && e.preventDefault()}
                className={`w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
                  isFormValid 
                    ? 'bg-[#25D366] text-white hover:bg-[#1ebe5d] active:scale-[0.98] shadow-[#25D366]/20' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <MessageCircle size={24} />
                <span>Order via WhatsApp</span>
              </a>
              {!isFormValid && (
                <p className="text-center text-xs text-red-400 mt-4 font-medium animate-pulse">
                  Please complete the delivery details to proceed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

