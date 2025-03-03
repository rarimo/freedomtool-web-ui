import { AlertColor, alpha, Components, Theme } from '@mui/material'
import type {} from '@mui/x-date-pickers/themeAugmentation'

import { Transitions } from './constants'
import { vh } from './helpers'
import { typography } from './typography'

export const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: theme => `
      html {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        min-height: ${vh(100)};
        -webkit-overflow-scrolling: touch !important;
        -webkit-tap-highlight-color: transparent;
      }

      body, #root, .App {
        display: flex;
        flex: 1;
        flex-direction: column;
        color: ${theme.palette.text.primary};
      }

      a {
        outline: none;
        text-decoration: none;
      }
    `,
  },
  MuiSnackbar: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& > .MuiPaper-root': {
          borderRadius: theme.spacing(1),
        },
      }),
    },
  },
  MuiStack: {
    defaultProps: {
      useFlexGap: true,
    },
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
      size: 'large',
      disableElevation: true,
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(250),
        transition: Transitions.Default,
      }),
      sizeLarge: ({ theme }) => ({
        ...typography.buttonLarge,
        padding: theme.spacing(2.5, 8),
        height: theme.spacing(12),
      }),
      sizeMedium: ({ theme }) => ({
        ...typography.buttonMedium,
        padding: theme.spacing(2.5, 6),
        height: theme.spacing(11),
      }),
      sizeSmall: ({ theme }) => ({
        ...typography.buttonSmall,
        padding: theme.spacing(1.5, 4),
        height: theme.spacing(10),
      }),
      fullWidth: {
        width: '100%',
      },
      text: {
        padding: 0,
        minWidth: 'unset',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      textPrimary: ({ theme }) => ({
        color: theme.palette.text.secondary,
        backgroundColor: 'transparent',
        '&:hover': {
          color: theme.palette.text.primary,
        },
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
        },
      }),
      textError: ({ theme }) => ({
        color: theme.palette.error.main,
        '&:hover': {
          color: theme.palette.error.dark,
        },
        '&.Mui-disabled, &.Mui-disabled:hover': {
          color: theme.palette.error.main,
          opacity: 0.5,
        },
      }),
      contained: ({ theme }) => ({
        '&.Mui-disabled': {
          '&, &:hover, &:focus': {
            backgroundColor: theme.palette.action.disabled,
            color: theme.palette.text.disabled,
          },
        },
      }),
      containedPrimary: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          background: alpha(theme.palette.primary.main, 0.9),
        },
        '&:active, &:focus': {
          background: alpha(theme.palette.primary.main, 0.8),
        },
      }),
      containedSecondary: ({ theme }) => ({
        color: theme.palette.common.white,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.secondary.dark,
        },
        '&:active': {
          backgroundColor: theme.palette.secondary.darker,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabled,
          color: theme.palette.text.disabled,
        },
      }),
      containedSuccess: ({ theme }) => ({
        color: theme.palette.success.main,
        backgroundColor: theme.palette.success.lighter,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.success.light,
        },
        '&:active': {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.success.main,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabled,
          color: theme.palette.text.disabled,
        },
      }),
      containedError: ({ theme }) => ({
        color: theme.palette.error.main,
        backgroundColor: theme.palette.error.lighter,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.error.light,
        },
        '&:active': {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.error.main,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabled,
          color: theme.palette.text.disabled,
        },
      }),
      containedWarning: ({ theme }) => ({
        color: theme.palette.warning.darker,
        backgroundColor: theme.palette.warning.lighter,
        '&:hover': {
          backgroundColor: theme.palette.warning.light,
        },
      }),
      containedInfo: ({ theme }) => ({
        color: theme.palette.common.white,
        backgroundColor: theme.palette.info.main,
        '&:hover': {
          backgroundColor: theme.palette.info.darker,
        },
      }),
      outlinedPrimary: ({ theme }) => ({
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.text.primary}`,
        '&:hover, &:focus, &:active': {
          color: theme.palette.inverted.light,
          backgroundColor: theme.palette.text.primary,
          border: `1px solid ${theme.palette.text.primary}`,
        },
        '&.Mui-disabled': {
          border: 'transparent',
          color: theme.palette.text.disabled,
          backgroundColor: theme.palette.action.disabled,
        },
      }),
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
    },
  },
  MuiFormControl: {
    defaultProps: {
      fullWidth: true,
    },
  },

  MuiPaper: {
    defaultProps: {
      variant: 'elevation',
      square: false,
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'unset',
        background: theme.palette.background.light,
        padding: theme.spacing(6),
        border: 0,
        borderRadius: theme.spacing(6),
        boxShadow: '0px 1px 1px 0px #0000000D, 0px 0px 0px 0.33px #0000000D',
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(5),
        },
      }),
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: ({ theme }) => ({
        padding: 3,
        borderRadius: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
          padding: 0,
        },
      }),
      noOptions: ({ theme }) => ({
        ...theme.typography.body3,
      }),
      root: { marginTop: 2 },
    },
  },
  MuiTextField: {
    defaultProps: { InputLabelProps: { shrink: true } },
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiInputBase-root, & .MuiInputBase-sizeMedium': typography.body3,
        '.MuiInputBase-sizeSmall': typography.body4,
        '& .MuiInputBase-root': {
          '&:not(.MuiInputBase-multiline)': {
            minHeight: theme.spacing(12),
            height: theme.spacing(12),
          },
          '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.action.focus,
            borderWidth: 1,
          },
          '&:hover:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.action.hover,
          },
        },
        '& .MuiInputBase-sizeSmall:not(.MuiInputBase-multiline)': {
          height: theme.spacing(8),
          minHeight: theme.spacing(8),
        },
        '& .MuiOutlinedInput-notchedOutline': {
          transition: Transitions.Default,
          borderRadius: theme.spacing(2),
          borderColor: theme.palette.action.active,
        },
        '& .MuiInputBase-input': {
          height: 'auto',
        },
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...typography.subtitle4,
        color: theme.palette.text.secondary,
        '&.Mui-focused': {
          color: 'inherit',
        },
      }),
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...typography.body4,
        marginTop: theme.spacing(1),
        marginLeft: 0,
      }),
    },
  },
  MuiSelect: {
    styleOverrides: {
      icon: ({ theme }) => ({
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: 'inherit',
        pointerEvents: 'none',
        top: theme.spacing(3.5),
        right: theme.spacing(3),
      }),
      root: ({ theme }) => ({
        ...typography.body3,
        height: theme.spacing(12),
        borderRadius: theme.spacing(2),
        '& .MuiOutlinedInput-notchedOutline': {
          transition: Transitions.Default,
          borderColor: theme.palette.action.active,
        },
        '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.action.focus,
          borderWidth: 1,
        },
        '&:hover:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiIconButton: {
    defaultProps: {
      color: 'primary',
    },
    styleOverrides: {
      root: {
        padding: 0,
        borderRadius: '1000px',
        transition: Transitions.Default,
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      colorPrimary: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
      colorSecondary: ({ theme }) => ({
        color: theme.palette.text.secondary,
        '&:hover': {
          color: theme.palette.text.primary,
        },
      }),
      colorSuccess: ({ theme }) => ({
        color: theme.palette.success.main,
        '&:hover': {
          color: theme.palette.success.dark,
        },
      }),
      colorError: ({ theme }) => ({
        color: theme.palette.error.main,
        '&:hover': {
          color: theme.palette.error.dark,
        },
      }),
      colorWarning: ({ theme }) => ({
        color: theme.palette.warning.main,
        '&:hover': {
          color: theme.palette.warning.dark,
        },
      }),
    },
  },
  MuiSkeleton: {
    defaultProps: {
      animation: 'wave',
      variant: 'rectangular',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.divider,
        borderRadius: theme.spacing(4),
      }),
      rounded: ({ theme }) => ({
        borderRadius: theme.spacing(6),
      }),
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: theme.spacing(10),
        height: theme.spacing(6),
        padding: 0,
        boxShadow: 'none',
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: theme.spacing(0.5),
          transition: Transitions.Default,
          color: theme.palette.common.white,
          '&.Mui-checked': {
            color: theme.palette.common.white,
            transform: `translateX(${theme.spacing(4)})`,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.primary.main,
              boxShadow: 'none',
              opacity: 1,
              border: 0,
            },
            '& + .MuiSwitch-thumb': {
              boxShadow: 'none',
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.08)',
          width: theme.spacing(5),
          height: theme.spacing(5),
          backgroundColor: theme.palette.common.white,
        },
        '& .MuiSwitch-track': {
          borderRadius: theme.spacing(10),
          backgroundColor: theme.palette.action.active,
          opacity: 1,
          transition: Transitions.Default,
        },
      }),
    },
  },
  MuiFormControlLabel: {
    defaultProps: {
      componentsProps: {
        typography: {
          variant: 'subtitle4',
        },
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 0,
        '& .MuiButtonBase-root': {
          padding: 0,
          marginRight: theme.spacing(2),
        },
      }),
    },
  },
  MuiTypography: {
    defaultProps: {
      variant: 'body3',
    },
  },
  MuiTooltip: {
    defaultProps: {
      placement: 'bottom',
      enterDelay: 0,
      enterTouchDelay: 0,
      arrow: true,
    },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        ...typography.body4,
        backgroundColor: theme.palette.inverted.dark,
        color: theme.palette.inverted.light,
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2, 4),
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.inverted.dark,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.spacing(3),
        boxShadow:
          '0px 0px 0px 1px #0000000D, 0px 4px 4px 0px #0000000A, 0px 8px 8px 0px #0000000A',
        marginTop: theme.spacing(4),
        padding: theme.spacing(3),
        zIndex: 100,
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
          padding: 8,
        },
      }),
      list: {
        padding: 4,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(2),
        '&:hover': {
          // TODO: integrate with design system when it's ready
          backgroundColor: theme.palette.action.active,
        },
      }),
    },
  },
  MuiPagination: {
    defaultProps: {
      color: 'primary',
      hidePrevButton: true,
      hideNextButton: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiButtonBase-root': {
          ...typography.buttonSmall,
          padding: theme.spacing(2.5, 4),
          height: theme.spacing(8),
        },
      }),
    },
  },
  MuiDrawer: {
    defaultProps: {
      anchor: 'right',
    },
    styleOverrides: {
      root: {
        '& > .MuiBackdrop-root': {
          backgroundColor: 'rgba(32, 32, 32, 0.50)',
        },
      },
      paper: ({ theme }) => ({
        width: '100%',
        maxWidth: theme.spacing(108),
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        border: 'none',
        borderRadius: theme.spacing(3),
      }),
      paperAnchorRight: ({ theme }) => ({
        height: 'unset',
        top: theme.spacing(3),
        bottom: theme.spacing(3),
        left: 'unset',
        right: theme.spacing(3),
      }),
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: '100%',
        borderRadius: theme.spacing(4),
        backgroundColor: theme.palette.background.paper,
        color: alpha(theme.palette.text.primary, 0.7),
        boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.04)',
      }),
      icon: ({ ownerState, theme }) => {
        const severityToBgColor: Record<AlertColor, string> = {
          success: alpha(theme.palette.success.main, 0.2),
          warning: alpha(theme.palette.warning.main, 0.2),
          error: alpha(theme.palette.error.main, 0.2),
          info: alpha(theme.palette.info.main, 0.2),
        }

        return {
          backgroundColor: severityToBgColor[ownerState.severity ?? 'info'],
          marginRight: theme.spacing(4),
          marginTop: 'auto',
          marginBottom: 'auto',
          padding: theme.spacing(2),
          borderRadius: theme.spacing(25),
        }
      },
      message: ({ theme }) => ({
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      }),
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...typography.subtitle4,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiLinearProgress: {
    defaultProps: {
      variant: 'determinate',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 250,
        height: theme.spacing(10),
        backgroundColor: theme.palette.action.active,
      }),
      barColorPrimary: ({ theme }) => ({
        borderRadius: 250,
        backgroundColor: theme.palette.primary.main,
      }),
      barColorSecondary: ({ theme }) => ({
        backgroundColor: theme.palette.primary.light,
        borderRadius: 250,
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        padding: 0,
        backgroundColor: theme.palette.background.light,
        boxShadow: `inset 0 0 0 1px ${theme.palette.action.active}`,
        border: 0,
        [theme.breakpoints.down('md')]: {
          padding: 0,
        },
      }),
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      colorPrimary: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
      colorSecondary: ({ theme }) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.action.active,
      }),
    },
  },
  MuiAccordion: {
    defaultProps: {
      disableGutters: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        border: 0,
        borderRadius: theme.spacing(2),
        '&.Mui-disabled': {
          background: 'transparent',
          opacity: 0.5,
        },
        backgroundColor: theme.palette.background.light,
        '&:first-of-type, &:last-of-type': {
          borderRadius: theme.spacing(2),
        },
        '&.MuiAccordion-root': {
          padding: theme.spacing(2, 4),
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 0,
        margin: 0,
        padding: theme.spacing(2, 0),
        '&.Mui-focusVisible': {
          backgroundColor: 'transparent',
        },
      }),
      content: {
        padding: 0,
        margin: 0,
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2, 0, 2, 0),
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      flexContainer: ({ theme }) => ({
        gap: theme.spacing(6),
      }),
    },
  },
  MuiYearCalendar: {
    styleOverrides: {
      root: {
        width: '100%',
      },
    },
  },
  MuiPickersYear: {
    styleOverrides: {
      yearButton: ({ theme }) => ({
        ...typography.buttonSmall,
        width: theme.spacing(16),
        borderRadius: theme.spacing(2),
        '& .Mui-selected': {
          color: theme.palette.common.white,
        },
      }),
    },
  },
  MuiPickersArrowSwitcher: {
    styleOverrides: {
      root: {
        display: 'grid',
        gridTemplateColumns: '1fr 20px 1fr',
      },
    },
  },
  MuiPickersToolbar: {
    styleOverrides: {
      root: {
        display: 'none',
      },
    },
  },
  MuiPickersLayout: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiPickersLayout-actionBar': {
          gap: 8,
        },
        '& .MuiButton-root': {
          ...typography.buttonSmall,
          padding: theme.spacing(2.5, 4),
          height: theme.spacing(8),
          width: 'fit-content',
        },
      }),
    },
  },
  MuiPickersPopper: {
    styleOverrides: {
      paper: ({ theme }) => ({
        padding: theme.spacing(4),
        paddingBottom: 0,
        borderRadius: theme.spacing(4),
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(4),
        },
        '& .MuiPickersCalendarHeader-root': {
          padding: 0,
          margin: 0,
        },
        '& .MuiPickersCalendarHeader-label': {
          ...typography.subtitle3,
        },
        '& .MuiYearCalendar-root': {
          width: '100%',
        },
        '& .MuiPickersYear-yearButton': {
          ...typography.buttonSmall,
          width: '56px',
          borderRadius: theme.spacing(2),
        },

        '& .MuiDateCalendar-root': {
          width: '280px',
          maxHeight: '260px',
        },
        '& .MuiMultiSectionDigitalClockSection-item': {
          ...typography.buttonSmall,
        },
      }),
    },
  },
}
