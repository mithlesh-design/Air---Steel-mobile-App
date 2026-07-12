import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated as RNAnimated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Moon, Sun } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../src/context/ThemeContext';
import { Fonts, Radius, Spacing, WhiteA, Shadow } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function FloatingInput({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const labelTop = useSharedValue(lifted ? 10 : 22);
  const labelSize = useSharedValue(lifted ? 9 : 11);
  const labelColor = useSharedValue(lifted ? 1 : 0);

  const labelStyle = useAnimatedStyle(() => ({
    top: withTiming(labelTop.value, { duration: 220 }),
    fontSize: withTiming(labelSize.value, { duration: 220 }),
    color: withTiming(
      labelColor.value === 1 ? colors.brandOrange : WhiteA[30],
      { duration: 220 }
    ),
  }));

  const onFocus = () => {
    setFocused(true);
    labelTop.value = 10;
    labelSize.value = 9;
    labelColor.value = 1;
  };
  const onBlur = () => {
    setFocused(false);
    if (!value) {
      labelTop.value = 22;
      labelSize.value = 11;
      labelColor.value = 0;
    }
  };

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: colors.bgInput,
          borderColor: focused ? `${colors.brandOrange}99` : colors.border,
        },
      ]}
    >
      <Animated.Text
        style={[
          styles.floatLabel,
          { letterSpacing: 2, textTransform: 'uppercase', position: 'absolute', left: 20 },
          Platform.OS === 'android' && { includeFontPadding: false },
          labelStyle,
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          { color: colors.textPrimary },
          Platform.OS === 'android' && styles.inputAndroid,
        ]}
      />
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleLogin = () => {
    btnScale.value = withSpring(0.96, {}, () => { btnScale.value = withSpring(1); });
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: colors.bgBase, paddingTop: insets.top }]}>
        {/* Theme toggle */}
        <Pressable
          onPress={toggleTheme}
          style={[styles.themeBtn, { top: insets.top + 16 }]}
          hitSlop={12}
        >
          {theme === 'dark'
            ? <Sun size={15} color={WhiteA[55]} strokeWidth={1.4} />
            : <Moon size={15} color={WhiteA[55]} strokeWidth={1.4} />}
        </Pressable>

        <View style={styles.inner}>
          {/* Header */}
          <Animated.View
            entering={FadeIn.delay(150).duration(800)}
            style={styles.header}
          >
            <Text style={[styles.brand, { color: colors.textPrimary }]}>Air & Steel</Text>
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: WhiteA[10] }]} />
              <Text style={[styles.dividerText, { color: WhiteA[35] }]}>Secure Entry</Text>
              <View style={[styles.divider, { backgroundColor: WhiteA[10] }]} />
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeIn.delay(300).duration(800)} style={styles.form}>
            <FloatingInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <FloatingInput
              label="OTP Code"
              value={otp}
              onChangeText={setOtp}
            />

            <View style={styles.actions}>
              <Animated.View style={btnStyle}>
                <Pressable
                  onPress={handleLogin}
                  style={[styles.primaryBtn, Shadow.card, { backgroundColor: colors.white }]}
                >
                  <Text style={[styles.primaryBtnText, { color: colors.black }]}>
                    DISPATCH CODE
                  </Text>
                </Pressable>
              </Animated.View>

              <Pressable onPress={() => router.push('/signup')} style={styles.secondaryBtn}>
                <Text style={[styles.secondaryBtnText, { color: colors.textMuted }]}>
                  Create Account
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>

        {/* Bottom mark */}
        <Text style={[styles.bottomMark, { color: WhiteA[10], bottom: insets.bottom + 24 }]}>
          Member Access Portal
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  themeBtn: {
    position: 'absolute',
    right: Spacing.page,
    zIndex: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 56,
  },
  brand: {
    fontFamily: Fonts.display,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: Radius.input,
    height: 56,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  floatLabel: {
    fontFamily: Fonts.body,
  },
  input: {
    fontFamily: Fonts.body,
    fontSize: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    letterSpacing: 0.5,
  },
  // Android adds vertical font padding and centers text, which rides up under the
  // floating label. Strip it and pin text to the bottom so it clears the label.
  inputAndroid: {
    includeFontPadding: false,
    textAlignVertical: 'bottom',
    paddingTop: 0,
    paddingVertical: 0,
  },
  actions: {
    marginTop: 24,
    gap: 16,
  },
  primaryBtn: {
    borderRadius: Radius.button,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: Fonts.display,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryBtnText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bottomMark: {
    position: 'absolute',
    alignSelf: 'center',
    fontFamily: Fonts.body,
    fontSize: 8,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
  },
});
