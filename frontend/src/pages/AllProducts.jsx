"use client";

import React, { useState, useContext, useEffect } from 'react';
import { FiEdit, FiTrash2, FiGrid, FiList, FiUpload } from 'react-icons/fi';

import UploadProduct from '@/components/UploadProduct.jsx';
import EditProduct from '@/components/EditProduct.jsx';
import CardView from '@/components/CardView.jsx';

import { Context } from '@/context/ProductContext.jsx';

const AllProducts = () => {
  const { toast, backendUrl } = useContext(Context);

  // STATE
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('card');

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

  useEffect(() => { fetchAllProducts(); }, []);

  // EDIT HANDLER
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditProduct(true);
  };

  // DELETE HANDLER
  const handleDelete = (id) => { toast.info(`Delete product ${id}`); };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-7 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Products Dashboard
        </h2>

        <div className="flex items-center gap-3">
          {/* VIEW SWITCH */}
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-lg transition text-lg ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Card View"
          >
            <FiGrid />
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition text-lg ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Table View"
          >
            <FiList />
          </button>

          {/* UPLOAD */}
          <button
            onClick={() => setOpenUploadProduct(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow font-medium transition"
          >
            <FiUpload />
            Upload Product
          </button>
        </div>
      </div>

      {/* MODALS */}
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

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto">
        {products.length > 0 ? (
          viewMode === 'card' ? (
            <CardView
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Brand</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Selling</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p, i) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="p-3">{i + 1}</td>

                      <td className="p-3">
                        <img
                          src={p.productImage?.[0]}
                          alt={p.productName}
                          className="w-12 h-12 rounded-lg object-contain shadow-sm"
                        />
                      </td>

                      <td className="p-3 font-semibold text-gray-800">{p.productName}</td>
                      <td className="p-3 text-gray-600">{p.brandName}</td>
                      <td className="p-3 text-gray-600">{p.category}</td>
                      <td className="p-3 font-medium text-gray-800">KES {p.price}</td>
                      <td className="p-3 font-medium text-green-600">KES {p.selling}</td>

                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 bg-yellow-400 rounded-lg text-white hover:bg-yellow-500 shadow-md transition"
                          title="Edit Product"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 shadow-md transition"
                          title="Delete Product"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <p className="text-center text-gray-400 mt-32 text-lg">
            No products available yet
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;