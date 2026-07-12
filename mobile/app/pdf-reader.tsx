import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { X, Bookmark, Maximize2, Minimize2, RefreshCw, BookOpen } from 'lucide-react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts, Spacing } from '../src/constants/tokens';
import { useAutoHideChrome } from '../src/hooks/useAutoHideChrome';

// react-native-pdf is a native module absent from Expo Go. Only evaluate it in a
// real build (dev-client / production); in Expo Go we render a lightweight fallback.
const isExpoGo = Constants.executionEnvironment === 'storeClient';
const Pdf: any = isExpoGo ? null : require('react-native-pdf').default;

const PDF_SOURCE = isExpoGo ? null : require('../assets/vol-1-genesis.pdf');
const PAGE_ASPECT = 1.41;

// Gesture thresholds — kept in step with src/app/screens/PdfReader.tsx (web).
const LONG_SWIPE_THRESHOLD = 0.38; // fraction of screen width
const FAST_FLICK_VELOCITY = 0.5; // px/ms — above this it's a flick, not a drag
const FULLSCREEN_SWIPE_MIN_PX = 40;
const FULLSCREEN_AXIS_RATIO = 1.5;
const CENTER_X_MIN = 0.25,
  CENTER_X_MAX = 0.75;
const CENTER_Y_MIN = 0.2,
  CENTER_Y_MAX = 0.8;

const PDF_CHAPTERS = [1, 8, 16, 24, 32];

const isCenterPoint = (x: number, y: number, w: number, h: number) => {
  const fx = x / w;
  const fy = y / h;
  return fx > CENTER_X_MIN && fx < CENTER_X_MAX && fy > CENTER_Y_MIN && fy < CENTER_Y_MAX;
};

export default function PdfReaderScreen() {
  // Branch on a module-level constant so hook order stays stable across renders.
  return isExpoGo ? <PdfReaderFallback /> : <PdfReaderNative />;
}

function PdfReaderNative() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  const [numPages, setNumPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [box, setBox] = useState({ width: screenW, height: 1 });

  const speedSwipeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const speedSwipeActive = useRef(false);

  const cardWidth = Math.max(100, Math.floor(Math.min(screenW * 0.9, 320)));
  const fullWidth = Math.max(100, Math.floor(screenW * zoomLevel));

  const goNext = useCallback(() => {
    setPageIndex((i) => (i < numPages - 1 ? i + 1 : i));
  }, [numPages]);

  const goPrev = useCallback(() => {
    setPageIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const cancelSpeedSwipe = useCallback(() => {
    speedSwipeTimers.current.forEach(clearTimeout);
    speedSwipeTimers.current = [];
    speedSwipeActive.current = false;
  }, []);

  useEffect(() => cancelSpeedSwipe, [cancelSpeedSwipe]);

  const collapse = useCallback(() => {
    cancelSpeedSwipe();
    setIsExpanded(false);
    setZoomLevel(1.0);
  }, [cancelSpeedSwipe]);

  const expand = useCallback(() => {
    cancelSpeedSwipe();
    setIsExpanded(true);
  }, [cancelSpeedSwipe]);

  const { visible: chromeVisible, show: showChrome } = useAutoHideChrome(isExpanded);

  // Entering fullscreen, turning a page and changing zoom are all just state
  // changes, so one effect covers three of the four reveal triggers.
  useEffect(() => {
    if (isExpanded) showChrome();
  }, [isExpanded, pageIndex, zoomLevel, showChrome]);

  const chromeStyle = useAnimatedStyle(() => ({
    opacity: withTiming(chromeVisible ? 1 : 0, { duration: 300 }),
  }));

  // Live pinch multiplier: transforms the page smoothly during the gesture, then
  // commits to the crisp container-resize zoom on release. Because the committed
  // width (screenW * zoomLevel * raw) equals the pinched visual, there's no jump.
  const pinchScale = useSharedValue(1);
  const pinchStyle = useAnimatedStyle(() => ({ transform: [{ scale: pinchScale.value }] }));

  const commitPinch = useCallback(
    (raw: number) => {
      setZoomLevel((z) => parseFloat(Math.min(3, Math.max(1, z * raw)).toFixed(2)));
      pinchScale.value = 1;
      showChrome();
    },
    [showChrome, pinchScale],
  );

  const triggerSpeedSwipe = useCallback(
    (dir: number, swipeDistance: number) => {
      if (isExpanded) return;
      cancelSpeedSwipe();
      speedSwipeActive.current = true;

      const screenFraction = Math.min(swipeDistance / screenW, 1.0);
      const initialInterval = Math.round(85 - screenFraction * 40);
      const decayFactor = 1.35;
      const maxInterval = 380;

      const fireTimes: number[] = [];
      let elapsed = 0;
      let interval = initialInterval;
      while (interval < maxInterval) {
        elapsed += interval;
        fireTimes.push(Math.round(elapsed));
        interval = Math.round(interval * decayFactor);
      }

      let current = pageIndex;
      speedSwipeTimers.current = fireTimes.map((t, i) =>
        setTimeout(() => {
          current = Math.max(0, Math.min(numPages - 1, current + dir));
          setPageIndex(current);
          if (i === fireTimes.length - 1) cancelSpeedSwipe();
        }, t),
      );
    },
    [pageIndex, numPages, isExpanded, screenW, cancelSpeedSwipe],
  );

  const onSwipeEnd = useCallback(
    (translationX: number, translationY: number, velocityX: number) => {
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);
      const dir = translationX < 0 ? 1 : -1;

      if (isExpanded) {
        // Fullscreen scrolls vertically — only a deliberate, horizontal-dominant
        // drag turns a page, and never more than one.
        if (absX < FULLSCREEN_SWIPE_MIN_PX) return;
        if (absX < absY * FULLSCREEN_AXIS_RATIO) return;
        dir === 1 ? goNext() : goPrev();
        return;
      }

      if (absX < 15) return;
      const velocity = Math.abs(velocityX) / 1000; // RNGH reports px/s
      const isLongSlowDrag = absX > screenW * LONG_SWIPE_THRESHOLD && velocity < FAST_FLICK_VELOCITY;
      if (isLongSlowDrag && !speedSwipeActive.current) {
        triggerSpeedSwipe(dir, absX);
      } else {
        dir === 1 ? goNext() : goPrev();
      }
    },
    [isExpanded, screenW, goNext, goPrev, triggerSpeedSwipe],
  );

  const onDoubleTap = useCallback(
    (x: number, y: number) => {
      if (zoomLevel > 1) return; // panning a zoomed page — don't yank the user out
      if (!isCenterPoint(x, y, box.width, box.height)) return;
      isExpanded ? collapse() : expand();
    },
    [zoomLevel, box.width, box.height, isExpanded, collapse, expand],
  );

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDistance(40)
    .runOnJS(true)
    .onEnd((e, success) => {
      if (success) onDoubleTap(e.x, e.y);
    });

  // Exclusive() below makes this wait for doubleTap to fail, so a double-tap
  // collapses cleanly instead of first flashing the chrome in.
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .runOnJS(true)
    .onEnd((_e, success) => {
      if (success && isExpanded) showChrome();
    });

  // Preview never scrolls, so the pan may claim small horizontal movement.
  // Fullscreen sits in a ScrollView: failOffsetY lets a vertical drag bail out
  // of the pan entirely so the ScrollView owns it. Disabled while zoomed so the
  // scroll views own the drag for panning the enlarged page.
  const pan = Gesture.Pan()
    .enabled(zoomLevel === 1)
    .maxPointers(1)
    .runOnJS(true)
    .activeOffsetX(isExpanded ? [-20, 20] : [-12, 12])
    .failOffsetY(isExpanded ? [-25, 25] : [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
    .onEnd((e, success) => {
      if (success) onSwipeEnd(e.translationX, e.translationY, e.velocityX);
    });

  // Pinch to zoom — fullscreen only. onUpdate is a worklet (UI thread) for
  // smooth tracking; start/end hop to JS to reveal chrome and commit the zoom.
  const pinch = Gesture.Pinch()
    .enabled(isExpanded)
    .onStart(() => {
      runOnJS(showChrome)();
    })
    .onUpdate((e) => {
      pinchScale.value = e.scale;
    })
    .onEnd((e) => {
      runOnJS(commitPinch)(e.scale);
    });

  const gesture = Gesture.Race(
    Gesture.Exclusive(doubleTap, singleTap),
    Gesture.Simultaneous(pan, pinch),
  );

  // showChrome() explicitly: a no-op press (reset at 100%, + at max zoom) leaves
  // zoomLevel unchanged, so the reveal effect would not re-arm the hide timer.
  const zoomIn = () => { showChrome(); setZoomLevel((z) => parseFloat(Math.min(3.0, z + 0.25).toFixed(2))); };
  const zoomOut = () => { showChrome(); setZoomLevel((z) => parseFloat(Math.max(1.0, z - 0.25).toFixed(2))); };
  const zoomReset = () => { showChrome(); setZoomLevel(1.0); };

  const pageNum = String(pageIndex + 1).padStart(3, '0');
  const activeChapter = Math.max(0, PDF_CHAPTERS.filter((c) => c <= pageIndex + 1).length - 1);

  const pdfNode = (width: number) => (
    <View pointerEvents="none" style={{ width, height: Math.floor(width * PAGE_ASPECT) }}>
      <Pdf
        source={PDF_SOURCE}
        page={pageIndex + 1}
        singlePage
        fitPolicy={0}
        onLoadComplete={(n: number) => {
          setNumPages(n);
          setPdfLoaded(true);
        }}
        onError={() => setPdfError(true)}
        style={styles.pdf}
      />
    </View>
  );

  if (pdfError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Could not load Volume 1.0.{'\n'}Check your connection and try again.
          </Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: isExpanded ? 0 : insets.top }]}>
      {!isExpanded && (
        <View style={styles.topBar}>
          <View>
            <Text style={styles.volLabel}>Vol 1.0</Text>
            <Text style={styles.volTitle}>Genesis</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <X size={14} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      )}

      {!pdfLoaded && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color="rgba(255,255,255,0.5)" />
          <Text style={styles.loadingText}>Loading Volume 1.0</Text>
        </View>
      )}

      {/* ── PREVIEW ── */}
      {!isExpanded && (
        <GestureDetector gesture={gesture}>
          <View
            style={styles.previewArea}
            onLayout={(e) => setBox(e.nativeEvent.layout)}
            collapsable={false}
          >
            <View style={styles.card}>{pdfNode(cardWidth)}</View>
          </View>
        </GestureDetector>
      )}

      {!isExpanded && pdfLoaded && (
        <>
          <View style={styles.dots}>
            {PDF_CHAPTERS.map((chapter, i) => (
              <Pressable
                key={chapter}
                onPress={() => setPageIndex(Math.min(numPages - 1, chapter - 1))}
                style={i === activeChapter ? styles.dotActive : styles.dot}
              />
            ))}
          </View>

          <View style={[styles.pillRow, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.pill}>
              <View style={styles.pillCounter}>
                <Text style={styles.pillPage}>{pageNum}</Text>
                <Text style={styles.pillTotal}> / {numPages}</Text>
              </View>
              <View style={styles.pillDivider} />
              <Pressable onPress={() => setBookmarked((b) => !b)} style={styles.pillBtn}>
                <Bookmark
                  size={16}
                  color={bookmarked ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
                  fill={bookmarked ? '#FFFFFF' : 'transparent'}
                />
              </Pressable>
              <View style={styles.pillDivider} />
              <Pressable onPress={expand} style={styles.pillBtn}>
                <Maximize2 size={16} color="rgba(255,255,255,0.4)" />
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* ── FULLSCREEN ── */}
      {isExpanded && (
        <GestureDetector gesture={gesture}>
          <View
            style={styles.fullArea}
            onLayout={(e) => setBox(e.nativeEvent.layout)}
            collapsable={false}
          >
            <ScrollView
              scrollEnabled={zoomLevel > 1}
              contentContainerStyle={styles.fullScrollV}
              showsVerticalScrollIndicator={false}
            >
              <ScrollView
                horizontal
                scrollEnabled={zoomLevel > 1}
                contentContainerStyle={styles.fullScrollH}
                showsHorizontalScrollIndicator={false}
              >
                <Animated.View style={pinchStyle}>{pdfNode(fullWidth)}</Animated.View>
              </ScrollView>
            </ScrollView>

            {zoomLevel === 1 && (
              <>
                <Pressable
                  onPress={goPrev}
                  style={[styles.tapZone, styles.tapZoneLeft]}
                  accessibilityLabel="Previous page"
                />
                <Pressable
                  onPress={goNext}
                  style={[styles.tapZone, styles.tapZoneRight]}
                  accessibilityLabel="Next page"
                />
              </>
            )}
          </View>
        </GestureDetector>
      )}

      {isExpanded && (
        <>
          <Animated.View
            style={[styles.expandedTop, { top: insets.top + 12 }, chromeStyle]}
            pointerEvents={chromeVisible ? 'box-none' : 'none'}
          >
            <View style={styles.counterChip}>
              <Text style={styles.counterChipText}>{pageNum}</Text>
              <Text style={styles.counterChipTotal}> / {numPages}</Text>
            </View>
            <Pressable onPress={collapse} style={styles.minimizeBtn}>
              <Minimize2 size={14} color="rgba(255,255,255,0.7)" />
            </Pressable>
          </Animated.View>

          <Animated.View
            style={[styles.zoomRow, { paddingBottom: insets.bottom + 24 }, chromeStyle]}
            pointerEvents={chromeVisible ? 'box-none' : 'none'}
          >
            <View style={styles.zoomCluster}>
              <Pressable onPress={zoomOut} disabled={zoomLevel <= 1} style={styles.zoomBtn}>
                <Text style={[styles.zoomSign, zoomLevel <= 1 && styles.zoomDisabled]}>−</Text>
              </Pressable>
              <Pressable onPress={zoomReset} style={styles.zoomReset}>
                <RefreshCw
                  size={38}
                  strokeWidth={1.1}
                  color={zoomLevel !== 1 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)'}
                />
                <Text style={[styles.zoomPct, { color: zoomLevel !== 1 ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }]}>
                  {Math.round(zoomLevel * 100)}%
                </Text>
              </Pressable>
              <Pressable onPress={zoomIn} disabled={zoomLevel >= 3.0} style={styles.zoomBtn}>
                <Text style={[styles.zoomSign, zoomLevel >= 3.0 && styles.zoomDisabled]}>+</Text>
              </Pressable>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

// Expo Go can't load the native PDF renderer. This keeps the screen's chrome and
// navigation testable in Expo Go; the real magazine renders in the dev-client / store build.
function PdfReaderFallback() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const cardWidth = Math.max(100, Math.floor(Math.min(screenW * 0.9, 320)));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.volLabel}>Vol 1.0</Text>
          <Text style={styles.volTitle}>Genesis</Text>
        </View>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <X size={14} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </View>

      <View style={styles.previewArea}>
        <View style={[styles.card, styles.fallbackCard, { width: cardWidth, height: Math.floor(cardWidth * PAGE_ASPECT) }]}>
          <BookOpen size={40} strokeWidth={1.1} color="rgba(255,255,255,0.5)" />
          <Text style={styles.fallbackTitle}>Genesis</Text>
          <Text style={styles.fallbackBody}>
            The live magazine reader runs in the full app build.{'\n'}Open it in the Air & Steel dev build to read Volume 1.0.
          </Text>
        </View>
      </View>

      <View style={[styles.pillRow, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.pill}>
          <View style={styles.pillCounter}>
            <Text style={styles.pillPage}>Expo Go</Text>
            <Text style={styles.pillTotal}>  preview</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
  pdf: { flex: 1, backgroundColor: 'transparent' },

  fallbackCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  fallbackTitle: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  fallbackBody: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 16,
    paddingTop: 8,
  },
  volLabel: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  volTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 5,
  },
  loadingText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  previewArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  card: { borderRadius: 22, overflow: 'hidden', backgroundColor: '#111' },

  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 12 },
  dot: { width: 4, height: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 20, height: 4, borderRadius: 999, backgroundColor: '#FFFFFF' },

  pillRow: { alignItems: 'center', paddingHorizontal: 24 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#141414',
    overflow: 'hidden',
  },
  pillCounter: { flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 20, paddingVertical: 14 },
  pillPage: { fontFamily: Fonts.display, fontSize: 14, color: '#FFFFFF' },
  pillTotal: { fontFamily: Fonts.display, fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  pillDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.12)' },
  pillBtn: { paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },

  fullArea: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#080808' },
  fullScrollV: { justifyContent: 'center', flexGrow: 1, paddingTop: 80, paddingBottom: 96 },
  fullScrollH: { alignItems: 'center', justifyContent: 'center', flexGrow: 1 },

  tapZone: { position: 'absolute', top: 0, bottom: 0, width: '25%', zIndex: 10 },
  tapZoneLeft: { left: 0 },
  tapZoneRight: { right: 0 },

  expandedTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 60,
  },
  counterChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterChipText: { fontFamily: Fonts.display, fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  counterChipTotal: { fontFamily: Fonts.display, fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  minimizeBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  zoomRow: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', zIndex: 60 },
  zoomCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  zoomBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  zoomSign: { fontSize: 20, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },
  zoomDisabled: { opacity: 0.25 },
  zoomReset: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  zoomPct: { position: 'absolute', fontFamily: Fonts.display, fontSize: 10 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 40 },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
  },
  backBtn: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtnText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
