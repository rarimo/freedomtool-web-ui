import { Breakpoint, BreakpointsOptions } from '@mui/material'

export const breakpoints: BreakpointsOptions & { values: { [key in Breakpoint]: number } } = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1440,
    xl: 1700,
  },
}
