'use client';

import Loader from "@/components/Loader";
import config from "@/utils/config";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthAgg({ params }) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const quoteId = searchParams.get('quoteId');
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmContent = searchParams.get('utm_content');
    const utmTerm = searchParams.get('utm_term');

    if (!quoteId) {
        router.push('/auth/login');
        return null;
    }

    useEffect(() => {
        window.location.href = config.app.subscriptionUrl + '/offres/' + quoteId + '?utm_source=' + utmSource + '&utm_medium=' + utmMedium + '&utm_campaign=' + utmCampaign + '&utm_content=' + utmContent + '&utm_term=' + utmTerm;
    }, []);

    return <>
        <Loader message={'Redirection en cours...'} />
    </>
}