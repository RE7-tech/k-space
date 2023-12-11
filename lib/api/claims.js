import client from "./client";

export function saveClaim(data = {}) {
  return client.post("/api/claims", data);
}

export function getCustomerClaims() {
  return client.get("/api/customers/claims");
}

export function getClaim(claimId) {
  return client.get("/api/claims/" + claimId);
}

export function getClaimDocuments(claimId) {
  return client.get("/api/claims/" + claimId + "/documents");
}

export function addClaimAttachment(claimId, data) {
  return client.post("/api/claims/" + claimId + "/attachments", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}