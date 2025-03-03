import { alpha, PaletteMode } from '@mui/material'
import { PaletteOptions } from '@mui/material/styles'

export type AppPaletteMode = PaletteMode | 'system'

export const lightPalette: PaletteOptions = {
  mode: 'light',
  common: {
    black: '#112a0a', // base/black
    white: '#ffffff', // base/white
    baseBackground: alpha('#112a0a', 0.28), // base/base-background
  },
  primary: {
    darker: '#3D7149',
    dark: '#7AE191',
    main: '#80ED99',
    light: '#E1F2E4',
    lighter: alpha('#80ED99', 0.06),
    contrastText: '#000000',
  },
  secondary: {
    darker: '#8f40d0', // secondary/secondary-darker
    dark: '#9f4be4', // secondary/secondary-dark
    main: '#ad56f4', // secondary/secondary-base
    light: alpha('#ad56f4', 0.12), // secondary/secondary-light
    lighter: alpha('#ad56f4', 0.06), // secondary/secondary-lighter
    contrastText: '#000000',
  },
  success: {
    darker: '#0f8f6f', // success/success-darker
    dark: '#0aa17b', // success/success-dark
    main: '#00b487', // success/success-base
    light: alpha('#00b487', 0.12), // success/success-light
    lighter: alpha('#00b487', 0.06), // success/green-lighter
    contrastText: '#ffffff',
  },
  error: {
    darker: '#c83733', // error/error-darker
    dark: '#dd3b36', // error/error-dark
    main: '#f23f3a', // error/error-base
    light: alpha('#f23f3a', 0.12), // error/error-light
    lighter: alpha('#f23f3a', 0.06), // error/red-lighter
    contrastText: '#ffffff',
  },
  warning: {
    darker: '#c09027', // warning/warning-darker
    dark: '#e1ac3b', // warning/warning-dark
    main: '#ffc548', // warning/warning-base
    light: alpha('#ffc548', 0.12), // warning/warning-light
    lighter: alpha('#ffc548', 0.06), // warning/warning-lighter
    contrastText: '#ffffff',
  },
  info: {
    main: '#3DA7D5', //informational/secondary-base
    darker: '#3494BE', //informational/secondary-darker
    lighter: alpha('#3DA7D5', 0.06), //informational/secondary-lighter
  },
  text: {
    primary: '#112a0a', // text & icons/primary
    secondary: alpha('#112a0a', 0.56), // text & icons/secondary
    placeholder: alpha('#112a0a', 0.44), // text & icons/placeholder
    disabled: alpha('#112a0a', 0.28), // text & icons/disabled
  },
  action: {
    active: alpha('#112a0a', 0.05), // background/component/primary
    hover: alpha('#112a0a', 0.1), // background/component/hovered
    focus: alpha('#112a0a', 0.15), // background/component/pressed
    selected: alpha('#112a0a', 0.05), // background/component/selected
    disabled: alpha('#112a0a', 0.05), // background/component/disabled
  },
  background: {
    default: '#F8F9FB', // background/bg/primary
    light: '#ffffff', // background/bg/Container
    paper: '#ffffff', // background/bg/surface1
    surface: '#ffffff', // background/bg/surface2
    pure: '#ffffff', // background/bg/pure
  },
  divider: alpha('#112a0a', 0.05),
  additional: {
    popupBackground: alpha('#1c1e1c', 0.56), // additional/popup-background
    gradient: 'linear-gradient(90deg, #366E24 0%, #3DA7D5 49.51%, #AD56F4 100%)', // additional/gradient1

    // TODO: Sync with design palette
    marketFlashWrapper:
      'linear-gradient(90deg, rgba(186, 59, 182, 0.1) 0%, rgba(233, 64, 87, 0.1) 100%)',
    marketFlashHeaderText: 'linear-gradient(90deg, #BA3BB6 0%, #E94057 100%)',
    marketFlashProgressThumb: '#BA3BB6',
    marketFlashProgressIndicator: 'linear-gradient(90deg, #BA3BB6 0%, #E94057 100%)',
  },
  inverted: {
    light: '#ffffff', // inverted/light
    dark: '#112a0a', // inverted/light
  },
}

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  common: {
    black: '#131313', // base/black
    white: '#ffffff', // base/white
    baseBackground: alpha('#112a0a', 0.28), // base/base-background
  },
  primary: {
    darker: '#2A4B34',
    dark: '#4F8E63',
    main: '#4A9F7B',
    light: '#7A9D85',
    lighter: alpha('#4A9F7B', 0.1),
    contrastText: '#FFFFFF',
  },
  secondary: {
    darker: '#c287f3', // secondary/secondary-darker
    dark: '#b572ec', // secondary/secondary-dark
    main: '#a860e3', // secondary/secondary-base
    light: alpha('#a860e3', 0.12), // secondary/secondary-light
    lighter: alpha('#a860e3', 0.06), // secondary/secondary-lighter
    contrastText: '#1d2715',
  },
  success: {
    darker: '#33d2aa', // success/success-darker
    dark: '#20c79d', // success/success-dark
    main: '#0ebb90', // success/success-base
    light: alpha('#0ebb90', 0.12), // success/success-light
    lighter: alpha('#0ebb90', 0.06), // success/green-lighter
    contrastText: '#ffffff',
  },
  error: {
    darker: '#f1736f', // error/error-darker
    dark: '#ea615d', // error/error-dark
    main: '#e0514d',
    light: alpha('#e0514d', 0.12), // error/error-light
    lighter: alpha('#e0514d', 0.06), // error/red-lighter
    contrastText: '#ffffff',
  },
  warning: {
    darker: '#ffd478', // warning/warning-darker
    dark: '#faca63', // warning/warning-dark
    main: '#f9c452', // warning/warning-base
    light: alpha('#f9c452', 0.12), // warning/warning-light
    lighter: alpha('#f9c452', 0.06), // warning/warning-lighter
    contrastText: '#ffffff',
  },
  info: {
    main: '#3DA7D5', //informational/secondary-base
    darker: '#3494BE', //informational/secondary-darker
    lighter: alpha('#3DA7D5', 0.06), //informational/secondary-lighter
  },
  text: {
    primary: alpha('#ffffff', 0.9), // text & icons/primary
    secondary: alpha('#ffffff', 0.56), // text & icons/secondary
    placeholder: alpha('#ffffff', 0.44), // text & icons/placeholder
    disabled: alpha('#ffffff', 0.28), // text & icons/disabled
  },
  action: {
    active: alpha('#ffffff', 0.05), // background/component/primary
    hover: alpha('#ffffff', 0.1), // background/component/hovererd
    focus: alpha('#ffffff', 0.15), // background/component/pressed
    selected: alpha('#ffffff', 0.05), // background/component/selected
    disabled: alpha('#ffffff', 0.05), // background/component/disabled
  },
  background: {
    default: '#131313', // background/bg/primary
    light: '#242524', // background/bg/Container
    pure: '#131313', // background/bg/pure
    paper: '#303230', // background/bg/surface1
    surface: '#4a4b4a', // background/bg/surface2
  },
  divider: alpha('#ffffff', 0.05),
  additional: {
    popupBackground: '#0d0e0ddb', // additional/popupbackground
    gradient: 'linear-gradient(90deg, #366E24 0%, #3DA7D5 49.51%, #AD56F4 100%)', // additional/gradient1

    // TODO: Sync with design palette
    marketFlashWrapper:
      'linear-gradient(90deg, rgba(186, 59, 182, 0.1) 0%, rgba(233, 64, 87, 0.1) 100%)',
    marketFlashHeaderText: 'linear-gradient(90deg, #BA3BB6 0%, #E94057 100%)',
    marketFlashProgressThumb: '#BA3BB6',
    marketFlashProgressIndicator: 'linear-gradient(90deg, #BA3BB6 0%, #E94057 100%)',
  },
  inverted: {
    light: '#112A0A', // inverted/light
    dark: '#f3f6f2', // inverted/dark
  },
}
