import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../src/context/ThemeContext';

const LOGO_LIGHT = require('../assets/brand/logo-light.png');
const LOGO_DARK = require('../assets/brand/logo-dark.png');

const LOGO_W = 300;
const LOGO_H = 98;

export default function SplashScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(16);
  const logoScale = useSharedValue(0.94);
  const dotsOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo animate in
    logoOpacity.value = withTiming(1, { duration: 1200, easing: Easing.bezier(0.22, 1, 0.36, 1) });
    logoY.value = withTiming(0, { duration: 1200, easing: Easing.bezier(0.22, 1, 0.36, 1) });
    logoScale.value = withDelay(
      100,
      withTiming(1, { duration: 1400, easing: Easing.bezier(0.22, 1, 0.36, 1) })
    );

    // Dots fade in
    setTimeout(() => {
      dotsOpacity.value = withTiming(1, { duration: 800 });
    }, 1200);

    // Navigate after 3s
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }, { scale: logoScale.value }],
  }));
  const dotsStyle = useAnimatedStyle(() => ({ opacity: dotsOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      {/* Logo */}
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <Image
          source={isDark ? LOGO_LIGHT : LOGO_DARK}
          style={{ width: LOGO_W, height: LOGO_H }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[styles.dotsRow, dotsStyle]}>
        {[0, 1, 2].map((i) => (
          <PulseDot key={i} delay={i * 200} color={colors.brandOrange} />
        ))}
      </Animated.View>
    </View>
  );
}

function PulseDot({ delay, color }: { delay: number; color: string }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(0.2, { duration: 600 })
        ),
        -1,
        true
      );
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    zIndex: 10,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
  },
});
