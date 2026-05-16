import { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import { searchApi } from "@/api/client";
import { colors, fontSize, spacing } from "@/constants/theme";
import { Button } from "@/components/Button";

interface Result {
  id: string;
  type: string;
  title: string;
  score?: number;
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const { data } = await searchApi.query(query);
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Поиск статей и примеров..."
        placeholderTextColor={colors.textSecondary}
        onSubmitEditing={search}
      />
      <Button title="Найти" onPress={search} loading={loading} style={styles.btn} />
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          query.length >= 2 && !loading ? (
            <Text style={styles.empty}>Ничего не найдено</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSize.md,
    backgroundColor: colors.surface,
  },
  btn: { marginVertical: spacing.sm },
  list: { paddingTop: spacing.sm },
  item: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  type: { fontSize: fontSize.sm, color: colors.primary },
  title: { fontSize: fontSize.md, color: colors.text, marginTop: 4 },
  empty: { textAlign: "center", color: colors.textSecondary, marginTop: 24 },
});
