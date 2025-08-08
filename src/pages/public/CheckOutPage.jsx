import { useDispatch, useSelector } from "react-redux";
import { clearCart, decrementQty, incrementQty, removeCart } from "../../redux/feature/cart/cartslice";
import { rupiah } from "../../utils/RupiahCurrent";
import Swal from "sweetalert2";

export default function CheckOutPage() {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.cart.items);
    const total = items.reduce((sum, item) => sum + item.harga * item.qty, 0);

    const handleConfirm = () => {
        console.log('pesanan dikonfirmasi');
        dispatch(clearCart());
        Swal.fire({
            title: "Transaksi berhasil!",
            icon: "success",
            draggable: true
        });
    }

    if (items.length === 0) return <p>Keranjang Kosong</p>;

    return (
        <>
            <div>
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table md:overflow-x-auto">

                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>Nama item</th>
                                <th>harga</th>
                                <th>jumlah</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>

                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex flex-row items-center gap-4">
                                            <img src={item.coverImage}
                                                alt={item.name}
                                                className="max-w-[80px] h-auto object-cover" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-md ">
                                                {item.judul}
                                            </span>
                                        </div>
                                    </td>

                                    <td>{rupiah(item.harga)}</td>

                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => dispatch(decrementQty(item.id))}
                                                disabled={item.qty <= 1}
                                                className="btn btn-sm btn btn-neutral btn-outline">
                                                -
                                            </button>
                                            <span>{item.qty}</span>
                                            <button
                                                onClick={() => dispatch(incrementQty(item.id))}
                                                disabled={item.qty >= item.stok}
                                                className="btn btn-sm btn btn-neutral btn-outline"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => dispatch(removeCart(item.id))}
                                            className="btn btn-sm btn-error"
                                        >
                                            Del
                                        </button>
                                    </td>
                                </tr>
                            ))};
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th colSpan={2} className="text-right">Total</th>
                                <th>{rupiah(total)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="w-full flex">
                    <button onClick={handleConfirm} className="btn btn-primary my-4 ml-auto">konfirmasi</button>
                </div>

            </div>
        </>
    )
}