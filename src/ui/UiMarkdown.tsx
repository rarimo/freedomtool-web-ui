import { Box, Link, Typography, TypographyProps, useTheme } from '@mui/material'
import { defaultOverrides, getOverrides, MuiMarkdown, type Overrides } from 'mui-markdown'
import { useMemo } from 'react'

type Props = {
  children?: string
  typographyProps?: TypographyProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & any

export default function UiMarkdown({ overrides, typographyProps, children, ...rest }: Props) {
  const { spacing, typography, palette } = useTheme()

  const defaultComponentOverrides: Overrides = {
    h1: {
      component: Typography,
      props: {
        variant: 'h1',
        component: 'h1',
        sx: {
          mt: spacing(4),
        },
      },
    },
    img: {
      component: Box,
      props: {
        component: 'img',
        sx: {
          display: 'block',
          objectFit: 'cover',
          maxHeight: '100%',
          width: '100%',
          my: spacing(8),
          mx: 'auto',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          marginTop: spacing(4),
          marginBottom: spacing(4),
          maxWidth: '100%',
        },
      },
    },
    a: {
      component: Link,
      props: {
        sx: {
          color: palette.text.primary,
          textDecorationColor: palette.text.primary,
        },
      },
    },
    h2: {
      component: Typography,
      props: {
        variant: 'h2',
        component: 'h2',
        sx: {
          mt: spacing(4),
        },
      },
    },
    h3: {
      component: Typography,
      props: {
        variant: 'h3',
        component: 'h3',
        sx: {
          mt: spacing(4),
        },
      },
    },
    h4: {
      component: Typography,
      props: {
        variant: 'h4',
        component: 'h4',
        sx: {
          mt: spacing(4),
        },
      },
    },
    h5: {
      component: Typography,
      props: {
        variant: 'h5',
        component: 'h5',
        sx: {
          mt: spacing(4),
        },
      },
    },
    h6: {
      component: Typography,
      props: {
        variant: 'h6',
        component: 'h6',
        sx: {
          mt: spacing(4),
        },
      },
    },
    p: {
      component: Typography,
      props: {
        variant: 'body4',
        component: 'p',
        my: spacing(4),
      },
    },
    ul: {
      component: 'ul',
      props: {
        style: {
          ...typography.body3,
        },
      },
    },
    ol: {
      component: 'ul',
      props: {
        style: {
          ...typography.body3,
        },
      },
    },
  }

  const typographyOverrides = useMemo(() => {
    if (!typographyProps) return undefined

    return Object.keys(defaultOverrides).reduce((acc, curr) => {
      if (curr === 'a') {
        acc[curr] = {
          component: Link,
          props: {
            target: '_blank',
            sx: {
              color: 'inherit',
            },
          },
        }

        return acc
      }

      acc[curr] = {
        component: Typography,
        props: {
          ...typographyProps,
        },
      }

      return acc
    }, {} as Overrides)
  }, [typographyProps])

  return (
    <MuiMarkdown
      {...rest}
      overrides={{
        ...getOverrides(),
        ...defaultComponentOverrides,
        ...(typographyOverrides || overrides),
      }}
    >
      {children}
    </MuiMarkdown>
  )
}
