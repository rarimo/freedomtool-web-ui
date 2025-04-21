import { Button, Divider, IconButton, Stack, useMediaQuery, useTheme } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { AppSettingsMenu } from '@/common'
import AppLogo from '@/common/AppLogo'
import { DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/constants'
import { useWeb3Context } from '@/contexts/web3-context'
import { getPollDraftsCount } from '@/db/services'
import { Icons, RoutePaths } from '@/enums'
import { QueryKey } from '@/query'
import { UiIcon } from '@/ui'

import PollsTabs, { PollTabProps } from './PollsTabs'

// FIXME: Get proposals count from another source
export default function PollsHeader() {
  const { palette, spacing, typography, breakpoints } = useTheme()
  const { t } = useTranslation()
  const { isConnected } = useWeb3Context()
  const isMdUp = useMediaQuery(breakpoints.up('md'))

  const { data: pollDraftsCount } = useQuery({
    queryKey: [QueryKey.DraftsCounter],
    queryFn: getPollDraftsCount,
    initialData: 0,
  })

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

  const pollsTabs: PollTabProps[] = [
    {
      route: RoutePaths.PollsActive,
      label: t('polls.active-polls-tab-lbl'),
      // count: activePollsCount,
    },
    {
      route: RoutePaths.PollsFinished,
      label: t('polls.history-polls-tab-lbl'),
      // count: historyPollsCount,
    },
    {
      route: RoutePaths.PollsDrafts,
      label: t('polls.draft-polls-tab-lbl'),
      count: isConnected && pollDraftsCount ? pollDraftsCount : 0,
    },
  ]

  return (
    <Stack
      px={4}
      width='100%'
      component='header'
      bgcolor={palette.background.light}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: zIndex.appBar,
        borderBottomLeftRadius: spacing(4),
        borderBottomRightRadius: spacing(4),
      }}
    >
      <Stack width='100%' maxWidth={1141} mx='auto'>
        <Stack
          height={{ xs: MOBILE_HEADER_HEIGHT, md: DESKTOP_HEADER_HEIGHT }}
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
                to={RoutePaths.NewPoll}
              >
                {t('polls.create-poll-btn')}
              </Button>
            ) : (
              <IconButton
                component={NavLink}
                sx={{
                  p: 1.5,
                  backgroundColor: palette.primary.main,
                  color: palette.common.black,
                }}
                to={RoutePaths.NewPoll}
              >
                <UiIcon name={Icons.AddFill} size={5} />
              </IconButton>
            )}
            {isConnected && <AppSettingsMenu />}
          </Stack>
        </Stack>
        <Divider flexItem />
        <PollsTabs tabs={pollsTabs} />
      </Stack>
    </Stack>
  )
}
