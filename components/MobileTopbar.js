import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useContext } from "react";
import { DrawerContext } from "@/context/DrawerContext";

export default function MobileTopBar ({ children, isAnimated = true }) {

    const { toggleDrawer, isDrawerOpen } = useContext(DrawerContext);

    return <>
        <div className="bg-white border-b-2 border-blue-200 h-[56px] flex items-center justify-between z-50">
            <div className="flex flew-row justify-between items-center px-4 w-full">
                <div className="flex flex-row items-center cursor-pointer hover:opacity-80">
                    <Image src={logo} alt="" height={31} onClick={() => window.location.href = '/'} />
                </div>

                <div className="flex items-center gap-4 cursor-pointer">
                    {/* Notifications bell */}
                    <FontAwesomeIcon icon={faBell} className="hover:text-blue-800" onClick={() => toggleDrawer('notifications')} />

                    {/* Hamburguer menu */}
                    <FontAwesomeIcon icon={faBars} className="hover:text-blue-800" onClick={() => toggleDrawer('menu')} />

                </div>
            </div>
        </div>
    </>

}