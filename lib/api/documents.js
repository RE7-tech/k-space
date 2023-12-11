import client from "./client";

export function getDocument (id, params = {}) {
    return client.get(`/api/documents/${id}`, { params });
}

export function downloadDocument (id, params = {}) {
    return client.get(`/api/documents/${id}/download`, { params, responseType: 'blob' });
}

export function uploadPolicySupportingDocument(id, data) {
    return client.post(`/api/policies/${id}/upload-supporting-document`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}