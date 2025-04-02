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
import { ChangeEvent, forwardRef, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ALLOWED_IMAGE_MIME_TYPES } from '@/constants'
import { Icons } from '@/enums'
import { Transitions } from '@/theme/constants'

import UiIcon from './UiIcon'

interface Props extends FormControlProps {
  maxSize?: number
  title?: string
  description?: string
  errorMessage?: string
  labelProps?: StackProps
  deleteButtonProps?: IconButtonProps
  deleteIconSize?: number
  onUpdate: (image: File) => void
  onDelete: () => void
}

const UiImagePicker = forwardRef<HTMLInputElement, Props>(
  (
    {
      maxSize,
      title,
      description,
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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const imageInputId = useMemo(() => `image-input-${uuidv4()}`, [])

    const updatePreview = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      onUpdate(file)
    }

    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    }, [previewUrl])

    return (
      <FormControl {...rest}>
        <Stack
          sx={{ cursor: 'pointer' }}
          component={FormLabel}
          htmlFor={imageInputId}
          direction='row'
          spacing={4}
        >
          <Stack sx={{ position: 'relative' }}>
            <Stack
              alignItems='center'
              borderRadius='100%'
              justifyContent='center'
              position='relative'
              bgcolor={palette.action.active}
              border={`1px solid ${palette.action.hover}`}
              {...labelProps}
              sx={{
                transition: Transitions.Default,
                borderColor: 'transparent',
                '&:hover': {
                  backgroundColor: palette.action.hover,
                },
                ...labelProps?.sx,
              }}
            >
              <Box
                ref={ref}
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
                  updatePreview(e)
                }}
              />
              {previewUrl ? (
                <Box
                  component='img'
                  src={previewUrl}
                  sx={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                children
              )}
            </Stack>
            {previewUrl && (
              <DeleteIconButton
                {...deleteButtonProps}
                iconSize={deleteIconSize}
                onClick={e => {
                  e.preventDefault()
                  setPreviewUrl(null)
                  onDelete()
                }}
              >
                <UiIcon name={Icons.TrashSimple} size={5} color={palette.error.main} />
              </DeleteIconButton>
            )}
          </Stack>

          <Stack>
            <Stack spacing={1} alignItems='flex-start'>
              {title && (
                <Typography color={palette.text.primary} variant='buttonLarge'>
                  {title}
                </Typography>
              )}
              {description && <Typography variant='body4'>{description}</Typography>}
            </Stack>

            {errorMessage && (
              <Typography
                variant='caption2'
                sx={({ palette }) => ({ mt: 1.5, color: palette.error.dark })}
              >
                {errorMessage}
              </Typography>
            )}
          </Stack>
        </Stack>
      </FormControl>
    )
  },
)

function DeleteIconButton({
  iconSize = 3,
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
        top: -5,
        right: -5,
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
      <UiIcon name={Icons.DeleteBin6Line} size={iconSize} color={palette.error.main} />
    </IconButton>
  )
}

UiImagePicker.displayName = 'UiImagePicker'

export default UiImagePicker
