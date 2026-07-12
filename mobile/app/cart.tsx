import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TopBar } from '../src/components/layout/TopBar';
import { FloatingNav } from '../src/components/layout/FloatingNav';
import { MenuOverlay } from '../src/components/layout/MenuOverlay';
import { useTheme } from '../src/context/ThemeContext';
import { useCart } from '../src/context/CartContext';
import { Fonts, Radius, Spacing, WhiteA } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { colors } = useTheme();
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const subtotal = cartItems.reduce((s, i) => s + i.price, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      <TopBar showBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.textMuted }]}>Purchase</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Cart</Text>
        </Animated.View>

        {cartItems.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <ShoppingBag size={22} color={WhiteA[25]} />
            </View>
            <Text style={[styles.emptyTitle, { color: WhiteA[60] }]}>Your cart is empty</Text>
            <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
              Browse the Archives to find issues to add.
            </Text>
            <Pressable
              onPress={() => router.push('/archives')}
              style={[styles.browseBtn, { borderColor: `${colors.brandOrange}4D` }]}
            >
              <Text style={[styles.browseBtnText, { color: colors.brandOrange }]}>Browse Archives </Text>
              <ArrowRight size={10} color={colors.brandOrange} />
            </Pressable>
          </Animated.View>
        ) : (
          <>
            {/* Items */}
            <View style={styles.items}>
              {cartItems.map((item, i) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(80 + i * 50).duration(500)}
                  style={[styles.itemCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                >
                  <View style={styles.itemThumb}>
                    <Image source={{ uri: item.img }} style={styles.itemThumbImg} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemVol, { color: WhiteA[30] }]}>{item.vol}</Text>
                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.itemFormat, { color: WhiteA[40] }]}>{item.format}</Text>
                    <Text style={[styles.itemPrice, { color: colors.textPrimary }]}>
                      ₹{item.price.toLocaleString()}
                    </Text>
                  </View>
                  <Pressable onPress={() => removeFromCart(item.id)} hitSlop={12}>
                    <Trash2 size={13} color={WhiteA[25]} />
                  </Pressable>
                </Animated.View>
              ))}
            </View>

            {/* Summary */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(500)}
              style={[styles.summary, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
            >
              <Text style={[styles.summaryLabel, { color: WhiteA[40] }]}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryKey, { color: WhiteA[50] }]}>Subtotal</Text>
                <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>₹{subtotal.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryKey, { color: WhiteA[50] }]}>Shipping</Text>
                <Text style={[styles.summaryMuted, { color: WhiteA[40] }]}>Calculated at checkout</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalKey, { color: colors.textPrimary }]}>Total</Text>
                <Text style={[styles.totalVal, { color: colors.textPrimary }]}>₹{subtotal.toLocaleString()}</Text>
              </View>
            </Animated.View>

            {/* Checkout */}
            <Animated.View
              entering={FadeInDown.delay(250).duration(500)}
              style={styles.checkoutSection}
            >
              <Pressable style={[styles.checkoutBtn, { backgroundColor: colors.white }]}>
                <Text style={[styles.checkoutBtnText, { color: colors.black }]}>Proceed to Checkout </Text>
                <ArrowRight size={13} color={colors.black} />
              </Pressable>
              <Pressable onPress={() => router.push('/archives')} style={styles.continueBtn}>
                <Text style={[styles.continueBtnText, { color: WhiteA[40] }]}>Continue Browsing</Text>
              </Pressable>
            </Animated.View>
          </>
        )}
      </ScrollView>
      <FloatingNav />
      <MenuOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.page, paddingTop: 4, paddingBottom: 32 },
  eyebrow: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.8, textTransform: 'uppercase', marginBottom: 10 },
  title: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 37, textTransform: 'uppercase', letterSpacing: -0.4 },
  empty: { paddingHorizontal: Spacing.page, alignItems: 'center', paddingTop: 80 },
  emptyIcon: { width: 64, height: 64, borderRadius: 999, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyTitle: { fontFamily: Fonts.display, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  emptyBody: { fontFamily: Fonts.body, fontSize: 11, textAlign: 'center', marginBottom: 32 },
  browseBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 12 },
  browseBtnText: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' },
  items: { paddingHorizontal: Spacing.page, gap: 12, marginBottom: 24 },
  itemCard: { flexDirection: 'row', gap: 16, padding: 16, borderRadius: 16, borderWidth: 2 },
  itemThumb: { width: 64, height: 80, borderRadius: Radius.md, overflow: 'hidden' },
  itemThumbImg: { width: '100%', height: '100%' },
  itemInfo: { flex: 1, gap: 3, justifyContent: 'space-between' },
  itemVol: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' },
  itemTitle: { fontFamily: Fonts.display, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  itemFormat: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' },
  itemPrice: { fontFamily: Fonts.displayMedium, fontSize: 14, marginTop: 4 },
  summary: { marginHorizontal: Spacing.page, padding: 20, borderRadius: 16, borderWidth: 2, gap: 10, marginBottom: 24 },
  summaryLabel: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryKey: { fontFamily: Fonts.body, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  summaryVal: { fontFamily: Fonts.bodyMedium, fontSize: 12 },
  summaryMuted: { fontFamily: Fonts.body, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  summaryDivider: { height: 1 },
  totalKey: { fontFamily: Fonts.display, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  totalVal: { fontFamily: Fonts.display, fontSize: 16 },
  checkoutSection: { paddingHorizontal: Spacing.page, gap: 12, marginBottom: 16 },
  checkoutBtn: { borderRadius: 999, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  checkoutBtnText: { fontFamily: Fonts.display, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  continueBtn: { alignItems: 'center', paddingVertical: 14 },
  continueBtnText: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' },
});
