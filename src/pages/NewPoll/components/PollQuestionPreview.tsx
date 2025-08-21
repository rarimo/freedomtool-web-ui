import { ButtonBase, Divider, Stack, Typography, useTheme } from '@mui/material'

import { textWrapAndDirectionStyles } from '@/theme/constants'
import { lineClamp } from '@/theme/helpers'

import { SectionAnchor } from '../constants'
import { CreatePollSchema } from '../createPollSchema'
import PreviewLayout from './PreviewLayout'

interface Props {
  question?: CreatePollSchema['questions'][0]
  isRankingBased?: boolean
}

export default function PollQuestionPreview({ question, isRankingBased }: Props) {
  const { palette } = useTheme()

  return (
    <>
      <Stack id={SectionAnchor.Questions} />
      <PreviewLayout>
        <Stack spacing={5} px={4} py={5}>
          <Typography
            variant='h4'
            color={palette.text.primary}
            sx={{ ...textWrapAndDirectionStyles, ...lineClamp(3) }}
          >
            {question?.text || '--'}
          </Typography>
          <Divider />
          <Stack spacing={2}>
            {question?.options.map(({ id, text }, index) => (
              <OptionItem key={id} text={text} index={index} isRankingBased={isRankingBased} />
            ))}
          </Stack>
        </Stack>
      </PreviewLayout>
    </>
  )
}

function OptionItem({
  text,
  index,
  isRankingBased,
}: {
  text: string
  index: number
  isRankingBased?: boolean
}) {
  const { palette } = useTheme()

  return (
    <Stack
      component={ButtonBase}
      direction='row'
      spacing={4}
      alignItems='center'
      justifyContent='flex-start'
      fontFamily='inherit'
      bgcolor={palette.action.active}
      px={4}
      py={2.5}
      borderRadius={3}
      sx={{
        '&:hover': {
          bgcolor: palette.action.selected,
        },
        '&:focus': {
          bgcolor: palette.action.hover,
        },
      }}
    >
      {!isRankingBased && (
        <>
          <Typography
            variant='subtitle7'
            color={palette.text.secondary}
            sx={{ minWidth: 16, textAlign: 'center' }}
          >
            {index + 1}
          </Typography>
          <Divider orientation='vertical' flexItem />
        </>
      )}
      <Typography
        variant='subtitle6'
        color={palette.text.primary}
        sx={{ ...textWrapAndDirectionStyles, ...lineClamp(3), textAlign: 'left' }}
      >
        {text}
      </Typography>
    </Stack>
  )
}
