'use client';

import {
    faComments,
    faExclamationTriangle,
    faFile,
    faFileSignature,
    faHome,
    faMessage,
    faPhone,
    faPhoneVolume,
    faSocks,
    faThunderstorm,
    faWheatAlt
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Link from "next/link";
import Button from "./Button";
import {usePathname, useRouter} from "next/navigation";
import config from "@/utils/config";
import Image from "next/image";
import phone from "@/public/icons/phone.svg";
import {faFacebookMessenger, faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {HomeIcon, QuoteIcon, PolicyIcon, ClaimIcon} from "./Icons";

export default function Sidebar({onNewQuote, isAnimated = true}) {

    const router = useRouter();
    const pathName = usePathname();

    const navItems = [
        {
            name: 'Accueil',
            icon: <HomeIcon width={18} height={18}/>,
            url: '/',
            isActive: pathName === '/' || pathName === '/dashboard' || pathName === '' || !pathName,
        },
        {
            name: 'Devis',
            icon: <QuoteIcon width={18} height={18}/>,
            url: '/quotes',
            isActive: pathName?.startsWith('/quotes'),
        },
        {
            name: 'Contrats',
            icon: <PolicyIcon width={18} height={18}/>,
            url: '/policies',
            isActive: pathName?.startsWith('/policies'),
        },
        {
            name: 'Sinistres',
            icon: <ClaimIcon width={18} height={18}/>,
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

    const itemHeight = 48;

    const activeItemTopPosition = activeItemIndex * itemHeight;

    const hasOneActiveItem = navItems.filter(item => item.isActive).length === 1;

    const borderStyle = {
        top: activeItemTopPosition,
        bottom: navItems.length * itemHeight - activeItemTopPosition - itemHeight + 8,
        right: '-3px',
        transition: 'all 0.2s ease-in-out',
        display: hasOneActiveItem ? 'block' : 'none',
    };

    const borderStyleBg = {
        top: activeItemTopPosition,
        bottom: navItems.length * itemHeight - activeItemTopPosition - itemHeight + 8,
        right: 0,
        left: '-3px',
        transition: 'all 0.3s linear',
        display: hasOneActiveItem ? 'block' : 'none',
    }

    console.log('pathName', pathName);

    return <>

        <div
            className="border-gray-100 border-r-4 h-screen flex flex-col justify-start bg-white w-[184px] pt-12 pb-7">

            <div className={'px-5'}>

                {/* Logo */}
                <div className="flex items-center justify-start  pb-12">
                    <Link href="/">
                        <Image src="/logo.svg" width={"100"} height={"45"} alt="Logo"
                               className="hover:opacity-80 transition-opacity cursor-pointer"/>
                    </Link>
                </div>
            </div>

            {/* Navigation */}

            <div className="relative flex items-center justify-start gap-2  px-5">
                <ul className="relative flex flex-col justify-start items-start gap-1 w-full ">
                    {navItems.map((item, index) => {
                        return <li key={index}
                                   className={` w-full py-2  flex items-center justify-start flex-1 hover:text-blue-800 ${item?.isActive ? 'leading-normal text-blue-default' : 'leading-[27px] text-gray-400'}`}>
                            <Link
                                href={item.url}
                                className={`flex items-center justify-start font-semibold gap-3 text-lg  w-full`}>
                                <div
                                    className={`rounded-md h-[25px] w-[25px] flex items-center justify-center ${item?.isActive ? 'text-white bg-blue-800' : 'text-gray-400'}`}>
                                    {item.icon}
                                </div>
                                <div
                                    className={`${item?.isActive ? 'font-bold' : 'font-semibold'} flex items-center justify-start`}>
                                    {item.name}
                                </div>
                            </Link>
                        </li>
                    })}


                </ul>


                {/* Bordure animée */}
                {isAnimated &&
                    <div className="absolute m-0 p-0 w-[5px] bg-blue-800 z-10 rounded-l-full "
                         style={borderStyle}></div>}
                {isAnimated &&
                    <div className="absolute m-0 p-0 w-full bg-white z-[-1]" style={borderStyleBg}></div>}


            </div>


            <div className="mt-12 border-t-2 border-gray-200">

                <div className="px-5  flex flex-col items-start justify-start py-12 gap-4">

                    <Button variant="outline_primary" className={`w-full`} onClick={() => toggleNewQuoteOverlay()}>
                        Faire un devis
                    </Button>

                    <Button variant="primary" className={`w-full`} onClick={() => router.push('/claims/new')}>
                        Déclarer un sinistre
                    </Button>

                </div>
            </div>

            <div className="flex flex-col items-start justify-end  flex-1">

                <div className={'px-5'}>
                    <h4 className="text-gray-500 font-bold text-sm mb-5">
                        Besoin d'aide ?
                    </h4>
                    <ul className="space-y-2">
                        <li className={`flex items-center justify-start py-2 text-gray-400 text-sm font-bold gap-1 cursor-pointer hover:text-blue-800`}
                            onClick={() => router.push('/help')}>
                            <FontAwesomeIcon icon={faComments} width={25} height={13}/>
                            Chatter
                        </li>
                        <li className={`flex items-center justify-start py-2 text-gray-400 text-sm font-bold gap-1 cursor-pointer hover:text-blue-800`}
                            onClick={() => window.open(`${config?.infos?.whatsappUrl ?? "02 78 84 84 84"}`, '_blank')}>
                            <FontAwesomeIcon icon={faWhatsapp} width={25} height={13}/>
                            <span>
                            WhatsApp
                        </span>
                        </li>
                        <li className={`flex items-center justify-start py-2 text-gray-400 text-sm  font-bold gap-1 cursor-pointer hover:text-blue-800`}
                            onClick={() => window.open(`${config?.infos?.facebookPageUrl ?? "https://fb.com/klianfr"}`, '_blank')}>
                            <FontAwesomeIcon icon={faFacebookMessenger} width={25} height={13}/>
                            <span>
                            Messenger
                        </span>
                        </li>
                        <li className={`flex items-center justify-start py-2 text-gray-400 text-sm font-bold gap-1 cursor-pointer hover:text-blue-800`}
                            onClick={() => window.open(`tel:${config?.infos?.rawPhone ?? "0278848484"}`, '_blank')}>
                            <FontAwesomeIcon icon={faPhoneVolume} width={25} height={13}/>
                            <span>
                            {config?.infos?.prettyPhone ?? "02 78 84 84 84"}
                        </span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>

    </>

}