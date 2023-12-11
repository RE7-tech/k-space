import fetcher from "@/lib/api/fetcher";
import useSWR from "swr";

export default function useCustomerQuotes(params = {}) {
    const { data, error, mutate } = useSWR(`/api/my-quotes`, fetcher, params);

    return {
        quotes: data?.data ?? [],
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}