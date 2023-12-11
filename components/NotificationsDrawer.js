'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGears, faInfoCircle, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Alert from "./Alert"
import { useViewport } from "react-viewport-hooks"
import config from "@/utils/config"
import useCustomerNotifications from "@/hooks/useCustomerNotifications"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NotificationsDrawer({ children, isOpen = true, onClose, isAmimated = true }) {

    const { vw, vh } = useViewport();

    let drawerClassName = '';

    const router = useRouter();

    if (vw >= config.breakpoints.md) {
        drawerClassName = `fixed top-0 shadow-lg right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    } else {
        drawerClassName = `fixed top-0 shadow-lg right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-full transform pt-[76px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    
        if (isAmimated) {
            drawerClassName += ' transition-transform duration-1000 ease-in-out'
        }
    }

    const handleNotificationClick = (notification) => {
        switch (notification.code?.toLowerCase()) {
            case 'pending_quote':
                router.push('/quotes/' + notification.data.quote_id);
                break;
            case 'pending_claim':
                router.push('/claims/' + notification.data.claim_id);
                break;
            case 'pending_payment':
                router.push('/payments/' + notification.data.payment_id);
                break;
            default:
                break;
        }
    }

    const { notifications } = useCustomerNotifications();

    return <>
        <div onClick={() => onClose()} className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 cursor-pointer ${isOpen ? 'block' : 'hidden'}`}></div>
        <div id="drawer-right" className={drawerClassName} tabIndex="-1">

            <div className="flex flex-row items-center justify-between text-2xl border-b-2 border-gray-100 pb-4">
                <h2 className="font-bold">
                    Notifications
                </h2>

                <FontAwesomeIcon icon={faTimes} className="text-gray-400 cursor-pointer" onClick={onClose} />
            </div>
            <div className="flex flex-col gap-6 text-2xl pt-8">
                {notifications.length === 0 ? <div className="text-center text-gray-400 text-2xl">
                    Aucune notification
                </div> : null}
                {(notifications ?? []).map((notification, idx) => {
                    return <Alert key={idx} variant={notification.type} className="flex gap-2 items-center justify-start cursor-pointer hover:text-blue-800" onClick={() => handleNotificationClick(notification)}>
                        <FontAwesomeIcon icon={notification.icon} />
                        <span className=" text-lg ml-2">
                            {notification.message}
                        </span>
                    </Alert>
                })}
            </div>
        </div>
    </>
}