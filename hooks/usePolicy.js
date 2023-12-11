import fetcher from "@/lib/api/fetcher";
import useSWR from "swr";

export default function usePolicy(id) {
  const {
    data,
    error,
    mutate
  } = useSWR(`/api/policies/${id}`, fetcher, {
    revalidateOnFocus: false
  });

  const loading = !data && !error;
  const notFound = error && error.status === 404;
  const hasPolicy = data && data.id === id;
  return {
    loading,
    notFound,
    hasPolicy,
    policy: data?.data ?? {},
    mutate
  };
}