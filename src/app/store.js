import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./reducer/wishlist-reducer";
import thunk from 'redux-thunk';

export default configureStore({
    reducer:{
        wishlist:wishlistReducer
    },
    middleware: [thunk]
})