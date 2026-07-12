import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, ArrowRight, LayoutDashboard } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TopBar } from '../src/components/layout/TopBar';
import { FloatingNav } from '../src/components/layout/FloatingNav';
import { MenuOverlay } from '../src/components/layout/MenuOverlay';
import { useTheme } from '../src/context/ThemeContext';
import { useReader } from '../src/context/ReaderContext';
import { Fonts, Radius, Spacing, WhiteA } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GENESIS_IMG = require('../assets/brand/vol1-genesis.png');

const imgSource = (img: string | number) =>
  typeof img === 'number' ? img : { uri: img };

const OWNED_VOLUMES = [
  { num: '1.0', title: 'Genesis', img: GENESIS_IMG, progress: 100 },
  { num: '04', title: 'Silence', img: 'https://images.unsplash.com/photo-1557226217-bf0da2478e6c?w=400&q=75', progress: 68 },
  { num: '03', title: 'Neon', img: 'https://images.unsplash.com/photo-1762522930348-070b98229e9b?w=400&q=75', progress: 32 },
];

const BOOKMARKS = [
  { vol: 'Vol 04 / Page 12', title: 'The Aesthetics of Void', progress: 68, img: 'https://images.unsplash.com/photo-1699349578489-54436281e9e0?w=400&q=75' },
  { vol: 'Vol 03 / Page 45', title: 'Neon Tokyo Nights', progress: 32, img: 'https://images.unsplash.com/photo-1762522930348-070b98229e9b?w=400&q=75' },
];

const COVER_W = 185;

export default function CockpitScreen() {
  const { colors } = useTheme();
  const { openVolume } = useReader();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      <TopBar showBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
          <View style={styles.eyebrowRow}>
            <LayoutDashboard size={9} color={WhiteA[30]} />
            <Text style={[styles.eyebrow, { color: WhiteA[30] }]}>Personal Vault</Text>
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Cockpit</Text>
          <Text style={[styles.memberLine, { color: WhiteA[30] }]}>Member: Alex S.</Text>
        </Animated.View>

        {/* Digital library */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.dot, { backgroundColor: colors.brandOrange }]} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Digital Library</Text>
            <Text style={[styles.sectionCount, { color: WhiteA[25] }]}>{OWNED_VOLUMES.length} Volumes</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20 }}>
            {OWNED_VOLUMES.map((vol) => (
              <Pressable
                key={vol.num}
                onPress={() => openVolume(vol.num, true)}
                style={styles.coverCard}
              >
                <Image source={imgSource(vol.img)} style={styles.coverImg} />
                <View style={styles.coverOverlay}>
                  <Text style={[styles.coverVol, { color: WhiteA[50] }]}>Vol {vol.num}</Text>
                  <View style={styles.coverProgressTrack}>
                    <View style={[styles.coverProgressFill, { backgroundColor: colors.brandOrange, width: `${vol.progress}%` }]} />
                  </View>
                  <Text style={[styles.coverPct, { color: WhiteA[40] }]}>{vol.progress}% read</Text>
                </View>
              </Pressable>
            ))}

            {/* Add Volume placeholder */}
            <Pressable onPress={() => router.push('/archives')} style={styles.addCard}>
              <Text style={[styles.addPlus, { color: `${colors.brandOrange}66` }]}>+</Text>
              <Text style={[styles.addLabel, { color: WhiteA[25] }]}>Add Volume</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>

        {/* Bookmarks */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.dot, { backgroundColor: WhiteA[20] }]} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Bookmarks</Text>
            <Text style={[styles.sectionCount, { color: WhiteA[25] }]}>2 Saved</Text>
          </View>
          <View style={styles.bookmarkList}>
            {BOOKMARKS.map((bm, i) => (
              <Pressable
                key={i}
                onPress={() => router.push('/reader')}
                style={[styles.bookmarkCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
              >
                <View style={styles.bmThumb}>
                  <Image source={{ uri: bm.img }} style={styles.bmThumbImg} />
                </View>
                <View style={styles.bmInfo}>
                  <Text style={[styles.bmVol, { color: colors.textDim }]}>{bm.vol}</Text>
                  <Text style={[styles.bmTitle, { color: colors.textPrimary }]}>{bm.title}</Text>
                  <View style={styles.bmProgressRow}>
                    <View style={[styles.bmProgress, { backgroundColor: WhiteA[8] }]}>
                      <View style={[styles.bmProgressFill, { backgroundColor: `${colors.brandOrange}99`, width: `${bm.progress}%` }]} />
                    </View>
                    <Text style={[styles.bmPct, { color: WhiteA[30] }]}>{bm.progress}%</Text>
                  </View>
                </View>
                <Bookmark size={14} color={colors.textPrimary} fill={colors.textPrimary} />
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => router.push('/bookmarks')} style={styles.seeAllBtn}>
            <Text style={[styles.seeAllText, { color: WhiteA[40] }]}>See All </Text>
            <ArrowRight size={9} color={WhiteA[40]} />
          </Pressable>
        </Animated.View>

        {/* Archive CTA */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <Pressable
            onPress={() => router.push('/archives')}
            style={[styles.archiveCta, { borderColor: colors.border }]}
          >
            <Text style={[styles.archiveCtaText, { color: colors.textSecondary }]}>Visit Archives</Text>
            <ArrowRight size={12} color={colors.textMuted} />
          </Pressable>
        </Animated.View>
      </ScrollView>
      <FloatingNav />
      <MenuOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.page, paddingTop: 4, paddingBottom: 32 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  eyebrow: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.52, textTransform: 'uppercase' },
  title: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 37, textTransform: 'uppercase', letterSpacing: -0.4, marginBottom: 8 },
  memberLine: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.16, textTransform: 'uppercase' },
  section: { paddingHorizontal: Spacing.page, marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2.2 },
  sectionCount: { fontFamily: Fonts.body, fontSize: 8, marginLeft: 'auto' },
  coverCard: {
    width: COVER_W,
    height: COVER_W * (4 / 3),
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
    position: 'relative',
  },
  coverImg: { width: '100%', height: '100%', position: 'absolute' },
  coverOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  coverVol: { fontFamily: Fonts.body, fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  coverProgressTrack: { height: 2, backgroundColor: WhiteA[10], borderRadius: 999 },
  coverProgressFill: { height: 2, borderRadius: 999 },
  coverPct: { fontFamily: Fonts.body, fontSize: 6, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 5 },
  addCard: {
    width: COVER_W,
    height: COVER_W * (4 / 3),
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#2A2A2A',
    backgroundColor: 'rgba(20,20,20,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPlus: { fontFamily: Fonts.display, fontSize: 30 },
  addLabel: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' },
  bookmarkList: { gap: 10 },
  bookmarkCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: Radius.md + 4, borderWidth: 1 },
  bmThumb: { width: 56, height: 64, borderRadius: Radius.md, overflow: 'hidden' },
  bmThumbImg: { width: '100%', height: '100%' },
  bmInfo: { flex: 1, gap: 4 },
  bmVol: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' },
  bmTitle: { fontFamily: Fonts.display, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  bmProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bmProgress: { flex: 1, height: 2, borderRadius: 999 },
  bmProgressFill: { height: 2, borderRadius: 999 },
  bmPct: { fontFamily: Fonts.body, fontSize: 7 },
  seeAllBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 999,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllText: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase' },
  archiveCta: {
    borderRadius: 999,
    borderWidth: 2,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  archiveCtaText: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase' },
});
