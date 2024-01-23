import client from "./client";

export function getPolicy(policyId) {
  return client.get("/api/policies/" + policyId);
}

export function createPolicyPayment (policyId, params = {}) {
  return client.post("/api/policies/" + policyId + "/create-payment", params = {});
}