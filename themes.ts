// Note: In `schedule`, months are 0-indexed (e.g., 0 for January, 11 for December).
export const THEMES = {
  apple: {
    brandConfig: {
      id: 'apple',
      appName: '🍎 Apple Theme',
      theme: {
        primaryColor: '#D32F2F',
        secondaryColor: '#FFCDD2',
        backgroundColor: '#B71C1C',
        textColor: '#ffffff',
      },
      iconName: 'apple',
    },
    ui: {
      subtitle: 'Crisp and refreshing',
      localIcon: require('./example/assets/apple.png'),
    },
  },
  orange: {
    brandConfig: {
      id: 'orange',
      appName: '🍊 Orange Theme',
      theme: {
        primaryColor: '#F57C00',
        secondaryColor: '#FFE0B2',
        backgroundColor: '#E65100',
        textColor: '#ffffff',
      },
      iconName: 'orange',
    },
    ui: {
      subtitle: 'Zesty and vibrant',
      localIcon: require('./example/assets/orange.png'),
    },
  },
  pineapple: {
    brandConfig: {
      id: 'pineapple',
      appName: '🍍 Pineapple Theme',
      theme: {
        primaryColor: '#FBC02D',
        secondaryColor: '#FFF9C4',
        backgroundColor: '#F57F17',
        textColor: '#ffffff',
      },
      iconName: 'pineapple',
    },
    ui: {
      subtitle: 'Sweet and tropical',
      localIcon: require('./example/assets/pineapple.png'),
    },
  },
  strawberry: {
    brandConfig: {
      id: 'strawberry',
      appName: '🍓 Strawberry Theme',
      theme: {
        primaryColor: '#C2185B',
        secondaryColor: '#F8BBD0',
        backgroundColor: '#880E4F',
        textColor: '#ffffff',
      },
      iconName: 'strawberry',
    },
    ui: {
      subtitle: 'Sweet and juicy',
      localIcon: require('./example/assets/strawberry.png'),
    },
  },
} as const;

// Type definition for a single theme entry
export type AppTheme = (typeof THEMES)[keyof typeof THEMES];

// The ID of the theme to be used as the default
export const DEFAULT_THEME_ID = 'apple';

// Derived constants for convenience
export const HOLIDAY_THEMES = Object.values(THEMES).filter(
  (t): t is AppTheme & { schedule: NonNullable<AppTheme['schedule']> } =>
    !!t.schedule
);
export const DYNAMIC_THEMES = Object.values(THEMES).filter(
  (t) => t.brandConfig.id !== DEFAULT_THEME_ID
);
export const DEFAULT_THEME_DATA = THEMES[DEFAULT_THEME_ID];