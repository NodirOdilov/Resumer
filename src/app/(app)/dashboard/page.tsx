"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { Header } from "@/components/layout/Header";
import { useResumes } from "@/hooks/useResume";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const quickActions = [
  { label: "Создать резюме", href: "/build-resume", icon: "document", color: "bg-[#0D47A1]" },
  { label: "Создать CV", href: "/build-cv", icon: "academic", color: "bg-emerald-600" },
  { label: "Создать письмо", href: "/build-letter", icon: "mail", color: "bg-purple-600" },
];

interface ListItem {
  id: string;
  title: string;
  type: string;
  templateSlug?: string;
  updatedAt: string;
  hrefPath: string;
}

function relTime(iso?: string): string {
  if (!iso) return "—";
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "—";
  }
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const resumesQuery = useResumes();

  // Pull cover letters and CVs in one go via the same query infrastructure.
  const cvsQuery = useQuery({
    queryKey: ["cvs"],
    queryFn: async () => (await api.get("/cvs/")).data,
  });
  const coverLettersQuery = useQuery({
    queryKey: ["cover-letters"],
    queryFn: async () => (await api.get("/cover-letters/")).data,
  });

  const allDocs = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    const list = (q: { data?: { results?: unknown[] } } | undefined) =>
      q?.data?.results ?? [];
    for (const r of list(resumesQuery as never) as Array<Record<string, unknown>>) {
      items.push({
        id: String(r.id),
        title: String(r.title || "Untitled resume"),
        type: "Resume",
        templateSlug: r.templateSlug as string | undefined,
        updatedAt: String(r.updatedAt || ""),
        hrefPath: `/build-resume?id=${r.id}`,
      });
    }
    for (const r of list(cvsQuery as never) as Array<Record<string, unknown>>) {
      items.push({
        id: String(r.id),
        title: String(r.title || "Untitled CV"),
        type: "CV",
        templateSlug: r.templateSlug as string | undefined,
        updatedAt: String(r.updatedAt || ""),
        hrefPath: `/build-cv?id=${r.id}`,
      });
    }
    for (const r of list(coverLettersQuery as never) as Array<Record<string, unknown>>) {
      items.push({
        id: String(r.id),
        title: String(r.title || "Untitled cover letter"),
        type: "Cover Letter",
        templateSlug: r.templateSlug as string | undefined,
        updatedAt: String(r.updatedAt || ""),
        hrefPath: `/build-letter?id=${r.id}`,
      });
    }
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [resumesQuery, cvsQuery, coverLettersQuery]);

  const recent = allDocs.slice(0, 5);
  const totalDocs = allDocs.length;
  const lastEdited = allDocs[0]?.updatedAt;

  const isLoading =
    resumesQuery.isLoading ||
    cvsQuery.isLoading ||
    coverLettersQuery.isLoading;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Здравствуйте{user?.firstName ? `, ${user.firstName}` : ""}
            </h1>
            <p className="mt-1 text-gray-500">
              Обзор ваших документов и недавней активности.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Всего документов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : totalDocs}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Резюме</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? "…" : (resumesQuery.data?.results?.length ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Последнее изменение</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-gray-900">
                  {isLoading ? "…" : relTime(lastEdited)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Быстрые действия</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[#0D47A1]/30"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${action.color}`}>
                    {action.icon === "document" && (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {action.icon === "academic" && (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M22 10l-10-5L2 10l10 5 10-5zM6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    )}
                    {action.icon === "mail" && (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.label}</h3>
                    <p className="text-sm text-gray-500">С нуля или из шаблона</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Недавние документы</h2>
              <Button asChild variant="link" size="sm">
                <Link href="/my-documents">Все документы</Link>
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {isLoading ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                  Загрузка документов…
                </div>
              ) : recent.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                  У вас пока нет документов. Нажмите <strong>«Создать резюме»</strong> выше.
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Название</th>
                      <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Тип</th>
                      <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">Шаблон</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Изменён</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recent.map((doc) => (
                      <tr key={doc.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link href={doc.hrefPath} className="font-medium text-gray-900 hover:text-[#0D47A1]">
                            {doc.title}
                          </Link>
                        </td>
                        <td className="hidden px-6 py-4 text-sm text-gray-500 sm:table-cell">{doc.type}</td>
                        <td className="hidden px-6 py-4 text-sm text-gray-500 md:table-cell">{doc.templateSlug ?? "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{relTime(doc.updatedAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={doc.hrefPath}>Изменить</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
