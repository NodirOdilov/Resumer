import { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter, Link } from "expo-router";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing } from "@/constants/theme";
import { Text } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Ошибка", "Заполните email и пароль");
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, name);
      router.replace("/(tabs)");
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Ошибка регистрации";
      Alert.alert("Ошибка", String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input label="Имя" value={name} onChangeText={setName} autoCapitalize="words" />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Создать аккаунт" onPress={handleRegister} loading={loading} />
      <Link href="/(auth)/login" style={styles.link}>
        <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  link: { marginTop: spacing.lg, alignItems: "center" },
  linkText: { color: colors.primary },
});
