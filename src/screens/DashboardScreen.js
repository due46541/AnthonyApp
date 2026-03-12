import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

const { width, height } = Dimensions.get('window');

const nestItems = [
  { key: 'nutrition', letter: 'N', label: 'Nutrition', emoji: '🥗' },
  { key: 'exercise', letter: 'E', label: 'Exercise', emoji: '💪' },
  { key: 'sleep', letter: 'S', label: 'Sleep', emoji: '😴' },
  { key: 'toxins', letter: 'T', label: 'Toxins', emoji: '🚫' },
];

function ScoreBar({ score, delay }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: score / 10,
      duration: 700,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={barStyles.track}>
      <Animated.View
        style={[
          barStyles.fill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: score >= 8 ? colors.orange : score >= 5 ? colors.orangeLight : '#FFD0A0',
          },
        ]}
      />
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: {
    flex: 1,
    height: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
});

export default function DashboardScreen({ navigation, route }) {
  const { name, scores, goals } = route.params || {
    name: 'friend',
    scores: { nutrition: 5, exercise: 5, sleep: 5, toxins: 5 },
    goals: {},
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalScore = nestItems.reduce((sum, item) => sum + (scores[item.key] || 0), 0);
  const avgScore = (totalScore / 4).toFixed(1);

  const getMotivation = (avg) => {
    if (avg >= 8) return "you're crushing it 🔥";
    if (avg >= 6) return "solid foundation, keep going 💪";
    if (avg >= 4) return "room to grow — that's exciting 🌱";
    return "every journey starts somewhere 🌅";
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>hey {name} 👋</Text>
          <Text style={styles.weekLabel}>week 1 · your nest</Text>
        </View>

        {/* Big score card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>overall score</Text>
          <Text style={styles.heroScore}>{avgScore}</Text>
          <Text style={styles.heroMax}>/10</Text>
          <Text style={styles.heroMotivation}>{getMotivation(parseFloat(avgScore))}</Text>

          {/* NEST letters */}
          <View style={styles.nestRow}>
            {['N', 'E', 'S', 'T'].map((l) => (
              <Text key={l} style={styles.nestLetter}>{l}</Text>
            ))}
          </View>
        </View>

        {/* Individual scores */}
        <Text style={styles.sectionTitle}>your foundations</Text>
        {nestItems.map((item, i) => (
          <View key={item.key} style={styles.scoreCard}>
            <View style={styles.scoreCardHeader}>
              <View style={styles.scoreCardLeft}>
                <Text style={styles.scoreEmoji}>{item.emoji}</Text>
                <View>
                  <Text style={styles.scoreCardLabel}>{item.label}</Text>
                  {goals[item.key] ? (
                    <Text style={styles.goalText} numberOfLines={1}>
                      goal: {goals[item.key]}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.scoreCardRight}>
                <Text style={styles.scoreValue}>{scores[item.key] || 5}</Text>
                <Text style={styles.scoreArrow}>→ {(scores[item.key] || 5) + 1}</Text>
              </View>
            </View>
            <ScoreBar score={scores[item.key] || 5} delay={i * 120} />
          </View>
        ))}

        {/* This week section */}
        <Text style={styles.sectionTitle}>this week's goals</Text>
        {nestItems.map((item) =>
          goals[item.key] ? (
            <View key={item.key} style={styles.goalCard}>
              <View style={styles.goalDot} />
              <View style={styles.goalCardContent}>
                <Text style={styles.goalCardLabel}>
                  {item.letter} · {item.label}
                </Text>
                <Text style={styles.goalCardText}>{goals[item.key]}</Text>
              </View>
            </View>
          ) : null
        )}

        {/* Restart / reassess */}
        <TouchableOpacity
          style={styles.reassessButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Assessment', { name })}
        >
          <Text style={styles.reassessText}>reassess next week →</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.08,
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    letterSpacing: -0.5,
  },
  weekLabel: {
    fontSize: 14,
    color: colors.mediumGray,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  heroCard: {
    backgroundColor: colors.orange,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  heroLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  heroScore: {
    fontSize: 80,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -3,
    lineHeight: 86,
  },
  heroMax: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    marginTop: -8,
    marginBottom: spacing.md,
  },
  heroMotivation: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  nestRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  nestLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.black,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  scoreCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  scoreCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  scoreEmoji: {
    fontSize: 22,
  },
  scoreCardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  goalText: {
    fontSize: 12,
    color: colors.mediumGray,
    marginTop: 2,
    maxWidth: width * 0.5,
  },
  scoreCardRight: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  scoreArrow: {
    fontSize: 12,
    color: colors.orange,
    fontWeight: '600',
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
    marginTop: 6,
  },
  goalCardContent: {
    flex: 1,
  },
  goalCardLabel: {
    fontSize: 12,
    color: colors.orange,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  goalCardText: {
    fontSize: 15,
    color: colors.black,
    lineHeight: 22,
  },
  reassessButton: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.orange,
    borderRadius: radius.full,
  },
  reassessText: {
    fontSize: 16,
    color: colors.orange,
    fontWeight: '700',
  },
});
