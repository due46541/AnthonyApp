import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  PanResponder,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

const { width, height } = Dimensions.get('window');
const SLIDER_WIDTH = width - spacing.lg * 2;

const nestItems = [
  {
    key: 'nutrition',
    letter: 'N',
    label: 'Nutrition',
    question: 'how well are\nyou eating?',
    hint: '1 = ultra processed every day\n10 = couldn\'t eat any better',
  },
  {
    key: 'exercise',
    letter: 'E',
    label: 'Exercise',
    question: 'how active\nhave you been?',
    hint: '1 = no movement at all\n10 = training like an athlete',
  },
  {
    key: 'sleep',
    letter: 'S',
    label: 'Sleep',
    question: 'how well\nare you sleeping?',
    hint: '1 = insomnia every night\n10 = sleeping like royalty',
  },
  {
    key: 'toxins',
    letter: 'T',
    label: 'Toxins',
    question: 'what are you\nputting in your body?',
    hint: '1 = toxic substances daily\n10 = nothing harmful at all',
  },
];

function NESTSlider({ value, onChange }) {
  const sliderRef = useRef(null);
  const [sliderX, setSliderX] = useState(0);

  const clampedValue = Math.min(10, Math.max(1, value));
  const thumbPosition = ((clampedValue - 1) / 9) * (SLIDER_WIDTH - 28);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const x = e.nativeEvent.locationX;
      const ratio = Math.min(1, Math.max(0, x / SLIDER_WIDTH));
      const newVal = Math.round(ratio * 9) + 1;
      onChange(newVal);
    },
    onPanResponderMove: (e) => {
      const x = e.nativeEvent.locationX;
      const ratio = Math.min(1, Math.max(0, x / SLIDER_WIDTH));
      const newVal = Math.round(ratio * 9) + 1;
      onChange(newVal);
    },
  });

  return (
    <View style={sliderStyles.wrapper} {...panResponder.panHandlers}>
      {/* Track background */}
      <View style={sliderStyles.track}>
        {/* Filled part */}
        <View
          style={[
            sliderStyles.filled,
            { width: thumbPosition + 14 },
          ]}
        />
        {/* Tick marks */}
        {Array.from({ length: 10 }, (_, i) => (
          <View
            key={i}
            style={[
              sliderStyles.tick,
              { left: (i / 9) * (SLIDER_WIDTH - 28) + 14 },
              i < clampedValue - 1 ? sliderStyles.tickFilled : sliderStyles.tickEmpty,
            ]}
          />
        ))}
        {/* Thumb */}
        <View style={[sliderStyles.thumb, { left: thumbPosition }]} />
      </View>

      <View style={sliderStyles.labels}>
        <Text style={sliderStyles.labelText}>1</Text>
        <Text style={sliderStyles.labelText}>10</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  wrapper: {
    width: SLIDER_WIDTH,
    paddingVertical: spacing.md,
  },
  track: {
    height: 6,
    backgroundColor: colors.inputBg,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  filled: {
    position: 'absolute',
    left: 0,
    height: 6,
    backgroundColor: colors.orange,
    borderRadius: 3,
  },
  tick: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: -2,
    top: 1,
  },
  tickFilled: { backgroundColor: colors.orangeLight },
  tickEmpty: { backgroundColor: colors.lightGray },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.orange,
    top: -11,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: colors.white,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  labelText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '500',
  },
});

export default function AssessmentScreen({ navigation, route }) {
  const { name } = route.params || { name: 'friend' };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({ nutrition: 5, exercise: 5, sleep: 5, toxins: 5 });

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const current = nestItems[currentIndex];
  const isLast = currentIndex === nestItems.length - 1;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / nestItems.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const goNext = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      if (isLast) {
        navigation.navigate('Goals', { name, scores });
      } else {
        setCurrentIndex(currentIndex + 1);
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start();
      }
    });
  };

  const currentScore = scores[current.key];

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBg}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        <View style={styles.progressDot} />
      </View>

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* NEST letter badge */}
        <View style={styles.letterBadge}>
          <Text style={styles.letterText}>{current.letter}</Text>
          <Text style={styles.letterLabel}>{current.label}</Text>
        </View>

        <Text style={styles.question}>{current.question}</Text>

        {/* Big score display */}
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreNumber}>{currentScore}</Text>
          <Text style={styles.scoreUnit}>/ 10</Text>
        </View>

        <NESTSlider
          value={currentScore}
          onChange={(val) => setScores({ ...scores, [current.key]: val })}
        />

        <Text style={styles.hint}>{current.hint}</Text>
      </Animated.View>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.85} onPress={goNext}>
          <Text style={styles.continueText}>
            {isLast ? 'set my goals' : 'continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.inputBg,
    borderRadius: 3,
    marginBottom: spacing.xxl,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.orange,
    borderRadius: 3,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.orange,
    position: 'absolute',
    right: 0,
  },
  content: {
    flex: 1,
  },
  letterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  letterText: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.orange,
    letterSpacing: -1,
  },
  letterLabel: {
    fontSize: 16,
    color: colors.mediumGray,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  question: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.black,
    lineHeight: 46,
    marginBottom: spacing.xl,
    letterSpacing: -0.5,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: colors.black,
    letterSpacing: -3,
  },
  scoreUnit: {
    fontSize: 24,
    color: colors.lightGray,
    fontWeight: '600',
    marginLeft: spacing.xs,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: colors.mediumGray,
    lineHeight: 22,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
  },
  continueButton: {
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
  continueText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
