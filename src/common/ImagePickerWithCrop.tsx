import {
  Box,
  Button,
  Dialog,
  DialogActions,
  FormControl,
  FormControlProps,
  FormLabel,
  IconButton,
  IconButtonProps,
  Stack,
  StackProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { getMimeType } from 'advanced-cropper/extensions/mimes'
import { ChangeEvent, forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { FixedCropper, FixedCropperRef, ImageRestriction } from 'react-advanced-cropper'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import { ALLOWED_IMAGE_MIME_TYPES, BANNER_HEIGHT, BANNER_WIDTH } from '@/constants'
import { Icons } from '@/enums'
import { Transitions } from '@/theme/constants'
import { UiDialogContent, UiDialogTitle, UiIcon } from '@/ui'

interface Props extends FormControlProps {
  maxSize?: number
  title?: string
  value?: File | null
  description?: string
  errorMessage?: string
  labelProps?: StackProps
  deleteButtonProps?: IconButtonProps
  deleteIconSize?: number
  onUpdate: (image: File) => void
  onDelete: () => void
}

interface Image {
  type?: string
  src: string
}

const ImagePickerWithCrop = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
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

    const [isCropperDialogOpen, setIsCropperDialogOpen] = useState(false)
    const [image, setImage] = useState<Image | null>(null)

    const imageInputId = useMemo(() => `image-input-${uuidv4()}`, [])

    const processImage = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const blobUrl = URL.createObjectURL(file)

      const typeFallback = file.type

      const reader = new FileReader()

      reader.onload = e => {
        setImage({
          src: blobUrl,
          type: getMimeType(e.target?.result, typeFallback),
        })
      }
      reader.readAsArrayBuffer(file)

      setIsCropperDialogOpen(true)
      // Clear the event target value to give the possibility to upload the same image:
      e.target.value = ''
    }

    useEffect(() => {
      if (!value) return

      const previewURL = URL.createObjectURL(value)
      setPreviewUrl(previewURL)

      return () => {
        URL.revokeObjectURL(previewURL)
      }
    }, [value])

    useEffect(() => {
      return () => {
        if (image && image.src) {
          URL.revokeObjectURL(image.src)
        }
      }
    }, [image])

    return (
      <>
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
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    position: 'absolute',
                  }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    processImage(e)
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
        <CropperDialog
          image={image}
          isOpen={isCropperDialogOpen}
          onSave={onUpdate}
          onClose={() => setIsCropperDialogOpen(false)}
        />
      </>
    )
  },
)

interface CropperDialogProps {
  image?: Image | null
  isOpen: boolean
  onSave: (image: File) => void
  onClose: () => void
}

function CropperDialog({ image, isOpen, onClose, onSave }: CropperDialogProps) {
  const cropperRef = useRef<FixedCropperRef>(null)
  const { breakpoints } = useTheme()
  const isMdDown = useMediaQuery(breakpoints.down('md'))
  const { t } = useTranslation()

  const saveResult = async () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas()
      if (!canvas) return

      canvas.toBlob(blob => {
        if (!blob) return

        const file = new File([blob], 'banner.png', { type: blob.type })
        onSave(file)
        onClose()
      }, 'image/webp')
    }
  }

  return (
    <Dialog fullScreen={isMdDown} open={isOpen} onClose={onClose}>
      <UiDialogTitle onClose={onClose}>{t('image-picker.title')}</UiDialogTitle>
      <UiDialogContent width={{ md: 400 }} height={400}>
        <Stack spacing={5}>
          <Stack sx={{ borderRadius: 2, overflow: 'hidden', maxHeight: 400 }}>
            <FixedCropper
              ref={cropperRef}
              src={image && image.src}
              stencilSize={{
                width: BANNER_WIDTH,
                height: BANNER_HEIGHT,
              }}
              stencilProps={{
                handlers: false,
                lines: true,
                movable: true,
                resizable: false,
              }}
              imageRestriction={ImageRestriction.fitArea}
            />
          </Stack>
          {!isMdDown && <Button onClick={saveResult}>{t('image-picker.save-btn')}</Button>}
        </Stack>
      </UiDialogContent>
      {isMdDown && (
        <DialogActions>
          <Button fullWidth onClick={saveResult}>
            {t('image-picker.save-btn')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

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

ImagePickerWithCrop.displayName = 'UiImagePicker'

export default ImagePickerWithCrop
