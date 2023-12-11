import client from "./client";

export default function makeFusion(formData) {
    return client.post(`/api/fusion`, formData, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}