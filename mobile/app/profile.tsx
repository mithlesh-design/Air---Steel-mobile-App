import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  LogOut, ChevronRight, Shield, CreditCard, MapPin, Clock, User, Bell,
  Fingerprint, Sun, Moon, Package,
} from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { TopBar } from '../src/components/layout/TopBar';
import { FloatingNav } from '../src/components/layout/FloatingNav';
import { MenuOverlay } from '../src/components/layout/MenuOverlay';
import { useTheme } from '../src/context/ThemeContext';
import { Fonts, Radius, Spacing, WhiteA } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SectionLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionLabelRow}>
      <View style={[styles.sectionLine, { backgroundColor: `${colors.textPrimary}10` }]} />
      <Text style={styles.sectionLabelText}>{label}</Text>
      <View style={[styles.sectionLine, { backgroundColor: `${colors.textPrimary}10` }]} />
    </View>
  );
}

function SettingRow({
  icon: Icon,
  label,
  right,
  onPress,
  danger,
}: {
  icon: React.ElementType<any>;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.settingRow, { borderBottomColor: colors.borderSubtle }]}
    >
      <View style={styles.settingLeft}>
        <Icon size={13} color={danger ? 'rgba(248,113,113,0.6)' : colors.textMuted} />
        <Text style={[styles.settingLabel, { color: danger ? 'rgba(248,113,113,0.8)' : colors.textPrimary }]}>
          {label}
        </Text>
      </View>
      {right}
    </Pressable>
  );
}

function GlyphRow({
  glyph,
  glyphStyle,
  label,
  value,
}: {
  glyph: string;
  glyphStyle: object;
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.borderSubtle }]}>
      <View style={styles.settingLeft}>
        <Text style={glyphStyle}>{glyph}</Text>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        <Text style={[styles.settingValue, { color: WhiteA[50] }]}>{value}</Text>
        <ChevronRight size={11} color={WhiteA[20]} />
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [toggleW, setToggleW] = useState(0);
  const progress = useSharedValue(theme === 'dark' ? 0 : 1);

  useEffect(() => {
    progress.value = withSpring(theme === 'dark' ? 0 : 1, {
      stiffness: 500,
      damping: 38,
      mass: 0.6,
    });
  }, [theme, progress]);

  const pillStyle = useAnimatedStyle(() => {
    const half = (toggleW - 6) / 2;
    return {
      width: half > 0 ? half : 0,
      transform: [{ translateX: progress.value * (half > 0 ? half : 0) }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      <TopBar showBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.textMuted }]}>Account Layer</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
          <View style={[styles.titleLine, { backgroundColor: WhiteA[40] }]} />
        </Animated.View>

        {/* Identity card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={[styles.identityCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.memberName, { color: colors.textPrimary }]}>Alex S.</Text>
            <Text style={styles.memberTier}>Founding Member</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.textPrimary }]} />
              <Text style={styles.statusText}>Active Subscription</Text>
            </View>
            <Text style={styles.memberSince}>Member Since Jan 2025</Text>
          </View>
          <Shield size={16} color={colors.textMuted} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(600)} style={styles.sections}>
          {/* Personal info */}
          <View>
            <SectionLabel label="Personal Information" />
            <View style={[styles.settingGroup, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <SettingRow
                icon={User}
                label="Full Name"
                right={
                  <View style={styles.settingRight}>
                    <Text style={[styles.settingValue, { color: WhiteA[50] }]}>Alex S.</Text>
                    <ChevronRight size={11} color={WhiteA[20]} />
                  </View>
                }
              />
              <GlyphRow glyph="@" glyphStyle={styles.glyphAt} label="Email" value="alex@air…" />
              <GlyphRow glyph="✆" glyphStyle={styles.glyphPhone} label="Phone" value="+1 (555) 019…" />
            </View>
          </View>

          {/* Addresses */}
          <View>
            <SectionLabel label="Addresses" />
            <View style={{ gap: 10 }}>
              <View style={[styles.addressCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                <View style={styles.addressIcon}>
                  <MapPin size={12} color={WhiteA[60]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressLabel}>Primary Address</Text>
                  <Text style={[styles.addressBody, { color: colors.textPrimary }]}>
                    1234 Industrial Loft{'\n'}District 9, Neo-Tokyo 101
                  </Text>
                </View>
                <ChevronRight size={11} color={WhiteA[20]} style={{ alignSelf: 'center' }} />
              </View>
              <Pressable style={[styles.dashedBtn, { borderColor: colors.border }]}>
                <Text style={styles.dashedBtnText}>+ Add Address</Text>
              </Pressable>
            </View>
          </View>

          {/* Payment */}
          <View>
            <SectionLabel label="Payment Methods" />
            <View style={{ gap: 10 }}>
              <View style={[styles.paymentCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                <View style={styles.paymentIcon}>
                  <CreditCard size={13} color={WhiteA[40]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.paymentTitle, { color: colors.textPrimary }]}>VISA •••• 4242</Text>
                  <Text style={styles.paymentExpiry}>Expires 09/27</Text>
                </View>
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              </View>
              <Pressable style={[styles.dashedBtn, { borderColor: colors.border }]}>
                <Text style={styles.dashedBtnText}>+ Add Payment Method</Text>
              </Pressable>
            </View>
          </View>

          {/* Purchase history */}
          <View>
            <SectionLabel label="Purchase History" />
            <View style={[styles.settingGroup, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              {[
                { item: 'Volume 04 — Hardcover', date: 'Oct 12, 2025', price: '₹3,999' },
                { item: 'Digital Subscription', date: 'Aug 01, 2025', price: '₹1,299/mo' },
                { item: 'Volume 03 — Hardcover', date: 'May 08, 2025', price: '₹3,800' },
              ].map((tx, i) => (
                <View key={i} style={[styles.txRow, { borderBottomColor: colors.borderSubtle }]}>
                  <View style={styles.txIcon}>
                    <Package size={12} color={WhiteA[40]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.txTitle, { color: colors.textPrimary }]}>{tx.item}</Text>
                    <View style={styles.txDateRow}>
                      <Clock size={8} color={WhiteA[30]} />
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>
                  </View>
                  <Text style={[styles.txPrice, { color: colors.textPrimary }]}>{tx.price}</Text>
                </View>
              ))}
              <Pressable style={styles.viewAllRow}>
                <Text style={styles.viewAllText}>View All Transactions</Text>
                <ChevronRight size={9} color={WhiteA[50]} />
              </Pressable>
            </View>
          </View>

          {/* App settings */}
          <View>
            <SectionLabel label="App Settings" />
            <View style={[styles.settingGroup, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              {/* Theme toggle */}
              <View style={[styles.settingRow, { borderBottomColor: colors.borderSubtle }]}>
                <View style={styles.settingLeft}>
                  {theme === 'dark'
                    ? <Moon size={13} color={colors.textMuted} />
                    : <Sun size={13} color={colors.textMuted} />}
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>App Theme</Text>
                </View>
                <Pressable
                  onPress={toggleTheme}
                  onLayout={(e) => setToggleW(e.nativeEvent.layout.width)}
                  style={[styles.themeToggle, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
                >
                  <Animated.View
                    style={[styles.themePill, { backgroundColor: colors.textPrimary }, pillStyle]}
                  />
                  <View style={styles.themeOption}>
                    <Moon
                      size={9}
                      strokeWidth={1.8}
                      color={theme === 'dark' ? colors.black : WhiteA[30]}
                    />
                    <Text style={[styles.themeOptionText, { color: theme === 'dark' ? colors.black : WhiteA[30] }]}>Dark</Text>
                  </View>
                  <View style={styles.themeOption}>
                    <Sun
                      size={9}
                      strokeWidth={1.8}
                      color={theme === 'light' ? colors.white : WhiteA[30]}
                    />
                    <Text style={[styles.themeOptionText, { color: theme === 'light' ? colors.white : WhiteA[30] }]}>Light</Text>
                  </View>
                </Pressable>
              </View>
              <SettingRow
                icon={Fingerprint}
                label="Biometric Lock"
                right={<Text style={styles.biometricValue}>Enabled</Text>}
              />
              <SettingRow icon={Bell} label="Notifications" right={<ChevronRight size={12} color={WhiteA[25]} />} />
              <GlyphRowRight glyph="?" glyphStyle={styles.glyphSupport} label="Support & Help" />
              <GlyphRowRight glyph="§" glyphStyle={styles.glyphLegal} label="Legal & Privacy" />
            </View>
          </View>

          {/* Sign out */}
          <Pressable
            onPress={() => router.replace('/login')}
            style={[styles.signOutBtn, { borderColor: colors.border }]}
          >
            <LogOut size={12} color={WhiteA[50]} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
      <FloatingNav />
      <MenuOverlay />
    </View>
  );
}

function GlyphRowRight({
  glyph,
  glyphStyle,
  label,
}: {
  glyph: string;
  glyphStyle: object;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.borderSubtle }]}>
      <View style={styles.settingLeft}>
        <Text style={glyphStyle}>{glyph}</Text>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <ChevronRight size={12} color={WhiteA[25]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.page, paddingTop: 4, paddingBottom: 32 },
  eyebrow: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.52, textTransform: 'uppercase', marginBottom: 12 },
  title: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 37, textTransform: 'uppercase', letterSpacing: -0.4, marginBottom: 16 },
  titleLine: { width: 40, height: 1, borderRadius: 999 },
  identityCard: { marginHorizontal: Spacing.page, borderRadius: 24, borderWidth: 2, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  avatar: { width: 56, height: 56, borderRadius: 999, borderWidth: 2, backgroundColor: '#2A2A2A', borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Fonts.display, fontSize: 14, letterSpacing: 1.5, color: WhiteA[60] },
  memberName: { fontFamily: Fonts.display, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  memberTier: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2, color: WhiteA[40] },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 999 },
  statusText: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: WhiteA[70] },
  memberSince: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4, color: WhiteA[40] },
  sections: { paddingHorizontal: Spacing.page, gap: 32 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sectionLine: { flex: 1, height: 1 },
  sectionLabelText: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: WhiteA[30] },
  settingGroup: { borderRadius: 16, borderWidth: 2, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingLabel: { fontFamily: Fonts.displaySemibold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontFamily: Fonts.body, fontSize: 9 },
  glyphAt: { fontFamily: Fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.30)' },
  glyphPhone: { fontFamily: Fonts.body, fontSize: 11, color: WhiteA[30] },
  glyphSupport: { fontFamily: Fonts.body, fontSize: 13, color: WhiteA[20] },
  glyphLegal: { fontFamily: Fonts.body, fontSize: 11, color: WhiteA[20] },
  addressCard: { borderRadius: 16, borderWidth: 1, padding: 16, flexDirection: 'row', gap: 12 },
  addressIcon: { width: 32, height: 32, borderRadius: Radius.md, backgroundColor: WhiteA[8], borderWidth: 2, borderColor: WhiteA[12], alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  addressLabel: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: WhiteA[50], marginBottom: 4 },
  addressBody: { fontFamily: Fonts.body, fontSize: 10, lineHeight: 16 },
  dashedBtn: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dashedBtnText: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: WhiteA[30] },
  paymentCard: { borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentIcon: { width: 32, height: 32, borderRadius: Radius.md, backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center' },
  paymentTitle: { fontFamily: Fonts.display, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  paymentExpiry: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2, color: WhiteA[35] },
  defaultBadge: { borderWidth: 2, borderColor: WhiteA[15], backgroundColor: WhiteA[8], borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  defaultBadgeText: { fontFamily: Fonts.body, fontSize: 7, letterSpacing: 2, textTransform: 'uppercase', color: WhiteA[60] },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  txIcon: { width: 32, height: 32, borderRadius: Radius.md, backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center' },
  txTitle: { fontFamily: Fonts.display, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  txDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  txDate: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: WhiteA[30] },
  txPrice: { fontFamily: Fonts.bodyMedium, fontSize: 11 },
  viewAllRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 14 },
  viewAllText: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase', color: WhiteA[50] },
  themeToggle: { position: 'relative', flexDirection: 'row', borderRadius: 999, borderWidth: 1, padding: 3 },
  themePill: { position: 'absolute', top: 3, bottom: 3, left: 3, borderRadius: 999 },
  themeOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7 },
  themeOptionText: { fontFamily: Fonts.display, fontSize: 8, textTransform: 'uppercase', letterSpacing: 2 },
  biometricValue: { fontFamily: Fonts.body, fontSize: 8, color: WhiteA[60], textTransform: 'uppercase', letterSpacing: 1.5 },
  signOutBtn: { borderRadius: 999, paddingVertical: 16, borderWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  signOutText: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: WhiteA[50] },
});
