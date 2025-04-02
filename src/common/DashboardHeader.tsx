import { Button, Divider, IconButton, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import AppLogo from '@/common/AppLogo'
import { Icons, RoutePaths } from '@/enums'
import { ProposalStatus } from '@/enums/proposals'
import { useProposalState } from '@/hooks'
import PollsTabs from '@/pages/Dashboard/components/PollsTabs'
import { UiIcon } from '@/ui'

export default function DashboardHeader() {
  const { palette, spacing, typography, breakpoints } = useTheme()
  const { t } = useTranslation()

  const isMdUp = useMediaQuery(breakpoints.up('md'))

  const { proposals } = useProposalState({
    shouldFetchProposals: true,
  })
  const activePollsCount = useMemo(
    () =>
      proposals.filter(
        proposal =>
          Number(proposal.proposal.status) == ProposalStatus.Started ||
          Number(proposal.proposal.status) == ProposalStatus.Waiting,
      ).length,
    [proposals],
  )

  const historyPollsCount = useMemo(
    () =>
      proposals.filter(proposal => Number(proposal.proposal.status) == ProposalStatus.Ended).length,
    [proposals],
  )

  const dashboardTabs = [
    {
      pollsAmount: activePollsCount,
      label: t('dashboard.active-polls-tab-lbl'),
      href: RoutePaths.DashboardActive,
    },
    {
      pollsAmount: historyPollsCount,
      label: t('dashboard.history-polls-tab-lbl'),
      href: RoutePaths.DashboardHistory,
    },
    {
      pollsAmount: 0,
      label: t('dashboard.draft-polls-tab-lbl'),
      href: RoutePaths.DashboardDraft,
    },
  ]

  return (
    <Stack
      px={4}
      pt={5}
      width='100%'
      bgcolor={palette.background.light}
      sx={{
        borderBottomLeftRadius: spacing(4),
        borderBottomRightRadius: spacing(4),
      }}
    >
      <Stack width='100%' maxWidth={1136} mx='auto'>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
          mb={5}
        >
          <AppLogo />
          {isMdUp ? (
            <Button
              size='small'
              startIcon={<UiIcon name={Icons.AddLine} size={4} />}
              sx={{
                typography: typography.subtitle6,
              }}
              onClick={() => {}}
            >
              Create a poll
            </Button>
          ) : (
            <IconButton
              sx={{
                p: 1.5,
                backgroundColor: palette.primary.main,
                color: palette.common.black,
              }}
              onClick={() => {}}
            >
              <UiIcon name={Icons.AddLine} size={5} />
            </IconButton>
          )}
        </Stack>
        <Divider flexItem />
        <PollsTabs tabs={dashboardTabs} />
      </Stack>
    </Stack>
  )
}
