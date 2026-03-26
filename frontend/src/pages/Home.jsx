import React from 'react'
import Header from '@/components/Header.jsx'
import CategoryList from '@/components/CategoryList.jsx'
import BannerProduct from '@/components/BannerProduct.jsx'
import HorizontalCardProduct from '@/components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '@/components/VerticalCardProduct.jsx'
import MultiCategoryConveyor from '@/components/MultiCategoryConveyor.jsx'
import VerticalProductStyle from '@/components/VerticalProductStyle.jsx'
import NewArrivals from "@/components/NewArrivals";
import { Helmet } from 'react-helmet-async';
import ColumnProducts from '@/components/ColumnProducts.jsx'
import BrandProducts from '@/components/BrandProducts.jsx'
const categories = ["televisions", "refrigerators", "watches"];

const Home = () => {
  return (
    <div>
      <Helmet>
        {/* Primary SEO */}
        <title>Digital Commerce Platform</title>
        <meta 
          name="description" 
          content="Explore a wide range of products including electronics, appliances, and accessories. Enjoy seamless online shopping with real-time updates." 
        />
        <link rel="canonical" href="https://digitalcommerce-whua.onrender.com" />

        {/* Open Graph (Facebook, Instagram, WhatsApp) */}
        <meta property="og:title" content="Digital Commerce Platform" />
        <meta property="og:description" content="Shop electronics, appliances, and more with a seamless experience." />
        <meta property="og:image" content="https://example.com/your-image.jpg" />
        <meta property="og:url" content="https://localhost:5173" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Digital Commerce Platform" />
        <meta name="twitter:description" content="Shop electronics, appliances, and more with ease." />
        <meta name="twitter:image" content="https://example.com/your-image.jpg" />
      </Helmet>

      {/* UI Components */}
      {/* <Header /> */}
      <CategoryList />
      <BannerProduct />
      <BrandProducts />
      <ColumnProducts category={"earphones"} heading={"Decorated Seasonal Offers"} />

      <MultiCategoryConveyor categories={categories} />
      <ColumnProducts category={"camera"} heading={"High contrast visionaries"} />


      <HorizontalCardProduct category={"airpodes"} heading={"Top Airpods"} />
      <NewArrivals category={"televisions"} heading={"New Arrivals"} />
      <VerticalProductStyle category={"televisions"} heading={"Latest Best Deals "} />

      <HorizontalCardProduct category={"watches"} heading={"Popular Watches"} />
      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />
      <VerticalCardProduct category={"mouse"} heading={"Computer Mouse"} />
      <VerticalCardProduct category={"televisions"} heading={"Televisions (All Sizes Available)"} />
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"} />
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"} />
      <VerticalCardProduct category={"refrigerators"} heading={"Refrigerators"} />
      <VerticalCardProduct category={"trimmers"} heading={"Trimmers"} />

    </div>
  )
}

export default Home