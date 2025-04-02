import { TypographyOptions } from '@mui/material/styles/createTypography'
import { CSSProperties } from 'react'

export interface ExtendedTypographyOptions extends TypographyOptions {
  display1: CSSProperties
  display2: CSSProperties

  subtitle3: CSSProperties
  subtitle4: CSSProperties
  subtitle5: CSSProperties
  subtitle6: CSSProperties
  subtitle7: CSSProperties

  body3: CSSProperties
  body4: CSSProperties
  body5: CSSProperties

  buttonLarge: CSSProperties
  buttonMedium: CSSProperties
  buttonSmall: CSSProperties

  caption1: CSSProperties
  caption2: CSSProperties
  caption3: CSSProperties

  overline1: CSSProperties
  overline2: CSSProperties
  overline3: CSSProperties
}

declare module '@mui/material/Typography/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true
    display2: true

    subtitle3: true
    subtitle4: true
    subtitle5: true
    subtitle6: true
    subtitle7: true

    body3: true
    body4: true
    body5: true

    buttonLarge: true
    buttonMedium: true
    buttonSmall: true

    caption1: true
    caption2: true
    caption3: true

    overline1: true
    overline2: true
    overline3: true

    button: false
    caption: false
    overline: false
  }
}

declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string
    lighter?: string
  }

  interface SimplePaletteColorOptions {
    darker?: string
    lighter?: string
  }

  interface TypeText {
    placeholder: string
  }

  interface TypeBackground {
    light: string
    pure: string
    surface: string
  }

  interface PaletteOptions {
    additional: {
      gradient1: string
      gradient2: string
      gradient3: string
      gradient4: string
      gradient5: string
      gradient6: string
    }
    inverted: {
      light: string
      dark: string
    }
  }

  interface CommonColors {
    baseBackground: string
  }

  interface Palette {
    additional: {
      gradient1: string
      gradient2: string
      gradient3: string
      gradient4: string
      gradient5: string
      gradient6: string
    }

    inverted: {
      light: string
      dark: string
    }
  }
}

declare module '@mui/material/styles/createTypography' {
  interface Typography extends ExtendedTypographyOptions {}
}
