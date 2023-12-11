'use client';

import fetcher from "@/lib/api/fetcher";
import useSWR from "swr";

export default function usePolicySupportingDocuments(policyId) {
    const {
        data,
        error,
        mutate
    } = useSWR(`/api/policies/${policyId}/supporting-documents`, fetcher, {
        revalidateOnFocus: false
    });
    const loading = !data && !error;
    const notFound = error && error.status === 404;
    const hasPolicySupportingDocuments = data && data.id === policyId;
    return {
        loading,
        notFound,
        hasPolicySupportingDocuments,
        policySupportingDocuments: data?.data ?? {},
        mutate
    };
}