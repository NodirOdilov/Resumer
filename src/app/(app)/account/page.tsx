"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { Header } from "@/components/layout/Header";

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [oauthMessage, setOauthMessage] = useState("");
  const [upgradeMessage, setUpgradeMessage] = useState("");

  function handleOAuthConnect(provider: "Google" | "GitHub") {
    setOauthMessage(
      `Подключение через ${provider} уже в разработке — скоро будет доступно. Спасибо за терпение!`,
    );
    setTimeout(() => setOauthMessage(""), 5000);
  }

  function handleUpgrade() {
    setUpgradeMessage(
      "Тариф Pro скоро будет доступен — мы работаем над интеграцией оплаты. Все шаблоны и AI-функции уже открыты для вас бесплатно.",
    );
    setTimeout(() => setUpgradeMessage(""), 6000);
  }

  function handleDeleteAccount() {
    const confirmed = confirm(
      "Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить — все ваши резюме, CV и сопроводительные письма будут безвозвратно удалены.",
    );
    if (!confirmed) return;

    const second = confirm(
      "Подтвердите ещё раз: все данные будут удалены навсегда.",
    );
    if (!second) return;

    // In demo mode we just clear local state and sign out.
    try {
      if (typeof window !== "undefined") {
        // Wipe demo IndexedDB so the next visit starts fresh.
        if ("indexedDB" in window) {
          indexedDB.deleteDatabase("resumer_demo");
          indexedDB.deleteDatabase("resumer_autosave");
        }
        // Also dispatch a logout event so QueryClient cache clears.
        window.dispatchEvent(new Event("auth:logout"));
      }
    } catch {
      /* ignore */
    }
    logout();
    router.push("/");
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setProfileMessage("");
    try {
      await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setProfileMessage("Профиль успешно обновлён.");
    } catch {
      setProfileMessage("Не удалось обновить профиль.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordMessage("Новые пароли не совпадают.");
      return;
    }
    setIsChangingPassword(true);
    setPasswordMessage("");
    try {
      await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      setPasswordMessage("Пароль успешно изменён.");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch {
      setPasswordMessage("Не удалось изменить пароль.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Настройки аккаунта</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Информация профиля</CardTitle>
                <CardDescription>Обновите свои личные данные.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Имя"
                      value={profile.firstName}
                      onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                    />
                    <Input
                      label="Фамилия"
                      value={profile.lastName}
                      onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                  <Input
                    label="Адрес электронной почты"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                  {profileMessage && (
                    <p className={`text-sm ${profileMessage.includes("успешно") ? "text-green-600" : "text-red-600"}`}>
                      {profileMessage}
                    </p>
                  )}
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Изменить пароль</CardTitle>
                <CardDescription>Обновите свой пароль, чтобы защитить аккаунт.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Текущий пароль"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    required
                  />
                  <Input
                    label="Новый пароль"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                    required
                  />
                  <Input
                    label="Подтвердите новый пароль"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    required
                  />
                  {passwordMessage && (
                    <p className={`text-sm ${passwordMessage.includes("успешно") ? "text-green-600" : "text-red-600"}`}>
                      {passwordMessage}
                    </p>
                  )}
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Изменение..." : "Изменить пароль"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Подключённые аккаунты</CardTitle>
                <CardDescription>Управляйте OAuth-подключениями для упрощённого входа.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Google</p>
                        <p className="text-sm text-gray-500">Не подключён</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOAuthConnect("Google")}
                    >
                      Подключить
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">GitHub</p>
                        <p className="text-sm text-gray-500">Не подключён</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOAuthConnect("GitHub")}
                    >
                      Подключить
                    </Button>
                  </div>
                  {oauthMessage && (
                    <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                      {oauthMessage}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Подписка</CardTitle>
                <CardDescription>Управляйте тарифом и оплатой.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">Бесплатный тариф</p>
                      <Badge variant="secondary">Текущий</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Ограничено до 2 документов и базовых шаблонов.</p>
                  </div>
                  <Button onClick={handleUpgrade}>Перейти на Pro</Button>
                </div>
                {upgradeMessage && (
                  <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                    {upgradeMessage}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Опасная зона</CardTitle>
                <CardDescription>Окончательно удалить аккаунт и все связанные с ним данные.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Удалить аккаунт
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
