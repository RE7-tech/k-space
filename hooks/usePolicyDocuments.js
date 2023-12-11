import fetcher from "@/lib/api/fetcher";
import useSWR from "swr";

export default function usePolicyDocuments (policyId) {
    const { data, error, mutate } = useSWR(`/api/policies/${policyId}/documents`, fetcher, {
        revalidateOnFocus: false
    });

    const loading = !data && !error;
    const notFound = error && error.status === 404;
    const hasPolicyDocuments = data && data.id === policyId;
    
    return {
        loading,
        notFound,
        hasPolicyDocuments,
        policyDocuments: data?.data ?? [],
        mutate
    };
}