import { faArrowRight, faCar, faChevronRight, faMotorcycle, faSoccerBall } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { productIcons } from "@/utils/products"
import { useViewport } from "react-viewport-hooks"
import config from "@/utils/config"

export default function PolicySmallCard({ policy, isBordered = false, onClick }) {

    const { vw, vh } = useViewport();

    const getInfo1 = () => {
        return policy?.summary?.primary;
    }

    const getInfo2 = () => {
        return policy?.summary?.secondary;
    }

    if (vw < config.breakpoints.md) {
        return <>
            <div onClick={onClick} className={`flex bg-gray-50 flex-row items-center gap-4 p-4 justify-between rounded-md flex-1 rounded-xl relative cursor-pointer hover:bg-gray-100 ${isBordered ? 'border border-gray-200' : ''} `}>
                <Image src={productIcons[policy.product?.type]} width={59} height={59} alt="" />
                
                <div className="flex items-start gap-1 flex-col">
                    <span className="uppercase text-xs text-gray-500 font-bold">N°{policy?.id ?? '...'}</span>
                    <h4 className="text-xl font-bold text-blue-900">{getInfo1()}</h4>
                    <span className="text-gray-500 text-xl">
                        {getInfo2()}
                    </span>
                </div>

                <FontAwesomeIcon width={18} height={18} className="text-gray-400" icon={faChevronRight} size="lg" />

            </div>
        </>
    } else {
        return <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-md flex-1 rounded-xl relative cursor-pointer hover:bg-gray-100" onClick={onClick}>
            <FontAwesomeIcon width={18} height={18} className="absolute top-[25px] right-[25px] text-gray-400" icon={faChevronRight} size="lg" />
            <Image src={productIcons[policy.product?.type]} width={59} height={59} className="mb-2" alt="" />
            <span className="uppercase text-xs text-gray-500 font-bold">N°{policy?.id ?? '...'}</span>
            <h4 className="text-xl font-bold text-blue-900">{getInfo1()}</h4>
            <span className="text-blue-800 text-xl">
                {getInfo2()}
            </span>
        </div>
    }
}