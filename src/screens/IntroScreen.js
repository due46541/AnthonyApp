import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing } from '../theme';

const { height } = Dimensions.get('window');

const slides = (name) => [
  {
    label: null,
    heading: `hey ${name},\nready to build\nyour `,
    highlight: 'nest?',
    body: null,
    tap: true,
  },
  {
    label: null,
    heading: 'most people know\nwhat they need\nto do.',
    highlight: null,
    body: "they just don't have a system to hold themselves accountable.",
    tap: true,
  },
  {
    label: null,
    heading: 'the four\nfoundations of\nphysical health.',
    highlight: null,
    body: 'Nutrition · Exercise · Sleep · Toxins\n\nget these four locked in, and everything else follows.',
    tap: true,
  },
  {
    label: null,
    heading: "we'll check in\nevery week.",
    highlight: null,
    body: "rate each area from 1–10. set one small goal. go up one point at a time.",
    tap: false,
  },
];

export default function IntroScreen({ navigation, route }) {
  const { name } = route.params || { name: 'friend' };
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentSlides = slides(name);
  const current = currentSlides[index];
  const isLast = index === currentSlides.length - 1;

  const goNext = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      if (isLast) {
        navigation.navigate('Assessment', { name });
      } else {
        setIndex(index + 1);
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      }
    });
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={goNext}>
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {current.label && <Text style={styles.label}>{current.label}</Text>}

        <Text style={styles.heading}>
          {current.heading}
          {current.highlight && (
            <Text style={styles.highlight}>{current.highlight}</Text>
          )}
        </Text>

        {current.body && <Text style={styles.body}>{current.body}</Text>}
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        {/* Slide dots */}
        <View style={styles.dotsRow}>
          {currentSlides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <Text style={styles.tapHint}>
          tap to continue{' '}
          <Text style={styles.arrow}>→</Text>
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.16,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.mediumGray,
    marginBottom: spacing.sm,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  heading: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.black,
    lineHeight: 50,
    marginBottom: spacing.lg,
    letterSpacing: -0.5,
  },
  highlight: {
    color: colors.orange,
  },
  body: {
    fontSize: 18,
    color: colors.darkGray,
    lineHeight: 28,
    fontWeight: '400',
  },
  footer: {
    alignItems: 'flex-end',
  },
  dotsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGray,
  },
  dotActive: {
    backgroundColor: colors.orange,
    width: 18,
  },
  tapHint: {
    fontSize: 16,
    color: colors.mediumGray,
    fontWeight: '500',
  },
  arrow: {
    color: colors.orange,
    fontWeight: '700',
  },
});
