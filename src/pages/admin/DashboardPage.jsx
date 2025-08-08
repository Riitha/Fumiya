import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { rupiah } from "../../utils/RupiahCurrent";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/feature/products/productsSlice";
import SearchBar from "../../components/SearchBar";

export default function Dashboard() {
    const [filterGenre, setFilterGenre] = useState('');
    const [filterKategori, setFilterKategori] = useState('')
    const [sort, setSort] = useState('');
    const dispatch = useDispatch();
    const { products, totalPage, loading } = useSelector((state) => state.products)
    const navigate = useNavigate();
    const PAGE_LIMIT = 10;
    const [currentPage, setCurrentPage] = useState(1);
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

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Hapus produk?",
                text: "Data akan dihapus secara permanen!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya",
            });
            if (result.isConfirmed) {
                await deleteDoc(doc(db, 'products', id));
                await Swal.fire({
                    title: "Deleted!",
                    text: "produk berhasil dihapus.",
                    icon: "success"
                });
                dispatch(fetchProducts({
                    genre: filterGenre,
                    kategori: filterKategori,
                    sort,
                    page: currentPage,
                    pageSize: PAGE_LIMIT
                }));
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "gagal mengapus produk",
            });
        }
    }

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
            <main className="w-full h-full bg-desert">
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

                <div className="overflow-x-auto text-black my-4 border">
                    <table className="table">
                        <thead>
                            <tr className="text-black">
                                <th className="border">No</th>
                                <th className="border">Judul</th>
                                <th className="border">Genre</th>
                                <th className="border">Harga</th>
                                <th className="border">status barang</th>
                                <th className="border">Modif</th>
                            </tr>
                        </thead>

                        <tbody>

                            {(renderProduct.length === 0 ?
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Belum ada produk
                                    </td>
                                </tr> :
                                renderProduct.map((p, index) => (
                                    <tr key={p.id}>

                                        <th className="border">{index + 1}</th>

                                        <td className="border">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="rounded-sm h-40 w-30">
                                                        <img
                                                            src={p.coverImage}
                                                            alt={p.judul}
                                                            className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                                <div >
                                                    <div className="font-bold">{p.judul}</div>
                                                    <div className="text-sm opacity-50">{p.author}</div>
                                                    <div className="text-sm">{p.tahunTerbit}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="border">
                                            <div className="flex gap-2">
                                                <p className="bg-blue-500 p-1 rounded-md">{p.genre} </p>
                                                <p className="bg-pink-500 p-1 rounded-md">{p.kategori}</p>
                                            </div>
                                            <br />
                                            <span className="badge badge-ghost badge-sm">{p.penerbit}</span>
                                        </td>

                                        <td className="border">{rupiah(p.harga)}</td>

                                        <td className="border">
                                            <span
                                                className={`badge ${p.stok > 0 ? "badge badge-success" : "badge badge-error"}`}
                                            >
                                                {p.stok > 0 ? "tersedia" : "terjual habis"}
                                            </span>
                                        </td>

                                        <td className="border">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/edit/${p.id}`)}
                                                    className="btn btn-ghost btn-md"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="btn btn-ghost btn-md text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        <tfoot className="text-black">
                            <tr>
                                <th>No</th>
                                <th>Judul</th>
                                <th>Genre</th>
                                <th>Harga</th>
                                <th>Modif</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="flex justify-center">
                    <div className="join mb-4 mt-2">
                        <button disabled={currentPage === 1} onClick={handlePrevPage} className="join-item btn bg-malibu">«</button>
                        <button className="join-item btn bg-malibu">{currentPage} of {totalPage}</button>
                        <button disabled={currentPage === totalPage} onClick={handleNextPage} className="join-item btn bg-malibu">»</button>
                    </div>
                </div>

            </main>
        </>
    )
}