import {
  Box,
  FormControl,
  FormControlProps,
  FormLabel,
  IconButton,
  IconButtonProps,
  Stack,
  StackProps,
  Typography,
  useTheme,
} from '@mui/material'
import { forwardRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ALLOWED_IMAGE_MIME_TYPES } from '@/constants'
import { Icons } from '@/enums'
import { Transitions } from '@/theme/constants'

import UiIcon from './UiIcon'

interface Props extends FormControlProps {
  imageUrl: string
  maxSize?: number
  errorMessage?: string
  labelProps?: StackProps
  deleteButtonProps?: IconButtonProps
  deleteIconSize?: number
  onUpdate: (image: File) => void
  onDelete: () => void
}

const UiImagePicker = forwardRef(
  (
    {
      imageUrl,
      maxSize,
      labelProps,
      deleteIconSize,
      errorMessage,
      deleteButtonProps,
      children,
      onUpdate,
      onDelete,
      ...rest
    }: Props,
    ref,
  ) => {
    const { palette } = useTheme()
    const imageInputId = useMemo(() => `image-input-${uuidv4()}`, [])

    return (
      <FormControl {...rest}>
        <Stack
          component={FormLabel}
          htmlFor={imageInputId}
          alignItems='center'
          justifyContent='center'
          position='relative'
          bgcolor={palette.action.active}
          border={`1px solid ${palette.action.hover}`}
          {...labelProps}
          sx={{
            overflow: 'hidden',
            cursor: 'pointer',
            transition: Transitions.Default,
            '&:hover': {
              backgroundColor: palette.action.hover,
            },
            ...labelProps?.sx,
          }}
        >
          <Box
            {...ref}
            component='input'
            id={imageInputId}
            type='file'
            max={maxSize}
            accept={ALLOWED_IMAGE_MIME_TYPES.join(',')}
            sx={{
              clip: 'rect(0 0 0 0)',
              width: 1,
              height: 1,
              overflow: 'hidden',
              position: 'absolute',
            }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (!file) return
              onUpdate(file)
            }}
          />
          {imageUrl ? (
            <Box
              component='img'
              src={imageUrl}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            children
          )}
        </Stack>
        {errorMessage && (
          <Typography
            variant='caption2'
            sx={({ palette }) => ({ mt: 1.5, color: palette.error.dark })}
          >
            {errorMessage}
          </Typography>
        )}
        {imageUrl && (
          <DeleteIconButton
            {...deleteButtonProps}
            iconSize={deleteIconSize}
            onClick={e => {
              e.preventDefault()
              onDelete()
            }}
          >
            <UiIcon name={Icons.TrashSimple} size={5} color={palette.error.main} />
          </DeleteIconButton>
        )}
      </FormControl>
    )
  },
)

function DeleteIconButton({
  iconSize = 4,
  ...rest
}: {
  iconSize?: number
} & IconButtonProps) {
  const { palette } = useTheme()

  return (
    <IconButton
      {...rest}
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        p: 1,
        backgroundColor: palette.background.paper,
        border: '1px solid',
        borderColor: palette.action.active,
        boxShadow: '0px 2px 4px 0px #0000001F',
        '&:hover': {
          backgroundColor: palette.background.default,
        },
        ...rest.sx,
      }}
    >
      <UiIcon name={Icons.TrashSimple} size={iconSize} color={palette.error.main} />
    </IconButton>
  )
}

export default UiImagePicker
