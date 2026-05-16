import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация | Resumer",
  description:
    "Создайте бесплатный аккаунт Resumer и начните создавать профессиональные резюме, CV и сопроводительные письма.",
};

export default function SignUpPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Создать аккаунт</h1>
        <p className="mt-1 text-sm text-gray-500">
          Начните создавать профессиональные документы за минуты
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
