import useSWR from 'swr';
import fetcher from '@/lib/api/fetcher';

export default function useCustomerPolicies() {
    const { data, error, mutate } = useSWR('/api/my-policies', fetcher);

    return {
        policies: data?.data ?? [],
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}