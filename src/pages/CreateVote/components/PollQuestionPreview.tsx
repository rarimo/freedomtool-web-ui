import { ButtonBase, Divider, Stack, Typography, useTheme } from '@mui/material'

import { CreateVoteSchema } from '../createVoteSchema'
import PreviewLayout from './PreviewLayout'

interface Props {
  question?: CreateVoteSchema['questions'][0]
}

export default function PollQuestionPreview({ question }: Props) {
  const { palette } = useTheme()

  return (
    <PreviewLayout>
      <Stack spacing={5} px={4} py={5}>
        <Typography variant='h4' color={palette.text.primary}>
          {question?.text || '--'}
        </Typography>
        <Divider />
        <Stack spacing={2}>
          {question?.options.map(({ id, text }, index) => (
            <OptionItem key={id} text={text} index={index} />
          ))}
        </Stack>
      </Stack>
    </PreviewLayout>
  )
}

function OptionItem({ text, index }: { text: string; index: number }) {
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
      <Typography
        variant='subtitle7'
        color={palette.text.secondary}
        sx={{ width: 16, textAlign: 'center' }}
      >
        {index + 1}
      </Typography>
      <Divider orientation='vertical' flexItem />
      <Typography variant='subtitle6' color={palette.text.primary}>
        {text}
      </Typography>
    </Stack>
  )
}
