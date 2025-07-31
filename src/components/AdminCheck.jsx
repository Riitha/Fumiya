import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminProtectedPage({children}) {
    const {user, role} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/auth/login', {
                state: {from: location},
                replace: true,
            });
        } else if (role !== 'admin') {
            navigate('/', {
                replace:true,
            });
        } 
    }, [location, navigate, user, role])
    return children;
}