import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Moon, Sun, ChevronLeft } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { Fonts, Spacing, Animation, WhiteA } from '../../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export function TopBar({ title = 'AIR & STEEL', showBack = false }: TopBarProps) {
  const { colors, theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cartScale = useSharedValue(1);
  const cartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  const backScale = useSharedValue(1);
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const iconProgress = useSharedValue(1);
  useEffect(() => {
    iconProgress.value = 0;
    iconProgress.value = withTiming(1, {
      duration: 180,
      easing: Easing.bezier(...Animation.bezier),
    });
  }, [theme]);

  const iconStyle = useAnimatedStyle(() => {
    const startRotate = theme === 'dark' ? -25 : 25;
    return {
      opacity: iconProgress.value,
      transform: [
        { rotate: `${interpolate(iconProgress.value, [0, 1], [startRotate, 0])}deg` },
        { scale: interpolate(iconProgress.value, [0, 1], [0.75, 1]) },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.sm },
      ]}
    >
      {/* Left */}
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            onPressIn={() => (backScale.value = withSpring(0.88, Animation.springFast))}
            onPressOut={() => (backScale.value = withSpring(1, Animation.springFast))}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Animated.View style={backStyle}>
              <ChevronLeft size={20} color={WhiteA[60]} strokeWidth={1.8} />
            </Animated.View>
          </Pressable>
        )}
        <View style={[styles.dot, { backgroundColor: colors.brandOrange }]} />
        <Text style={[styles.brand, { color: colors.textPrimary }]}>{title}</Text>
      </View>

      {/* Right */}
      <View style={styles.right}>
        <Pressable
          onPress={() => router.push('/cart')}
          onPressIn={() => (cartScale.value = withSpring(0.9, Animation.springFast))}
          onPressOut={() => (cartScale.value = withSpring(1, Animation.springFast))}
          style={styles.iconBtn}
          hitSlop={12}
        >
          <Animated.View style={cartStyle}>
            <ShoppingBag size={17} color={WhiteA[50]} />
          </Animated.View>
          {cartItems.length > 0 && (
            <View style={[styles.badge, { backgroundColor: '#C85A00' }]}>
              <Text style={styles.badgeText}>
                {cartItems.length > 9 ? '9+' : cartItems.length}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable onPress={toggleTheme} style={styles.iconBtn} hitSlop={12}>
          <Animated.View style={iconStyle}>
            {theme === 'dark' ? (
              <Sun size={15} color={WhiteA[55]} strokeWidth={1.4} />
            ) : (
              <Moon size={15} color={WhiteA[55]} strokeWidth={1.4} />
            )}
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.page,
    paddingBottom: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    marginLeft: -4,
    marginRight: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  brand: {
    fontFamily: Fonts.display,
    fontSize: 10,
    letterSpacing: 2.2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 14,
    height: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: Fonts.display,
    fontSize: 8,
    color: '#FFFFFF',
    lineHeight: 10,
  },
});
