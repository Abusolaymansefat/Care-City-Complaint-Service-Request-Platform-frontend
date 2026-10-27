import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

const configuredBaseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const baseURL = configuredBaseURL
  ? /\/api\/v1$/i.test(configuredBaseURL)
    ? configuredBaseURL
    : `${configuredBaseURL}/api/v1`
  : undefined;

export const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string> | null = null;

const refreshAccessToken = async () => {
  const { refreshToken, setTokens } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post(
    `${baseURL}/auth/refresh-token`,
    { refreshToken },
    { withCredentials: true }
  );
  const { accessToken, refreshToken: newRefresh } = res.data.data;
  setTokens(accessToken, newRefresh);
  return accessToken as string;
};



const skipRefresh = /\/auth\/(login|register|verify-email|google-login|refresh-token)/;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && original && !original._retry && !skipRefresh.test(original.url ?? "")) {
      original._retry = true;
      try {
        refreshing ??= refreshAccessToken().finally(() => (refreshing = null));
        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);