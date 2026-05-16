import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Вход | Resumer",
  description:
    "Войдите в аккаунт Resumer, чтобы продолжить работу с резюме, CV и сопроводительными письмами.",
};

export default function SignInPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">С возвращением</h1>
        <p className="mt-1 text-sm text-gray-500">
          Войдите в аккаунт, чтобы продолжить работу
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
