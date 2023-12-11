import fetcher from "@/lib/api/fetcher";
import useSWR from "swr";

export default function useCustomerNotifications () {
    const { data, error, mutate } = useSWR(`/api/my-alerts`, fetcher, {
        revalidateOnFocus: false
    });

    const loading = !data && !error;
    const notFound = error && error.status === 404;
    const hasCustomerNotifications = data;
    
    return {
        loading,
        notFound,
        hasCustomerNotifications,
        notifications: data?.data ?? [],
        mutate
    };
}