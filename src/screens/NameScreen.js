import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

const { height } = Dimensions.get('window');

export default function NameScreen({ navigation }) {
  const [name, setName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (name.trim().length === 0) return;
    navigation.navigate('Intro', { name: name.trim() });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.label}>first things first</Text>
        <Text style={styles.heading}>what should{'\n'}we call you?</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="your name"
          placeholderTextColor={colors.lightGray}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleContinue}
          autoCapitalize="words"
        />
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.continueText}>continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.14,
    paddingBottom: spacing.xxl,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.mediumGray,
    fontWeight: '500',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  heading: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.black,
    lineHeight: 48,
    marginBottom: spacing.xl,
    letterSpacing: -0.5,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 22,
    fontWeight: '500',
    color: colors.black,
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
  continueButtonDisabled: {
    backgroundColor: colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
