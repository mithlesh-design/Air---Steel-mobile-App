import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useMenu } from '../../context/MenuContext';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, Radius, Shadow, Animation, WhiteA } from '../../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FloatingNav() {
  const { isMenuOpen, toggleMenu } = useMenu();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = withSpring(1, Animation.spring);
  }, []);

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: interpolate(enter.value, [0, 1], [20, 0]) },
      { scale: interpolate(enter.value, [0, 1], [0.92, 1]) * scale.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, Animation.springFast);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Animation.springFast);
  };

  if (isMenuOpen) return null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { bottom: insets.bottom + 24 },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={toggleMenu}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.pill,
            { backgroundColor: colors.bgCard },
            wrapperStyle,
            Shadow.modal as object,
          ]}
        >
          <View style={[styles.dot, { backgroundColor: colors.brandOrange }]} />
          {/* Hamburger */}
          <View style={styles.hamburger}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.line,
                  { backgroundColor: colors.textPrimary, width: i === 1 ? 9 : 13 },
                ]}
              />
            ))}
          </View>
          <Text style={styles.label}>Menu</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 30,
    pointerEvents: 'box-none',
  } as any,
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: Radius.button,
    borderWidth: 2,
    borderColor: '#282828',
    overflow: 'hidden',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  hamburger: {
    gap: 3,
    alignItems: 'flex-start',
  },
  line: {
    height: 1.3,
    borderRadius: 999,
  },
  label: {
    fontFamily: Fonts.displayMedium,
    fontSize: 9,
    letterSpacing: 1.8,
    color: WhiteA[80],
  },
});
