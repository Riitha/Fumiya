import { createSlice } from '@reduxjs/toolkit'
import { db } from '../../../config/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, updateDoc } from 'firebase/firestore';

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
};

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload;
        },
        fetchProductSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload;
        },
        fetchReject: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchPending, fetchProductSuccess, fetchProductsSuccess, fetchReject } = productsSlice.actions;

export const fetchProducts = () => async (dispatch) => {
    try {
        dispatch(fetchPending());
        const querySnapshot = await getDocs(collection(db, 'products'), orderBy('createAt', 'desc'));
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        dispatch(fetchProductsSuccess(data))
    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export const fetchProductById = (id) => async (dispatch) => {
    try {
        dispatch(fetchPending());
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            dispatch(fetchProductSuccess({ id: docSnap.id, ...docSnap.data()}));
        } else {
            dispatch(fetchReject('product not found'));
        }
    } catch (error) {
        dispatch(fetchReject(error.message));
    }
}

export const addProduct = (newProduct) => async (dispatch) => {
    try {
        dispatch(fetchPending());
        await addDoc(collection(db, 'products'), newProduct);
        dispatch(fetchProducts())
    } catch (error) {
        dispatch(fetchReject(error.message));
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch(fetchPending());
        await deleteDoc(doc(db, 'products', id));
        dispatch(fetchProducts());
    } catch (error) {
        dispatch(fetchReject(error.message))
    }
}

export const updateProduct = (id, updateData) => async (dispatch) => {
    try {
        dispatch(fetchPending());
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, updateData);
        dispatch(fetchProducts());
    } catch (error) {
        dispatch(fetchReject(error.message));
    }
};
export default productsSlice.reducer;