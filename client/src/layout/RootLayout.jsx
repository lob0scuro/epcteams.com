import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const RootLayout = () => {
  return (
    <>
      <Header />
      <div id="container">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" reverseOrder={true} />
    </>
  );
};

export default RootLayout;
