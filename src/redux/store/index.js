import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../feature/cart/cartslice'
import productsSlice  from '../feature/products/productsSlice'

export default configureStore({
    reducer: {
        cart: cartReducer,
        products: productsSlice
    }
})