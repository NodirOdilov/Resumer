'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  Resume,
  ResumeListItem,
  CreateResumeData,
  UpdateResumeData,
  PaginatedResponse,
} from '@/types';

const RESUMES_KEY = ['resumes'] as const;

function resumeKey(id: string) {
  return ['resumes', id] as const;
}

// ── API calls ────────────────────────────────────────────────────────────────

async function fetchResumes(): Promise<PaginatedResponse<ResumeListItem>> {
  const { data } = await api.get<PaginatedResponse<ResumeListItem>>('/resumes/');
  return data;
}

async function fetchResume(id: string): Promise<Resume> {
  const { data } = await api.get<Resume>(`/resumes/${id}/`);
  return data;
}

async function createResume(payload: CreateResumeData): Promise<Resume> {
  const { data } = await api.post<Resume>('/resumes/', payload);
  return data;
}

async function updateResume({
  id,
  ...payload
}: UpdateResumeData & { id: string }): Promise<Resume> {
  const { data } = await api.patch<Resume>(`/resumes/${id}/`, payload);
  return data;
}

async function deleteResume(id: string): Promise<void> {
  await api.delete(`/resumes/${id}/`);
}

async function duplicateResume(id: string): Promise<Resume> {
  const { data } = await api.post<Resume>(`/resumes/${id}/duplicate/`);
  return data;
}

// ── Query hooks ──────────────────────────────────────────────────────────────

export function useResumes(): UseQueryResult<PaginatedResponse<ResumeListItem>> {
  return useQuery({
    queryKey: RESUMES_KEY,
    queryFn: fetchResumes,
  });
}

export function useResume(id: string | null): UseQueryResult<Resume> {
  return useQuery({
    queryKey: resumeKey(id ?? ''),
    queryFn: () => fetchResume(id!),
    enabled: !!id,
  });
}

// ── Mutation hooks ───────────────────────────────────────────────────────────

export function useCreateResume(): UseMutationResult<Resume, Error, CreateResumeData> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}

export function useUpdateResume(): UseMutationResult<
  Resume,
  Error,
  UpdateResumeData & { id: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      queryClient.setQueryData(resumeKey(data.id), data);
      queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}

export function useDeleteResume(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResume,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: resumeKey(id) });
      queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}

export function useDuplicateResume(): UseMutationResult<Resume, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: duplicateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}
