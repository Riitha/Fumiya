import { useDispatch, useSelector } from "react-redux";
import { clearCart, decrementQty, incrementQty, removeCart } from "../../redux/feature/cart/cartslice";
import { rupiah } from "../../utils/RupiahCurrent";

export default function CheckOutPage() {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.cart.items);
    const total = items.reduce((sum, item) => sum + item.harga * item.qty, 0);

    const handleConfirm = () => {
        console.log('pesanan dikonfirmasi');
        dispatch(clearCart());
        alert("checkout sukses!");
    }

    if (items.length === 0) return <p>Keranjang Kosong</p>;

    return (
        <>
            <h1>Checkout</h1>
            <div>
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nama item</th>
                                <th>harga</th>
                                <th>jumlah</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex flex-row items-center gap-4">
                                            <img src={item.coverImage}
                                                alt={item.name}
                                                className="w-20 h-28 object-cover" />
                                            {item.judul}
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
                <button onClick={handleConfirm} className="btn btn-primary my-4">konfirmasi</button>
                </div>

            </div>
        </>
    )
}