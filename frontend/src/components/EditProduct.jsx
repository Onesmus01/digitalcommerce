import React, { useState } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";
import productCategories from "@/helpers/ProductCategory.jsx";
import UploadImage from "@/helpers/UploadImage.jsx";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const EditProduct = ({ onClose, product }) => {
  const [data, setData] = useState({
    productId: product?._id?.toString() || "",
    productName: product?.productName || "",
    brandName: product?.brandName || "",
    category: product?.category || "",
    productImage: product?.productImage || [],
    description: product?.description || "",
    price: product?.price || "",
    selling: product?.selling || "",
  });

  // HANDLE IMAGE UPLOAD (UP TO 4)
  const handleUploadProductChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (data.productImage.length + files.length > 20) {
      toast.error("You can upload up to 20 images only");
      return;
    }

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await UploadImage(file);
        uploadedUrls.push(url);
      }
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed");
    }
  };

  // REMOVE IMAGE
  const handleRemoveImage = (index) => {
    setData((prev) => ({
      ...prev,
      productImage: prev.productImage.filter((_, i) => i !== index),
    }));
  };

  // HANDLE FORM INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.productId) return toast.error("Invalid product ID");

    try {
      const response = await fetch(`${backendUrl}/product/update-product`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: data.productId,
          productName: data.productName,
          brandName: data.brandName,
          category: data.category,
          productImage: data.productImage,
          description: data.description,
          price: Number(data.price),
          selling: Number(data.selling),
        }),
      });
      const resData = await response.json();
      if (response.ok) {
        toast.success(resData.message);
        window.location.reload();
      } else {
        toast.error(resData.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Product</h2>
            <p className="text-sm text-slate-500">Edit product from your store</p>
          </div>
          <FiX
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-red-500 cursor-pointer"
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[85vh] overflow-y-auto">
          {/* BASIC INFO */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={data.productName}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={data.brandName}
                  onChange={handleChange}
                  placeholder="Brand Name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
            </div>
          </section>

          {/* CATEGORY */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase">Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {productCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setData((prev) => ({ ...prev, category: cat.value }))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium border transition
                    ${data.category === cat.value
                      ? "bg-blue-500 text-white/90 border-blue-600 shadow"
                      : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {data.category && (
              <p className="text-xs text-black">
                Selected: <span className="font-semibold text-black">{data.category}</span>
              </p>
            )}
          </section>

          {/* IMAGE UPLOAD */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase">Media</h3>
            <div className="relative w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Images (max 4)</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg py-10 cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                <FiUploadCloud className="text-indigo-600 text-4xl mb-2" />
                <span className="text-sm text-slate-700">Select Files</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadProductChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {data.productImage.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {data.productImage.map((imgUrl, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img
                        src={imgUrl}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase">Description</h3>
            <textarea
              rows="4"
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Write a clear description of your product..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </section>

          {/* PRICING */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={handleChange}
                placeholder="Original Price (KES)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
              <input
                type="number"
                name="selling"
                value={data.selling}
                onChange={handleChange}
                placeholder="Selling Price (KES)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
