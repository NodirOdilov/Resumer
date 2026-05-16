import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, fontSize, spacing } from "@/constants/theme";

interface Resume {
  id: string;
  title: string;
  status?: string;
  updated_at?: string;
}

interface Props {
  resume: Resume;
  onPress: () => void;
}

export function ResumeCard({ resume, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {resume.title}
        </Text>
        <View
          style={[
            styles.badge,
            resume.status === "complete" && styles.badgeComplete,
          ]}
        >
          <Text style={styles.badgeText}>{resume.status || "draft"}</Text>
        </View>
      </View>
      {resume.updated_at && (
        <Text style={styles.date}>
          Обновлено: {new Date(resume.updated_at).toLocaleDateString("ru-RU")}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeComplete: {
    backgroundColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  date: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
