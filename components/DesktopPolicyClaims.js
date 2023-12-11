import { useEffect, useState } from 'react';
import { formatDate, ucfirst } from '@/utils/format';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Badge from '@/components/Badge';
import { statusLabelMappping } from '@/utils/claims';
import { useRouter } from 'next/navigation';

export default function DesktopPolicyClaims({ policyClaims }) {

    const router = useRouter();

    const handleClaimClick = (claim) => {
        router.push('/claims/' + claim.id);
    }

    return <>
        <table className="w-full border-separate border-spacing-y-6">
            <thead >
                <tr className="text-gray-400 p-0">
                    <th className=" text-left p-0">N° du sinistre</th>
                    <th className=" text-left p-0">Type</th>
                    <th className=" text-left p-0">Date</th>
                    <th className=" text-left p-0">Statut</th>
                </tr>
            </thead>
            <tbody >
                {(policyClaims ?? []).map((claim, idx) => {
                    return <tr key={idx} className="shadow-opaque bg-white p-4 rounded-md hover:opacity-50 transition-opacity cursor-pointer" onClick={() => handleClaimClick(claim)}>
                        <td className="px-4 py-4 border-l border-gray-200 border-t">
                            N°{claim?.id}
                        </td>
                        <td className="py-4 border-t border-gray-200 ">
                            {ucfirst(claim?.policy?.product?.type ?? '...')} - {claim?.data?.claimType?.label ?? '...'}
                        </td>
                        <td className="py-4 border-t border-gray-200 ">
                            {formatDate(claim?.created_at, true)}
                        </td>
                        <td className="py-4 border-t border-gray-200 flex flew-row gap-4 items-center">
                            <span className="text-gray-500 text-xl">
                                <Badge variant="success" className="text-white">
                                    {statusLabelMappping[claim.status] ?? statusLabelMappping['default']}
                                </Badge>
                            </span>

                            <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />
                        </td>

                    </tr>
                })}
                {(policyClaims?.length === 0) && <tr className="shadow-opaque p-4 rounded-md hover:opacity-50 transition-opacity cursor-pointer">
                    <td colSpan={5} className="p-4 border-l border-gray-200 font-bold border-t text-center">
                        Formidable, vous n'avez aucun sinistre !
                    </td>
                </tr>}
            </tbody>
        </table>
    </>
}