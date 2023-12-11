import useSWR from 'swr';
import fetcher from '@/lib/api/fetcher';

export default function useSupportingDocumentParts (policyId, supportingDocumentId) {
    const {
        data,
        error,
        mutate
    } = useSWR(`/api/policies/${policyId}/supporting-documents/${supportingDocumentId}/parts`, fetcher, {
        revalidateOnFocus: false
    });
    const loading = !data && !error;
    const notFound = error && error.status === 404;
    const hasSupportingDocumentParts = data && data.id === supportingDocumentId;
    return {
        loading,
        notFound,
        hasSupportingDocumentParts,
        supportingDocumentParts: data?.data ?? {},
        mutate
    };
}