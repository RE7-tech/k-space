import fetcher from "@/lib/api/fetcher";
import useSWR from "swr";

export default function usePolicyClaims (policyId) {
    const { data, error, mutate } = useSWR(`/api/policies/${policyId}/claims`, fetcher, {
        revalidateOnFocus: false
    });

    const loading = !data && !error;
    const notFound = error && error.status === 404;
    const hasPolicyClaims = data && data.id === policyId;
    
    return {
        loading,
        notFound,
        hasPolicyClaims,
        policyClaims: data?.data ?? [],
        mutate
    };
}