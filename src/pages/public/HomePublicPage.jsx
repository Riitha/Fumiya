import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
// import { useNavigate } from "react-router-dom";
import { rupiah } from "../../utils/RupiahCurrent";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/feature/cart/cartslice";
import { useNavigate } from "react-router-dom";

export default function HomePublicPage() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterGenre, setFilterGenre] = useState('');
    const [filterKategori, setFilterKategori] = useState('')
    const [filterStok, setFilterStok] = useState('')
    const [sort, setSort] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const navigate = useNavigate();
    const PAGE_LIMIT = 8;
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

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
    useEffect(() => {
        async function fetchFilteredData() {
            try {
                let q = query(collection(db, 'products'));

                if (filterGenre) q = query(q, where("genre", "==", filterGenre));
                if (filterKategori) q = query(q, where("kategori", "==", filterKategori));
                if (filterStok === 'tersedia') {
                    q = query(q, where("stok", ">", 0))
                } else if (filterStok === 'habis') {
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
            <main className="w-full h-full box-border">
                <div className="flex flex-cols justify-center gap-3 my-2  md:flex flex-row">
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
                </div>
                <div className="flex sm:w-[90%] md:w-[80%] my-2 mx-auto">
                    <h1 className="rounded-2xl p-1 text-center text-sm sm:text-md md:text-lg w-[50%] sm:w-[40%] md:w-[10%] bg-sky-300">HOME</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 w-[100%] sm:w-[90%] md:w-[80%] bg-gray-400 mx-auto">

                    {(filteredProducts.length === 0 ?
                        <div className="text-md text center">
                            Belum ada produk!
                        </div> : filteredProducts.map((p) => (
                            <div key={p.id} className="card bg-base-100 w-96 h-auto shadow-sm">
                                <figure>
                                    <img
                                        src={p.coverImage}
                                        alt={p.name} />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {p.name}
                                    </h2>
                                            <span
                                                className={`badge ${p.stok > 0 ? "badge-outline badge-success" : "badge-outline badge-error"}`}
                                            >
                                                {p.stok > 0 ? "tersedia" : "terjual habis"}
                                            </span>
                                    <div className="flex flex row gap-2">
                                        <span className="badge">
                                            {p.kategori}
                                        </span>
                                        <span className="badge">
                                            {p.genre}
                                        </span>
                                    </div>
                                    <span className="ml-auto">
                                        {rupiah(p.harga)}
                                    </span>
                                    <div className="card-actions justify-end  items-end flex-col w-full my-2">
                                        <button onClick={() => {
                                            dispatch(addCart(p));
                                            navigate('/checkout');
                                        }} className="btn btn-primary">
                                            Add cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )))}
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