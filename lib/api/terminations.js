import client from './client';

export function createTermination(policyId, termination, comment, is_offline) {
    return client.post("/api/terminations", {
        policy_id: policyId,
        data: termination,
        comment: comment,
        is_offline: is_offline
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function addTerminationAttachment(terminationId, file) {
    const formData = new FormData();
    formData.append('attachment', file);

    return client.post(`/api/terminations/${terminationId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function getCustomerTerminationReasons () {
    return client.get("/api/customer-termination-reasons");
}