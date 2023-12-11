'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Accordeon({ isOpen = true, title, children, className }) {

    const [isOpened, setIsOpened] = useState(isOpen);

    return <>
        <div className={`border shadow-opaque border-gray-300 rounded-md p-4 mb-4 hover:bg-gray-100 cursor-pointer ${className}`}>
            <div onClick={() => setIsOpened(!isOpened)} className={`flex flex-row justify-between items-center ${isOpened ? 'pb-4' : ''}`}>
                {title}
                <FontAwesomeIcon icon={faPlus} width={18} height={18} className={`text-gray-400 transition-all duration-500 ease-in-out transform ${isOpened ? 'rotate-45' : ''}`} />
            </div>
            <div className="border-t border-gray-300 py-4 mb-4 transition-all duration-500 ease-in-out overflow-hidden" style={{ display: !isOpened ? 'none' : null}}>
                {children}
            </div>
        </div>
    </>
}