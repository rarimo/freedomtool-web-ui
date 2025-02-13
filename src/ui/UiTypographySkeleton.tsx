import {
  Skeleton,
  Stack,
  StackProps,
  TypographyPropsVariantOverrides,
  TypographyVariant,
} from '@mui/material'

import { typography } from '@/theme/typography'

interface Props extends StackProps {
  variant: TypographyVariant | keyof TypographyPropsVariantOverrides
}

export default function UiTypographySkeleton({ variant, ...rest }: Props) {
  const typo = typography[variant] ?? typography.body3

  return (
    <Stack justifyContent='center' height={typo.lineHeight} {...rest}>
      <Skeleton variant='rounded' sx={{ height: typo.fontSize }} />
    </Stack>
  )
}
