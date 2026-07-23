import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import {
  DynamicSplashScreen,
  BrandProvider,
  useBranding,
  Branding,
} from 'react-native-dynamic-app-icon';
import {
  THEMES,
  DEFAULT_THEME_DATA,
  DEFAULT_THEME_ID,
  DYNAMIC_THEMES,
  type AppTheme,
} from './themes';

// ─────────────────────────────────────────────────────────────────────────────
// OS ICON STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ refreshKey }: { refreshKey: number }) => {
  const [currentIcon, setCurrentIcon] = useState<string>('...');

  useEffect(() => {
    Branding.getCurrentIcon()
      .then(setCurrentIcon)
      .catch(() => setCurrentIcon('unavailable'));
  }, [refreshKey]);

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>OS ICON STATE:</Text>
      <Text style={styles.badgeValue}>{currentIcon}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC APP ICON & SPLASH CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
const IconAndSplashController = ({
  onTriggerSplash,
}: {
  onTriggerSplash: (theme: AppTheme) => void;
}) => {
  const { brand, setBrand, isInitialized } = useBranding();
  const [activeKey, setActiveKey] = useState(DEFAULT_THEME_ID);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [iconRefreshKey, setIconRefreshKey] = useState(0);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      const initialThemeKey = brand?.id || DEFAULT_THEME_ID;
      const initialTheme =
        THEMES[initialThemeKey as keyof typeof THEMES] || DEFAULT_THEME_DATA;

      setActiveKey(initialThemeKey);
      const ui = initialTheme.ui as { localIcon?: any };
      if (ui.localIcon) {
        const source = Image.resolveAssetSource(ui.localIcon);
        setImageUri(source.uri);
      }
    }
  }, [isInitialized, brand]);

  const applyIconAndTheme = useCallback(
    async (themeData: AppTheme) => {
      setSwitching(true);
      setActiveKey(themeData.brandConfig.id);

      try {
        const ui = themeData.ui as { localIcon?: any };
        if (ui.localIcon) {
          const source = Image.resolveAssetSource(ui.localIcon);
          setImageUri(source.uri);
        }

        await setBrand(themeData.brandConfig.id, themeData.brandConfig);

        if (themeData.brandConfig.iconName) {
          await Branding.changeIcon(themeData.brandConfig.iconName);
        } else {
          await Branding.restoreDefaultIcon();
        }

        setIconRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.warn('[App] Failed to change icon:', err);
      } finally {
        setSwitching(false);
      }
    },
    [setBrand]
  );

  const primaryColor =
    brand?.theme?.primaryColor || DEFAULT_THEME_DATA.brandConfig.theme.primaryColor;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8F9FA"
        translucent={Platform.OS === 'android'}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Image
              source={
                imageUri ? { uri: imageUri } : DEFAULT_THEME_DATA.ui.localIcon
              }
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heading}>react-native-dynamic-app-icon</Text>
          <Text style={styles.subheading}>
            {brand?.appName || DEFAULT_THEME_DATA.brandConfig.appName}
          </Text>
        </View>

        {/* Status Badge */}
        <StatusBadge refreshKey={iconRefreshKey} />

        {/* Dynamic App Icon Section */}
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>1. DYNAMIC APP ICON SWITCHER</Text>

        {/* Alternate Fruit Icons */}
        {DYNAMIC_THEMES.map((theme) => {
          const isActive = activeKey === theme.brandConfig.id;
          return (
            <TouchableOpacity
              key={theme.brandConfig.id}
              style={[
                styles.card,
                { backgroundColor: theme.brandConfig.theme.secondaryColor },
                isActive && {
                  borderColor: theme.brandConfig.theme.primaryColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => applyIconAndTheme(theme)}
              disabled={switching}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.brandConfig.theme.primaryColor },
                  ]}
                >
                  {theme.brandConfig.appName}
                </Text>
                {isActive && (
                  <View
                    style={[
                      styles.activePill,
                      { backgroundColor: theme.brandConfig.theme.primaryColor },
                    ]}
                  >
                    <Text style={styles.activePillText}>ACTIVE</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardSubtitle}>{theme.ui.subtitle}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Default Apple Icon */}
        {(() => {
          const isActive = activeKey === DEFAULT_THEME_ID;
          return (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: DEFAULT_THEME_DATA.brandConfig.theme.secondaryColor },
                isActive && {
                  borderColor: DEFAULT_THEME_DATA.brandConfig.theme.primaryColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => applyIconAndTheme(DEFAULT_THEME_DATA)}
              disabled={switching}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: DEFAULT_THEME_DATA.brandConfig.theme.primaryColor },
                  ]}
                >
                  {DEFAULT_THEME_DATA.brandConfig.appName}
                </Text>
                {isActive && (
                  <View
                    style={[
                      styles.activePill,
                      { backgroundColor: DEFAULT_THEME_DATA.brandConfig.theme.primaryColor },
                    ]}
                  >
                    <Text style={styles.activePillText}>ACTIVE</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardSubtitle}>
                Default fruit launcher icon
              </Text>
            </TouchableOpacity>
          );
        })()}

        {/* Dynamic Splash Screen Section */}
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>2. ANIMATED DYNAMIC SPLASH SCREEN</Text>
        <TouchableOpacity
          style={[styles.splashButton, { backgroundColor: primaryColor }]}
          onPress={() => {
            const currentTheme =
              THEMES[activeKey as keyof typeof THEMES] || DEFAULT_THEME_DATA;
            onTriggerSplash(currentTheme);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.splashButtonText}>✨ Preview Animated Splash Screen</Text>
        </TouchableOpacity>

        {/* Core Capabilities */}
        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>CORE FEATURES</Text>
        {[
          '🖼  Programmatic App Icon Switching (iOS & Android)',
          '✨  Animated Dynamic Splash Screen (Fade/Scale/Slide)',
          '💾  MMKV Encrypted Icon State Persistence',
          '⚡  React Native 0.86 / Expo 57 TurboModule Ready',
        ].map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Loading Overlay */}
      {switching && (
        <View style={styles.switchingOverlay}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={styles.switchingText}>Changing app icon…</Text>
        </View>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
const MainApp = () => {
  const { isInitialized } = useBranding();
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashConfig, setSplashConfig] = useState({
    title: 'Dynamic App Icon',
    subtitle: 'react-native-dynamic-app-icon',
    background: '#F8F9FA',
    animation: 'scale' as const,
    logo: DEFAULT_THEME_DATA.ui.localIcon,
  });

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => setSplashVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  const triggerSplash = (theme: AppTheme) => {
    setSplashConfig({
      title: theme.brandConfig.appName,
      subtitle: theme.ui.subtitle,
      background: theme.brandConfig.theme.secondaryColor,
      animation: 'scale',
      logo: theme.ui.localIcon,
    });
    setSplashVisible(true);
    setTimeout(() => setSplashVisible(false), 1500);
  };

  return (
    <View style={{ flex: 1 }}>
      <IconAndSplashController onTriggerSplash={triggerSplash} />
      <DynamicSplashScreen
        visible={splashVisible}
        config={{
          title: splashConfig.title,
          subtitle: splashConfig.subtitle,
          background: splashConfig.background,
          animation: splashConfig.animation,
          darkMode: false,
          logo: splashConfig.logo,
        }}
      />
    </View>
  );
};

export default function App() {
  return (
    <BrandProvider>
      <MainApp />
    </BrandProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 56 : 60,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.2,
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
    marginVertical: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
  },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  splashButton: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  splashButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  featureRow: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  featureText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
  switchingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  switchingText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
