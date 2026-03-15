import React from 'react'
import HorizontalCardProduct from '@/components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '@/components/VerticalCardProduct.jsx'
import VerticalProductStyle from '@/components/VerticalProductStyle.jsx'
import NewArrivals from "@/components/NewArrivals";


const ProductsPage = () => {
  return (
    <div>
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
