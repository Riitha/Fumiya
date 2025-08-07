import { serverTimestamp } from "firebase/firestore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import UploadWidget from "../../components/UploadWidget"
import { useDispatch } from "react-redux"
import { addProduct } from "../../redux/feature/products/productsSlice"

export default function AddProduct() {
    const [judul, setJudul] = useState("");
    const [author, setAuthor] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [genre, setGenre] = useState("");
    const [harga, setHarga] = useState("");
    const [penerbit, setPenerbit] = useState("");
    const [sinopsis, setSinopsis] = useState("");
    const [tahunTerbit, setTahunTerbit] = useState("");
    const [stok, setStok] = useState("");
    const [kategori, setKategori] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!judul || !author || !coverImage || !genre || !harga || !penerbit || !sinopsis) {
            Swal.fire("masih ada data kosong");
            return;
        }
        try {
            const newProduct = {
                judul: judul,
                harga: Number(harga),
                coverImage: coverImage,
                genre: genre,
                author: author,
                penerbit: penerbit,
                tahunTerbit: tahunTerbit,
                stok: Number(stok),
                kategori: kategori,
                sinopsis: sinopsis,
                createdAt: serverTimestamp(),
            };
            dispatch(addProduct(newProduct));
            await Swal.fire({
                title: "buku berhasil ditambahkan!",
                icon: "success",
                draggable: true
            });
            navigate('/admin/dashboard')
        } catch {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }

    }

    return (
        <>
            <section className="bg-white overflow-auto h-screen">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Add a new product</h2>
                    <form onSubmit={handleAdd}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label for="judul" className="block mb-2 text-sm font-medium text-gray-900">judul buku</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={judul}
                                    onChange={(e) => setJudul(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="silahkan isi judul buku" required="" />
                            </div>

                            <div className="w-full">
                                <label for="author" className="block mb-2 text-sm font-medium text-gray-900">Author</label>
                                <input
                                    type="text"
                                    name="brand"
                                    id="brand"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="nama penulis"
                                    required="" />
                            </div>

                            <div className="w-full">
                                <label for="harga" className="block mb-2 text-sm font-medium text-gray-900">harga</label>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    value={harga}
                                    onChange={(e) => setHarga(+e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="harga buku"
                                    required="" />
                            </div>

                            <div>
                                <label for="category" className="block mb-2 text-sm font-medium text-gray-900">genre</label>
                                <select
                                    id="category"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}>
                                    <option value="" disabled={true} >genre</option>
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
                            </div>

                            <div>
                                <label for="category" className="block mb-2 text-sm font-medium text-gray-900">kategori buku</label>
                                <select
                                    id="category"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                    value={kategori}
                                    onChange={(e) => setKategori(e.target.value)}>
                                    <option value="" disabled={true} >kategori</option>
                                    <option value="manga">manga</option>
                                    <option value="light novel">light novel</option>
                                </select>
                            </div>

                            <div>
                                <label for="status stok" className="block mb-2 text-sm font-medium text-gray-900">status stok</label>
                                <input
                                    type="number"
                                    name="stok"
                                    id="stok"
                                    value={stok}
                                    onChange={(e) => setStok(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="isi jumlah stok buku"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label for="tahun-terbit" className="block mb-2 text-sm font-medium text-gray-900">Tahun Terbit</label>
                                <input
                                    type="number"
                                    name="tahun-terbit"
                                    id="tahun-terbit"
                                    value={tahunTerbit}
                                    onChange={(e) => setTahunTerbit(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="kapan buku diterbitkan?"
                                    required="" />
                            </div>

                            <div className="sm:col-span-1">
                                <label for="cover" className="block mb-2 text-sm font-medium text-gray-900">cover buku</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        disabled={true}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="silahkan upload cover buku" required="" />
                                    <UploadWidget setCoverImage={setCoverImage} />
                                </div>
                            </div>

                            <div className="w-full">
                                <label for="penerbit" className="block mb-2 text-sm font-medium text-gray-900">Penerbit</label>
                                <input
                                    type="text"
                                    name="brand"
                                    id="brand"
                                    value={penerbit}
                                    onChange={(e) => setPenerbit(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="silahkan isi asal penerbit"
                                    required="" />
                            </div>

                            <div className="sm:col-span-2">
                                <label for="sinopsis" className="block mb-2 text-sm font-medium text-gray-900">Sinopsis</label>

                                <textarea
                                    id="sinopsis"
                                    rows="8"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" placeholder="Your description here"
                                    value={sinopsis}
                                    onChange={(e) => setSinopsis(e.target.value)}>

                                </textarea>
                            </div>

                        </div>
                        <div className="flex gap-2  mt-4">
                            <button type="submit" className="btn btn-primary">
                                Tambah
                            </button>
                            <button onClick={() => navigate('/admin/dashboard')} type="button" className="btn btn-secondary">
                                kembali
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}