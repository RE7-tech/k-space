import { formatEuro, formatLicensePlate, formatPriceAsIntegerAndDecimal, ucfirst } from "@/utils/format";
import { productIcons } from "@/utils/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import config from "@/utils/config";
import { useViewport } from "react-viewport-hooks";

export default function QuoteCard({ quote, onClick }) {

    const priceParts = formatPriceAsIntegerAndDecimal(quote?.total_premium);

    const { vw, vh } = useViewport();

    if (vw < config.breakpoints.md) {
        return <>
            <div className="bg-white rounded-md border-2 border-gray-200 p-4 gap-2 flex flex-col items-center justify-between cursor-pointer hover:bg-gray-100" onClick={onClick}>
                <div className="flex items-center justify-between mb-2 w-full">
                    <div className="flex items-center gap-4">
                        <div>
                            N° {quote?.id ?? '...'}
                        </div>
                        <quoteBadge quote={quote} />
                    </div>

                    <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />
                </div>
                <div className="flex flex-row items-center justify-between w-full">

                    <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-bold text-blue-900">
                            {ucfirst(quote?.product?.type ?? '...')} - {ucfirst(quote?.formula?.name ?? '...')}
                        </h4>

                        <div className="text-blue-800 text-xl">
                            <div className="text-blue-800 text-xl">
                                {["home", "mrh"].includes(quote?.product?.type) ? <>
                                    {quote?.fields?.address ?? '...'}
                                </> : <>
                                    {formatLicensePlate(quote?.fields?.license_plate) ?? '...'}
                                </>}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-center">
                        <Image src={productIcons[quote?.product?.type]} alt="" />
                    </div>

                </div>

                <div className="bg-gray-100 rounded-md p-4 w-full flex items-center justify-between mt-4">

                    <div className="flex flex-col gap-2 text-gray-500 text-xl">
                        Formule <br />
                        <strong>{ucfirst(quote?.formula?.name ?? '...')}</strong>
                    </div>

                    <div className="">
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
                                soit {formatEuro(quote?.total_premium) ?? '...'}/an
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    } else {
        return <>
            <div className="bg-white shadow-opaque rounded-lg p-4 border-2 border-gray-200 h-full cursor-pointer flex-col items-center justify-between hover:shadow-lg" onClick={onClick}>

                <div className="flex items-center justify-between mb-2">
                    N° {quote?.id ?? '...'}
                </div>

                <div className="flex items-center justify-between mb-2">

                    <div className="flex items-center justify-end relative top-[5px] right-[5px]">
                        <div className="flex items-center gap-8">

                            <Image src={productIcons[quote?.product?.type]} className="mb-2" alt="" />

                            <div className="flex flex-col gap-2">
                                <h4 className="text-xl font-bold text-blue-900">
                                    {ucfirst(quote?.product?.type) ?? '...'} - {ucfirst(quote?.formula?.name) ?? '...'}
                                </h4>

                                <div className="text-blue-800 text-xl">
                                    <div className="text-blue-800 text-xl">
                                        {formatLicensePlate(quote?.fields?.license_plate) ?? '...'}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex items-center justify-end gap-2 w-full">

                            <div className="flex items-center bg-gray-50 p-4 rounded-xl justify-between relative cursor-pointer hover:bg-gray-100 w-full gap-24">
                                <div className="text-gray-500 text-xl">
                                    Formule <br />
                                    <span className="uppercase">
                                        {quote?.formula?.name ?? '...'}
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
                                            soit {formatEuro(quote?.total_premium) ?? '...'}/an
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <FontAwesomeIcon icon={faChevronRight} width={18} height={18} />

                    </div>

                </div>

            </div>
        </>
    }
}