'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faFileAlt, faFileContract, faHome } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";

export default function MobileNav({ isAnimated = true }) {

    const router = useRouter();
    const pathName = usePathname();

    // État pour suivre l'élément actif
    const [activeItem, setActiveItem] = useState(pathName);

    useEffect(() => {
        setActiveItem(pathName);
    }, [pathName]);

    const items = [
        {
            name: "Accueil",
            icon: <FontAwesomeIcon icon={faHome} width={20} height={20} fontSize={20} />,
            href: '/',
            isActive: pathName === '/' || pathName === '/dashboard' || pathName === '' || !pathName,
        },
        {
            name: "Devis",
            icon: <FontAwesomeIcon icon={faFileAlt} width={20} height={20} fontSize={20} />,
            href: '/quotes',
            isActive: pathName?.startsWith('/quotes'),
        },
        {
            name: "Contrats",
            icon: <FontAwesomeIcon icon={faFileContract} width={20} height={20} fontSize={20} />,
            href: '/policies',
            isActive: pathName?.startsWith('/policies'),
        },
        {
            name: "Claims",
            icon: <FontAwesomeIcon icon={faExclamationTriangle} width={20} height={20} fontSize={20} />,
            href: '/claims',
            isActive: pathName?.startsWith('/claims'),
        }
    ];

    const handleItemClick = (item) => {
        setActiveItem(item.href); // Mise à jour de l'état actif
        router.push(item.href);
    };

    const getItemClassName = (item) => {
        let className = `flex relative pt-2 px-5 flex-col items-center gap-1`;

        if (activeItem === item.href) {
            className += ' text-blue-800';
        } else {
            className += ' text-gray-400';
        }

        return className;
    };

    const activeItemIndex = items.findIndex(item => item.isActive);

    // Calculer la position de la bordure
    const borderStyle = {
        left: `${(activeItemIndex * 100) / items.length}%`,
        right: `${100 - ((activeItemIndex * 100) / items.length)}%`,
        width: `${100 / items.length}%`,
        transition: 'left 0.3s ease-out',
        display: activeItemIndex >= 0 ? 'block' : 'none',
    };

    console.log('pathName', pathName);
    console.log('activeItem', activeItem);

    return <>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-200 h-[80px] px-4">
            <div className="flex justify-around items-center relative h-full">
                {items.map((item, index) => (
                    <div onClick={() => handleItemClick(item)} key={index} className={getItemClassName(item)}>
                        <div className={`${item.isActive ? 'text-white bg-blue-800' : 'text-gray-400'} rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center`}>
                            {item.icon}
                        </div>
                        <span className="text-xs font-bold">{item.name}</span>
                    </div>
                ))}
                {/* Bordure animée */}
                {isAnimated && <div className="absolute top-0 h-1 bg-blue-800 rounded-b-md" style={borderStyle}></div>}
            </div>
        </div>
    </>
}