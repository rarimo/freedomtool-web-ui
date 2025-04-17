import { Box, Button, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { ReactNode, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'

import { RoundedBackground } from '@/common'
import { RARIME_APP_STORE_URL, RARIME_GOOGLE_PLAY_URL } from '@/constants'
import { Icons, RoutePaths } from '@/enums'
import { useUiState } from '@/store'
import { UiIcon } from '@/ui'

import { HOME_CONTAINER_WIDTH } from '../constants'

interface GuideItemProps {
  order: number
  title: string
  previewSrc: string
  list?: { title: string; icon?: Icons }[]
  footer?: ReactNode
  isReversed?: boolean
}

export default function HowItWorksSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()
  const { isDarkMode } = useUiState()

  const guideItems: Omit<GuideItemProps, 'order'>[] = useMemo(
    () => [
      {
        title: t('home.how-it-works.guide-1-title'),
        previewSrc: isDarkMode ? 'images/polls-dark.png' : 'images/polls-light.png',
        list: [
          {
            title: t('home.how-it-works.guide-1-list-item-1'),
            icon: Icons.ShieldCheck,
          },
          {
            title: t('home.how-it-works.guide-1-list-item-2'),
            icon: Icons.StackLine,
          },
          {
            title: t('home.how-it-works.guide-1-list-item-3'),
            icon: Icons.Shining2Line,
          },
        ],
        footer: (
          <Button
            component={NavLink}
            size='small'
            sx={{ width: 'fit-content' }}
            to={RoutePaths.NewPoll}
          >
            {t('home.how-it-works.create-a-poll-btn')}
          </Button>
        ),
      },
      {
        title: t('home.how-it-works.guide-2-title'),
        previewSrc: isDarkMode ? 'images/voting-dark.png' : 'images/voting-light.png',
        list: [
          {
            title: t('home.how-it-works.guide-2-list-item-1'),
            icon: Icons.QrCodeLine,
          },
          {
            title: t('home.how-it-works.guide-2-list-item-2'),
            icon: Icons.PassportLine,
          },
          {
            title: t('home.how-it-works.guide-2-list-item-3'),
            icon: Icons.LockLine,
          },
        ],
        footer: (
          <Stack direction='row' spacing={4}>
            <IconButton target='_blank' rel='noopener' component={Link} to={RARIME_APP_STORE_URL}>
              <UiIcon sx={{ opacity: 0.9 }} name={Icons.Apple} />
            </IconButton>
            <IconButton target='_blank' rel='noopener' component={Link} to={RARIME_GOOGLE_PLAY_URL}>
              <UiIcon sx={{ opacity: 0.9 }} name={Icons.GooglePlay} />
            </IconButton>
          </Stack>
        ),
      },
      {
        title: t('home.how-it-works.guide-3-title'),
        previewSrc: isDarkMode ? 'images/privacy-dark.png' : 'images/privacy-light.png',
        footer: (
          <Typography variant='body3' color={palette.text.primary}>
            {t('home.how-it-works.guide-3-footer')}
          </Typography>
        ),
      },
    ],
    [isDarkMode, palette, t],
  )

  return (
    <RoundedBackground
      sx={{
        background: palette.background.paper,
        overflow: 'hidden',
        position: 'relative',
        pt: 20,
        mt: 0,
        [breakpoints.down('md')]: {
          mx: 0,
          p: 4,
          py: 8,
        },
      }}
    >
      <Stack component='section' maxWidth={HOME_CONTAINER_WIDTH} width={1}>
        <Typography
          alignSelf='flex-start'
          component='h2'
          variant='h2'
          typography={{ xs: 'h3', md: 'h2' }}
        >
          {t('home.how-it-works.title')}
        </Typography>

        <Stack
          spacing={10}
          sx={{ mt: { xs: 10, md: 20 }, width: 1, justifyContent: 'space-between' }}
        >
          {guideItems.map((item, index) => (
            <GuideItem key={index} order={index + 1} isReversed={(index + 1) % 2 === 0} {...item} />
          ))}
        </Stack>
      </Stack>
    </RoundedBackground>
  )
}

function GuideItem({ list, previewSrc, order, title, footer, isReversed = true }: GuideItemProps) {
  const { palette, breakpoints } = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const childVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      style={{ width: '100%' }}
    >
      <Stack
        width={1}
        direction={{ md: isReversed ? 'row-reverse' : 'row' }}
        alignItems='center'
        justifyContent='space-between'
        gap={{ xs: 8, md: 16 }}
      >
        <motion.div variants={childVariant}>
          <Stack
            sx={{
              aspectRatio: 1.16,
              width: 463,
              maxHeight: 400,
              borderRadius: 8,
              [breakpoints.down('md')]: {
                width: '100%',
              },
            }}
            bgcolor={palette.background.default}
          >
            <Box
              component='img'
              src={previewSrc}
              alt={title}
              sx={{ width: 1, height: 1, objectFit: 'contain' }}
            />
          </Stack>
        </motion.div>

        <motion.div variants={childVariant}>
          <Stack mr='auto' spacing={8} maxWidth={508}>
            <motion.div variants={childVariant}>
              <Stack
                spacing={4}
                direction={{ xs: 'row', md: 'column' }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
              >
                <Typography color={palette.text.placeholder} component='h3' variant='h2'>
                  {order.toString().length > 1 ? order : `0${order}`}
                </Typography>
                <Typography component='p' variant='h2' typography={{ xs: 'h4', md: 'h2' }}>
                  {title}
                </Typography>
              </Stack>
            </motion.div>
            {list &&
              list.map(({ title: listTitle, icon }, index) => (
                <motion.div variants={childVariant} key={index}>
                  <Stack direction='row' spacing={3}>
                    {icon && <UiIcon size={5} color={palette.primary.darker} name={icon} />}
                    <Typography variant='body3' color={palette.text.primary}>
                      {listTitle}
                    </Typography>
                  </Stack>
                </motion.div>
              ))}
            <motion.div variants={childVariant}>{footer}</motion.div>
          </Stack>
        </motion.div>
      </Stack>
    </motion.div>
  )
}
