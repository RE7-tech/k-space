'use client';

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Alert ({ children, variant = 'info', clickable = false, onClick, className }) {

    const [visible, setVisible] = useState(true);
    const baseStyle = 'flex items-center justify-between gap-4';

    const variantStyles = {
        info: 'bg-blue-100 border-blue-400 p-4 text-gray-1000 rounded-lg',
        success: 'bg-green-100 border-green-400 p-4 text-gray-1000 rounded-lg',
        warning: 'bg-yellow-100 border-yellow-400 p-4 text-gray-1000 rounded-lg',
        danger: 'bg-red-100 border-red-400 p-4 text-gray-1000 rounded-lg',
        error: 'bg-red-100 border-red-400 p-4 text-gray-1000 rounded-lg',
    };


    if (clickable) {
        variantStyles[variant] = `${variantStyles[variant]} cursor-pointer hover:opacity-75`;
    }

    const alertClassNames = `${baseStyle} ${variantStyles[variant]} ${className}`;


    return <>
        {visible ? <div className={alertClassNames} onClick={onClick}>
            {children}
            <FontAwesomeIcon icon={faTimes} width={18} height={18} onClick={() => setVisible(false)} className="cursor-pointer hover:text-gray-500" />
        </div> : null}
    </>
}