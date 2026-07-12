import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
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
import { ARTICLES } from '../src/data/articles';
import { Fonts, Spacing, Animation } from '../src/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_W = width - Spacing.page * 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Article = (typeof ARTICLES)[number];

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const { openReader } = useReader();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(80 + index * 60).duration(500)}>
      <AnimatedPressable
        onPress={() => openReader(article.id)}
        onPressIn={() => {
          scale.value = withSpring(0.98, Animation.springFast);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Animation.springFast);
        }}
        style={[styles.card, animatedStyle, { width: CARD_W }]}
      >
        <Image source={{ uri: article.img }} style={styles.cardImg} />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{article.section}</Text>
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.cardLocation}>{article.location}</Text>
          <Text style={styles.cardTitle}>{article.title}</Text>
          <Text style={styles.cardSubtitle}>{article.subtitle}</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function ArticlesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
      <TopBar showBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.textMuted }]}>Free to Read</Text>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {'Featured\nArticles'}
            </Text>
            <Text style={[styles.count, { color: colors.textMuted }]}>{ARTICLES.length} Articles</Text>
          </View>
        </Animated.View>

        <View style={styles.list}>
          {ARTICLES.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
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
  header: { paddingHorizontal: Spacing.page, paddingTop: 8, paddingBottom: 32 },
  eyebrow: { fontFamily: Fonts.body, fontSize: 9, letterSpacing: 2.52, textTransform: 'uppercase', marginBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 37, textTransform: 'uppercase', letterSpacing: -0.4 },
  count: { fontFamily: Fonts.body, fontSize: 10, marginBottom: 4 },
  list: { paddingHorizontal: Spacing.page, gap: 16 },
  card: {
    aspectRatio: 16 / 9,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  cardImg: { width: '100%', height: '100%', position: 'absolute' },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: Fonts.body,
    fontSize: 7,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.54,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  cardBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  cardLocation: {
    fontFamily: Fonts.body,
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  cardTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: -0.45,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  cardSubtitle: {
    fontFamily: Fonts.bodyLight,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    lineHeight: 15,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});
