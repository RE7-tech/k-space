'use client';

import { formatDate, ucfirst } from '@/utils/format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// components/ClaimCard.js
import React from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ClaimCard = ({ claim, onClick }) => {

    const statusLabelsMapping = {
        'pending': 'En cours',
        'accepted': 'Accepté',
        'refused': 'Refusé',
        'default': 'En cours',
    };

    return (
        <div className="relative bg-white rounded-lg p-4 w-full border-2 border-gray-200 cursor-pointer hover:border-gray-300" onClick={onClick}>
            <div className="absolute top-0 right-0 bg-success-dark text-white px-2 py-1 rounded-bl-lg rounded-tr-lg uppercase text-xs font-bold">
                {statusLabelsMapping[claim.status] ?? statusLabelsMapping['default']}
            </div>
            <div className='flex flex-col gap-2'>
                <div className="text-gray-500 text-sm">
                    N° {claim.id}
                </div>
                <div className="text-gray-800 font-bold text-xl">
                    {ucfirst(claim?.policy?.product?.type ?? '...')} - {ucfirst(claim?.data?.claimType?.value ?? '...')}
                </div>
                <div className="text-gray-600 text-sm">{formatDate(claim.created_at, true)}</div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 absolute top-1/2 right-4 transform -translate-y-1/2 text-xl" />
        </div>
    );
};

export default ClaimCard;
