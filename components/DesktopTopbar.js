'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown, faArrowCircleDown, faArrowDown, faBell, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { DrawerContext } from "@/context/DrawerContext";
import useCustomer from "@/hooks/useCustomer";
import { ucfirst } from "@/utils/format";
import { useViewport } from "react-viewport-hooks";
import config from "@/utils/config";

export default function DesktopTopbar({ children, breadcrumbs = [], className }) {

    // Path name
    const pathName = usePathname();
    const { toggleDrawer } = useContext(DrawerContext);
    const { customer } = useCustomer();

    const { vw, vh } = useViewport();

    // Add home at first position in breadcrumbs
    if (pathName !== '/') {
        breadcrumbs = [{ name: 'Accueil', href: '/' }, ...breadcrumbs];
    }

    const handleMenuClick = (e) => {
        e.stopPropagation();

        toggleDrawer('menu');
    }

    const toggleNotificationsDrawer = () => {
        toggleDrawer('notifications');
    }

    if (vw < config.breakpoints.md) {
        return null;
    }

    return <div className={`h-[25px] flex items-center justify-between text-gray-500 mt-4 mb-12 ${className ?? ''}`}>
        
        {vw >= config.breakpoints.md ? <div className="flex items-center gap-4">
            {breadcrumbs.map((breadcrumb, index) => {
                return <Link href={breadcrumb.href} key={index} className={`flex items-center justify-start py-2 gap-2 text-lg gap-4 ${index !== breadcrumbs.length - 1 ? 'hover:text-blue-800' : ''}`}>
                    <span className={`${index === breadcrumbs.length - 1 ? 'font-bold' : ''}`}>{breadcrumb.name}</span>
                    {index !== breadcrumbs.length - 1 && <FontAwesomeIcon icon={faChevronRight} width={18} height={18} />}
                </Link>
            })}
        </div> : null}

        <div className="flex items-center gap-4 cursor-pointer">
            <FontAwesomeIcon icon={faBell} width={18} height={18} className="hover:text-blue-800" onClick={() => toggleNotificationsDrawer()} />
            <div onClick={(e) => handleMenuClick(e)} className="flex items-center gap-2  hover:text-blue-800">
                <span>
                    {ucfirst(customer?.firstname?.toLowerCase()) ?? '...'}
                </span>
                <FontAwesomeIcon icon={faChevronDown} width={18} height={18} />
            </div>
        </div>
    </div>

}