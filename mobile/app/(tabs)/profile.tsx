import { useState } from "react";
import { View, Text, StyleSheet, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/authStore";
import { telegramApi } from "@/api/client";
import { colors, fontSize, spacing } from "@/constants/theme";
import { APP_VERSION } from "@/constants/version";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [linking, setLinking] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const linkTelegram = async () => {
    setLinking(true);
    try {
      const { data } = await telegramApi.linkToken();
      if (data.bot_deep_link) {
        await Linking.openURL(data.bot_deep_link);
        Alert.alert(
          "Telegram",
          "Откройте бота и подтвердите привязку аккаунта."
        );
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось создать ссылку привязки");
    } finally {
      setLinking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Premium</Text>
        <Text style={styles.value}>{user?.is_premium ? "Активен" : "Нет"}</Text>
      </View>

      <Button
        title="Привязать Telegram"
        onPress={linkTelegram}
        loading={linking}
        style={styles.btn}
      />
      <Button title="Выйти" variant="danger" onPress={handleLogout} />
      <Text style={styles.version}>Resumer v{APP_VERSION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { fontSize: fontSize.sm, color: colors.textSecondary },
  value: {
    fontSize: fontSize.lg,
    color: colors.text,
    marginBottom: spacing.md,
    fontWeight: "500",
  },
  btn: { marginBottom: spacing.sm },
  version: {
    marginTop: spacing.xl,
    textAlign: "center",
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
