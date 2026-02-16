import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:5001/api/v1";

const publicApi = axios.create({ baseURL, withCredentials: true });

export const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    const token = (session as { accessToken?: string })?.accessToken;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window !== "undefined") {
      const { toast } = await import("sonner");
      const message =
        error?.response?.data?.message || error?.message || "Something went wrong";
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export async function loginRequest(payload: { email: string; password: string }) {
  const { data } = await publicApi.post("/auth/login", payload);
  return data?.data;
}

export async function requestForgotPassword(email: string) {
  const { data } = await publicApi.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(payload: { email: string; otp: string; password?: string }) {
  const { data } = await publicApi.post("/auth/reset-password", {
    email: payload.email,
    otp: payload.otp,
    password: payload.password
  });
  return data;
}

export async function changePassword(payload: { oldPassword: string; newPassword: string }) {
  const { data } = await api.post("/auth/change-password", payload);
  return data;
}

export async function fetchDashboardOverview() {
  const { data } = await api.get("/admin/dashboard");
  return data?.data;
}

export async function fetchReportAnalytics() {
  const { data } = await api.get("/admin/reports");
  return data?.data;
}

export async function fetchPlanSummary() {
  const { data } = await api.get("/admin/plan-summary");
  return data?.data;
}

export async function fetchStudents(params: { page: number; limit: number }) {
  const { data } = await api.get("/admin/students", { params });
  return data?.data;
}

export async function fetchSubscriptions(params: { page: number; limit: number; plan?: string }) {
  const { data } = await api.get("/admin/subscriptions", { params });
  return data?.data;
}

export async function fetchTopStudents(params: { page: number; limit: number }) {
  const { data } = await api.get("/admin/top-students", { params });
  return data?.data;
}
