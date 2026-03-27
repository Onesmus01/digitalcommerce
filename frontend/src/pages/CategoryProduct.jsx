import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "@/context/ProductContext.jsx";
import { 
  FaStar, 
  FaHeart, 
  FaShoppingCart,
  FaFire,
  FaPercentage,
  FaFilter,
  FaTimes,
  FaChevronDown
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { Link } from 'react-router-dom';

// Ultra-compact Product Card - 3 per row
const ProductCard = ({ product, index, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className="group relative bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Image - Square, compact */}
        <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          <img
            src={product?.productImage?.[0]}
            alt={product?.productName}
            className="w-full h-full object-contain p-1.5"
            loading="lazy"
          />
          
          {/* Discount Badge - Micro */}
          {discount > 0 && (
            <div className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">
              -{discount}%
            </div>
          )}
          
          {/* Fire Badge - Micro */}
          <div className="absolute top-1 right-1">
            <div className="bg-amber-400 text-white p-0.5 rounded-sm">
              <FaFire size={7} />
            </div>
          </div>
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`absolute bottom-1 right-1 p-1 rounded-full shadow-sm transition-colors ${
              isLiked ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-400'
            }`}
          >
            <FaHeart size={8} />
          </button>
        </div>

        {/* Content - Minimal */}
        <div className="p-1.5">
          {/* Category */}
          <span className="text-[8px] font-medium text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded block w-fit mb-1 truncate max-w-[90%]">
            {product?.category}
          </span>
          
          {/* Name - 2 lines max */}
          <h3 className="font-semibold text-slate-800 text-[10px] leading-tight mb-1 line-clamp-2 min-h-[28px]">
            {product?.productName}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-1">
            <FaStar className="text-amber-400 text-[7px]" />
            <span className="text-[8px] text-slate-500">4.5</span>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-xs font-bold text-slate-900">
              {displayKESCurrency(product?.selling)}
            </span>
            {product?.price > product?.selling && (
              <span className="text-[8px] text-slate-400 line-through">
                {displayKESCurrency(product?.price)}
              </span>
            )}
          </div>
          
          {/* Add Button - Icon only on tiny screens */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(e, product?._id);
            }}
            className="w-full bg-indigo-600 active:bg-indigo-700 text-white text-[9px] font-semibold py-1.5 rounded flex items-center justify-center gap-1"
          >
            <FaShoppingCart size={9} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

// 3-Column Grid
const ProductGrid = ({ data, loading, onAddToCart }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-slate-200" />
            <div className="p-1.5 space-y-1">
              <div className="h-1.5 bg-slate-200 rounded w-2/3" />
              <div className="h-2.5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 mx-auto mb-2 bg-slate-100 rounded-full flex items-center justify-center">
          <FaShoppingCart className="text-slate-300 text-sm" />
        </div>
        <p className="text-slate-400 text-xs">No products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {data.map((product, index) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          index={index}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

// Compact Category Item
const CategoryItem = ({ cat, isSelected, onChange, index }) => (
  <motion.label 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.01 }}
    className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${
      isSelected ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'
    }`}
  >
    <input 
      type="checkbox" 
      value={cat.category} 
      checked={isSelected}
      onChange={onChange}
      className="sr-only"
    />
    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
      isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
    }`}>
      {isSelected && <FaTimes size={7} className="text-white rotate-45" />}
    </div>
    
    <div className="w-6 h-6 rounded overflow-hidden bg-slate-100 flex-shrink-0">
      <img src={cat.productImage} alt="" className="w-full h-full object-contain p-0.5" loading="lazy" />
    </div>
    
    <span className={`text-[11px] flex-1 truncate ${isSelected ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>
      {cat.category}
    </span>
  </motion.label>
);

const CategoryProduct = () => {
  const { backendUrl, addToCart, fetchCountCart } = useContext(Context);
  const navigate = useNavigate();
  const { categoryName } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    if (addToCart) {
      await addToCart(e, id);
      fetchCountCart?.();
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(`${backendUrl}/product/get-product-category`, { credentials: 'include' });
      const res = await response.json();
      if (res.success) setCategories(res.data || []);
    } catch (error) { console.error(error); }
    finally { setCategoriesLoading(false); }
  };

  const fetchData = async (cats) => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/product/filter-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cats }),
      });
      const result = await res.json();
      setData(result?.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (!categoryName) return;
    const cats = categoryName.split(",");
    const obj = {};
    cats.forEach((c) => obj[c] = true);
    setSelectedCategory(obj);
    fetchData(cats);
  }, [categoryName, backendUrl]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    const updated = { ...selectedCategory, [value]: checked };
    setSelectedCategory(updated);
    const active = Object.keys(updated).filter((k) => updated[k]);
    if (active.length) navigate(`/product-category/${active.join(",")}`);
    else setData([]);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setShowSort(false);
    if (val === "asc") setData((p) => [...p].sort((a, b) => a.selling - b.selling));
    else if (val === "dsc") setData((p) => [...p].sort((a, b) => b.selling - a.selling));
  };

  const activeFiltersCount = Object.values(selectedCategory).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Sticky Header - Compact */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-slate-800 text-sm">Products</h1>
            <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
              {data.length}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Sort Button */}
            <button
              onClick={() => setShowSort(true)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-colors ${
                sortBy ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Sort
              <FaChevronDown size={8} />
            </button>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-1 px-2 py-1.5 bg-indigo-600 text-white text-[10px] font-semibold rounded-md active:scale-95 transition-transform"
            >
              <FaFilter size={9} />
              {activeFiltersCount > 0 && (
                <span className="bg-white text-indigo-600 text-[8px] font-bold px-1 rounded">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Active Filters - Horizontal scroll */}
        {categoryName && (
          <div className="flex gap-1 mt-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {categoryName.split(',').map((cat, idx) => (
              <span 
                key={idx} 
                className="flex-shrink-0 inline-flex items-center gap-1 text-[9px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100"
              >
                {cat.length > 12 ? cat.slice(0, 12) + '...' : cat}
                <button 
                  onClick={() => {
                    const updated = { ...selectedCategory };
                    delete updated[cat];
                    setSelectedCategory(updated);
                    const active = Object.keys(updated).filter((k) => updated[k]);
                    if (active.length) navigate(`/product-category/${active.join(",")}`);
                    else { navigate('/product-category/'); setData([]); }
                  }}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  <FaTimes size={6} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Categories - Horizontal scroll */}
      {!categoriesLoading && categories.length > 0 && (
        <div className="bg-white border-b border-slate-200 px-2 py-1.5">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => {
                  const isSel = selectedCategory[cat.category];
                  const updated = { ...selectedCategory, [cat.category]: !isSel };
                  setSelectedCategory(updated);
                  const active = Object.keys(updated).filter((k) => updated[k]);
                  if (active.length) navigate(`/product-category/${active.join(",")}`);
                }}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 p-1 rounded-md min-w-[52px] transition-all ${
                  selectedCategory[cat.category] 
                    ? 'bg-indigo-50 ring-1 ring-indigo-500' 
                    : 'bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 rounded overflow-hidden bg-white shadow-sm">
                  <img src={cat.productImage} alt="" className="w-full h-full object-contain p-0.5" loading="lazy" />
                </div>
                <span className={`text-[8px] font-medium text-center truncate max-w-[48px] ${
                  selectedCategory[cat.category] ? 'text-indigo-700' : 'text-slate-600'
                }`}>
                  {cat.category.length > 8 ? cat.category.slice(0, 8) + '..' : cat.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products - 3 per row */}
      <div className="p-1.5">
        <ProductGrid data={data} loading={loading} onAddToCart={handleAddToCart} />
      </div>

      {/* Sort Bottom Sheet */}
      <AnimatePresence>
        {showSort && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSort(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 overflow-hidden"
            >
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-slate-300 rounded-full" />
              </div>
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Sort By</h3>
                <button onClick={() => setShowSort(false)} className="p-1.5 hover:bg-slate-100 rounded-full">
                  <FaTimes size={14} className="text-slate-500" />
                </button>
              </div>
              <div className="p-2">
                {[
                  { val: '', label: 'Default' },
                  { val: 'asc', label: 'Price: Low to High' },
                  { val: 'dsc', label: 'Price: High to Low' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => handleSortChange(opt.val)}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium mb-1 transition-all ${
                      sortBy === opt.val
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.val && <span className="float-right text-indigo-600">✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Filter Bottom Sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-slate-300 rounded-full" />
              </div>
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-slate-100 rounded-full">
                  <FaTimes size={14} className="text-slate-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</h4>
                  <span className="text-[9px] text-slate-400">{categories.length}</span>
                </div>
                
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 animate-pulse">
                        <div className="w-6 h-6 bg-slate-200 rounded" />
                        <div className="h-2.5 bg-slate-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {categories.map((cat, idx) => (
                      <CategoryItem
                        key={cat.category}
                        cat={cat}
                        isSelected={!!selectedCategory[cat.category]}
                        onChange={handleSelectCategory}
                        index={idx}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory({});
                        navigate('/product-category/');
                        setData([]);
                      }}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-[2] py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
                  >
                    Show {data.length}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CategoryProduct;