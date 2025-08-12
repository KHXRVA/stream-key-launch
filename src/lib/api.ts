// src/lib/api.ts
// Универсальная обертка для API-запросов с поддержкой авторизации и обработки ошибок

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, token } = options;
  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) {
    fetchHeaders['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }
  if (response.status === 204) return {} as T;
  return response.json();
}

// Пример использования:
// const data = await apiFetch('/status', { token });
