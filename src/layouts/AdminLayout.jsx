import { Outlet } from "react-router-dom";
import NavbarAll from "../components/Navbar";

export default function AdminLayout() {
    return (
        <>
        <NavbarAll/>
        <Outlet/>
        </>
    )
}