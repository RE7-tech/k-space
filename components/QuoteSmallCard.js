import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { formatEuro, ucfirst } from "@/utils/format";

export default function QuoteSmallCard({ quote, onClick }) {
    return <>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md flex-1 rounded-xl relative cursor-pointer hover:bg-gray-100" onClick={onClick}>
            <div className="text-foreground text-xl font-bold">
                {ucfirst(quote?.product?.type) ?? '...'}
            </div>

            <div className="flex flex-start items-center gap-4">
                <div className="flex flex-col items-start gap-2 text-blue-default">
                    <span className="text-blue-default text-xl font-bold">
                        {quote?.formula?.name ?? '...'}
                    </span>

                    <span className="text-blue-default text-xl">
                        {formatEuro(quote?.total_premium) ?? '...'}/mois
                    </span>

                </div>

                <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />
            </div>

        </div>
    </>
}