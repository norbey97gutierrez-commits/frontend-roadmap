const getApiBase = () => {
  const envBase = import.meta.env.VITE_API_BASE;
  return envBase && envBase !== 'undefined' ? envBase : 'http://localhost:8000';
};

export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = getApiBase();
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(`${baseUrl}${path}`, { ...options, headers });
}
