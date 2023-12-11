import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Badge from "@/components/Badge";
import { ucfirst } from "@/utils/format";
import { statusLabelMappping } from "@/utils/claims";

export default function ClaimSmallCard({ claim, onClick }) {
    return <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md flex-1 rounded-xl relative cursor-pointer hover:bg-gray-100" onClick={onClick}>

        <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xl font-bold">
                {ucfirst(claim?.policy.product?.type) ?? '...'}
            </span>

            <span className="text-gray-500 text-xl">
                {claim?.data?.claimType?.label ?? '...'}
            </span>
        </div>

        <div className="flex items-center gap-2">

            <span className="text-gray-500 text-xl">
                <Badge variant="success" className="text-white">
                    {statusLabelMappping[claim.status] ?? statusLabelMappping['default']}
                </Badge>
            </span>

            <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />

        </div>
    </div>
}