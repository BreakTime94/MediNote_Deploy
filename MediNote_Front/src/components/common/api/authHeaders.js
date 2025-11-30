// src/api/authHeaders.js
export function buildAuthHeaders(member, { includeId = true } = {}) {
    const headers = {};
    if (member?.role) {
        headers["X-Role"] = String(member.role).toUpperCase(); // "ADMIN" / "USER"
    }
    if (includeId && member?.id != null) {
        headers["X-Member-Id"] = String(member.id); // 게이트웨이가 또 넣어도 무해
    }
    return headers;
}