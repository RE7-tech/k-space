export function getPlaces(params = {}) {
    const response = client.get("/api/places", {
        params
    });
    return response;
}