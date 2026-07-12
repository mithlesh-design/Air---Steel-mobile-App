import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  Home,
  Archive,
  LayoutDashboard,
  User,
  X,
  Search,
  Bookmark,
  BookOpen,
  ArrowRight,
  LogOut,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useMenu } from '../../context/MenuContext';
import { useTheme } from '../../context/ThemeContext';
import { Fonts, Radius, Spacing, Shadow, Animation, WhiteA } from '../../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_H } = Dimensions.get('window');

const NAV_ITEMS = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Archives', path: '/archives', icon: Archive },
  { label: 'Cockpit', path: '/cockpit', icon: LayoutDashboard },
  { label: 'Profile', path: '/profile', icon: User },
];

const SEARCHABLE = [
  { id: '1.0', label: 'Genesis', sublabel: 'Vol 1.0', type: 'volume' as const, path: '/archives' },
  { id: '04', label: 'Silence', sublabel: 'Vol 04', type: 'volume' as const, path: '/archives' },
  { id: 'night-runners', label: 'Night Runners', sublabel: 'Article · Tokyo', type: 'article' as const, path: '/articles' },
  { id: 'analogue', label: 'Analogue', sublabel: 'Article · Los Angeles', type: 'article' as const, path: '/articles' },
  { id: 'the-silent-mile', label: 'The Silent Mile', sublabel: 'Article · Geneva', type: 'article' as const, path: '/articles' },
  { id: 'carbon-ritual', label: 'Carbon Ritual', sublabel: 'Article · London', type: 'article' as const, path: '/articles' },
];

export function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useMenu();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const enter = useSharedValue(0);
  const closeScale = useSharedValue(1);

  useEffect(() => {
    if (!isMenuOpen) {
      setSearch('');
      enter.value = 0;
    } else {
      enter.value = withSpring(1, Animation.springSnappy);
    }
  }, [isMenuOpen]);

  const panelStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: interpolate(enter.value, [0, 1], [20, 0]) },
      { scale: interpolate(enter.value, [0, 1], [0.94, 1]) },
    ],
  }));

  const closeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return SEARCHABLE.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel.toLowerCase().includes(q)
    );
  }, [search]);

  const handleNav = (path: string) => {
    closeMenu();
    router.push(path as any);
  };

  const activeBg = isDark ? '#FFFFFF' : '#111111';
  const activeFg = isDark ? '#0A0A0A' : '#FFFFFF';

  if (!isMenuOpen) return null;

  return (
    <Modal transparent visible={isMenuOpen} onRequestClose={closeMenu} statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
      >
        <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.scrim]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
      </Animated.View>

      {/* Panel */}
      <Animated.View
        style={[
          styles.panel,
          panelStyle,
          {
            backgroundColor: colors.panel,
            borderColor: colors.borderSubtle,
            bottom: insets.bottom + 100,
            maxHeight: SCREEN_H * 0.78,
            ...(Shadow.modal as object),
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.panelHeader, { borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.panelHeaderLeft}>
            <View style={[styles.dot, { backgroundColor: colors.brandOrange }]} />
            <Text style={styles.panelTitle}>Command Center</Text>
          </View>
          <Pressable
            onPress={closeMenu}
            onPressIn={() => (closeScale.value = withSpring(0.88, Animation.springFast))}
            onPressOut={() => (closeScale.value = withSpring(1, Animation.springFast))}
            hitSlop={12}
          >
            <Animated.View style={closeStyle}>
              <X size={15} color={WhiteA[40]} />
            </Animated.View>
          </Pressable>
        </View>

        <ScrollView
          style={{ maxHeight: SCREEN_H * 0.78 - 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search */}
          <View style={styles.searchWrapper}>
            <View style={[styles.searchBox, { backgroundColor: colors.bgCard }]}>
              <Search size={13} color={WhiteA[25]} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search volumes, articles..."
                placeholderTextColor={colors.textDim}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: colors.textPrimary }]}
                autoCapitalize="none"
              />
            </View>
          </View>

          {search.trim() ? (
            /* Search results */
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Results</Text>
              {results.length === 0 ? (
                <View style={styles.emptySearch}>
                  <Search size={16} color={colors.textDim} />
                  <Text style={[styles.emptyText, { color: colors.textDim }]}>No results</Text>
                </View>
              ) : (
                results.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleNav(item.path)}
                    style={[styles.searchResult, { backgroundColor: colors.bgCard }]}
                  >
                    <View style={[styles.resultIcon, { backgroundColor: colors.borderSubtle }]}>
                      {item.type === 'volume' ? (
                        <BookOpen size={11} color={WhiteA[40]} />
                      ) : (
                        <Bookmark size={11} color={WhiteA[40]} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.resultLabel, { color: WhiteA[80] }]}>{item.label}</Text>
                      <Text style={[styles.resultSub, { color: WhiteA[25] }]}>{item.sublabel}</Text>
                    </View>
                    <View style={[styles.typeTag, { borderColor: item.type === 'volume' ? `${colors.brandOrange}50` : WhiteA[15] }]}>
                      <Text style={[styles.typeTagText, { color: item.type === 'volume' ? colors.brandOrange : WhiteA[30] }]}>
                        {item.type}
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          ) : (
            <>
              {/* Navigation grid */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Navigation</Text>
                <View style={styles.navGrid}>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Pressable
                        key={item.path}
                        onPress={() => handleNav(item.path)}
                        style={[
                          styles.navItem,
                          isActive
                            ? { backgroundColor: activeBg, borderColor: activeBg }
                            : { backgroundColor: colors.bgCard, borderColor: '#222222' },
                        ]}
                      >
                        <Icon size={13} color={isActive ? activeFg : WhiteA[40]} />
                        <Text
                          style={[
                            styles.navLabel,
                            { color: isActive ? activeFg : WhiteA[70] },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Quick access */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Quick Access</Text>
                <View style={styles.navGrid}>
                  <Pressable
                    onPress={() => handleNav('/bookmarks')}
                    style={[styles.quickCard, { backgroundColor: colors.bgCard, borderColor: '#222222' }]}
                  >
                    <View style={styles.quickCardTop}>
                      <View style={[styles.quickIcon, { backgroundColor: '#1E1E1E' }]}>
                        <Bookmark size={12} color={colors.brandOrange} />
                      </View>
                      <ArrowRight size={9} color={WhiteA[20]} />
                    </View>
                    <Text style={[styles.quickLabel, { color: WhiteA[80] }]}>Bookmarks</Text>
                    <Text style={[styles.quickSub, { color: WhiteA[25] }]}>2 Saved Articles</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleNav('/reader')}
                    style={[styles.quickCard, { backgroundColor: colors.bgCard, borderColor: '#222222' }]}
                  >
                    <View style={styles.quickCardTop}>
                      <View style={[styles.quickIcon, { backgroundColor: `${colors.brandOrange}18`, borderWidth: 1, borderColor: `${colors.brandOrange}30` }]}>
                        <BookOpen size={11} color={colors.brandOrange} />
                      </View>
                      <ArrowRight size={9} color={colors.brandOrange} />
                    </View>
                    <Text style={[styles.continueLabel, { color: colors.brandOrange }]}>Continue Reading</Text>
                    <Text style={[styles.quickLabel, { color: WhiteA[80] }]}>Architecture of...</Text>
                    <View style={[styles.progressBar, { backgroundColor: WhiteA[10] }]}>
                      <View style={[styles.progressFill, { backgroundColor: colors.brandOrange, width: '68%' }]} />
                    </View>
                    <Text style={[styles.metaLine, { color: WhiteA[25] }]}>Vol 04 · 68%</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
            <Pressable onPress={() => handleNav('/login')} style={styles.signOut}>
              <LogOut size={11} color={WhiteA[30]} />
              <Text style={[styles.signOutText, { color: WhiteA[30] }]}>Sign Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
  },
  scrim: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: Radius.card,
    borderWidth: 2,
    overflow: 'hidden',
    zIndex: 50,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  panelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  panelTitle: {
    fontFamily: Fonts.displayMedium,
    fontSize: 9,
    letterSpacing: 1.8,
    color: WhiteA[50],
  },
  searchWrapper: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 16,
    paddingBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: '#222222',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  sectionLabel: {
    fontFamily: Fonts.body,
    fontSize: 8,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    color: WhiteA[25],
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  navItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  navLabel: {
    fontFamily: Fonts.display,
    fontSize: 10,
    letterSpacing: 1,
  },
  quickCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 6,
  },
  quickCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: Fonts.display,
    fontSize: 10,
    letterSpacing: 1,
  },
  quickSub: {
    fontFamily: Fonts.body,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  continueLabel: {
    fontFamily: Fonts.body,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metaLine: {
    fontFamily: Fonts.body,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  progressBar: {
    height: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  progressFill: {
    height: 2,
    borderRadius: 999,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#222222',
    marginBottom: 6,
  },
  resultIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultLabel: {
    fontFamily: Fonts.display,
    fontSize: 10,
    letterSpacing: 1,
  },
  resultSub: {
    fontFamily: Fonts.body,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  typeTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeTagText: {
    fontFamily: Fonts.body,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  emptySearch: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signOutText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
