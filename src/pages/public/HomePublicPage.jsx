import { useEffect, useState } from "react";
import { rupiah } from "../../utils/RupiahCurrent";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../../redux/feature/cart/cartslice";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../redux/feature/products/productsSlice";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router";

export default function HomePublicPage() {
    const [filterGenre, setFilterGenre] = useState('');
    const [filterKategori, setFilterKategori] = useState('')
    const [sort, setSort] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products, totalPage, loading } = useSelector((state) => state.products)
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_LIMIT = 8;

    const [searchTerm, setSearchTerm] = useState('');
    const renderProduct = searchTerm ? products.filter((p) => p.judul.toLowerCase().includes(searchTerm.toLowerCase())) : products;

    useEffect(() => {
        if (currentPage > totalPage) {
            setCurrentPage(1)
        }
    }, [totalPage, currentPage])

    useEffect(() => {
        dispatch(fetchProducts({
            genre: filterGenre,
            kategori: filterKategori,
            sort,
            page: currentPage,
            pageSize: PAGE_LIMIT
        }))
    }, [dispatch, filterGenre, filterKategori, sort, currentPage])

    function handlePrevPage() {
        if (currentPage > 1) {
            setCurrentPage((prevState) => prevState - 1);
        }
    }

    function handleNextPage() {
        if (currentPage < totalPage) {
            setCurrentPage((prevState) => prevState + 1);
        }
    }

    const handleClearFilterSort = async () => {
        setFilterGenre('');
        setSort('');
        setFilterKategori('')
    }
    if (loading) return <span className="loading loading-infinity loading-xl"></span>

    return (
        <>
            <main className="w-full min-h-screen box-border bg-desert">
                <div className="flex justify-center">
                    <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
                </div>
                <div className="flex gap-2 items-center w-full justify-center ">
                    <fieldset className="fieldset">
                        <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="select bg-coral">
                            <option value='' disabled={true}>pilih genre</option>
                            <option value="fantasi">fantasi</option>
                            <option value="romance">romance</option>
                            <option value="komedi">komedi</option>
                            <option value="slice of life">slice of life</option>
                            <option value="aksi">aksi</option>
                            <option value="sci-fi">sci-fi</option>
                            <option value="horor">horor</option>
                            <option value="isekai">isekai</option>
                            <option value="supranatural">supranatural</option>
                            <option value="boys love">boy's love</option>
                            <option value="girls love">girl's love</option>
                            <option value="shounen manga">shounen manga</option>
                            <option value="dansei manga">dansei manga</option>
                            <option value="shoujo manga">shoujo manga</option>
                            <option value="josei manga">josei manga</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="select bg-coral">
                            <option value='' disabled={true}>jenis buku</option>
                            <option value="manga">manga</option>
                            <option value="light novel">light novel</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="select bg-coral">
                            <option value='' disabled={true}>urutkan berdasarkan</option>
                            <option value='price-asc' >paling murah</option>
                            <option value='price-desc'>paling mahal</option>
                            <option value='terbitan-lama'>Terlama</option>
                            <option value='terbitan-terbaru'>Terbaru</option>
                        </select>
                    </fieldset>

                    <button onClick={handleClearFilterSort} className="btn btn-secondary">clear filter</button>
                    <button onClick={() => navigate("/admin/add")} className="btn btn-info">Tambah Produk</button>
                </div>

                <div className="flex justify-center sm:w-[90%] md:w-[80%] my-2 mx-auto">
                    <h1 className="rounded-2xl p-1 text-center text-sm sm:text-md md:text-lg w-[50%] sm:w-[40%] md:w-[10%] border bg-malibu">HOME</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl w-full mx-auto sm:p-8 md:p-8 lg:p-4 bg-redDamask rounded">

                    {(renderProduct.length === 0 ?
                        <div className="text-md text center">
                            Belum ada produk!
                        </div> : renderProduct.map((p) => (
                            <div key={p.id} className="card w-full sm:w-[320px] md:w-[300px] lg:w-[300px] bg-white/80 h-auto shadow-sm">
                                <div className="card-body">
                                    <Link to={`/admin/detail/${p.id}`}>
                                        <figure className="h-[280px] w-full flex justify-center items-center">
                                            <img src={p.coverImage} alt={p.judul} className="object-contain w-full h-full" />
                                        </figure>
                                    </Link>

                                    <div className="flex flex-col justify-between md:h-auto">
                                        <h2 className="card-title line-clamp-2 text-sm text-malibu md:text-lg ">{p.judul}</h2>
                                        <div className="flex flex-col gap-2">
                                            <span className={`badge ${p.stok > 0 ? 'badge badge-success' : 'badge badge-error'}`}>{p.stok > 0 ? 'tersedia' : 'terjual habis'}</span>
                                            <div className="flex flex row gap-2">
                                                <span className="badge bg-gray-600">{p.kategori}</span>
                                                <span className="badge bg-gray-600">{p.genre}</span>
                                            </div>
                                            <span className="ml-auto text-lg text-redDamask font-bold">{rupiah(p.harga)}</span>
                                            <div className="card-actions justify-end  items-end flex-col w-full my-2">
                                                <button
                                                    onClick={() => {
                                                        dispatch(addCart(p))
                                                        navigate('/checkout')
                                                    }}
                                                    className="btn btn-neutral"
                                                >
                                                    Add cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>
                <div className="flex justify-center items-center">
                    <div className="join my-4">
                        <button disabled={currentPage === 1} onClick={handlePrevPage} className="join-item btn bg-malibu">«</button>
                        <button className="join-item btn bg-malibu">{currentPage} of {totalPage}</button>
                        <button disabled={currentPage === totalPage} onClick={handleNextPage} className="join-item btn bg-malibu">»</button>
                    </div>
                </div>

            </main>
        </>
    )
}