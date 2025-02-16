"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/store/index";

import Footer from "@/components/footer";
import Header from "@/components/header";

interface WithStoreProps {
  children: ReactNode;
}

const WithStore = ({ children }: WithStoreProps) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Provider store={store}>{children}</Provider>
      <Footer />
    </div>
  );
};


export default WithStore;
