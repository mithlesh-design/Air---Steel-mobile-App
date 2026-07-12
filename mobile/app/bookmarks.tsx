import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
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
import { Animation, Fonts, Radius, Spacing, WhiteA } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BOOKMARKS = [
  {
    vol: 'Vol 04 / Page 12',
    title: 'The Aesthetics of Void',
    progress: 68,
    img: 'https://images.unsplash.com/photo-1699349578489-54436281e9e0?w=400&q=75',
  },
  {
    vol: 'Vol 03 / Page 45',
    title: 'Neon Tokyo Nights',
    progress: 32,
    img: 'https://images.unsplash.com/photo-1762522930348-070b98229e9b?w=400&q=75',
  },
];

type BookmarkItem = (typeof BOOKMARKS)[number];

function BookmarkCard({ bm, index }: { bm: BookmarkItem; index: number }) {
  const { colors } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(80 + index * 60).duration(500)}>
      <AnimatedPressable
        onPress={() => router.push('/reader')}
        onPressIn={() => {
          scale.value = withSpring(0.98, Animation.springFast);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Animation.springFast);
        }}
        style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }, animatedStyle]}
      >
        <View style={styles.thumb}>
          <Image source={{ uri: bm.img }} style={styles.thumbImg} />
        </View>
        <View style={styles.info}>
          <View>
            <Text style={[styles.volRef, { color: WhiteA[35] }]}>{bm.vol}</Text>
            <Text style={[styles.bmTitle, { color: colors.textPrimary }]}>{bm.title}</Text>
          </View>
          <View style={styles.progressRow}>
            <View style={[styles.progressTrack, { backgroundColor: WhiteA[8] }]}>
              <View style={[styles.progressFill, { backgroundColor: 'rgba(255,255,255,0.5)', width: `${bm.progress}%` }]} />
            </View>
            <Text style={[styles.progressLabel, { color: WhiteA[30] }]}>{bm.progress}%</Text>
          </View>
        </View>
        <Bookmark size={14} color={colors.textPrimary} fill={colors.textPrimary} />
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function BookmarksScreen() {
  const { colors } = useTheme();
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
          <Text style={[styles.eyebrow, { color: colors.textMuted }]}>Cockpit</Text>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Bookmarks</Text>
            <Text style={[styles.count, { color: colors.textMuted }]}>{BOOKMARKS.length} Saved</Text>
          </View>
        </Animated.View>

        <View style={styles.list}>
          {BOOKMARKS.map((bm, i) => (
            <BookmarkCard key={i} bm={bm} index={i} />
          ))}
        </View>
      </ScrollView>
      <FloatingNav />
      <MenuOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.page, paddingTop: 4, paddingBottom: 32 },
  eyebrow: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.8, textTransform: 'uppercase', marginBottom: 10, paddingTop: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 37, textTransform: 'uppercase', letterSpacing: -0.4 },
  count: { fontFamily: Fonts.body, fontSize: 10, marginBottom: 4 },
  list: { paddingHorizontal: Spacing.page, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  thumb: { width: 64, height: 80, borderRadius: Radius.md, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  info: { flex: 1, justifyContent: 'space-between', gap: 12 },
  volRef: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  bmTitle: { fontFamily: Fonts.display, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  progressTrack: { flex: 1, height: 2, borderRadius: 999 },
  progressFill: { height: 2, borderRadius: 999 },
  progressLabel: { fontFamily: Fonts.body, fontSize: 8 },
});
