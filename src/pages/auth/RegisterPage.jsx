import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../../config/firebase"
import Swal from 'sweetalert2'
import CarouselAuth from "../../components/Carousel"

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                name: name,
                role: 'user',
            });
            Swal.fire({
                title: "register success!",
                icon: "success",
                draggable: true
            });
            navigate('/');
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
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <h1 className="text-4xl font-bold lg:hidden">LOGIN</h1>
                    <CarouselAuth />
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <form onSubmit={handleRegister}>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend hidden md:block md:text-xl lg:block lg:text-2xl">REGISTER</legend>
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label className="label">nama</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="isi nama anda"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <label className="label">Password</label>
                                    <input
                                        type="password"
                                        className="input" placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                    <div>Sudah punya akun?<span onClick={()=>navigate('/auth/login')} className="link link-hover hover:text-blue-200"> klik di sini!</span></div>
                                    <button className="btn btn-neutral mt-4">Register</button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}