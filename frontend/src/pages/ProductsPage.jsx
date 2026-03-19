import React from 'react'
import HorizontalCardProduct from '@/components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '@/components/VerticalCardProduct.jsx'
import VerticalProductStyle from '@/components/VerticalProductStyle.jsx'
import NewArrivals from "@/components/NewArrivals";
import SEO from '@/components/Seo.jsx';


const ProductsPage = () => {
  return (
    <div>
      <SEO 
        title="All Products | Digital Commerce Platform"
        description="Explore a wide range of products including electronics, appliances, and accessories. Shop online with real-time updates and exclusive offers."
        url="/all-products"
        image="https://yourwebsite.com/default-image.jpg"
      />
      <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"}  />
      <NewArrivals category={"televisions"} heading={"New Arrivals "} />
      
      <HorizontalCardProduct category={"watches"} heading={"Popular Watches"} />
      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />
      <VerticalCardProduct category={"mouse"} heading={"Clickable Mouse"} />
      <VerticalCardProduct category={"televisions"} heading={"Televisions,(All inches available)"} />
      <VerticalCardProduct category={"camera"} heading={"Digital Cameras,Experience the beauty of photoshoot"} />
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"} />
      <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers,Our offers have a premium price as we  enjoy black Friday"} />
      <VerticalCardProduct category={"refrigerators"} heading={"High Quality Refrigerators"} />
      <VerticalCardProduct category={"trimmers"} heading={"Fast Trimmers"} />
      <VerticalProductStyle category={"televisions"} heading={"Laptops,Get the best laptops in the market"} />
   
    </div>
  )
}

export default ProductsPage
