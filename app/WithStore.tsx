"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/store/index";



interface WithStoreProps {
  children: ReactNode;
}

const WithStore = ({ children }: WithStoreProps) => {
  return (
    <div className="h-screen flex flex-col">
      <Provider store={store}>{children}</Provider>
    </div>
  );
};


export default WithStore;
