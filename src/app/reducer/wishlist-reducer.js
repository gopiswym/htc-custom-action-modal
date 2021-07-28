import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchWishlistCateogory = createAsyncThunk(
    'wishlist/fetchWishlistCateogory',
    async () => {
        return await new Promise((resolve, reject)=>{
            window._swat.fetchLists({
                callbackFn: (list)=>{
                    console.log('fetch wihslist category list', list);
                    resolve(list);
                },
                errorFn:(error)=>{
                    reject(error);
                }
            });
        });
    }
)

export const fetchWishList = createAsyncThunk(
    'wishlist/fetchWishList',
    async (payload) => {
        console.log('fetchwishlist payload ', payload);
        let {lid} = payload;
        return await new Promise((resolve, reject)=>{
            window._swat.fetchListCtx({lid}, async(lists) => {
                console.log("Fetched product lists", lists);
                resolve(lists);
            })
        });
    }
)

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState:{
        wishlist:[],
        wishlistCategory:[]
    },
    reducers:{
    },
    extraReducers:{
        [fetchWishlistCateogory.fulfilled]:(state, action) =>{
            console.log('on action response', action);
            state.wishlistCategory = action.payload;
        },
        [fetchWishList.fulfilled]:(state, action) =>{
            console.log('on action response', action);
            state.wishlist = action.payload;
        }
    }
});

export const { fetchCategoryList, setWishlistCateogry } = wishlistSlice.actions;

export default wishlistSlice.reducer;