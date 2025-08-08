import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../redux/feature/products/productsSlice";
import { rupiah } from "../../utils/RupiahCurrent";
import { addCart } from "../../redux/feature/cart/cartslice";
import Swal from "sweetalert2";

export default function DetailProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.products);
    const navigate = useNavigate();

    const backIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>

    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [dispatch, id])

    if (loading) {
        return <span className="loading loading-infinity loading-xl"></span>
    }
    if (!product || error) {
        return (
            <p className="text-xl text-center">data tidak ditemukan!</p>
        )
    }
    return (
        <>
            <div>
                <button onClick={() => navigate('/')} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl flex justify-start">{backIcon}</button>
            </div>
            {loading && <span className="loading loading-spinner text-warning text-2xl"></span>}
            {!error || !loading || !product}
            <div className="max-w-6xl w-full mx-auto flex p-10 bg-white rounded shadow-md">
                <div className="flex flex-col md:flex-row gap-8">

                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <img
                            src={product.coverImage}
                            alt={product.judul}
                            className="w-full h-auto rounded object-contain"
                        />
                    </div>

                    <div className="flex flex-col w-full md:w-2xl space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.judul}</h1>
                            <p className="text-xl text-yellow-500 font-semibold mt-4">{rupiah(product.harga)}</p>
                            <span className="badge badge-primary my-4">{product.genre}</span>
                        </div>

                        <p className="text-gray-800">{product.sinopsis}</p>
                    </div>
                    <div className="flex">
                        <button
                            onClick={() => {
                                dispatch(addCart(product))
                                Swal.fire({
                                    title: "Produk berhasil ditambahkan!",
                                    icon: "success",
                                    draggable: true
                                });
                            }


                            }
                            className="btn btn-success w-[400px] flex mx-auto md:w-[50px] rounded-4xl md:rounded-lg"
                        >
                            Beli
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
