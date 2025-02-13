import { Stack, StackProps } from '@mui/material'
import { ComponentProps } from 'react'

import { UiIcon } from '@/ui'

export default function CircleIcon({
  iconProps,
  ...rest
}: { iconProps: ComponentProps<typeof UiIcon> } & StackProps) {
  return (
    <Stack
      {...rest}
      justifyContent='center'
      alignItems='center'
      sx={{
        width: 88,
        minWidth: 88,
        height: 88,
        minHeight: 88,
        borderRadius: '50%',
        ...rest.sx,
      }}
    >
      <UiIcon {...iconProps} />
    </Stack>
  )
}
