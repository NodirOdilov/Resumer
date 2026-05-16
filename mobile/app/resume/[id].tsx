import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Button } from "@/components/Button";
import { resumeApi } from "@/api/client";
import { colors, fontSize, spacing } from "@/constants/theme";

export default function ResumeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [resume, setResume] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!id) return;
    resumeApi
      .get(id)
      .then(({ data }) => setResume(data))
      .catch(() => Alert.alert("Ошибка", "Не удалось загрузить резюме"))
      .finally(() => setLoading(false));
  }, [id]);

  const exportDoc = async (format: "pdf" | "docx") => {
    if (!id) return;
    setExporting(true);
    try {
      const { data } = await resumeApi.export(id, format);
      Alert.alert(
        "Экспорт",
        `Задача запущена. ID: ${data.task_id || "—"}\nФайл появится в веб-кабинете.`
      );
    } catch {
      Alert.alert("Ошибка", "Не удалось запустить экспорт");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{String(resume?.title || "Резюме")}</Text>
      <Text style={styles.meta}>Статус: {String(resume?.status || "—")}</Text>
      <Text style={styles.meta}>ID: {id}</Text>

      <View style={styles.actions}>
        <Button
          title="Скачать PDF"
          onPress={() => exportDoc("pdf")}
          loading={exporting}
        />
        <Button
          title="Скачать DOCX"
          variant="secondary"
          onPress={() => exportDoc("docx")}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  meta: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  actions: { marginTop: spacing.xl },
});
