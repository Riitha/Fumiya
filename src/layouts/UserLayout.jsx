import { Outlet } from "react-router-dom";
import NavbarAll from "../components/Navbar";

export default function UserLayout() {

    return (
        <>
        <NavbarAll/>
        <Outlet/>
        </>
    )
}