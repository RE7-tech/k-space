'use client';

import { faComments, faExclamationTriangle, faFile, faFileSignature, faHome, faMessage, faPhone, faPhoneVolume, faSocks, faThunderstorm, faWheatAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link";
import Button from "./Button";
import { usePathname, useRouter } from "next/navigation";
import config from "@/utils/config";
import Image from "next/image";
import phone from "@/public/icons/phone.svg";
import { faFacebookMessenger, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { HomeIcon, QuoteIcon, PolicyIcon, ClaimIcon } from "./Icons";

export default function Sidebar({ onNewQuote, isAnimated = true }) {

    const router = useRouter();
    const pathName = usePathname();

    const navItems = [
        {
            name: 'Accueil',
            icon: <HomeIcon width={18} height={18} />,
            url: '/',
            isActive: pathName === '/' || pathName === '/dashboard' || pathName === '' || !pathName,
        },
        {
            name: 'Devis',
            icon: <QuoteIcon width={18} height={18} />,
            url: '/quotes',
            isActive: pathName?.startsWith('/quotes'),
        },
        {
            name: 'Contrats',
            icon: <PolicyIcon width={18} height={18} />,
            url: '/policies',
            isActive: pathName?.startsWith('/policies'),
        },
        {
            name: 'Sinistres',
            icon: <ClaimIcon width={18} height={18} />,
            url: '/claims',
            isActive: pathName?.startsWith('/claims'),
        }
    ];

    const toggleNewQuoteOverlay = () => {
        if (typeof onNewQuote === 'function') {
            onNewQuote();
        }
    }

    const activeItemIndex = navItems.findIndex(item => item.isActive);

    const itemHeight = 44 + 16;

    const activeItemTopPosition = activeItemIndex * itemHeight;

    const hasOneActiveItem = navItems.filter(item => item.isActive).length === 1;

    const borderStyle = {
        top: activeItemTopPosition,
        bottom: navItems.length * itemHeight - activeItemTopPosition - itemHeight,
        right: 0,
        transition: 'all 0.2s ease-in-out',
        display: hasOneActiveItem ? 'block' : 'none',
    };

    const borderStyleBg = {
        top: activeItemTopPosition,
        bottom: navItems.length * itemHeight - activeItemTopPosition - itemHeight,
        right: 0,
        left: 0,
        transition: 'all 0.3s linear',
        display: hasOneActiveItem ? 'block' : 'none',
    }

    console.log('pathName', pathName);

    return <>

        <div className="border-r border-gray-200 border-r-4 h-full flex flex-col justify-between">

            {/* Logo */}
            <div className="flex items-center justify-start py-12 px-5">
                <Link href="/">
                    <Image src="/logo.svg" width={"100"} height={"45"} alt="Logo" className="hover:opacity-80 transition-opacity cursor-pointer" />
                </Link>
            </div>

            {/* Navigation */}
            <ul className="relative flex flex-col gap-4">
                {navItems.map((item, index) => {
                    return <li key={index} className={`flex items-center justify-start flex-1 hover:text-blue-800 ${item?.isActive ? 'text-blue-900' : 'text-gray-400'}`}>
                        <Link
                            href={item.url}
                            className={`flex items-center justify-start py-2 px-5 gap-2 text-lg gap-4`}>
                            <div className={`rounded-md h-[24px] w-[24px] flex items-center justify-center ${item?.isActive ? 'text-white bg-blue-800' : 'text-gray-400'}`}>
                                {item.icon}
                            </div>
                            <span className={`${item?.isActive ? 'font-bold' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    </li>
                })}
                {/* Bordure animée */}
                {isAnimated && <div className="absolute m-0 p-0 w-1 bg-blue-800 z-10 rounded-l-full" style={borderStyle}></div>}
                {isAnimated && <div className="absolute m-0 p-0 w-full bg-white z-[-1]" style={borderStyleBg}></div>}

            </ul>

            <div className="mt-12 border-t-2 border-gray-200  flex flex-col items-start justify-start py-12 px-5 gap-4">
                <Button variant="outline_primary" className={`w-full`} onClick={() => toggleNewQuoteOverlay()}>
                    Faire un devis
                </Button>

                <Button variant="primary" className={`w-full`} onClick={() => router.push('/claims/new')}>
                    Déclarer un sinistre
                </Button>
            </div>

            <div className="flex flex-col items-start justify-start py-12 px-5">
                <h4 className="text-gray-500 font-bold text-sm mb-4">
                    Besoin d'aide ?
                </h4>
                <ul className="space-y-2">
                    <Link as={'li'} href="/faq" className={`flex items-center justify-start py-2 text-gray-400 text-sm font-bold gap-1`} onClick={() => router.push('/help')}>
                        <FontAwesomeIcon icon={faComments} width={25} height={13} />
                        Chatter
                    </Link>
                    <Link as={'li'} href="/faq" className={`flex items-center justify-start py-2 text-gray-400 text-sm font-bold gap-1`} onClick={() => window.open(`${config?.infos?.whatsappUrl ?? "02 78 84 84 84"}`, '_blank')}>
                        <FontAwesomeIcon icon={faWhatsapp} width={25} height={13} />
                        <span>
                            WhatsApp
                        </span>
                    </Link>
                    <Link as={'li'} href="/faq" className={`flex items-center justify-start py-2 text-gray-400 text-sm  font-bold gap-1`} onClick={() => window.open(`${config?.infos?.facebookPageUrl ?? "https://fb.com/klianfr"}`, '_blank')}>
                        <FontAwesomeIcon icon={faFacebookMessenger} width={25} height={13} />
                        <span>
                            Messenger
                        </span>
                    </Link>
                    <Link as={'li'} href="/faq" className={`flex items-center justify-start py-2 text-gray-400 text-sm font-bold gap-1`} onClick={() => window.open(`tel:${config?.infos?.rawPhone ?? "0278848484"}`, '_blank')}>
                        <FontAwesomeIcon icon={faPhoneVolume} width={25} height={13} />
                        <span>
                            {config?.infos?.prettyPhone ?? "02 78 84 84 84"}
                        </span>
                    </Link>
                </ul>
            </div>

        </div>

    </>

}