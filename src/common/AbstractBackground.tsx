import { Box, Stack, StackProps, useTheme } from '@mui/material'
import { PropsWithChildren, useMemo } from 'react'

export default function AbstractBackground({ children, ...rest }: PropsWithChildren & StackProps) {
  const { palette } = useTheme()

  const gradients = useMemo(
    () => [
      palette.additional.gradient2,
      palette.additional.gradient3,
      palette.additional.gradient4,
    ],
    [palette],
  )

  const randomGradient = useMemo(() => {
    return gradients[Math.floor(Math.random() * gradients.length)]
  }, [gradients])

  const shapes = useMemo(() => {
    const positions = [
      { top: '-10%', left: '5%' },
      { top: '15%', left: '60%' },
      { top: '30%', left: '20%' },
      { top: '50%', left: '75%' },
      { top: '70%', left: '35%' },
      { top: '90%', left: '10%' },
    ]

    return positions.map(({ top, left }, index) => {
      let shapeGradient
      do {
        shapeGradient = gradients[Math.floor(Math.random() * gradients.length)]
      } while (shapeGradient === randomGradient)

      return {
        id: index,
        size: `${Math.random() * 50 + 30}px`,
        top,
        left,
        rotation: `${Math.random() * 60 - 30}deg`,
        shapeType: Math.random() > 0.5 ? 'circle' : 'triangle',
        gradient: shapeGradient,
        blendMode: Math.random() > 0.5 ? 'multiply' : 'screen',
        blur: Math.random() > 0.5 ? `${Math.random() * 5 + 25}px` : '0px',
      }
    })
  }, [gradients, randomGradient])

  return (
    <Stack
      height='100%'
      width='100%'
      alignItems='center'
      justifyContent='center'
      position='relative'
      sx={{ background: randomGradient, overflow: 'hidden', ...rest.sx }}
    >
      {shapes.map(({ id, size, top, left, rotation, shapeType, gradient, blendMode, blur }) => (
        <Box
          key={id}
          sx={{
            position: 'absolute',
            width: size,
            height: size,
            top,
            left,
            background: gradient,
            clipPath:
              shapeType === 'circle' ? 'circle(50%)' : 'polygon(50% 0%, 0% 100%, 100% 100%)',
            opacity: 0.5,
            transform: `rotate(${rotation})`,
            mixBlendMode: blendMode,
            filter: `blur(${blur})`,
          }}
        />
      ))}

      {children}
    </Stack>
  )
}
