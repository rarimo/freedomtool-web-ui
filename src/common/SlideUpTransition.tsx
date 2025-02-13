import { Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef, ReactElement, Ref } from 'react'

const SlideUpTransition = forwardRef(function SlideUpTransition(
  props: TransitionProps & {
    // Slide API requires children to be a single element
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: ReactElement<any, any>
  },
  ref: Ref<unknown>,
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default SlideUpTransition
