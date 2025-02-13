import { Box, BoxProps, IconButton, Stack, Typography, useTheme } from '@mui/material'
import get from 'lodash/get'

import { Icons } from '@/enums'
import { useCopyToClipboard } from '@/hooks'
import { UiIcon } from '@/ui/index'

type Props = {
  value: string
  displayValue?: string
  label?: string
} & BoxProps

export default function UiCopyField({ value, displayValue, label, ...rest }: Props) {
  const { palette } = useTheme()
  const { copy, isCopied } = useCopyToClipboard()

  return (
    <Box
      {...rest}
      sx={{
        py: 2.5,
        px: 3,
        background: palette.background.paper,
        border: 0,
        borderRadius: 2,
        ...rest.sx,
      }}
    >
      <Stack direction='row' spacing={4} alignItems='center'>
        <Stack overflow='hidden'>
          {label && (
            <Typography
              variant='subtitle5'
              color={palette.text.secondary}
              sx={{ mb: 1, display: 'block' }}
            >
              {label}
            </Typography>
          )}
          <Typography color='inherit' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayValue ?? value}
          </Typography>
        </Stack>
        <IconButton onClick={() => copy(value)} sx={{ ml: 'auto' }}>
          <UiIcon
            name={isCopied ? Icons.Check : Icons.FileCopyLine}
            color={get(rest.sx, 'color', palette.text.secondary) as string}
            opacity={0.56}
            size={5}
          />
        </IconButton>
      </Stack>
    </Box>
  )
}
