import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"

export default function NavbarAll() {
    const { user, role } = useContext(AuthContext);
    const navigate = useNavigate();
    const logoutIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
    </svg>

    async function handleLogout() {
        try {
            signOut(auth);
            navigate("/auth/login")
        } catch {
            Swal.fire({
                title: "Sweet!",
                text: "gagal logout",
                imageUrl: "https://pbs.twimg.com/media/Ft6Z1yCakAIGs2s.jpg",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "Custom image"
            });
            navigate("/")
        }
    }
    return (
        <>
            <div className="navbar shadow-sm bg-casablanca rounded-md sticky top-0 z-10">
                <div className="navbar-start">
                    <div className="dropdown bg-malibu rounded-3xl">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {role === 'admin' && <li><Link to={'/admin/dashboard'}>Admin</Link></li>}
                            <li><Link to={'/'}>Homepage</Link> </li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[90px]" />
                </div>
                <div className="navbar-end gap-2">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="btn btn-soft bg-malibu rounded-4xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>

                    </button>
                    {!user || role === !'admin' ? (<button onClick={() => navigate('/auth/login')} className="btn btn-soft bg-chathams rounded-4xl">Login</button>) : (<button onClick={handleLogout} className="btn btn-soft bg-calypso rounded-4xl">{logoutIcon}</button>)}
                </div>
            </div>
        </>
    )
}
