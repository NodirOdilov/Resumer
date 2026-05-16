import { useCallback, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ResumeCard } from "@/components/ResumeCard";
import { Button } from "@/components/Button";
import { resumeApi } from "@/api/client";
import { colors, spacing } from "@/constants/theme";

interface Resume {
  id: string;
  title: string;
  status?: string;
  updated_at?: string;
}

export default function ResumesScreen() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const { data } = await resumeApi.list();
      setResumes(data.results || data);
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            load();
          }} />
        }
        ListHeaderComponent={
          <Button
            title="+ Новое резюме"
            onPress={() => router.push("/resume/create")}
            style={{ marginBottom: spacing.md }}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Нет резюме. Создайте первое.</Text>
        }
        renderItem={({ item }) => (
          <ResumeCard
            resume={item}
            onPress={() => router.push(`/resume/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", color: colors.textSecondary, marginTop: 40 },
});
