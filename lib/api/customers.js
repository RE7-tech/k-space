import client from './client';

export function getCustomer(id) {
  return client.get(`/api/customers/${id}`);
}

export function getCustomers(params = {}) {
    return client.get(`/api/customers`, {
        params
    });
}

export function createCustomer(data) {
    return client.post(`/api/customers`, data);
}

export function updateCustomer(id, data) {
    return client.put(`/api/customers/${id}`, data);
}

