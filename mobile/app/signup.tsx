import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'email-address';
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const labelTop = useSharedValue(lifted ? 10 : 22);
  const labelSize = useSharedValue(lifted ? 9 : 11);

  const labelStyle = useAnimatedStyle(() => ({
    top: withSpring(labelTop.value, { damping: 20, stiffness: 300 }),
    fontSize: withSpring(labelSize.value, { damping: 20, stiffness: 300 }),
    color: lifted ? colors.brandOrange : WhiteA[30],
  }));

  const onFocus = () => {
    setFocused(true);
    labelTop.value = 10;
    labelSize.value = 9;
  };
  const onBlur = () => {
    setFocused(false);
    if (!value) {
      labelTop.value = 22;
      labelSize.value = 11;
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
          { position: 'absolute', left: 20, letterSpacing: 2, textTransform: 'uppercase' },
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
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
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

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleSignup = () => {
    btnScale.value = withSpring(0.96, {}, () => { btnScale.value = withSpring(1); });
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: colors.bgBase, paddingTop: insets.top }]}>

        <View style={styles.inner}>
          <Animated.View entering={FadeIn.delay(150).duration(800)} style={styles.header}>
            <Text style={[styles.brand, { color: colors.textPrimary }]}>Air & Steel</Text>
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: WhiteA[35] }]}>New Member</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300).duration(800)} style={styles.form}>
            <FloatingInput label="Full Name" value={name} onChangeText={setName} />
            <FloatingInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <View style={styles.actions}>
              <Animated.View style={btnStyle}>
                <Pressable
                  onPress={handleSignup}
                  style={[styles.primaryBtn, Shadow.card, { backgroundColor: colors.white }]}
                >
                  <Text style={[styles.primaryBtnText, { color: colors.black }]}>Join</Text>
                </Pressable>
              </Animated.View>

              <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
                <Text style={[styles.secondaryBtnText, { color: colors.textMuted }]}>
                  Return to Login
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  brand: { fontFamily: Fonts.display, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' },
  form: { gap: 16 },
  inputContainer: { borderWidth: 1, borderRadius: Radius.input, height: 64, justifyContent: 'flex-end', paddingBottom: 10 },
  floatLabel: { fontFamily: Fonts.body },
  input: { fontFamily: Fonts.body, fontSize: 14, paddingHorizontal: 20, paddingTop: 8, letterSpacing: 0.5 },
  inputAndroid: { includeFontPadding: false, textAlignVertical: 'bottom', paddingTop: 0, paddingVertical: 0 },
  actions: { marginTop: 16, gap: 16 },
  primaryBtn: { borderRadius: Radius.button, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { fontFamily: Fonts.display, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  secondaryBtn: { alignItems: 'center', paddingVertical: 8 },
  secondaryBtnText: { fontFamily: Fonts.body, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
});
