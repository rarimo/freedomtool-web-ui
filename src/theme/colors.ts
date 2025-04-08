import { alpha, PaletteMode } from '@mui/material'
import { PaletteOptions } from '@mui/material/styles'

export type AppPaletteMode = PaletteMode | 'system'

/*
 * Colors added from the design system in Figma.
 * Each color is mapped according to its label in the project.
 */
export const lightPalette: PaletteOptions = {
  mode: 'light',
  common: {
    black: '#000000', // base/black
    white: '#ffffff', // base/white
    baseBackground: alpha('#112a0a', 0.28), // base/base-background
  },
  primary: {
    darker: '#57CA71', // primary/primary-darker
    dark: '#69DE84', // primary/primary-dark
    main: '#80ED99', // primary/primary-base
    light: alpha('#80ED99', 0.12), // primary/primary-light
    lighter: alpha('#80ED99', 0.06), // primary/primary-lighter
    contrastText: '#000000',
  },
  secondary: {
    darker: '#4D7C0F', // secondary/secondary-darker
    dark: '#65A30D', // secondary/secondary-dark
    main: '#84CC16', // secondary/secondary-base
    light: alpha('#84CC16', 0.12), // secondary/secondary-light
    lighter: alpha('#84CC16', 0.06), // secondary/secondary-lighter
    contrastText: '#FFFFFF',
  },
  success: {
    darker: '#15803D', // success/success-darker
    dark: '#16A34A', // success/success-dark
    main: '#22C55E', // success/success-base
    light: alpha('#22C55E', 0.12), // success/success-light
    lighter: alpha('#22C55E', 0.06), // success/green-lighter
    contrastText: '#ffffff',
  },
  error: {
    darker: '#B91C1C', // error/error-darker
    dark: '#DC2626', // error/error-dark
    main: '#EF4444', // error/error-base
    light: alpha('#EF4444', 0.12), // error/error-light
    lighter: alpha('#EF4444', 0.06), // error/red-lighter
    contrastText: '#ffffff',
  },
  warning: {
    darker: '#C09027', // warning/warning-darker
    dark: '#E1AC3B', // warning/warning-dark
    main: '#F59E0B', // warning/warning-base
    light: alpha('#F59E0B', 0.12), // warning/warning-light
    lighter: alpha('#F59E0B', 0.06), // warning/warning-lighter
    contrastText: '#ffffff',
  },
  info: {
    main: '#3B82F6', // Informational/secondary-base
    darker: '#1D4ED8', // Informational/secondary-darker
    lighter: alpha('#3B82F60F', 0.06), // Informational/secondary-lighter
  },
  text: {
    primary: '#000000', // text & icons/primary
    secondary: alpha('#000000', 0.56), // text & icons/secondary
    placeholder: alpha('#000000', 0.44), // text & icons/placeholder
    disabled: alpha('#000000', 0.28), // text & icons/disabled
  },
  action: {
    active: alpha('#000000', 0.03), // background/component/primary
    hover: alpha('#000000', 0.1), // background/component/hovered
    focus: alpha('#000000', 0.15), // background/component/pressed
    selected: alpha('#000000', 0.06), // background/component/selected
    disabled: alpha('#000000', 0.06), // background/component/selected
  },
  background: {
    default: '#F6F6F6', // background/bg/primary
    light: '#FFFFFF', // background/bg/Container
    paper: '#ffffff', // background/bg/surface1
    surface: '#ffffff', // background/bg/surface2
    pure: '#ffffff', // background/bg/pure
  },
  divider: alpha('#000000', 0.05),
  additional: {
    // additional/gradient1
    gradient1: 'linear-gradient(180deg, #9AFE8A 0%, #8AFECC 100%)',
    // additional/gradient2
    gradient2: 'linear-gradient(180deg, #CBE7EC 0%, #F2F8EE 100%)',
    // additional/gradient3
    gradient3: 'linear-gradient(187.48deg, #F4F3F0 3.99%, #DFFCC4 94.19%)',
    // additional/gradient4
    gradient4: 'linear-gradient(180deg, #FCE3FC 0%, #D3D1EF 100%)',
    // additional/gradient5
    gradient5: 'linear-gradient(180deg, #D5FEC8 0%, #80ED99 100%)',
    // additional/gradient6
    gradient6: 'linear-gradient(87.63deg, #45C45C -1.41%, #39CDA0 113.73%)',
  },
  inverted: {
    light: '#FFFFFF', // inverted/dark
    dark: '#000000', // inverted/light
  },
}

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  common: {
    black: '#000000', // base/black
    white: '#ffffff', // base/white
    baseBackground: alpha('#00000066', 0.5), // base/base-background
  },
  primary: {
    darker: '#57CA71', // primary/primary-dark
    dark: '#69DE84', // primary/primary-dark
    main: '#80ED99', // primary/primary-base
    light: alpha('#80ED991F', 0.12), // primary/primary-light
    lighter: alpha('##80ED991F', 0.6), // primary/primary-lighter
    contrastText: '#000000',
  },
  secondary: {
    darker: '#A8E152', // secondary/secondary-darker
    dark: '#99D838', // secondary/secondary-dark
    main: '#8CCD28', // secondary/secondary-base
    light: alpha('#8CCD28', 0.12), // secondary/secondary-light
    lighter: alpha('#8CCD28', 0.06), // secondary-lighter
    contrastText: '#000000',
  },
  success: {
    darker: '#4AD07B', // success/success-darker
    dark: '#3DD073', // success/success-dark
    main: '#37CF6F', // success/success-base
    light: alpha('#37CF6F', 0.12), // success/success-light
    lighter: alpha('#37CF6F', 0.06), // success/green-lighter
    contrastText: '#000000',
  },
  error: {
    darker: '#EE6565', // error/error-darker
    dark: '#E65454', // error/error-dark
    main: '#DA4343', // error/error-base
    light: alpha('#DA43431F', 0.12), // error/error-light
    lighter: alpha('#DA43431F', 0.06), // error/red-lighter
    contrastText: '#ffffff',
  },
  warning: {
    darker: '#FBB239', // warning/warning-darker
    dark: '#F3A728', // warning/warning-dark
    main: '#ED9E19', // warning/warning-base
    light: alpha('#ED9E19', 0.12), // warning/warning-light
    lighter: alpha('#ED9E19', 0.06), // warning/warning-lighter
    contrastText: '#000000',
  },
  info: {
    main: '#367BEC', // Informational/secondary-base
    darker: '#5D97F5', // Informational/secondary-darker
    lighter: alpha('#367BEC', 0.06), // Informational/secondary-lighter
  },
  text: {
    primary: alpha('#ffffff', 0.9), // text & icons/primary
    secondary: alpha('#ffffff', 0.56), // text & icons/secondary
    placeholder: alpha('#ffffff', 0.44), // text & icons/placeholder
    disabled: alpha('#ffffff', 0.28), // text & icons/disabled
  },
  action: {
    active: alpha('#FFFFFF', 0.03), // background/component/primary
    hover: alpha('#FFFFFF', 0.1), // background/component/hovered
    focus: alpha('#FFFFFF', 0.15), // background/component/pressed
    selected: alpha('#FFFFFF', 0.06), // background/component/selected
    disabled: alpha('#FFFFFF', 0.06), // background/component/selected
  },
  background: {
    default: '#0E0E0E', // background/bg/primary
    light: '#171717', // background/bg/Container
    paper: '#272827', // background/bg/surface1
    surface: '#3F403F', // background/bg/surface2
    pure: '#0E0E0E', // background/bg/pure
  },
  divider: alpha('#ffffff', 0.05),
  additional: {
    // additional/gradient1
    gradient1: 'linear-gradient(180deg, #9AFE8A 0%, #8AFECC 100%)',
    // additional/gradient2
    gradient2: 'linear-gradient(180deg, #CBE7EC 0%, #F2F8EE 100%)',
    // additional/gradient3
    gradient3: 'linear-gradient(187.48deg, #F4F3F0 3.99%, #DFFCC4 94.19%)',
    // additional/gradient4
    gradient4: 'linear-gradient(180deg, #FCE3FC 0%, #D3D1EF 100%)',
    // additional/gradient5
    gradient5: 'linear-gradient(180deg, #D5FEC8 0%, #80ED99 100%)',
    // additional/gradient6
    gradient6: 'linear-gradient(87.63deg, #45C45C -1.41%, #39CDA0 113.73%)',
  },
  inverted: {
    light: '#000000', // inverted/light
    dark: '#F3F6F2', // inverted/dark
  },
}
