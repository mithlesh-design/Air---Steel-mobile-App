import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  X,
  Bookmark,
  Maximize2,
  Minimize2,
  AlignJustify,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { useTheme } from '../src/context/ThemeContext';
import { Fonts, Radius, Spacing, WhiteA } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const MAGAZINE_PAGES = [
  {
    num: 93,
    image: 'https://images.unsplash.com/photo-1557226217-bf0da2478e6c?w=800&q=80',
    section: 'Cover Story',
    headline: 'The Architecture\nof Silence',
    body: 'Modern high-end garages are moving away from the cluttered, oil-stained aesthetic of the past towards a clean, brutalist minimalism. "The Architecture of Silence" takes you inside three architecturally significant workshops in Switzerland and Japan — where concrete meets carbon fiber, and every tool has its place.',
  },
  {
    num: 94,
    image: 'https://images.unsplash.com/photo-1769641241031-3d4266780e17?w=800&q=80',
    section: 'Feature',
    headline: 'The Private\nGarage',
    body: 'For the ultra-wealthy, the garage has evolved into something far more personal — a curated space that reveals as much about character as any art collection. We profile four collectors whose private garages function less as storage and more as shrines to mechanical perfection.',
  },
  {
    num: 95,
    image: 'https://images.unsplash.com/photo-1768334431181-a9e82f158eaf?w=800&q=80',
    section: 'Material',
    headline: 'Carbon &\nSteel',
    body: 'Two materials define the modern performance automobile: carbon fiber, born in aerospace, and high-tensile steel, forged in tradition. Their relationship is neither rivalry nor compromise — it is a precise dialogue between weight and strength, flex and rigidity.',
  },
  {
    num: 96,
    image: 'https://images.unsplash.com/photo-1751819224947-01b829fbb4ce?w=800&q=80',
    section: 'Environment',
    headline: 'Void as\nMedium',
    body: 'There is a particular kind of courage in leaving a space empty. In an age of maximalism — where every surface competes for attention — the designers and collectors who choose restraint are making a radical statement.',
  },
  {
    num: 97,
    image: 'https://images.unsplash.com/photo-1762028768745-f701dce6aa64?w=800&q=80',
    section: 'Nightside',
    headline: 'Night\nRunners',
    body: 'The city after midnight belongs to a different kind of driver. Not the commuter, not the weekend enthusiast — but those for whom the road is only truly alive when it is empty, slick with rain, and lit by the amber blur of passing streetlights.',
  },
];

const TOTAL_PAGES = 140;
const CARD_W = width * 0.82;
const CARD_H = CARD_W * (4.2 / 3);

export default function ReaderScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [pageIndex, setPageIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showContents, setShowContents] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const currentPage = MAGAZINE_PAGES[pageIndex];

  const goNext = useCallback(() => {
    if (pageIndex < MAGAZINE_PAGES.length - 1) {
      setDirection(1);
      setPageIndex((i) => i + 1);
    }
  }, [pageIndex]);

  const goPrev = useCallback(() => {
    if (pageIndex > 0) {
      setDirection(-1);
      setPageIndex((i) => i - 1);
    }
  }, [pageIndex]);

  const handleTouchStart = (e: GestureResponderEvent) => {
    touchStartX.current = e.nativeEvent.pageX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: GestureResponderEvent) => {
    const deltaX = e.nativeEvent.pageX - touchStartX.current;
    const absDelta = Math.abs(deltaX);
    if (absDelta < 30) return;
    deltaX < 0 ? goNext() : goPrev();
  };

  const enterAnim = direction === 1 ? SlideInRight : SlideInLeft;
  const exitAnim = direction === 1 ? SlideOutLeft : SlideOutRight;

  return (
    <View style={[styles.container, { backgroundColor: '#080808' }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.volLabel}>Vol 04</Text>
          <Text style={styles.volTitle}>Silence</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable
            onPress={() => setShowContents((v) => !v)}
            style={[styles.iconBtn, { borderColor: '#2A2A2A', backgroundColor: '#141414' }]}
          >
            <AlignJustify size={14} color="rgba(255,255,255,0.7)" />
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            style={[styles.iconBtn, styles.iconBtnRound, { borderColor: '#2A2A2A', backgroundColor: '#141414' }]}
          >
            <X size={14} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      </View>

      {/* Magazine card */}
      <View
        style={styles.cardArea}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Animated.View
          key={pageIndex}
          entering={enterAnim.duration(280).springify().damping(28)}
          exiting={exitAnim.duration(220)}
          style={[styles.card, { width: CARD_W, height: CARD_H }]}
        >
          <Image source={{ uri: currentPage.image }} style={styles.cardImg} />

          {/* Magazine header strip */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardBrand}>Air & Steel</Text>
            <Text style={styles.cardPageNum}>{String(currentPage.num).padStart(3, '0')}</Text>
          </View>

          {/* Section */}
          <View style={styles.cardSection}>
            <View style={styles.sectionDot} />
            <Text style={styles.cardSectionText}>{currentPage.section}</Text>
          </View>

          {/* Center decorative element */}
          <View style={styles.cardCenterDeco}>
            <View style={styles.cardCenterLine} />
            <View style={styles.cardCenterDot} />
            <View style={styles.cardCenterLine} />
          </View>

          {/* Bottom content */}
          <View style={styles.cardBottom}>
            <Text style={styles.cardHeadline}>{currentPage.headline}</Text>
            <View style={styles.cardDivider} />
            <Text style={styles.cardVolLabel}>Vol 04 · Silence</Text>
          </View>
        </Animated.View>

        {/* Tap zones */}
        <Pressable
          onPress={goPrev}
          style={[styles.tapZone, styles.tapLeft]}
          disabled={pageIndex === 0}
        />
        <Pressable
          onPress={goNext}
          style={[styles.tapZone, styles.tapRight]}
          disabled={pageIndex === MAGAZINE_PAGES.length - 1}
        />
      </View>

      {/* Dot nav + arrow buttons */}
      <View style={styles.dotNav}>
        <Pressable onPress={goPrev} disabled={pageIndex === 0} style={[styles.dotNavBtn, { opacity: pageIndex === 0 ? 0 : 1 }]}>
          <ChevronLeft size={12} color={WhiteA[25]} />
          <Text style={styles.dotNavLabel}>Prev</Text>
        </Pressable>

        <View style={styles.dots}>
          {MAGAZINE_PAGES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => { setDirection(i > pageIndex ? 1 : -1); setPageIndex(i); }}
              style={[
                styles.dot,
                i === pageIndex
                  ? { width: 20, backgroundColor: '#FFFFFF' }
                  : { width: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={goNext}
          disabled={pageIndex === MAGAZINE_PAGES.length - 1}
          style={[styles.dotNavBtn, { opacity: pageIndex === MAGAZINE_PAGES.length - 1 ? 0 : 1 }]}
        >
          <Text style={styles.dotNavLabel}>Next</Text>
          <ChevronRight size={12} color={WhiteA[25]} />
        </Pressable>
      </View>

      {/* Bottom pill */}
      <View style={[styles.bottomPill, { bottom: insets.bottom + 28 }]}>
        <View style={[styles.pill, { borderColor: '#2A2A2A' }]}>
          <View style={styles.pageCounter}>
            <Text style={styles.pageNum}>{String(currentPage.num).padStart(3, '0')}</Text>
            <Text style={styles.pageTotal}> / {TOTAL_PAGES}</Text>
          </View>
          <View style={styles.pillDivider} />
          <Pressable onPress={() => setBookmarked((b) => !b)} style={styles.pillBtn}>
            <Bookmark
              size={16}
              color={bookmarked ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
              fill={bookmarked ? '#FFFFFF' : 'none'}
            />
          </Pressable>
          <Pressable onPress={() => setIsExpanded(true)} style={styles.pillBtn}>
            <Maximize2 size={16} color="rgba(255,255,255,0.4)" />
          </Pressable>
        </View>
      </View>

      {/* Table of contents overlay */}
      {showContents && (
        <>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.contentsBackdrop}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowContents(false)} />
          </Animated.View>
          <Animated.View
            entering={SlideInRight.springify().damping(28).stiffness(260)}
            exiting={FadeOut.duration(200)}
            style={[styles.contentsPanel, { backgroundColor: '#0D0D0D', borderColor: '#1E1E1E', paddingTop: insets.top }]}
          >
            <View style={[styles.contentsPanelHeader, { borderBottomColor: '#1A1A1A' }]}>
              <View>
                <Text style={styles.contentsEyebrow}>Contents</Text>
                <Text style={styles.contentsPanelTitle}>Vol 04 · Silence</Text>
              </View>
              <Pressable
                onPress={() => setShowContents(false)}
                style={[styles.contentsClose, { backgroundColor: '#1A1A1A' }]}
              >
                <X size={12} color="rgba(255,255,255,0.6)" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MAGAZINE_PAGES.map((p, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setDirection(i > pageIndex ? 1 : -1);
                    setPageIndex(i);
                    setShowContents(false);
                  }}
                  style={[
                    styles.contentsRow,
                    {
                      borderBottomColor: '#141414',
                      backgroundColor: i === pageIndex ? 'rgba(255,255,255,0.04)' : 'transparent',
                    },
                  ]}
                >
                  <View style={[styles.contentsThumb, { overflow: 'hidden' }]}>
                    <Image source={{ uri: p.image }} style={styles.contentsThumbImg} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contentsSection}>{p.section}</Text>
                    <Text style={[styles.contentsTitle, { color: i === pageIndex ? '#FFFFFF' : 'rgba(255,255,255,0.6)' }]}>
                      {p.headline}
                    </Text>
                  </View>
                  <Text style={styles.contentsPageNum}>{String(p.num).padStart(3, '0')}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </>
      )}

      {/* Expanded full-screen */}
      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[StyleSheet.absoluteFill, { backgroundColor: '#080808', zIndex: 50 }]}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Animated.Image
            key={`exp-${pageIndex}`}
            source={{ uri: currentPage.image }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View style={[styles.expandedTop, { top: insets.top + 12 }]}>
            <Text style={styles.expandedBrand}>Air & Steel · Vol 04</Text>
            <Pressable
              onPress={() => setIsExpanded(false)}
              style={styles.expandedClose}
            >
              <Minimize2 size={13} color="rgba(255,255,255,0.8)" />
            </Pressable>
          </View>
          <Text style={[styles.expandedPageNum, { top: insets.top + 56 }]}>
            {String(currentPage.num).padStart(3, '0')} / {TOTAL_PAGES}
          </Text>
          <View style={[styles.expandedBottom, { bottom: insets.bottom + 32 }]}>
            <Pressable onPress={goPrev} disabled={pageIndex === 0} style={styles.expandedNavBtn}>
              <ChevronLeft size={14} color={WhiteA[50]} />
              <Text style={styles.expandedNavLabel}>Prev</Text>
            </Pressable>
            <View style={styles.dots}>
              {MAGAZINE_PAGES.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === pageIndex ? '#FFFFFF' : 'rgba(255,255,255,0.3)', width: i === pageIndex ? 20 : 4 },
                  ]}
                />
              ))}
            </View>
            <Pressable onPress={goNext} disabled={pageIndex === MAGAZINE_PAGES.length - 1} style={styles.expandedNavBtn}>
              <Text style={styles.expandedNavLabel}>Next</Text>
              <ChevronRight size={14} color={WhiteA[50]} />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 20,
    zIndex: 20,
  },
  volLabel: { fontFamily: Fonts.body, fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 2.25, textTransform: 'uppercase', marginBottom: 2 },
  volTitle: { fontFamily: Fonts.display, fontSize: 18, color: '#FFFFFF', letterSpacing: 2.7, textTransform: 'uppercase' },
  topActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconBtnRound: { borderRadius: 999 },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.95,
    shadowRadius: 40,
    elevation: 24,
  },
  cardImg: { width: '100%', height: '100%', position: 'absolute' },
  cardHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 18 },
  cardBrand: { fontFamily: Fonts.bodyMedium, fontSize: 7, color: 'rgba(255,255,255,0.8)', letterSpacing: 2.1, textTransform: 'uppercase' },
  cardPageNum: { fontFamily: Fonts.body, fontSize: 7, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.75 },
  cardCenterDeco: { position: 'absolute', top: '50%', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardCenterLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  cardCenterDot: { width: 4, height: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)' },
  cardSection: { position: 'absolute', top: 44, left: 18, flexDirection: 'row', alignItems: 'center', gap: 5 },
  sectionDot: { width: 4, height: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.8)' },
  cardSectionText: { fontFamily: Fonts.body, fontSize: 7, color: 'rgba(255,255,255,0.8)', letterSpacing: 2.5, textTransform: 'uppercase' },
  cardBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 },
  cardHeadline: { fontFamily: Fonts.display, fontSize: 22, color: '#FFFFFF', letterSpacing: 1, textTransform: 'uppercase', lineHeight: 26, marginBottom: 10, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  cardDivider: { width: 32, height: 1, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 999, marginBottom: 7 },
  cardVolLabel: { fontFamily: Fonts.body, fontSize: 8, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.76, textTransform: 'uppercase' },
  tapZone: { position: 'absolute', top: 0, bottom: 0, width: '20%' },
  tapLeft: { left: 0 },
  tapRight: { right: 0 },
  dotNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, paddingVertical: 16 },
  dotNavBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dotNavLabel: { fontFamily: Fonts.body, fontSize: 8, color: WhiteA[25], letterSpacing: 0.8, textTransform: 'uppercase' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 4, borderRadius: 999 },
  bottomPill: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 20 },
  pill: { flexDirection: 'row', alignItems: 'center', borderRadius: 999, borderWidth: 1, backgroundColor: '#0F0F0F', overflow: 'hidden' },
  pageCounter: { flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 20, paddingVertical: 14 },
  pageNum: { fontFamily: Fonts.display, fontSize: 14, color: '#FFFFFF', letterSpacing: 1 },
  pageTotal: { fontFamily: Fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  pillDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 4 },
  pillBtn: { paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  contentsBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 30 },
  contentsPanel: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 288, borderLeftWidth: 1, zIndex: 40 },
  contentsPanelHeader: { paddingHorizontal: 18, paddingBottom: 16, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contentsEyebrow: { fontFamily: Fonts.body, fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 3 },
  contentsPanelTitle: { fontFamily: Fonts.display, fontSize: 14, color: '#FFFFFF', letterSpacing: 1.5, textTransform: 'uppercase' },
  contentsClose: { width: 28, height: 28, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  contentsRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1 },
  contentsThumb: { width: 40, height: 48, borderRadius: 8 },
  contentsThumbImg: { width: '100%', height: '100%' },
  contentsSection: { fontFamily: Fonts.body, fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  contentsTitle: { fontFamily: Fonts.display, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', lineHeight: 14 },
  contentsPageNum: { fontFamily: Fonts.body, fontSize: 9, color: 'rgba(255,255,255,0.2)' },
  expandedTop: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  expandedBrand: { fontFamily: Fonts.body, fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase' },
  expandedClose: { width: 36, height: 36, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  expandedPageNum: { position: 'absolute', left: 20, fontFamily: Fonts.body, fontSize: 9, color: WhiteA[30], letterSpacing: 2, textTransform: 'uppercase', fontVariant: ['tabular-nums'] },
  expandedBottom: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  expandedNavBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  expandedNavLabel: { fontFamily: Fonts.body, fontSize: 9, color: WhiteA[50], letterSpacing: 1.5, textTransform: 'uppercase' },
});
