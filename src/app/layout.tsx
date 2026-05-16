"use client";

import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n/config";
import { DemoSeeder } from "@/components/shared/DemoSeeder";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  // Wipe cached queries the moment any component triggers a logout so the
  // next user can't see leftover data of the previous session.
  useEffect(() => {
    function onLogout() {
      queryClient.clear();
    }
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [queryClient]);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Create professional resumes, CVs, and cover letters with Resumer. ATS-friendly templates, AI-powered writing assistance, and expert guidance."
        />
        <meta name="theme-color" content="#0D47A1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Resumer — Professional Resume Builder</title>
      </head>
      <body className={`${inter.className} antialiased`}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <DemoSeeder />
            {children}
          </QueryClientProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
