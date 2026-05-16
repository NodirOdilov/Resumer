'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import type {
  AuthTokens,
  LoginCredentials,
  RegisterData,
  User,
} from '@/types';

// ── API calls ────────────────────────────────────────────────────────────────

async function loginApi(credentials: LoginCredentials): Promise<AuthTokens & { user: User }> {
  const { data } = await api.post<AuthTokens & { user: User }>(
    '/auth/login/',
    credentials,
  );
  return data;
}

async function registerApi(payload: RegisterData): Promise<AuthTokens & { user: User }> {
  const { data } = await api.post<AuthTokens & { user: User }>(
    '/auth/register/',
    payload,
  );
  return data;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  const storeLogout = useAuthStore((s) => s.logout);
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      setUser(data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      setUser(data.user);
    },
  });

  function login(email: string, password: string) {
    return loginMutation.mutateAsync({ email, password });
  }

  function register(data: RegisterData) {
    return registerMutation.mutateAsync(data);
  }

  function logout() {
    storeLogout();
    queryClient.clear();
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    fetchCurrentUser,
    loginMutation,
    registerMutation,
  };
}
