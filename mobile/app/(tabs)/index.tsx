import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/authStore";
import { colors, fontSize, spacing } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>
          Здравствуйте{user?.first_name ? `, ${user.first_name}` : ""}
        </Text>
        <Text style={styles.sub}>
          Создавайте профессиональные резюме с любого устройства
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Создать резюме"
          onPress={() => router.push("/resume/create")}
        />
        <Button
          title="Мои резюме"
          variant="secondary"
          onPress={() => router.push("/(tabs)/resumes")}
          style={{ marginTop: spacing.sm }}
        />
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Возможности</Text>
        {[
          "34+ профессиональных шаблона",
          "Экспорт PDF и DOCX",
          "AI-подсказки для секций",
          "Синхронизация с веб и Telegram",
        ].map((f) => (
          <View key={f} style={styles.featureRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  hero: { marginBottom: spacing.lg },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
  },
  sub: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actions: { marginBottom: spacing.xl },
  features: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  featureRow: { flexDirection: "row", marginBottom: spacing.xs },
  bullet: { color: colors.primary, marginRight: spacing.sm },
  featureText: { fontSize: fontSize.md, color: colors.text, flex: 1 },
});
