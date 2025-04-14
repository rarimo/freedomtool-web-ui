import { IconButton, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { memo } from 'react'

import { Icons } from '@/enums'
import { uiStore } from '@/store'
import { UiIcon } from '@/ui'

const AppThemeButton = () => {
  const { palette } = useTheme()

  const icon = palette.mode === 'dark' ? Icons.Moon : Icons.Sun

  return (
    <IconButton sx={{ flexGrow: 0, width: 40, height: 40 }} onClick={uiStore.togglePaletteMode}>
      <motion.div
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

export default memo(AppThemeButton)
