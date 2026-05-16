"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type VerifyState = "loading" | "success" | "error" | "waiting";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [state, setState] = useState<VerifyState>(token ? "loading" : "waiting");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    async function verifyToken() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Не удалось подтвердить email");
        }

        setState("success");
      } catch (err) {
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : "Не удалось подтвердить email. Возможно, срок действия ссылки истёк.");
      }
    }

    verifyToken();
  }, [token]);

  return (
    <div className="text-center">
      {state === "loading" && (
        <div className="space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0D47A1]" />
          <h1 className="text-xl font-bold text-gray-900">Подтверждаем ваш email...</h1>
          <p className="text-sm text-gray-500">Пожалуйста, подождите, пока мы подтвердим ваш адрес электронной почты.</p>
        </div>
      )}

      {state === "success" && (
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Email подтверждён!</h1>
          <p className="text-sm text-gray-500">
            Ваш адрес электронной почты успешно подтверждён. Теперь вы можете войти в свой аккаунт.
          </p>
          <Button asChild className="mt-2">
            <Link href="/signin">Войти в аккаунт</Link>
          </Button>
        </div>
      )}

      {state === "error" && (
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Не удалось подтвердить</h1>
          <p className="text-sm text-gray-500">{errorMessage}</p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/signin">Перейти ко входу</Link>
            </Button>
          </div>
        </div>
      )}

      {state === "waiting" && (
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-[#0D47A1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Проверьте свою почту</h1>
          <p className="text-sm text-gray-500">
            {email ? (
              <>Мы отправили ссылку для подтверждения на <span className="font-medium text-gray-700">{email}</span>.</>
            ) : (
              <>Мы отправили ссылку для подтверждения на ваш адрес электронной почты.</>
            )}{" "}
            Перейдите по ссылке в письме, чтобы подтвердить аккаунт.
          </p>
          <p className="text-xs text-gray-400">
            Не получили письмо? Проверьте папку &laquo;Спам&raquo; или запросите новую ссылку для подтверждения.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/signin">Назад ко входу</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
