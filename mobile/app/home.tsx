import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
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
import { useReader } from '../src/context/ReaderContext';
import { Fonts, Spacing, Animation, WhiteA } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const LATEST_ISSUE_IMG = require('../assets/brand/vol1-genesis.png');

const ARTICLES = [
  {
    id: 'night-runners',
    city: 'Tokyo',
    title: 'Night Runners',
    img: 'https://images.unsplash.com/photo-1598082630518-ad3583b480ad?w=600&q=75',
  },
  {
    id: 'analogue',
    city: 'Los Angeles',
    title: 'Analogue',
    img: 'https://images.unsplash.com/photo-1594051164364-8753eac89b0b?w=600&q=75',
  },
  {
    id: 'the-silent-mile',
    city: 'Geneva',
    title: 'The Silent Mile',
    img: 'https://images.unsplash.com/photo-1699349578489-54436281e9e0?w=600&q=75',
  },
  {
    id: 'carbon-ritual',
    city: 'London',
    title: 'Carbon Ritual',
    img: 'https://images.unsplash.com/photo-1762522930348-070b98229e9b?w=600&q=75',
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  if (h >= 17 && h < 21) return 'Good Evening';
  return 'Good Night';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressScaleProps {
  scaleTo: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

function PressScale({ scaleTo, onPress, style, children }: PressScaleProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, Animation.springFast);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, Animation.springFast);
      }}
      style={[style, animStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

const item = (i: number) =>
  FadeInDown.delay(100 + i * 90).springify().damping(24).stiffness(280);

export default function HomeScreen() {
  const { colors } = useTheme();
  const { openReader, openVolume } = useReader();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const greeting = getGreeting();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      <TopBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Greeting ── */}
        <View style={styles.greeting}>
          <Animated.View entering={item(0)}>
            <Text style={[styles.greetLabel, { color: colors.textMuted }]}>{greeting}</Text>
            <Text style={[styles.greetTitle, { color: colors.textPrimary }]}>
              {'Hello,\nAlex.'}
            </Text>
            <Text style={[styles.greetBody, { color: WhiteA[40] }]}>
              Your allocation is confirmed. The signal has been isolated from the noise. A private briefing on rare provenance awaits your review.
            </Text>
          </Animated.View>
        </View>

        {/* ── 2. Latest Issue ── */}
        <View style={styles.latestSection}>
          <Animated.View entering={item(0)} style={styles.labelHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Latest Issue</Text>
          </Animated.View>

          <Animated.View entering={item(1)}>
            <PressScale
              scaleTo={0.98}
              onPress={() => openVolume('1.0', true)}
              style={[styles.coverCard, { borderColor: colors.borderSubtle }]}
            >
              <Image source={LATEST_ISSUE_IMG} style={styles.coverImg} />
            </PressScale>
          </Animated.View>

          <Animated.View entering={item(2)} style={{ marginTop: 20 }}>
            <View style={styles.tagRow}>
              <Text style={[styles.dash, { color: colors.textDim }]}>—</Text>
              <Text style={[styles.tag, { color: colors.brandOrange }]}>Cover Story</Text>
            </View>
            <Text style={[styles.issueTitle, { color: colors.textPrimary }]}>
              {'Volume 1.0\nGenesis'}
            </Text>
            <Text style={[styles.issueBody, { color: WhiteA[40] }]}>
              The Inaugural Dispatch. 150+ pages of immersive storytelling, curated from renowned as well as overlooked peripheries of automotive culture. From the solitude of Alpine passes to the neon-drenched depths of Tokyo's underpasses.
              {'\n\n'}
              Substantial in weight, permanent in nature, and crafted with intent.
            </Text>
          </Animated.View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ── 3. Featured Articles ── */}
        <View style={styles.section}>
          <Animated.View entering={item(0)} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Featured Articles
            </Text>
            <PressScale
              scaleTo={0.93}
              onPress={() => router.push('/articles')}
              style={styles.viewAllBtn}
            >
              <Text style={[styles.viewAllText, { color: colors.brandOrange }]}>View All</Text>
              <ArrowRight size={9} color={colors.brandOrange} />
            </PressScale>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {ARTICLES.map((card, idx) => (
              <Animated.View key={card.id} entering={item(idx + 1)}>
                <PressScale
                  scaleTo={0.96}
                  onPress={() => openReader(card.id)}
                  style={[styles.articleCard, { borderColor: colors.borderSubtle }]}
                >
                  <Image source={{ uri: card.img }} style={styles.articleImg} />
                  <View style={styles.articleOverlay}>
                    <Text style={styles.articleCity}>{card.city}</Text>
                    <Text style={styles.articleTitle}>{card.title}</Text>
                  </View>
                </PressScale>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ── 4. Featured Issue ── */}
        <View style={styles.section}>
          <Animated.View entering={item(0)} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Featured Issue
            </Text>
            <PressScale
              scaleTo={0.93}
              onPress={() => router.push('/archives')}
              style={styles.viewAllBtn}
            >
              <Text style={[styles.viewAllText, { color: colors.brandOrange }]}>Archives</Text>
              <ArrowRight size={9} color={colors.brandOrange} />
            </PressScale>
          </Animated.View>

          <Animated.View entering={item(1)}>
            <PressScale
              scaleTo={0.98}
              onPress={() => openVolume('1.0', true)}
              style={[styles.coverCard, { borderColor: colors.borderSubtle }]}
            >
              <Image source={LATEST_ISSUE_IMG} style={styles.coverImg} />
            </PressScale>
          </Animated.View>

          <Animated.View entering={item(2)} style={{ marginTop: 20 }}>
            <View style={styles.tagRow}>
              <Text style={[styles.dash, { color: colors.textDim }]}>—</Text>
              <Text style={[styles.tag, { color: colors.brandOrange }]}>Cover Story</Text>
            </View>
            <Text style={[styles.issueTitle, { color: colors.textPrimary }]}>
              {'Volume 1.0\nGenesis'}
            </Text>
            <Text style={[styles.issueBody, { color: WhiteA[40] }]}>
              The Inaugural Dispatch. 150+ pages of immersive storytelling, curated from renowned as well as overlooked peripheries of automotive culture. From the solitude of Alpine passes to the neon-drenched depths of Tokyo's underpasses.
              {'\n\n'}
              Substantial in weight, permanent in nature, and crafted with intent.
            </Text>
          </Animated.View>
        </View>
      </ScrollView>

      <FloatingNav />
      <MenuOverlay />
    </View>
  );
}

const CARD_W = width - Spacing.page * 2;
const ARTICLE_W = 190;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  greeting: {
    paddingHorizontal: Spacing.page,
    paddingTop: 4,
    paddingBottom: 40,
  },
  greetLabel: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 2.52,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  greetTitle: {
    fontFamily: Fonts.display,
    fontSize: 40,
    lineHeight: 37,
    letterSpacing: -0.4,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  greetBody: {
    fontFamily: Fonts.bodyLight,
    fontSize: 11,
    lineHeight: 18,
    maxWidth: 260,
  },
  section: {
    paddingHorizontal: Spacing.page,
    marginBottom: 40,
  },
  latestSection: {
    paddingHorizontal: Spacing.page,
    marginBottom: 48,
  },
  labelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 2.16,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    lineHeight: 22.5,
    letterSpacing: -0.2,
    textTransform: 'uppercase',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 1.98,
    textTransform: 'uppercase',
  },
  coverCard: {
    width: CARD_W,
    aspectRatio: 3 / 4,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '100%',
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  dash: { fontFamily: Fonts.body, fontSize: 9 },
  tag: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 2.16,
    textTransform: 'uppercase',
  },
  issueTitle: {
    fontFamily: Fonts.display,
    fontSize: 38,
    lineHeight: 35,
    letterSpacing: -0.4,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  issueBody: {
    fontFamily: Fonts.bodyLight,
    fontSize: 11,
    lineHeight: 18,
  },
  divider: {
    marginHorizontal: Spacing.page,
    height: 1,
    marginBottom: 40,
    backgroundColor: '#1A1A1A',
  },
  articleCard: {
    width: ARTICLE_W,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  articleImg: {
    width: '100%',
    height: '100%',
  },
  articleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  articleCity: {
    fontFamily: Fonts.body,
    fontSize: 8,
    letterSpacing: 1.76,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  articleTitle: {
    fontFamily: Fonts.display,
    fontSize: 13,
    lineHeight: 16.25,
    letterSpacing: 0.1,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});
