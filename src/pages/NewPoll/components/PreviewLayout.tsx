import { Box, BoxProps, Stack, Typography, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

export default function PreviewLayout({ children }: PropsWithChildren) {
  const { palette } = useTheme()
  const { t } = useTranslation()

  return (
    <Stack position='relative' width={364} height={750} p={4}>
      <PhoneFrame position='absolute' color={palette.action.active} sx={{ inset: 0 }} />
      <Stack
        spacing={10}
        alignItems='center'
        bgcolor={palette.background.default}
        flex={1}
        border={1}
        borderColor={palette.action.active}
        borderRadius={12}
        pt={6}
      >
        <Typography variant='overline2' color={palette.text.secondary}>
          {t('poll-preview.title')}
        </Typography>
        <Box
          position='absolute'
          bgcolor={palette.action.active}
          my={10}
          borderRadius={4}
          sx={{ inset: 40 }}
        />
        <Stack
          width='100%'
          flex={1}
          bgcolor={palette.background.paper}
          maxHeight={637}
          zIndex={1}
          sx={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 48,
            borderBottomRightRadius: 48,
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  )
}

function PhoneFrame(props: BoxProps<'svg'>) {
  return (
    <Box
      component='svg'
      viewBox='0 0 364 750'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.9105 33.8163C0.160156 47.0646 0.160156 64.4076 0.160156 99.0935V650.589C0.160156 685.275 0.160156 702.618 6.9105 715.867C12.8483 727.52 22.3229 736.995 33.9764 742.933C47.2247 749.683 64.5677 749.683 99.2537 749.683H264.746C299.432 749.683 316.775 749.683 330.023 742.933C341.677 736.995 351.151 727.52 357.089 715.867C363.839 702.618 363.839 685.275 363.839 650.589V99.0936C363.839 64.4076 363.839 47.0646 357.089 33.8163C351.151 22.1627 341.677 12.6881 330.023 6.75036C316.775 1.52588e-05 299.432 1.52588e-05 264.746 1.52588e-05H99.2537C64.5677 1.52588e-05 47.2247 1.52588e-05 33.9764 6.75036C22.3229 12.6881 12.8483 22.1627 6.9105 33.8163ZM5.92141 95.6368C5.92141 64.1774 5.92141 48.4477 12.0438 36.4318C17.4292 25.8623 26.0225 17.2691 36.592 11.8837C48.6079 5.76127 64.3376 5.76127 95.7969 5.76127H144.191C144.883 5.76127 145.438 6.82285 145.823 7.5583C145.881 7.66856 145.935 7.77149 145.985 7.86242C146.473 8.75283 147.419 9.35644 148.507 9.35644H214.772C215.86 9.35644 216.806 8.75283 217.295 7.86242C217.345 7.77149 217.398 7.66855 217.456 7.55828C217.841 6.82284 218.396 5.76127 219.088 5.76127H268.202C299.662 5.76127 315.392 5.76127 327.407 11.8837C337.977 17.2691 346.57 25.8623 351.956 36.4318C358.078 48.4477 358.078 64.1774 358.078 95.6368V654.046C358.078 685.506 358.078 701.235 351.956 713.251C346.57 723.821 337.977 732.414 327.407 737.799C315.392 743.922 299.662 743.922 268.202 743.922H95.7969C64.3376 743.922 48.6079 743.922 36.592 737.799C26.0225 732.414 17.4292 723.821 12.0438 713.251C5.92141 701.235 5.92141 685.506 5.92141 654.046V95.6368Z'
        fill='currentColor'
      />
    </Box>
  )
}
