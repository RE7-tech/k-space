'use client';

import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";

export default function Logout({ children }) {

    const { logout, user } = useAuth();

    useEffect(() => {
        logout();

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);

        return () => { };
    }, []);

    return <>
        <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-90 z-50">
            <Loader message={<>Déconnexion en cours...</>} />
        </div>
    </>;
}