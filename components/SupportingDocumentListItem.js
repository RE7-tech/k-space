'use client';

import Image from 'next/image';
import ThreeStarsIcon from '@/public/misc/threestars.svg';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge from '@/components/Badge';
import { supportingDocumentIcons } from '@/utils/supportingDocuments';
import { statusBadgeMap } from '@/utils/supportingDocuments';


export default function SupportingDocumentListItem({ supportingDocument, onClick, hasBorderBottom = true }) {

    const sd = supportingDocument;

    function canViewSupportingDocument(sd) {
        return [
            'validated',
            'accepted',
            'pending',
            'approved',
            'approved_auto',
            'accepted_auto',
            'validated_auto',
        ].includes(sd?.status?.toLowerCase());
    }


    return <>
        <div className={`flex items-center justify-between py-4 ${hasBorderBottom ? 'border-b border-gray-100' : ''} cursor-pointer hover:opacity-80`} onClick={onClick}>
            <div className="flex flex-row gap-8">
                <Image alt="" src={supportingDocumentIcons[sd?.key]} width={32} height={32} />
                <div className="flex flex-col gap-2 justify-center items-start">
                    <span className="text-xl font-normal">
                        {sd?.label ?? '...'}
                    </span>
                    {statusBadgeMap(sd)}
                </div>
            </div>
            {canViewSupportingDocument(sd) ? <>
                <FontAwesomeIcon icon={faEye} width={18} height={18} className="text-gray-400" />
            </> : null}
        </div>
    </>
}