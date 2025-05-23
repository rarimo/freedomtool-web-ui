import { Box, Stack, StackProps, Tab, TabProps, Tabs, TabsProps, useTheme } from '@mui/material'
import { ReactNode, SyntheticEvent, useCallback, useState } from 'react'

import { Transitions } from '@/theme/constants'

interface Props extends StackProps {
  tabs: UiTab[]
  ariaLabel?: string
  slots?: {
    tabsProps?: TabsProps
  }
}

export type UiTab = Omit<TabProps, 'content'> & {
  content: ReactNode
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
  const { palette } = useTheme()

  const changeTab = useCallback((event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }, [])

  return (
    <Stack {...rest}>
      <Tabs
        value={currentTab}
        textColor='inherit'
        indicatorColor='primary'
        onChange={changeTab}
        aria-label={ariaLabel}
        {...rest?.slots?.tabsProps}
        sx={{
          background: palette.action.active,
          alignItems: 'center',
          px: 0.5,
          py: 0,
          width: '100%',
          height: 40,
          minHeight: 40,
          borderRadius: 100,
          '& .MuiTabs-indicator': {
            background: ({ palette }) => palette.background.paper,
            borderRadius: 100,
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
          },
          ...rest?.slots?.tabsProps?.sx,
        }}
      >
        {tabs.map(({ label, icon, ...rest }, idx) => (
          <Tab
            key={idx}
            label={label}
            icon={icon}
            {...rest}
            content={undefined}
            {...a11yProps(idx)}
            sx={{
              minWidth: 'unset',
              alignItems: 'center',
              justifyContent: 'center',
              py: 2,
              flexGrow: 1,
              zIndex: 1,
              width: 'max-content',
              minHeight: 'unset',
              height: 36,
              transition: Transitions.Default,
              '&[aria-selected="false"]:hover': {
                opacity: 1,
              },
              ...rest.sx,
            }}
          />
        ))}
      </Tabs>

      {tabs.map(({ content }, idx) => (
        <CustomTabPanel key={idx} value={currentTab} index={idx}>
          {content}
        </CustomTabPanel>
      ))}
    </Stack>
  )
}
