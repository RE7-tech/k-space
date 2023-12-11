import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGears, faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { useViewport } from "react-viewport-hooks"
import config from "@/utils/config"

export default function Drawer({ children, isOpen = true, onClose, isAnimated = true }) {

    const { vw, vh } = useViewport();

    let drawerClassName = '';

    if (vw >= config.breakpoints.md) {
        drawerClassName = `fixed top-0 shadow-lg right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    } else {
        // for mobile, the drawer appears from the top, in column, the height match the content height
        drawerClassName = `fixed top-0 shadow-lg right-0 z-40 p-4 overflow-y-auto transition-transform bg-white w-full rounded-b-xl transform pt-[76px] ${isOpen ? '-translate-y-0' : '-translate-y-full'}`
    
        if (isAnimated) {
            drawerClassName += ' transition-transform duration-1000 ease-in-out'
        }
    }

    return <>
        <div onClick={() => onClose()} className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 cursor-pointer ${isOpen ? 'block' : 'hidden'}`}></div>
        <div id="drawer-right" className={drawerClassName} tabIndex="-1" onClick={() => onClose()}>
            <div className="flex flex-col gap-6 text-2xl p-4">
                <Link href="/logout" className="flex gap-2 items-center justify-start cursor-pointer hover:text-blue-800 border-b-2 border-gray-100 pb-4">
                    <FontAwesomeIcon icon={faSignOutAlt} width={24} height={24} />
                    <span className=" text-lg font-bold ml-2">
                        Se déconnecter
                    </span>
                </Link>

                <Link href="/settings" className="flex gap-2 items-center justify-start cursor-pointer hover:text-blue-800 border-b-2 border-gray-100 pb-4">
                    <FontAwesomeIcon icon={faGears} width={24} height={24} />
                    <span className=" text-lg font-bold ml-2">
                        Paramètres de compte
                    </span>
                </Link>

                <Link href="/help" className="flex gap-2 items-center justify-start cursor-pointer hover:text-blue-800">
                    <FontAwesomeIcon icon={faInfoCircle} width={24} height={24} />
                    <span className=" text-lg font-bold ml-2">
                        Aide
                    </span>
                </Link>
            </div>
        </div>
    </>
}