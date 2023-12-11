'use client';

import Loader from '@/components/Loader';
import Page from '@/components/Page';
import { useRouter } from 'next/navigation';

export default function Quote ({ params }) {

    return <>
        <iframe src={'https://souscription.klian.fr/offers/' + quoteId} className="w-full h-full" />
    </>
}