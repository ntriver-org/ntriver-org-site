// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NTriver.org',
  tagline: 'Open-source software, technical guides, and archival resources for Microsoft products.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://ntriver.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ntriver-org', // Usually your GitHub org/user name.
  projectName: 'ntriver-org-site', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ntriver-org/ntriver-org-site',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ntriver-org/ntriver-org-site',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'NTriver.org',
        // logo: {
        //   alt: 'NTriver.org Logo',
        //   src: 'img/logo.jpg',
        // },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'pkeymasterSidebar',
            position: 'left',
            label: 'PKeyMaster',
          },
          {
            type: 'docSidebar',
            sidebarId: 'guidesSidebar',
            position: 'left',
            label: 'Guides',
          },
          {
            type: 'docSidebar',
            sidebarId: 'troubleshootSidebar',
            position: 'left',
            label: 'Troubleshoot',
          },
          { to: '/blog', label: 'Blog', position: 'right' },
          {
            href: 'https://github.com/ntriver-org/PKeyMaster',
            position: 'right',
            className: 'navbar-icon-link navbar-github-link',
            'aria-label': 'GitHub',
          },
          {
            href: 'https://discord.gg/476fzQ3mV3',
            position: 'right',
            className: 'navbar-icon-link navbar-discord-link',
            'aria-label': 'Discord',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Projects',
            items: [
              {
                label: 'PKeyMaster',
                to: '/pkeymaster',
              },
              {
                label: 'Guides',
                to: '/guides',
              },
            ],
          },
          {
            title: 'Support',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/476fzQ3mV3',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ntriver-org/PKeyMaster',
              },
            ],
          },
        ],
        copyright: `Made with ❤️<br />© ${new Date().getFullYear()} NTriver.org`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['powershell'],
      },
    }),
};

export default config;
