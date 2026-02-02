import { createTheme } from '@g-loot/react-tournament-brackets'

export const CustomThemeBracket = createTheme({
  textColor: { main: '#FFFFFF', highlighted: '#07ffc6', dark: '#a0a0a0' },
  transitionTimingFunction: 'cubic-bezier(0, 0.92, 0.77, 0.99)',
  disabledColor: '#5D6371',
  roundHeaders: {
    background: '#2F3648'
  },

  matchBackground: {
    wonColor: '#1D2232',
    lostColor: '#141822'
  },
  score: {
    background: { wonColor: '#38B2AC', lostColor: '#E53E3E' },
    text: { highlightedWonColor: '#07ffc6', highlightedLostColor: '#FC8181' }
  },
  border: {
    color: '#22293B',
    highlightedColor: '#707582'
  },
  roundHeader: { backgroundColor: '#2D3748', fontColor: '#FFFFFF' },
  connectorColor: '#4A5568',
  connectorColorHighlight: '#07ffc6',
  svgBackground: '#1A202C'
})
