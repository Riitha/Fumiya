import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState:{
        items: [],
    },
    reducers: {
        addCart: (state, action) => {
            const existing = state.items.find((item) => item.id === action.payload.id);

            if (!existing) {
                state.items.push({...action.payload, qty: 1});
            } else if (existing.qty < action.payload.stok) {
                existing.qty += 1;
            }
        },
        incrementQty: (state, action) => {
            const item = state.items.find((item)=> item.id === action.payload)
            if (item && item.qty < item.stok) {
                item.qty += 1;
            }
        },
        decrementQty: (state, action) => {
            const item = state.items.find((item)=> item.id === action.payload)
            if (item && item.qty > 1) {
                item.qty -= 1;
            } 
        },
        removeCart: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload)
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { addCart, clearCart, incrementQty, decrementQty, removeCart } = cartSlice.actions
export default cartSlice.reducer;