// styles/theme.js

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  colorScheme: 'dark',

  colors: {
    dark: [
      '#e4e4e7',  // 0
      '#a1a1aa',  // 1
      '#71717a',  // 2
      '#52525b',  // 3
      '#3f3f46',  // 4
      '#27272a',  // 5
      '#18181b',  // 6
      '#16213e',  // 7
      '#1a1a2e',  // 8
      '#0f1419'   // 9
    ],

    yellow: [
      '#fffbeb',
      '#fef3c7',
      '#fde68a',
      '#fcd34d',
      '#fbbf24',
      '#ffbe0b',  // Main
      '#f59e0b',
      '#d97706',
      '#b45309',
      '#92400e'
    ],

    cyan: [
      '#ecfeff',
      '#cffafe',
      '#a5f3fc',
      '#67e8f9',
      '#22d3ee',
      '#00d9ff',  // Main
      '#06b6d4',
      '#0891b2',
      '#0e7490',
      '#155e75'
    ]
  },

  primaryColor: 'yellow',

  fontFamily: 'Inter, system-ui, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',

  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 600
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md'
      },
      styles: (theme) => ({
        root: {
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }
      })
    },

    Paper: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.dark[7],
          border: `1px solid ${theme.colors.dark[4]}`
        }
      })
    },

    Badge: {
      styles: (theme) => ({
        root: {
          fontFamily: theme.fontFamilyMonospace,
          fontSize: 10,
          textTransform: 'none'
        }
      })
    }
  }
});
