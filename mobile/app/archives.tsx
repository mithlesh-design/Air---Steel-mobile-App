import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ChevronDown, Plus, Check, ArrowRight } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TopBar } from '../src/components/layout/TopBar';
import { FloatingNav } from '../src/components/layout/FloatingNav';
import { MenuOverlay } from '../src/components/layout/MenuOverlay';
import { useTheme } from '../src/context/ThemeContext';
import { useReader } from '../src/context/ReaderContext';
import { useCart } from '../src/context/CartContext';
import { Fonts, Radius, Spacing, WhiteA, Animation } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const OWNED = new Set(['1.0', '04', '03']);

const COMING_SOON_IMG = require('../assets/brand/archives-garage.jpg');
const GENESIS_IMG = require('../assets/brand/vol1-genesis.png');

const imgSource = (img: string | number) =>
  typeof img === 'number' ? img : { uri: img };

type Volume = { num: string; title: string; img: string | number };
type Generation = { id: string; label: string; volumes: Volume[] };

const GENERATIONS: Generation[] = [
  {
    id: 'gen1',
    label: 'Generation 1',
    volumes: [
      { num: '1.0', title: 'Genesis', img: GENESIS_IMG },
      { num: '04', title: 'Silence', img: 'https://images.unsplash.com/photo-1557226217-bf0da2478e6c?w=600&q=75' },
      { num: '03', title: 'Neon', img: 'https://images.unsplash.com/photo-1762522930348-070b98229e9b?w=600&q=75' },
      { num: '02', title: 'Static', img: 'https://images.unsplash.com/photo-1772877357487-ca7dc84cc04e?w=600&q=75' },
      { num: '01', title: 'Origin', img: 'https://images.unsplash.com/photo-1776231659026-8c3943737502?w=600&q=75' },
    ],
  },
];

export default function ArchivesScreen() {
  const { colors } = useTheme();
  const { openVolume } = useReader();
  const { addToCart, cartItems } = useCart();
  const insets = useSafeAreaInsets();
  const [expandedGen, setExpandedGen] = useState<string>('gen1');
  const [notified, setNotified] = useState(false);

  const inCart = (num: string) => cartItems.some((i) => i.id === `vol-${num}`);

  const handleAddToCart = (vol: Volume) => {
    addToCart({
      id: `vol-${vol.num}`,
      title: vol.title,
      vol: `Vol ${vol.num}`,
      format: 'Hardcover',
      price: 3999,
      img: vol.img as string,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      <TopBar showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Archives</Text>
        </Animated.View>

        {/* Latest Issue — full width hero */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Latest Issue</Text>
          <Pressable
            onPress={() => openVolume('1.0', OWNED.has('1.0'))}
            style={[styles.heroCard, { borderColor: colors.borderSubtle }]}
          >
            <Image
              source={imgSource(GENERATIONS[0].volumes[0].img)}
              style={styles.heroImg}
            />
          </Pressable>
          <Text style={styles.heroTitle}>Volume 1.0{'\n'}Genesis</Text>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Coming Soon — next dispatch */}
        <Animated.View entering={FadeInDown.delay(130).duration(500)} style={styles.section}>
          <View style={[styles.comingCard, { borderColor: colors.borderSubtle }]}>
            <Image source={COMING_SOON_IMG} style={styles.comingImg} />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.55)']}
              style={styles.comingScrim}
            />
            <View style={styles.comingContent}>
              <View style={styles.comingEyebrowRow}>
                <View style={[styles.comingDot, { backgroundColor: colors.brandOrange }]} />
                <Text style={styles.comingEyebrow}>Next Dispatch · Vol 1.1</Text>
              </View>

              <Text style={styles.comingHeading}>Coming{'\n'}Soon</Text>

              <View style={[styles.comingRule, { backgroundColor: colors.brandOrange }]} />

              <Text style={styles.comingTeaser}>The next chapter in the Air & Steel lineage.</Text>
              <Text style={styles.comingSub}>Priority access for subscribers</Text>

              {notified ? (
                <View style={styles.notifiedPill}>
                  <View style={[styles.notifiedIcon, { backgroundColor: `${colors.brandOrange}20` }]}>
                    <Check size={13} color={colors.brandOrange} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.notifiedText}>You're on the list</Text>
                </View>
              ) : (
                <Pressable onPress={() => setNotified(true)} style={styles.notifyBtn}>
                  <Text style={styles.notifyBtnText}>Notify Me</Text>
                  <ArrowRight size={13} color="#0A0A0A" strokeWidth={2.2} />
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Air & Steel Archives — heading */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.section}>
          <View style={styles.archivesHeading}>
            <Text style={[styles.archivesTitle, { color: colors.textPrimary }]}>Air & Steel Archives</Text>
            <Text style={styles.archivesSub}>All Editions</Text>
          </View>

          {GENERATIONS.map((gen) => (
            <GenerationBlock
              key={gen.id}
              gen={gen}
              isOpen={expandedGen === gen.id}
              onToggle={() => setExpandedGen(expandedGen === gen.id ? '' : gen.id)}
              colors={colors}
              openVolume={openVolume}
              inCart={inCart}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Animated.View>
      </ScrollView>

      <FloatingNav />
      <MenuOverlay />
    </View>
  );
}

function GenerationBlock({
  gen,
  isOpen,
  onToggle,
  colors,
  openVolume,
  inCart,
  onAddToCart,
}: {
  gen: Generation;
  isOpen: boolean;
  onToggle: () => void;
  colors: any;
  openVolume: (num: string, owned: boolean) => void;
  inCart: (num: string) => boolean;
  onAddToCart: (vol: Volume) => void;
}) {
  const rotation = useSharedValue(isOpen ? 180 : 0);
  rotation.value = withSpring(isOpen ? 180 : 0, Animation.spring);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View>
      <Pressable onPress={onToggle} style={styles.genHeader}>
        <View style={styles.genLabelRow}>
          <View style={[styles.genDot, { backgroundColor: colors.brandOrange }]} />
          <Text style={styles.genLabel}>{gen.label}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={12} color={WhiteA[30]} />
        </Animated.View>
      </Pressable>

      {isOpen && (
        <View style={styles.volumeList}>
          {gen.volumes.map((vol) => {
            const owned = OWNED.has(vol.num);
            const alreadyInCart = inCart(vol.num);

            return (
              <Pressable
                key={vol.num}
                onPress={() => openVolume(vol.num, owned)}
                style={[
                  styles.volumeRow,
                  { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle },
                ]}
              >
                {/* Thumbnail */}
                <View style={styles.thumb}>
                  <Image source={imgSource(vol.img)} style={styles.thumbImg} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.volNum, { color: colors.textMuted }]}>Vol {vol.num}</Text>
                  <Text style={[styles.volTitle, { color: colors.textPrimary }]}>{vol.title}</Text>
                </View>

                {/* Decoration + action */}
                <View style={styles.volRight}>
                  <Text style={styles.volGiant}>{vol.num}</Text>
                  {alreadyInCart ? (
                    <View style={[styles.actionInCart, { backgroundColor: `${colors.brandOrange}26` }]}>
                      <Check size={14} color={colors.brandOrange} strokeWidth={2.5} />
                    </View>
                  ) : (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onAddToCart(vol);
                      }}
                      style={styles.actionBtn}
                    >
                      <Plus size={18} color={WhiteA[40]} strokeWidth={2} />
                    </Pressable>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.page, paddingTop: 4, paddingBottom: 32 },
  title: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 37, textTransform: 'uppercase', letterSpacing: -0.4 },
  section: { paddingHorizontal: Spacing.page, marginBottom: 32 },
  sectionLabel: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.16, textTransform: 'uppercase', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#1A1A1A', marginHorizontal: 24, marginBottom: 40 },
  heroCard: {
    width: width - Spacing.page * 2,
    aspectRatio: 3 / 4,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroImg: { width: '100%', height: '100%' },
  heroTitle: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 29,
    letterSpacing: -0.32,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  comingCard: {
    width: width - Spacing.page * 2,
    aspectRatio: 4 / 5,
    borderRadius: Radius.card,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  comingImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  comingScrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  comingContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 40,
  },
  comingEyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  comingDot: { width: 6, height: 6, borderRadius: 999 },
  comingEyebrow: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  },
  comingHeading: {
    fontFamily: Fonts.display,
    fontSize: 40,
    lineHeight: 35,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: -0.8,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 2 },
  },
  comingRule: { width: 40, height: 1, borderRadius: 999, marginBottom: 16, opacity: 0.7 },
  comingTeaser: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.65)',
    maxWidth: 280,
    marginBottom: 6,
  },
  comingSub: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 20,
  },
  notifyBtn: {
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  notifyBtnText: {
    fontFamily: Fonts.displaySemibold,
    fontSize: 11,
    letterSpacing: 2.42,
    textTransform: 'uppercase',
    color: '#0A0A0A',
  },
  notifiedPill: {
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  notifiedIcon: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifiedText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
  },
  archivesHeading: { marginBottom: 24 },
  archivesTitle: { fontFamily: Fonts.display, fontSize: 18, textTransform: 'uppercase', letterSpacing: -0.18 },
  archivesSub: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 2.16,
    textTransform: 'uppercase',
    color: WhiteA[30],
    marginTop: 4,
  },
  genHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    marginBottom: 12,
  },
  genLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  genDot: { width: 4, height: 4, borderRadius: 999 },
  genLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    color: WhiteA[50],
  },
  volumeList: { gap: 8, paddingBottom: 4 },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 2,
  },
  thumb: { width: 56, height: 72, borderRadius: 12, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  volNum: { fontFamily: Fonts.body, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 },
  volTitle: { fontFamily: Fonts.display, fontSize: 15, textTransform: 'uppercase', letterSpacing: 0 },
  volRight: { alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch' },
  volGiant: {
    fontFamily: Fonts.display,
    fontSize: 36,
    lineHeight: 36,
    color: WhiteA[6],
    letterSpacing: -0.8,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  actionInCart: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});
