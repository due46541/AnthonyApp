import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

const { height } = Dimensions.get('window');

const nestItems = [
  { key: 'nutrition', letter: 'N', label: 'Nutrition', placeholder: 'e.g. no Coke this week, 2 apples daily' },
  { key: 'exercise', letter: 'E', label: 'Exercise', placeholder: 'e.g. one extra gym session, 15min walk daily' },
  { key: 'sleep', letter: 'S', label: 'Sleep', placeholder: 'e.g. phone off at 10pm, no screens in bed' },
  { key: 'toxins', letter: 'T', label: 'Toxins', placeholder: 'e.g. stay in this weekend, alcohol-free week' },
];

export default function GoalsScreen({ navigation, route }) {
  const { name, scores } = route.params || { name: 'friend', scores: {} };
  const [goals, setGoals] = useState({ nutrition: '', exercise: '', sleep: '', toxins: '' });
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleDone = () => {
    navigation.navigate('Dashboard', { name, scores, goals });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.label}>week 1</Text>
          <Text style={styles.heading}>
            what's one thing{'\n'}you can do to{'\n'}
            <Text style={styles.headingHighlight}>go up one point?</Text>
          </Text>
          <Text style={styles.subtitle}>
            you already know what you need to do.{'\n'}just write it down.
          </Text>
        </View>

        {nestItems.map((item) => (
          <View key={item.key} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLetter}>{item.letter}</Text>
              <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>{item.label}</Text>
                <Text style={styles.goalScore}>
                  currently{' '}
                  <Text style={styles.goalScoreNum}>{scores[item.key] || 5}</Text>
                  {' '}→{' '}
                  <Text style={styles.goalScoreTarget}>{(scores[item.key] || 5) + 1}</Text>
                </Text>
              </View>
            </View>
            <TextInput
              style={styles.goalInput}
              value={goals[item.key]}
              onChangeText={(text) => setGoals({ ...goals, [item.key]: text })}
              placeholder={item.placeholder}
              placeholderTextColor={colors.lightGray}
              multiline
              returnKeyType="done"
            />
          </View>
        ))}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneButton} activeOpacity={0.85} onPress={handleDone}>
            <Text style={styles.doneText}>build my nest 🪺</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.08,
  },
  header: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    color: colors.mediumGray,
    fontWeight: '500',
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  heading: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.black,
    lineHeight: 44,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  headingHighlight: {
    color: colors.orange,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mediumGray,
    lineHeight: 24,
  },
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  goalLetter: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.orange,
    width: 32,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  goalScore: {
    fontSize: 13,
    color: colors.mediumGray,
    marginTop: 2,
  },
  goalScoreNum: {
    color: colors.black,
    fontWeight: '600',
  },
  goalScoreTarget: {
    color: colors.orange,
    fontWeight: '700',
  },
  goalInput: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 15,
    color: colors.black,
    lineHeight: 22,
    minHeight: 60,
  },
  footer: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl + spacing.xl,
  },
  doneButton: {
    backgroundColor: colors.orange,
    borderRadius: radius.full,
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  doneText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
