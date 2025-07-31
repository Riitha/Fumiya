import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export default function AuthContextProvider ({children}) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [name, setName] = useState(null);
    const [loading, setLoading] = useState(true);

    const value = {user, role, name, setUser};
    useEffect(() => {
        setLoading(true);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                console.log("user data", docSnap.data());
                setUser(user);
                setRole(docSnap.data().role);
                setName(docSnap.data().name);
            } else {
                setUser(null);
                setRole(null);
                setName(null);
            }
            setLoading(false);
        });
        return() => unsubscribe();
    }, [])
    
    if(loading) {
        return <span className="loading loading-infinity loading-xl"></span>
    }
    return <AuthContext value={value}>{children}</AuthContext>
}
