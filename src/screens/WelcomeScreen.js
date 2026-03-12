import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background accent */}
      <View style={styles.bgCircle} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo / Brand */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>NEST</Text>
          <View style={styles.logoDot} />
        </View>

        <Text style={styles.tagline}>
          your health,{'\n'}
          <Text style={styles.taglineHighlight}>elevated.</Text>
        </Text>

        <Text style={styles.subtitle}>
          The four foundations of physical health — nutrition, exercise, sleep & toxins.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Name')}
        >
          <Text style={styles.startButtonText}>get started</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>by Anthony • Vegan Health Coach</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.12,
    paddingBottom: spacing.xxl,
  },
  bgCircle: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: colors.orange,
    opacity: 0.06,
    top: -width * 0.4,
    right: -width * 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 6,
    color: colors.orange,
  },
  logoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
    marginLeft: 4,
    marginTop: -8,
  },
  tagline: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.black,
    lineHeight: 58,
    marginBottom: spacing.lg,
    letterSpacing: -1,
  },
  taglineHighlight: {
    color: colors.orange,
  },
  subtitle: {
    fontSize: 17,
    color: colors.mediumGray,
    lineHeight: 26,
    fontWeight: '400',
  },
  bottomSection: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.orange,
    borderRadius: radius.full,
    paddingVertical: 20,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 13,
    color: colors.lightGray,
    marginTop: spacing.sm,
  },
});
