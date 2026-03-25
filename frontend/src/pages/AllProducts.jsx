"use client";

import React, { useState, useContext, useEffect } from 'react';
import { 
  FiEdit, 
  FiTrash2, 
  FiGrid, 
  FiList, 
  FiSearch,
  FiFilter,
  FiPlus,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiChevronDown,
  FiTrendingUp,
  FiBox
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import UploadProduct from '@/components/UploadProduct.jsx';
import EditProduct from '@/components/EditProduct.jsx';
import CardView from '@/components/CardView.jsx';

import { Context } from '@/context/ProductContext.jsx';

// Stats Card Component
const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative group"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="text-xl text-white" />
        </div>
      </div>
    </div>
  </motion.div>
);

// Table Row Component with hover effects
const TableRow = ({ product, index, onEdit, onDelete }) => (
  <motion.tr 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="border-b border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group"
  >
    <td className="p-4">
      <span className="text-sm font-medium text-slate-400">#{String(index + 1).padStart(3, '0')}</span>
    </td>

    <td className="p-4">
      <div className="relative">
        <img
          src={product.productImage?.[0] || '/placeholder.png'}
          alt={product.productName}
          className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
          onError={(e) => e.target.src = '/placeholder.png'}
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[10px] text-white font-bold">{product.productImage?.length || 1}</span>
        </div>
      </div>
    </td>

    <td className="p-4">
      <div>
        <p className="font-semibold text-slate-800 line-clamp-1">{product.productName}</p>
        <p className="text-xs text-slate-500 mt-0.5">ID: {product._id?.slice(-8).toUpperCase()}</p>
      </div>
    </td>

    <td className="p-4">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
        <FiTag className="text-xs" />
        {product.brandName}
      </span>
    </td>

    <td className="p-4">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
        <FiLayers className="text-xs" />
        {product.category}
      </span>
    </td>

    <td className="p-4">
      <div className="flex flex-col">
        <span className="font-bold text-slate-800">KES {Number(product.selling).toLocaleString()}</span>
        <span className="text-xs text-slate-400 line-through">KES {Number(product.price).toLocaleString()}</span>
      </div>
    </td>

    <td className="p-4">
      <div className="flex items-center gap-1 text-emerald-600">
        <FiTrendingUp className="text-sm" />
        <span className="font-bold">KES {Number(product.selling).toLocaleString()}</span>
      </div>
    </td>

    <td className="p-4">
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(product)}
          className="p-2.5 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
          title="Edit Product"
        >
          <FiEdit size={16} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(product._id)}
          className="p-2.5 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-200"
          title="Delete Product"
        >
          <FiTrash2 size={16} />
        </motion.button>
      </div>
    </td>
  </motion.tr>
);

const AllProducts = () => {
  const { toast, backendUrl } = useContext(Context);

  // STATE
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // FETCH PRODUCTS
  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/product/all-products`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => { 
    fetchAllProducts(); 
  }, []);

  // FILTERED PRODUCTS
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // UNIQUE CATEGORIES
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // EDIT HANDLER
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditProduct(true);
  };

  // DELETE HANDLER
  const handleDelete = async (productId) => {
  if (!window.confirm("Do you want to delete this Product?")) {
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/product/delete-product/${productId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
      // Remove body, or keep empty - DELETE requests usually don't have bodies
    });

    const responseData = await response.json();
    
    if (response.ok) {
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success(responseData.message || "Product deleted successfully"); // Note: backend sends 'message', not 'success'
    } else {
      toast.error(responseData.message || "Failed to delete product"); // Note: backend sends 'message'
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Network error while deleting");
  }
};
  // STATS
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6">
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Products Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage your inventory and product listings</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenUploadProduct(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 font-medium hover:shadow-xl transition-all"
          >
            <FiPlus className="text-lg" />
            Add Product
          </motion.button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard 
            title="Total Products" 
            value={totalProducts.toLocaleString()} 
            icon={FiBox}
            trend="+12 this week"
            color="from-blue-500 to-indigo-600"
            delay={0}
          />
          <StatCard 
            title="Inventory Value" 
            value={`KES ${totalValue.toLocaleString()}`} 
            icon={FiDollarSign}
            trend="+8.5%"
            color="from-emerald-500 to-teal-600"
            delay={0.1}
          />
          <StatCard 
            title="Categories" 
            value={categoriesCount} 
            icon={FiLayers}
            trend="Active"
            color="from-purple-500 to-pink-600"
            delay={0.2}
          />
        </div>

        {/* CONTROLS BAR */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            
            {/* SEARCH & FILTER */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
              
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-12 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none cursor-pointer min-w-[180px]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'card'
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <FiGrid />
                Cards
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <FiList />
                Table
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MODALS */}
      <AnimatePresence>
        {openUploadProduct && (
          <UploadProduct onClose={() => setOpenUploadProduct(false)} />
        )}

        {openEditProduct && selectedProduct && (
          <EditProduct
            product={selectedProduct}
            onClose={() => {
              setOpenEditProduct(false);
              setSelectedProduct(null);
              fetchAllProducts();
            }}
          />
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <AnimatePresence mode="wait">
            {viewMode === 'card' ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardView
                  products={filteredProducts}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      <tr>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">#</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">Product</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">Name</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">Brand</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">Category</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">Price</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">Selling</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.map((product, index) => (
                        <TableRow
                          key={product._id}
                          product={product}
                          index={index}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <FiPackage className="text-slate-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {searchTerm || categoryFilter !== 'all' ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'Get started by adding your first product to the inventory.'}
            </p>
            {(searchTerm || categoryFilter !== 'all') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
                className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-600 rounded-xl font-medium hover:bg-indigo-200 transition-colors"
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div> 
  );
};

export default AllProducts;