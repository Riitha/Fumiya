import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { useNavigate} from "react-router-dom";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(data)
        } catch {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    };

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
                fetchProducts()
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "gagal mengapus produk",
            });
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <>
            <main className="w-full h-full">
                <div>
                    <button onClick={() => navigate("/admin/add")} className="btn btn-primary">Tambah Produk</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Judul</th>
                                <th>Genre</th>
                                <th>Harga</th>
                                <th>Modif</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Belum ada produk
                                    </td>
                                </tr>
                            ) : (
                                products.map((p, index) => (
                                    <tr key={p.id}>

                                        <th>{index + 1}</th>

                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12">
                                                        <img src={p.coverImage} alt={p.judul} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{p.judul}</div>
                                                    <div className="text-sm opacity-50">{p.author}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex gap-2">
                                                <p className="bg-blue-500 p-1 rounded-md">{p.genre} </p>
                                                <p className="bg-pink-500 p-1 rounded-md">{p.genreSub}</p>
                                            </div>
                                            <br />
                                            <span className="badge badge-ghost badge-sm">{p.penerbit}</span>
                                        </td>

                                        {/* Harga */}
                                        <td>Rp {Number(p.harga).toLocaleString()}</td>

                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                onClick={()=> navigate(`/admin/edit/${p.id}`)}
                                                className="btn btn-ghost btn-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={()=>handleDelete(p.id)}
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
            </main>
        </>
    )
}