import React from 'react'
import Header from'@/components/Header.jsx'
import CategoryList from '@/components/CategoryList.jsx'
import BannerProduct from '@/components/BannerProduct.jsx'
import HorizontalCardProduct from '@/components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '@/components/VerticalCardProduct.jsx'
import ConveyorBelt from '@/components/ConveyorBelt.jsx'
import MultiCategoryConveyor from '@/components/MultiCategoryConveyor.jsx'
import VerticalProductStyle from '@/components/VerticalProductStyle.jsx'

const categories = ["televisions", "refrigerators", "watches"];

const Home = () => {

  return (
    <div>

      <CategoryList />
      {/* <ConveyorBelt category={"televisions"}/> */}
      <BannerProduct />
              <MultiCategoryConveyor categories={categories} />

      <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"}  />
      
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

export default Home