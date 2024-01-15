import client from "./client";

export function getPolicy(policyId) {
  return client.get("/api/policies/" + policyId);
}