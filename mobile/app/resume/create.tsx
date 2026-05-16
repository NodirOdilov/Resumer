import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { resumeApi } from "@/api/client";
import { colors, spacing } from "@/constants/theme";

export default function CreateResumeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Введите название");
      return;
    }
    setLoading(true);
    try {
      const { data } = await resumeApi.create(title.trim());
      router.replace(`/resume/${data.id}`);
    } catch {
      Alert.alert("Ошибка", "Не удалось создать резюме");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Название резюме"
        value={title}
        onChangeText={setTitle}
        placeholder="Например: Frontend Developer 2026"
        autoCapitalize="sentences"
      />
      <Button title="Создать" onPress={create} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
});
