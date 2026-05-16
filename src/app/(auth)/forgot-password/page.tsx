import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Восстановление пароля | Resumer",
  description:
    "Сбросьте пароль от аккаунта Resumer. Мы отправим ссылку для создания нового пароля.",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Забыли пароль?</h1>
        <p className="mt-1 text-sm text-gray-500">
          Не переживайте — мы отправим инструкции по сбросу
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
