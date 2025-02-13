import { Divider, Link, MenuItem, Stack, SxProps, Typography, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { ThemeSwitcher } from '@/common/index'
import { Icons } from '@/enums'
import { UiIcon } from '@/ui'

export default function AppSettings({ children }: PropsWithChildren) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  const menuItemSx: SxProps = { minHeight: 36, p: 2, m: 0 }

  const menuLinks = [
    {
      icon: Icons.FileList2Line,
      label: t('app-navbar.terms-conditions-lbl'),
      href: '/terms',
    },
    {
      icon: Icons.ShieldLine,
      label: t('app-navbar.privacy-policy-lbl'),
      href: '/privacy',
    },
  ]

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        {menuLinks.map(({ icon, label, href }, idx) => (
          <MenuItem
            key={idx}
            component={Link}
            href={href}
            target='_blank'
            rel='noreferrer'
            sx={menuItemSx}
          >
            <Stack direction='row' alignItems='center' spacing={3}>
              <UiIcon name={icon} color={palette.text.secondary} size={5} />
              <Typography variant='buttonMedium' color={palette.text.primary}>
                {label}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Stack>
      <Divider />
      <ThemeSwitcher />
      {children}
    </Stack>
  )
}
