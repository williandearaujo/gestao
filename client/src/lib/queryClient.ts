import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

const API_BASE = "http://localhost:8000";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const sessionId = localStorage.getItem("sessionId");
  const headers: Record<string, string> = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {})
  };

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include"
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> = ({ on401 }) => async ({ queryKey }) => {
  const sessionId = localStorage.getItem("sessionId");
  const headers: Record<string, string> = {
    ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {})
  };

  const res = await fetch(`${API_BASE}${queryKey[0]}`, {
    credentials: "include",
    headers
  });

  if (on401 === "returnNull" && res.status === 401) {
    return null as T;
  }

  await throwIfResNotOk(res);
  return (await res.json()) as T;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});
