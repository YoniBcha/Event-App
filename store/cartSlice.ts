// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: {
    bookingData?: any;
    selectedDesignId?: any[]; // Changed from selectedDesignId
    selectedPackageId?: any[];
    eventPackageAdditions?: any[];
    extraServices?: any;
    personalData?: any;
    payload?: any;
  };
  visible: boolean;
}

const initialState: CartState = {
  items: {},
  visible: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCart: (
      state,
      action: PayloadAction<{ items: any; visible: boolean }>
    ) => {
      state.items = action.payload.items;
      state.visible = action.payload.visible;
    },
    clearCart: () => {
      // Clear both Redux and sessionStorage
      sessionStorage.clear();
      sessionStorage.setItem("bookingCompleted", "true");
      return initialState;
    },
    toggleCart: (state) => {
      state.visible = !state.visible;
    },
  },
});

export const { updateCart, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
