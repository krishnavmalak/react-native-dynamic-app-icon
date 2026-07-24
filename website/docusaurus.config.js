export default {
  title: 'React Native Dynamic Branding',
  tagline: 'The ultimate runtime branding library for React Native',
  url: 'https://dynamic-branding.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'dynamic-branding', 
  projectName: '@krishnavm/react-native-dynamic-app-icon', 
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/dynamic-branding/@krishnavm/react-native-dynamic-app-icon/tree/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Dynamic Branding',
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/dynamic-branding/@krishnavm/react-native-dynamic-app-icon',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};
