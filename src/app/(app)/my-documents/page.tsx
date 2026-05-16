"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { useResumes, useDeleteResume, useDuplicateResume } from "@/hooks/useResume";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type DocType = "resume" | "cv" | "cover-letter";

interface DocumentItem {
  id: string;
  title: string;
  type: DocType;
  template: string;
  updatedAt: string;
}

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

function editPathFor(type: DocType): string {
  return type === "resume"
    ? "/build-resume"
    : type === "cv"
    ? "/build-cv"
    : "/build-letter";
}

function DocumentCard({
  doc,
  onDelete,
  onDuplicate,
}: {
  doc: DocumentItem;
  onDelete: (doc: DocumentItem) => void;
  onDuplicate: (doc: DocumentItem) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const editPath = `${editPathFor(doc.type)}?id=${doc.id}`;

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="aspect-[3/4] bg-gray-50 p-4">
        <div className="h-full w-full space-y-2 rounded border border-gray-200 bg-white p-3">
          <div className="h-2.5 w-1/2 rounded bg-[#0D47A1]/15" />
          <div className="h-1.5 w-full rounded bg-gray-100" />
          <div className="h-1.5 w-5/6 rounded bg-gray-100" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-100" />
          <div className="h-1.5 w-4/5 rounded bg-gray-100" />
        </div>
      </div>

      {showActions && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40">
          <Button asChild size="sm">
            <Link href={editPath}>Изменить</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={() => onDuplicate(doc)}
          >
            Дублировать
          </Button>
        </div>
      )}

      <div className="p-4">
        <h3 className="truncate font-semibold text-gray-900">{doc.title}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">{doc.template || "—"}</span>
          <span className="text-xs text-gray-400">{fmtDate(doc.updatedAt)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
            <Link href={editPath}>Изменить</Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => onDuplicate(doc)}
            title="Дублировать"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-red-500 hover:text-red-700"
            onClick={() => onDelete(doc)}
            title="Удалить"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MyDocumentsPage() {
  const queryClient = useQueryClient();
  const resumesQuery = useResumes();
  const cvsQuery = useQuery({
    queryKey: ["cvs"],
    queryFn: async () => (await api.get("/cvs/")).data,
  });
  const coverLettersQuery = useQuery({
    queryKey: ["cover-letters"],
    queryFn: async () => (await api.get("/cover-letters/")).data,
  });

  const deleteResume = useDeleteResume();
  const duplicateResume = useDuplicateResume();
  const deleteCv = useMutation({
    mutationFn: async (id: string) => api.delete(`/cvs/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cvs"] }),
  });
  const deleteCl = useMutation({
    mutationFn: async (id: string) => api.delete(`/cover-letters/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cover-letters"] }),
  });

  const allDocs = useMemo<DocumentItem[]>(() => {
    const items: DocumentItem[] = [];
    const list = (q: { data?: { results?: unknown[] } } | undefined) =>
      q?.data?.results ?? [];
    for (const r of list(resumesQuery as never) as Array<Record<string, unknown>>) {
      items.push({
        id: String(r.id),
        title: String(r.title || "Untitled resume"),
        type: "resume",
        template: String(r.templateSlug || ""),
        updatedAt: String(r.updatedAt || ""),
      });
    }
    for (const r of list(cvsQuery as never) as Array<Record<string, unknown>>) {
      items.push({
        id: String(r.id),
        title: String(r.title || "Untitled CV"),
        type: "cv",
        template: String(r.templateSlug || ""),
        updatedAt: String(r.updatedAt || ""),
      });
    }
    for (const r of list(coverLettersQuery as never) as Array<Record<string, unknown>>) {
      items.push({
        id: String(r.id),
        title: String(r.title || "Untitled cover letter"),
        type: "cover-letter",
        template: String(r.templateSlug || ""),
        updatedAt: String(r.updatedAt || ""),
      });
    }
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [resumesQuery, cvsQuery, coverLettersQuery]);

  function handleDelete(doc: DocumentItem) {
    if (!confirm(`Удалить "${doc.title}"? Это действие нельзя отменить.`)) return;
    if (doc.type === "resume") deleteResume.mutate(doc.id);
    else if (doc.type === "cv") deleteCv.mutate(doc.id);
    else deleteCl.mutate(doc.id);
  }

  function handleDuplicate(doc: DocumentItem) {
    if (doc.type === "resume") {
      duplicateResume.mutate(doc.id);
    } else {
      // Generic duplicate: read + post a new copy
      const path = doc.type === "cv" ? "/cvs/" : "/cover-letters/";
      api.get(`${path}${doc.id}/`).then((res) => {
        const data = res.data as Record<string, unknown>;
        api.post(path, {
          ...data,
          id: undefined,
          title: `${data.title} (Copy)`,
        }).then(() => {
          queryClient.invalidateQueries({
            queryKey: [doc.type === "cv" ? "cvs" : "cover-letters"],
          });
        });
      });
    }
  }

  const isLoading =
    resumesQuery.isLoading ||
    cvsQuery.isLoading ||
    coverLettersQuery.isLoading;

  const filtered = (type: DocType) => allDocs.filter((d) => d.type === type);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Мои документы</h1>
              <p className="mt-1 text-gray-500">
                Управляйте резюме, CV и сопроводительными письмами.
              </p>
            </div>
            <Button asChild>
              <Link href="/build-resume">Новый документ</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500">
              Загрузка документов…
            </div>
          ) : allDocs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <p className="text-sm text-gray-500">
                Вы ещё не создали ни одного документа.
              </p>
              <Button asChild className="mt-4">
                <Link href="/build-resume">Создать первое резюме</Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Все ({allDocs.length})</TabsTrigger>
                <TabsTrigger value="resume">Резюме ({filtered("resume").length})</TabsTrigger>
                <TabsTrigger value="cv">CV ({filtered("cv").length})</TabsTrigger>
                <TabsTrigger value="cover-letter">Письма ({filtered("cover-letter").length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {allDocs.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} onDuplicate={handleDuplicate} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="resume">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered("resume").map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} onDuplicate={handleDuplicate} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="cv">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered("cv").map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} onDuplicate={handleDuplicate} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="cover-letter">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered("cover-letter").map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} onDuplicate={handleDuplicate} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
}
