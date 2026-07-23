import type { BrandConfig } from '@krishnavmalak/react-native-dynamic-app-icon';

export const THEMES = {
  apple: {
    brandConfig: {
      id: 'apple',
      appName: '🍎 Apple Theme',
      theme: {
        primaryColor: '#E53935',
        secondaryColor: '#FFEBEE',
        backgroundColor: '#F8F9FA',
        textColor: '#1F2937',
      },
      iconName: 'apple',
    },
    ui: {
      subtitle: 'Crisp, fresh & classic red',
      localIcon: require('../assets/apple.png'),
    },
  },
  orange: {
    brandConfig: {
      id: 'orange',
      appName: '🍊 Orange Theme',
      theme: {
        primaryColor: '#F57C00',
        secondaryColor: '#FFF3E0',
        backgroundColor: '#F8F9FA',
        textColor: '#1F2937',
      },
      iconName: 'orange',
    },
    ui: {
      subtitle: 'Zesty, warm & citrus vibe',
      localIcon: require('../assets/orange.png'),
    },
  },
  pineapple: {
    brandConfig: {
      id: 'pineapple',
      appName: '🍍 Pineapple Theme',
      theme: {
        primaryColor: '#D97706',
        secondaryColor: '#FEF3C7',
        backgroundColor: '#F8F9FA',
        textColor: '#1F2937',
      },
      iconName: 'pineapple',
    },
    ui: {
      subtitle: 'Sweet, tropical & golden sun',
      localIcon: require('../assets/pineapple.png'),
    },
  },
  strawberry: {
    brandConfig: {
      id: 'strawberry',
      appName: '🍓 Strawberry Theme',
      theme: {
        primaryColor: '#D81B60',
        secondaryColor: '#FCE4EC',
        backgroundColor: '#F8F9FA',
        textColor: '#1F2937',
      },
      iconName: 'strawberry',
    },
    ui: {
      subtitle: 'Sweet, juicy & vibrant berry',
      localIcon: require('../assets/strawberry.jpg'),
    },
  },
} as const;

export type AppTheme = (typeof THEMES)[keyof typeof THEMES];

export const DEFAULT_THEME_ID = 'apple';
export const HOLIDAY_THEMES = Object.values(THEMES);
export const DYNAMIC_THEMES = Object.values(THEMES).filter(
  (t) => t.brandConfig.id !== DEFAULT_THEME_ID
);
export const DEFAULT_THEME_DATA = THEMES[DEFAULT_THEME_ID];