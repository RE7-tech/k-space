'use client';

import useSWR from 'swr';
import fetcher from '@/lib/api/fetcher';


export default function useClaim (claimId) {
    const { data, error, mutate } = useSWR(`/api/claims/${claimId}`, fetcher, {
        revalidateOnFocus: false
    });

    const loading = !data && !error;
    const notFound = error && error.status === 404;
    const hasClaim = data;
    
    return {
        loading,
        notFound,
        hasClaim,
        claim: data?.data ?? [],
        mutate
    };
}