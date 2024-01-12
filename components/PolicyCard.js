import { formatEuro, formatNumber, formatPriceAsIntegerAndDecimal, ucfirst } from "@/utils/format";
import { productIcons } from "@/utils/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import PolicyBadge from "./PolicyBadge";
import { useViewport } from "react-viewport-hooks";
import config from "@/utils/config";
import { statusLabelMappping } from "@/utils/policies";

export default function PolicyCard({ policy, onClick, className }) {

    const priceParts = formatPriceAsIntegerAndDecimal(parseFloat(policy?.total_premium / 12));

    const { vw, vh } = useViewport();

    if (vw < config.breakpoints.md) {
        return <>
            <div onClick={onClick} className={`relative bg-white rounded-lg border-2 border-gray-200 p-4 gap-4 flex flex-col items-center justify-between cursor-pointer hover:bg-gray-100 ${className ?? ''}`}>
                <div className={`absolute top-0 right-0 ${policy?.status === 'active' ? 'success-dark' : 'blue-500'} text-white px-2 py-1 rounded-bl-lg rounded-tr-lg uppercase text-xs font-bold`}>
                    {ucfirst(statusLabelMappping[policy?.status ?? 'pending']) ?? statusLabelMappping['default']}
                </div>
                
                <div className="flex items-center justify-between mb-2 w-full">
                    <div className="flex items-center gap-4">
                        <div>
                            N° {policy?.id ?? '...'}
                        </div>
                    </div>

                </div>
                <div className="flex flex-row items-center justify-start gap-8 w-full">

                    <div className="flex flex-col gap-2 items-center justify-center">
                        <Image src={productIcons[policy?.product?.type]} alt="" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-bold text-blue-900">
                            {policy?.summary?.primary ?? '...'}
                        </h4>

                        <div className="text-blue-800 text-xl">
                            <div className="text-blue-800 text-xl">
                                {policy?.summary?.secondary ?? '...'}
                            </div>
                        </div>
                    </div>
                </div>

                <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400 absolute top-1/2 right-4 transform -translate-y-1/2 text-xl" />
                
            </div>
        </>
    } else {
        return <>
            <div onClick={onClick} className={`bg-white shadow-opaque rounded-lg p-5 border-2 border-gray-200 h-full cursor-pointer flex-col items-center justify-between hover:shadow-lg ${className ?? ''}`}>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xl font-bold">
                        N° {policy?.id ?? '...'}
                    </span>

                    <PolicyBadge policy={policy} />

                </div>

                <div className="flex items-center justify-between mb-2">

                    <div className="flex items-center justify-end relative top-[5px] right-[5px]">
                        <div className="flex items-center gap-8">

                            <Image src={productIcons[policy?.product?.type]} className="mb-2" alt="" />

                            <div className="flex flex-col gap-2">
                                <h4 className="text-xl font-bold text-blue-900">
                                    {policy.summary?.primary ?? '...'}
                                </h4>

                                <div className="text-blue-800 text-xl">
                                    <div className="text-blue-800 text-xl">
                                        {policy.summary?.secondary ?? '...'}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex items-center justify-end gap-2 w-full">

                            <div className="flex items-center bg-gray-50 p-4 rounded-xl justify-between relative cursor-pointer hover:bg-gray-100 w-full gap-24">
                                <div className="text-xl">
                                    Formule <br />
                                    <span>
                                        {ucfirst(policy?.formula?.name ?? '...')}
                                    </span>
                                </div>

                                <div className="text-xl">
                                    <div className="price relative">
                                        <div className="price-currency text-xl">
                                            <span className="text-3xl font-bold">
                                                {priceParts?.integer ?? '...'}
                                            </span>
                                            <sup className="text-xl relative">
                                                <span>
                                                    ,{priceParts?.decimal ?? '...'}€
                                                </span>
                                            </sup>
                                            <span className="text-xs absolute top-[15px] right-0 text-gray-500">
                                                /mois
                                            </span>
                                        </div>
                                        <div className="price-amount text-xs">
                                            soit {formatEuro(policy?.total_premium) ?? '...'}/an
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />

                    </div>

                </div>

            </div>
        </>
    }
}