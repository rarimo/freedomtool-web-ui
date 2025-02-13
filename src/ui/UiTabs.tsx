import { Box, Stack, StackProps, Tab, Tabs } from '@mui/material'
import { ReactNode, SyntheticEvent, useCallback, useState } from 'react'

import { Transitions } from '@/theme/constants'

interface Props extends StackProps {
  tabs: {
    label: string
    content: ReactNode
  }[]
  ariaLabel?: string
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function CustomTabPanel({
  children,
  value,
  index,
  ...rest
}: {
  children?: ReactNode
  index: number
  value: number
}) {
  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && <Box pt={5}>{children}</Box>}
    </Box>
  )
}

export default function UiTabs({ tabs, ariaLabel, ...rest }: Props) {
  const [currentTab, setCurrentTab] = useState(0)

  const handleChange = useCallback((event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }, [])

  return (
    <Stack {...rest}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          textColor='inherit'
          indicatorColor='primary'
          onChange={handleChange}
          aria-label={ariaLabel}
          sx={{
            '& .MuiTabs-indicator': {
              background: ({ palette }) => palette.text.primary,
              display: 'flex',
              justifyContent: 'center',
              height: '1px',
              pb: 0,
            },
          }}
        >
          {tabs.map(({ label }, idx) => (
            <Tab
              key={idx}
              label={label}
              {...a11yProps(idx)}
              sx={{
                minWidth: 'unset',
                paddingInline: 0,
                paddingBottom: 2,
                justifyContent: 'flex-end',
                transition: Transitions.Default,
                '&[aria-selected="false"]:hover': {
                  opacity: 1,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map(({ content }, idx) => (
        <CustomTabPanel key={idx} value={currentTab} index={idx}>
          {content}
        </CustomTabPanel>
      ))}
    </Stack>
  )
}
