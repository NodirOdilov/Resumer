import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  "http://localhost:8000/api/v1";

const ACCESS_KEY = "resumer_access";
const REFRESH_KEY = "resumer_refresh";

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(ACCESS_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh,
          });
          await SecureStore.setItemAsync(ACCESS_KEY, data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          await clearTokens();
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function saveTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync(ACCESS_KEY, access);
  await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

export async function hasToken(): Promise<boolean> {
  const token = await SecureStore.getItemAsync(ACCESS_KEY);
  return Boolean(token);
}

// --- API methods ---

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login/", { email, password }),
  register: (email: string, password: string, first_name?: string) =>
    api.post("/auth/register/", {
      email,
      password,
      password_confirm: password,
      first_name: first_name || "",
    }),
  me: () => api.get("/auth/me/"),
  logout: (refresh: string) => api.post("/auth/logout/", { refresh }),
};

export const resumeApi = {
  list: () => api.get("/resumes/"),
  get: (id: string) => api.get(`/resumes/${id}/`),
  create: (title: string, template?: string) =>
    api.post("/resumes/", { title, ...(template ? { template } : {}) }),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/resumes/${id}/`, data),
  delete: (id: string) => api.delete(`/resumes/${id}/`),
  export: (id: string, format: "pdf" | "docx" | "txt") =>
    api.post("/documents/export/", {
      document_type: "resume",
      document_id: id,
      format,
    }),
};

export const templateApi = {
  list: (type = "resume") => api.get("/templates/", { params: { type } }),
};

export const searchApi = {
  query: (q: string) => api.get("/search/", { params: { q, limit: 10 } }),
};

export const telegramApi = {
  linkToken: () => api.post("/telegram/link-token/"),
  me: () => api.get("/telegram/me/"),
  unlink: () => api.delete("/telegram/unlink/"),
};
