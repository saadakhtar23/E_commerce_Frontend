import React from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";
import Header from "./header/OrderHeader";
import SidebarButtons from "../../../Components/button/Button";
import OrderList from "./order/OrderList";

const MyOrder = () => {
  const myorder = "My Orders"

  return (
    <div>
      <Navbar />
      <Header heading={myorder} />

      <div className="flex flex-col lg:flex-row justify-center items-stretch bg-[#ECECEC] min-h-screen  ">
        <SidebarButtons />
        <OrderList />
      </div>

      <Footer />
    </div>


  );
};


export default MyOrder;
