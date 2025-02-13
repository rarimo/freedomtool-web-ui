import { ExtendedTypographyOptions } from '@/types'

import { FONT_FAMILY, FontWeight } from './constants'
import { toRem } from './helpers'

export const typography: ExtendedTypographyOptions = {
  htmlFontSize: 16,

  fontFamily: FONT_FAMILY,
  fontSize: 14,

  fontWeightRegular: FontWeight.Regular,
  fontWeightMedium: FontWeight.Medium,

  display1: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(64),
    lineHeight: toRem(72),
  },

  display2: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(56),
    lineHeight: toRem(60),
  },

  h1: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(48),
    lineHeight: toRem(52),
  },
  h2: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(32),
    lineHeight: toRem(36),
  },
  h3: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(24),
    lineHeight: toRem(28),
  },
  h4: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(20),
    lineHeight: toRem(24),
  },
  h5: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(16),
    lineHeight: toRem(20),
  },
  h6: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(14),
    lineHeight: toRem(18),
  },
  subtitle1: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(24),
    lineHeight: toRem(32),
  },
  subtitle2: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(20),
    lineHeight: toRem(24),
  },
  subtitle3: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(16),
    lineHeight: toRem(22),
  },
  subtitle4: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(14),
    lineHeight: toRem(20),
  },
  subtitle5: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(12),
    lineHeight: toRem(18),
  },
  body1: {
    fontWeight: FontWeight.Regular,
    fontSize: toRem(20),
    lineHeight: toRem(28),
  },
  body2: {
    fontWeight: FontWeight.Regular,
    fontSize: toRem(16),
    lineHeight: toRem(22),
  },
  body3: {
    fontWeight: FontWeight.Regular,
    fontSize: toRem(14),
    lineHeight: toRem(20),
  },
  body4: {
    fontWeight: FontWeight.Regular,
    fontSize: toRem(12),
    lineHeight: toRem(18),
  },
  button: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(14),
    lineHeight: toRem(18),
    textTransform: 'none',
  },
  buttonLarge: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(16),
    lineHeight: toRem(20),
    textTransform: 'none',
  },
  buttonMedium: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(14),
    lineHeight: toRem(18),
    textTransform: 'none',
  },
  buttonSmall: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(12),
    lineHeight: toRem(14),
    letterSpacing: toRem(0.24),
    textTransform: 'none',
  },
  caption1: {
    fontWeight: FontWeight.Regular,
    fontSize: toRem(14),
    lineHeight: toRem(16),
  },
  caption2: {
    fontWeight: FontWeight.Regular,
    fontSize: toRem(12),
    lineHeight: toRem(14),
  },
  caption3: {
    fontWeight: FontWeight.Regular,
    fontSize: toRem(10),
    lineHeight: toRem(12),
  },
  overline1: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(14),
    lineHeight: toRem(18),
    letterSpacing: toRem(0.56),
    textTransform: 'uppercase',
  },
  overline2: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(12),
    lineHeight: toRem(16),
    letterSpacing: toRem(0.48),
    textTransform: 'uppercase',
  },
  overline3: {
    fontWeight: FontWeight.Medium,
    fontSize: toRem(10),
    lineHeight: toRem(12),
    letterSpacing: toRem(0.4),
    textTransform: 'uppercase',
  },
}
