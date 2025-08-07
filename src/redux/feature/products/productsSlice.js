import { createSlice } from '@reduxjs/toolkit'
import { db } from '../../../config/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';

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
            state.products = action.payload.products;
            state.totalPage = action.payload.totalPage;
            state.loading = false;
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

export const fetchProducts = ( {genre="", kategori='', sort='', page= 1, pageSize= 8} ) => async (dispatch) => {
    try {
        dispatch(fetchPending());
        let q = collection(db, 'products');

        if (genre && kategori) {
            q = query(q, where('genre', '==', genre), where('kategori', '==', kategori));
        } else if (genre) {
            q = query(q, where('genre', '==', genre));
        }else if (kategori) {
            q = query(q, where('kategori', "==", kategori));
        }

        if (sort === 'price-asc') {
            q = query(q, orderBy('harga', 'asc'));
        } else if (sort === 'price-desc') {
            q = query(q, orderBy('harga', 'desc'));
        } else {
            q = query(q, orderBy('createdAt', 'desc'));
        }

        const totalSnap = await getDocs(q);
        const totalItems = totalSnap.size;
        const totalPage = Math.ceil(totalItems / pageSize);

        if (page > 1) {
            const prevSnap = await getDocs(query(q, limit((page-1) * pageSize)));
            const lastVisible = prevSnap.docs.at(-1);
            const q = query(q, startAfter(lastVisible), limit(pageSize));
        } else {
            q = query(q, limit(pageSize))
        }
        const snapShot = await getDocs(q);
        const products = snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toString() || null,
        }));
        dispatch(fetchProductsSuccess( {products, totalPage} ))
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
            dispatch(fetchProductSuccess({
                id: docSnap.id,
                judul: docSnap.data().judul,
                author: docSnap.data().author,
                coverImage: docSnap.data().coverImage,
                genre: docSnap.data().genre,
                harga: docSnap.data().harga,
                penerbit: docSnap.data().penerbit,
                sinopsis: docSnap.data().sinopsis,
                tahunTerbit: docSnap.data().tahunTerbit,
                stok: docSnap.data().stok,
                kategori: docSnap.data().kategori,
            }));
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

export const updateProduct = ({id, updateData}) => async (dispatch) => {
    try {
        dispatch(fetchPending());
        const docRef = doc(db, 'products', id);
        console.log("Data yang dikirim:", updateData);
        await updateDoc(docRef, updateData);
        dispatch(fetchProducts());
    } catch (error) {
        dispatch(fetchReject(error.message));
    }
};
export default productsSlice.reducer;