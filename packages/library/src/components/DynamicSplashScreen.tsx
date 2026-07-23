import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Image, Text, Easing } from 'react-native';
import { SplashConfig } from '../types';

interface DynamicSplashScreenProps {
  config: SplashConfig;
  onAnimationComplete?: () => void;
  visible: boolean;
}

const AnimatedView = Animated.View as any;
const RNImage = Image as any;
const RNText = Text as any;

export const DynamicSplashScreen: React.FC<DynamicSplashScreenProps> = ({
  config,
  onAnimationComplete,
  visible,
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  // Track whether the fade-out animation has completed so we can unmount safely
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!visible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start(({ finished }) => {
        if (finished) {
          setHidden(true);
          onAnimationComplete?.();
        }
      });
    } else {
      // Reset when becoming visible again
      opacity.setValue(1);
      setHidden(false);
    }
  }, [visible, opacity, onAnimationComplete]);

  useEffect(() => {
    if (config.animation === 'scale') {
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }
  }, [config.animation, scale]);

  if (hidden) return null;

  return (
    <AnimatedView
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { backgroundColor: config.background || '#ffffff', opacity },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <AnimatedView style={[styles.content, { transform: [{ scale }] }]}>
        {config.logo && (
          <RNImage
            source={typeof config.logo === 'number' ? config.logo : { uri: config.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
        {config.title && (
          <RNText style={[styles.title, config.darkMode && styles.textDark]}>
            {config.title}
          </RNText>
        )}
        {config.subtitle && (
          <RNText style={[styles.subtitle, config.darkMode && styles.textDark]}>
            {config.subtitle}
          </RNText>
        )}
      </AnimatedView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  textDark: {
    color: '#ffffff',
  },
});
