const getApiBase = () => {
  const envBase = import.meta.env.VITE_API_BASE;
  return envBase && envBase !== 'undefined' ? envBase : 'http://localhost:8000';
};

const API_BASE = getApiBase();

export const loginWithGoogle = () => {
  const baseUrl = getApiBase();
  window.location.href = `${baseUrl}/api/v1/auth/google/login`;
};

export async function handleGoogleCallback(code: string) {
  const baseUrl = getApiBase();
  const res = await fetch(`${baseUrl}/api/v1/auth/google/callback?code=${code}`);
  if (!res.ok) throw new Error("Error en callback");
  return res.json();
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token");
  const baseUrl = getApiBase();
  const res = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  if (!res.ok) throw new Error("Error refresh");
  return res.json();
}

export async function revokeToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return;
  const baseUrl = getApiBase();
  await fetch(`${baseUrl}/api/v1/auth/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
}
