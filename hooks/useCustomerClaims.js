import useSWR from 'swr';
import fetcher from '@/lib/api/fetcher';

export default function useCustomerClaims() {
    const {
        data,
        error,
        mutate
    } = useSWR('/api/my-claims', fetcher);
    return {
        claims: data?.data ?? [],
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}