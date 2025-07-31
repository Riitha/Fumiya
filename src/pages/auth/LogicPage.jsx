import { signInWithEmailAndPassword } from "firebase/auth"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../config/firebase"
import Swal from 'sweetalert2'
import { AuthContext } from "../../context/AuthContext"

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { role } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/')
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    };

    return (
        <>
            
                <div className="hero bg-base-200 min-h-screen">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Login now!</h1>
                            <p className="py-6">
                                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                                quasi. In deleniti eaque aut repudiandae et a id nisi.
                            </p>
                        </div>
                        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <div className="card-body">
                            <form onSubmit={handleLogin}>
                                <fieldset className="fieldset">
                                    <label className="label">Email</label>
                                    <input 
                                    type="email" 
                                    className="input" 
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e)=> setEmail(e.target.value)}
                                    />
                                    <label className="label">Password</label>
                                    <input 
                                    type="password" 
                                    className="input" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div><a className="link link-hover">belum punya akun?</a></div>
                                    <button className="btn btn-neutral mt-4">Login</button>
                                </fieldset>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}