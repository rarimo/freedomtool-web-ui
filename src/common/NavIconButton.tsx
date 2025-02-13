import { IconButton, useTheme } from '@mui/material'

import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

export default function NavIconButton({
  icon,
  onClick,
  disabled,
}: {
  icon: Icons
  disabled: boolean
  onClick: () => void
}) {
  const { palette } = useTheme()

  return (
    <IconButton
      color='secondary'
      disabled={disabled}
      onClick={onClick}
      sx={{
        backgroundColor: palette.action.active,
        p: 3.5,
        '&:hover': {
          backgroundColor: palette.action.hover,
        },
        '&:disabled': {
          backgroundColor: palette.action.disabled,
          color: palette.text.disabled,
        },
      }}
    >
      <UiIcon name={icon} size={5} />
    </IconButton>
  )
}
