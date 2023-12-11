'use client';

import Loader from '@/components/Loader';
import Page from '@/components/Page';
import { useRouter } from 'next/navigation';

export default function Quote ({ params }) {

    const router = useRouter();
    const quoteId = params?.quoteId;

    setTimeout(() => {
        window.open('https://souscription.klian.fr/offers/' + quoteId, '_blank');
    }, 1000);

    return <>
        <Page>
            <Loader message={`Redirection vers votre devis...`} />
        </Page>
    </>
}