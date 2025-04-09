import { IconButton, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Icons } from '@/enums'
import { uiStore } from '@/store'
import { UiIcon } from '@/ui'

export default function AppThemeButton() {
  const { palette } = useTheme()
  const [icon, setIcon] = useState(palette.mode === 'dark' ? Icons.Moon : Icons.Sun)

  useEffect(() => {
    setIcon(palette.mode === 'dark' ? Icons.Moon : Icons.Sun)
  }, [palette.mode])

  return (
    <IconButton
      key={palette.mode}
      sx={{ flexGrow: 0, width: 40, height: 40 }}
      onClick={uiStore.togglePaletteMode}
    >
      <motion.div
        key={palette.mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UiIcon name={icon} size={4} color={palette.text.primary} />
      </motion.div>
    </IconButton>
  )
}
