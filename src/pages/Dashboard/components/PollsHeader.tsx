import { Button, Divider, IconButton, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { AppSettingsMenu } from '@/common'
import AppLogo from '@/common/AppLogo'
import { DESKTOP_HEADER_HEIGHT } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { Icons, RoutePaths } from '@/enums'
import PollsTabs, { PollTabProps } from '@/pages/Dashboard/components/PollsTabs'
import { UiIcon } from '@/ui'

// FIXME: Get proposals count from another source
export default function PollsHeader() {
  const { palette, spacing, typography, breakpoints } = useTheme()
  const { t } = useTranslation()
  const { isConnected } = useWeb3Context()
  const isMdUp = useMediaQuery(breakpoints.up('md'))

  // const { getProposalInfo } = useProposalState()

  // const activePollsCount = useMemo(
  //   () =>
  //     proposals.filter(
  //       proposal =>
  //         Number(proposal.proposal.status) === ProposalStatus.Started ||
  //         Number(proposal.proposal.status) === ProposalStatus.Waiting,
  //     ).length,
  //   [proposals],
  // )

  // const historyPollsCount = useMemo(
  //   () =>
  //     proposals.filter(proposal => Number(proposal.proposal.status) === ProposalStatus.Ended)
  //       .length,
  //   [proposals],
  // )

  const dashboardTabs: PollTabProps[] = [
    {
      route: RoutePaths.DashboardActive,
      label: t('dashboard.active-polls-tab-lbl'),
      // count: activePollsCount,
    },
    {
      route: RoutePaths.DashboardHistory,
      label: t('dashboard.history-polls-tab-lbl'),
      // count: historyPollsCount,
    },
    {
      route: RoutePaths.DashboardDraft,
      label: t('dashboard.draft-polls-tab-lbl'),
      // count: 0,
    },
  ]

  return (
    <Stack
      px={4}
      width='100%'
      bgcolor={palette.background.light}
      sx={{
        borderBottomLeftRadius: spacing(4),
        borderBottomRightRadius: spacing(4),
      }}
    >
      <Stack width='100%' maxWidth={1141} mx='auto'>
        <Stack
          height={DESKTOP_HEADER_HEIGHT}
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
        >
          <AppLogo />
          <Stack direction='row' spacing={3} alignItems='center'>
            {isMdUp ? (
              <Button
                component={NavLink}
                size='small'
                startIcon={<UiIcon name={Icons.AddFill} size={4} />}
                sx={{
                  typography: typography.subtitle6,
                }}
                to={RoutePaths.CreatePoll}
              >
                {t('dashboard.create-poll-btn')}
              </Button>
            ) : (
              <IconButton
                component={NavLink}
                sx={{
                  p: 1.5,
                  backgroundColor: palette.primary.main,
                  color: palette.common.black,
                }}
                to={RoutePaths.CreatePoll}
              >
                <UiIcon name={Icons.AddFill} size={5} />
              </IconButton>
            )}
            {isConnected && <AppSettingsMenu />}
          </Stack>
        </Stack>
        <Divider flexItem />
        <PollsTabs tabs={dashboardTabs} />
      </Stack>
    </Stack>
  )
}
