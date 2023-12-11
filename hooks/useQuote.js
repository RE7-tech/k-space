import fetcher from "@/lib/api/fetcher";
import useSWR from "swr";

export default function useQuote(id) {
  const {
    data,
    error,
    mutate
  } = useSWR(`/api/quotes/${id}`, fetcher, {
    revalidateOnFocus: false
  });

  const loading = !data && !error;
  const notFound = error && error.status === 404;
  const hasQuote = data && data.id === id;
  return {
    loading,
    notFound,
    hasQuote,
    quote: data,
    mutate
  };
}