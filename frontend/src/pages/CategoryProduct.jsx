import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCategory from "../helpers/ProductCategory.jsx";
import VerticalCardProduct from "@/components/VerticalCardProduct.jsx";
import { Context } from "@/context/ProductContext.jsx";

const CategoryProduct = () => {
  const { backendUrl } = useContext(Context);
  const navigate = useNavigate();
  const { categoryName } = useParams(); // categoryName from path

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});

  // --- Fetch products for given categories
  const fetchData = async (categories) => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/product/filter-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categories }),
      });
      const result = await res.json();
      setData(result?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Update selected categories from URL
  useEffect(() => {
    if (!categoryName) return;
    const categories = categoryName.split(",");
    const categoryObj = {};
    categories.forEach((cat) => (categoryObj[cat] = true));
    setSelectedCategory(categoryObj);
    fetchData(categories);
  }, [categoryName]);

  // --- Handle category checkbox change
  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    const updated = { ...selectedCategory, [value]: checked };
    setSelectedCategory(updated);

    const activeCategories = Object.keys(updated).filter((key) => updated[key]);
    if (activeCategories.length > 0) {
      navigate(`/product-category/${activeCategories.join(",")}`);
      fetchData(activeCategories);
    } else {
      setData([]);
    }
  };

  // --- Handle sort
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (value === "asc") setData((prev) => [...prev].sort((a, b) => a.selling - b.selling));
    if (value === "dsc") setData((prev) => [...prev].sort((a, b) => b.selling - a.selling));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="hidden lg:grid grid-cols-[220px,1fr] gap-4">
        {/* Filters */}
        <div className="bg-white p-3 min-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1">Sort by</h3>
          <div className="text-sm flex flex-col gap-2 py-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="sortBy" value="asc" checked={sortBy === "asc"} onChange={handleSortChange} />
              Price - Low to High
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="sortBy" value="dsc" checked={sortBy === "dsc"} onChange={handleSortChange} />
              Price - High to Low
            </label>
          </div>

          <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 mt-4">Category</h3>
          <div className="text-sm flex flex-col gap-2 py-3">
            {ProductCategory.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2">
                <input type="checkbox" value={cat.value} checked={!!selectedCategory[cat.value]} onChange={handleSelectCategory} />
                {cat.label}
              </label>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="px-2">
          <p className="font-medium text-slate-800 text-lg my-2">Search Results: {data.length}</p>

          <div className="min-h-[calc(100vh-120px)] overflow-y-auto">
            {loading && <p className="text-center text-slate-500">Loading...</p>}
            {!loading && data.length > 0 && <VerticalCardProduct data={data} loading={loading} />}
            {!loading && data.length === 0 && !loading && <p className="text-center text-slate-500">No products found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
