import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { id: 1, name: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', category: 'Sport' },
  { id: 2, name: 'Adidas', image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=300&h=300&fit=crop', category: 'Sport' },
  { id: 3, name: 'Apple', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&h=300&fit=crop', category: 'Tech' },
  { id: 4, name: 'Samsung', image: 'https://images.unsplash.com/photo-1610945265078-3858a0828671?w=300&h=300&fit=crop', category: 'Tech' },
  { id: 5, name: 'Sony', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop', category: 'Audio' },
  { id: 6, name: 'Gucci', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop', category: 'Luxury' },
  { id: 7, name: 'Zara', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop', category: 'Fashion' },
  { id: 8, name: 'H&M', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=300&fit=crop', category: 'Fashion' },
];

const BrandProducts = () => {
  return (
    <section className="w-full py-4 sm:py-6 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3 sm:mb-4"
        >
          <h2 className="text-sm sm:text-lg font-bold text-white mb-1 tracking-wide">
            SELECT BY BRANDS
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto" />
        </motion.div>

        {/* Compact 8-Grid */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-md sm:rounded-lg border border-gray-600 hover:border-white transition-all duration-200 overflow-hidden shadow-md hover:shadow-xl">
                {/* Compact Image Container - Better visibility */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  {/* Tiny category badge */}
                  <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1">
                    <span className="text-[6px] sm:text-[8px] font-semibold text-white bg-black/70 px-1 py-0.5 rounded">
                      {brand.category}
                    </span>
                  </div>
                </div>

                {/* Compact Brand Name */}
                <div className="py-1 sm:py-1.5 text-center bg-white">
                  <h3 className="text-[8px] sm:text-[10px] font-bold text-gray-900 truncate px-1">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandProducts;
