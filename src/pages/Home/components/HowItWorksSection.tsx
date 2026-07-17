import { Box, Button, ButtonBase, Stack, Typography, useTheme } from '@mui/material'
import { motion, useInView } from 'framer-motion'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LazyImage, RoundedBackground } from '@/common'
import { Icons } from '@/enums'
import { getCreatePollLinkProps } from '@/helpers'
import { UiIcon } from '@/ui'

import { HOME_CONTAINER_WIDTH } from '../constants'

interface GuideItemProps {
  order: number
  title: string
  previewSrc: string
  previewVideoSrcs?: string[]
  previewOverlay?: ReactNode
  list?: { title: string; icon?: Icons }[]
  footer?: ReactNode
  isReversed?: boolean
}

export default function HowItWorksSection() {
  const { palette, breakpoints } = useTheme()
  const { t } = useTranslation()

  const guideItems: Omit<GuideItemProps, 'order'>[] = useMemo(
    () => [
      {
        title: t('home.how-it-works.guide-1-title'),
        previewSrc: `images/how-it-works/polls-${palette.mode}.png`,
        previewOverlay: <ClickRippleOverlay />,
        list: [
          {
            title: t('home.how-it-works.guide-1-list-item-1'),
          },
        ],
        footer: (
          <Button {...getCreatePollLinkProps()} size='small' sx={{ width: 'fit-content' }}>
            {t('home.how-it-works.create-a-poll-btn')}
          </Button>
        ),
      },
      {
        title: t('home.how-it-works.guide-2-title'),
        previewSrc: `images/how-it-works/voting-${palette.mode}.png`,
        previewVideoSrcs: ['videos/id-voting.mp4', 'videos/passport-voting.mp4'],
        previewOverlay: <ScanLineOverlay />,
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
      },
      {
        title: t('home.how-it-works.guide-3-title'),
        previewSrc: `images/how-it-works/privacy-${palette.mode}.png`,
        previewOverlay: <RadarPulseOverlay />,
        footer: (
          <Typography variant='body3' color={palette.text.primary}>
            {t('home.how-it-works.guide-3-footer')}
          </Typography>
        ),
      },
    ],
    [palette, t],
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
          textAlign='center'
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

function GuideItem({
  list,
  previewSrc,
  previewVideoSrcs,
  previewOverlay,
  order,
  title,
  footer,
  isReversed = true,
}: GuideItemProps) {
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
        <motion.div variants={childVariant} style={{ width: '100%', maxWidth: 463 }}>
          {previewVideoSrcs?.length ? (
            <FlipPreview
              previewSrc={previewSrc}
              videoSrcs={previewVideoSrcs}
              title={title}
              overlay={previewOverlay}
            />
          ) : (
            <Box sx={{ position: 'relative' }}>
              <LazyImage
                src={previewSrc}
                alt={title}
                sx={{
                  aspectRatio: 1.16,
                  width: 463,
                  maxHeight: 400,
                  borderRadius: 8,
                  bgcolor: palette.background.default,
                  [breakpoints.down('md')]: {
                    width: '100%',
                  },
                }}
                width={463}
                height='auto'
              />
              {previewOverlay}
            </Box>
          )}
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

interface FlipPreviewProps {
  previewSrc: string
  videoSrcs: string[]
  title: string
  overlay?: ReactNode
}

function FlipPreview({ previewSrc, videoSrcs, title, overlay }: FlipPreviewProps) {
  const { palette } = useTheme()
  const { t } = useTranslation()
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [visibleIdx, setVisibleIdx] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Play the active clip while flipped; reset everything when flipped back
  useEffect(() => {
    if (!isFlipped) {
      setActiveIdx(0)
      setVisibleIdx(null)
      videoRefs.current.forEach(video => video?.pause())
      return
    }

    const video = videoRefs.current[activeIdx]
    if (!video) return

    video.currentTime = 0
    video.play().catch(() => setIsFlipped(false))

    // Warm up the next clip while the current one plays
    const next = videoRefs.current[activeIdx + 1]
    if (next) next.preload = 'auto'
  }, [isFlipped, activeIdx])

  const handleClipEnded = (index: number) => {
    if (index < videoSrcs.length - 1) {
      // Fade the finished clip out to the white card, then the next fades in
      setVisibleIdx(null)
      setActiveIdx(index + 1)
      return
    }

    setIsFlipped(false)
  }

  const faceSx = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  } as const

  return (
    <Box
      sx={{
        position: 'relative',
        perspective: 1200,
        width: '100%',
      }}
    >
      <Box
        component={motion.div}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        sx={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          aspectRatio: 1.16,
          maxHeight: 400,
        }}
      >
        <Box sx={{ ...faceSx, overflow: 'hidden' }}>
          <LazyImage
            src={previewSrc}
            alt={title}
            width='100%'
            height='100%'
            sx={{ bgcolor: palette.background.default }}
          />
          {overlay}
        </Box>
        <Box
          sx={{
            ...faceSx,
            overflow: 'hidden',
            transform: 'rotateY(180deg)',
            bgcolor: palette.common.white,
          }}
        >
          {videoSrcs.map((videoSrc, index) => (
            <Box
              key={videoSrc}
              component='video'
              ref={(el: HTMLVideoElement | null) => (videoRefs.current[index] = el)}
              src={videoSrc}
              muted
              playsInline
              preload={index === 0 ? 'auto' : 'metadata'}
              aria-label={title}
              onPlaying={() => setVisibleIdx(index)}
              onEnded={() => handleClipEnded(index)}
              // If the browser pauses a clip early (e.g. the tab goes to the
              // background), flip back so the card is never stuck on a frozen
              // frame; a clip that finished naturally is handled by onEnded
              onPause={() => {
                if (!videoRefs.current[index]?.ended) setIsFlipped(false)
              }}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Slight zoom crops the thin dark edge some clips have at the frame border
                transform: 'scale(1.03)',
                opacity: visibleIdx === index ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      <ButtonBase
        onClick={() => setIsFlipped(true)}
        aria-label={t('home.how-it-works.see-demo-btn')}
        sx={{
          position: 'absolute',
          top: 55,
          left: 63,
          width: 46,
          height: 46,
          borderRadius: '50%',
          zIndex: 2,
          opacity: isFlipped ? 0 : 1,
          pointerEvents: isFlipped ? 'none' : 'auto',
          transition: 'opacity 0.3s, transform 0.3s ease',
          '@keyframes demo-play-pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.12)' },
            '100%': { transform: 'scale(1)' },
          },
          '&:hover': {
            animation: 'demo-play-pulse 1.1s ease-in-out infinite',
          },
        }}
      >
        <Box component='svg' viewBox='0 0 24 24' sx={{ width: 1, height: 1, display: 'block' }}>
          <circle
            cx='12'
            cy='12'
            r='10.2'
            fill={palette.primary.main}
            stroke={palette.common.black}
            strokeWidth='1.6'
          />
          <path
            d='M9.8 8.3 L16 12 L9.8 15.7 Z'
            fill={palette.common.white}
            stroke={palette.common.black}
            strokeWidth='1.4'
            strokeLinejoin='round'
          />
        </Box>
      </ButtonBase>
    </Box>
  )
}

// Looping click ripple at the drawn cursor of the polls illustration
function ClickRippleOverlay() {
  const { palette } = useTheme()

  return (
    <Box sx={{ position: 'absolute', left: '74.9%', top: '59.3%', pointerEvents: 'none' }}>
      <Box
        component={motion.div}
        animate={{ scale: [0.3, 1.6], opacity: [0.55, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.6 }}
        sx={{
          width: 64,
          height: 64,
          ml: '-32px',
          mt: '-32px',
          borderRadius: '50%',
          border: `2px solid ${palette.primary.darker}`,
        }}
      />
    </Box>
  )
}

// Scanner beam sweeping over the QR code of the voting illustration
function ScanLineOverlay() {
  const { palette } = useTheme()

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '65.5%',
        top: '45.5%',
        width: '14.5%',
        height: '17%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Box
        component={motion.div}
        animate={{ top: ['2%', '92%', '2%'] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 3,
          borderRadius: 2,
          background: palette.primary.darker,
          boxShadow: `0 0 10px 2px ${palette.primary.light}`,
          opacity: 0.85,
        }}
      />
    </Box>
  )
}

// Radar-style rings expanding from the shield of the privacy illustration
function RadarPulseOverlay() {
  const { palette } = useTheme()

  return (
    <Box sx={{ position: 'absolute', left: '49.5%', top: '49.8%', pointerEvents: 'none' }}>
      {[0, 1.75].map(delay => (
        <Box
          key={delay}
          component={motion.div}
          // Fade in, then out, so rings never pop into view at full opacity
          animate={{ scale: [0.95, 1.3, 2], opacity: [0, 0.3, 0] }}
          transition={{
            duration: 3.5,
            times: [0, 0.3, 1],
            repeat: Infinity,
            ease: 'easeOut',
            delay,
          }}
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            ml: '-90px',
            mt: '-90px',
            borderRadius: '50%',
            border: `1.5px solid ${palette.primary.darker}`,
          }}
        />
      ))}
    </Box>
  )
}
