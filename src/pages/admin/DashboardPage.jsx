import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { rupiah } from "../../utils/RupiahCurrent";

export default function Dashboard() {
    // const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterGenre, setFilterGenre] = useState('');
    const [filterKategori, setFilterKategori] = useState('')
    const [filterStok, setFilterStok] = useState('')
    const [sort, setSort] = useState('');
    const navigate = useNavigate();
    const PAGE_LIMIT = 10;
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // const fetchProducts = async () => {
    //     try {
    //         const q = query(collection(db, "products"), orderBy('createdAt', 'desc'));
    //         const querySnapshot = await getDocs(q);
    //         const data = querySnapshot.docs.map((doc) => ({
    //             id: doc.id,
    //             ...doc.data(),
    //         }));
    //         setProducts(data)
    //     } catch {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Oops...",
    //             text: "Something went wrong!",
    //         });
    //     }
    // };

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
                filteredProducts()
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
        setFilterStok('');
        setFilterKategori('')
    }

    // useEffect(() => {
    //     fetchProducts();
    // }, [])

    useEffect(() => {
        async function fetchFilteredData() {
            try {
                let q = query(collection(db, 'products'));

                if (filterGenre) q = query(q, where("genre", "==", filterGenre));
                if (filterKategori) q = query(q, where("kategori", "==", filterKategori));
                if (filterStok === 'tersedia') {
                    q = query(q, where("stok", ">", 0))
                } else if (filterStok === 'habis'){
                    q = query(q, where('stok', '==', 0))
                }

                if (sort === 'price-asc') {
                    q = query(q, orderBy('harga', 'asc'));
                } else if (sort === 'price-desc') {
                    q = query(q, orderBy('harga', 'desc'));
                } else if (sort === 'terbitan-lama') {
                    q = query(q, orderBy('tahunTerbit', 'asc'));
                } else if (sort === 'terbitan-terbaru') {
                    q = query(q, orderBy('tahunTerbit', 'desc'))
                } else {
                    q = query(q, orderBy('createdAt', 'desc'));
                }
                //pagination
                const totalItems = (await getDocs(q)).size;
                const currentTotalPage = Math.ceil(totalItems / PAGE_LIMIT);
                setTotalPage(currentTotalPage);
                //kondisi items melebihi total page saat filter
                if (currentPage > currentTotalPage) {
                    setCurrentPage(1);
                }
                //mendapatkan lastVisible item halaman sebelumnya
                if (currentPage > 1) {
                    const prevSnap = await getDocs(query(q, limit((currentPage - 1) * PAGE_LIMIT)));
                    const lastVisible = prevSnap.docs.at(-1);
                    q = query(q, startAfter(lastVisible), limit(PAGE_LIMIT));
                } else {
                    q = query(q, limit(PAGE_LIMIT)); //halaman pertama
                }
                const snapshot = await getDocs(q);
                const result = snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };
                });
                setFilteredProducts(result)
            } catch (error) {
                console.log(error)
            }
        }
        fetchFilteredData();
    }, [filterGenre, filterKategori, filterStok, sort, currentPage])

    return (
        <>
            <main className="w-full h-full">
                <div className="flex gap-2 items-center w-full justify-center ">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">genre</legend>
                        <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="select">
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
                        <legend className="fieldset-legend">kategori buku</legend>
                        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="select">
                            <option value='' disabled={true}>jenis buku</option>
                            <option value="manga">manga</option>
                            <option value="light novel">light novel</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">status barang</legend>
                        <select value={filterStok} onChange={(e) => setFilterStok(e.target.value)} className="select">
                            <option value='' disabled={true}>stok</option>
                            <option value="tersedia">tersedia</option>
                            <option value="habis">sold out</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">sort</legend>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="select">
                            <option value='' disabled={true}>urutkan berdasarkan</option>
                            <option value='price-asc' >paling murah</option>
                            <option value='price-desc'>paling mahal</option>
                            <option value='terbitan-lama'>Terlama</option>
                            <option value='terbitan-terbaru'>Terbaru</option>
                        </select>
                    </fieldset>

                    <button onClick={handleClearFilterSort} className="btn btn-soft btn-warning mt-8">clear filter</button>
                    <button onClick={() => navigate("/admin/add")} className="btn btn-primary mt-8">Tambah Produk</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Judul</th>
                                <th>Genre</th>
                                <th>Harga</th>
                                <th>status barang</th>
                                <th>Modif</th>
                            </tr>
                        </thead>

                        <tbody>

                            {(filteredProducts.length === 0 ?
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Belum ada produk
                                    </td>
                                </tr> :
                                filteredProducts.map((p, index) => (
                                    <tr key={p.id}>

                                        <th>{index + 1}</th>

                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="rounded-sm h-40 w-30">
                                                        <img
                                                            src={p.coverImage}
                                                            alt={p.judul}
                                                            className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{p.judul}</div>
                                                    <div className="text-sm opacity-50">{p.author}</div>
                                                    <div className="text-sm">{p.tahunTerbit}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex gap-2">
                                                <p className="bg-blue-500 p-1 rounded-md">{p.genre} </p>
                                                <p className="bg-pink-500 p-1 rounded-md">{p.kategori}</p>
                                            </div>
                                            <br />
                                            <span className="badge badge-ghost badge-sm">{p.penerbit}</span>
                                        </td>

                                        <td>{rupiah(p.harga)}</td>

                                        <td>
                                            <span
                                                className={`badge ${p.stok > 0 ? "badge-outline badge-success" : "badge-outline badge-error"}`}
                                            >
                                                {p.stok > 0 ? "tersedia" : "terjual habis"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/edit/${p.id}`)}
                                                    className="btn btn-ghost btn-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="btn btn-ghost btn-xs text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        <tfoot>
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

                <div className="join">
                    <button disabled={currentPage === 1} onClick={handlePrevPage} className="join-item btn">«</button>
                    <button className="join-item btn">{currentPage} of {totalPage}</button>
                    <button disabled={currentPage === totalPage} onClick={handleNextPage} className="join-item btn">»</button>
                </div>
            </main>
        </>
    )
}