import { keyframes } from '@emotion/react'

export const FONT_FAMILY_MAIN = 'Roboto, sans-serif'
export const FONT_FAMILY_ACCENT = 'Roboto Slab, serif'

export enum FontWeight {
  Regular = 400,
  Medium = 500,
  SemiBold = 600,
  Bold = 700,
}

export enum Transitions {
  Fast = 'all 0.1s ease',
  Default = 'all 0.2s ease-out',
  Gentle = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
}

export const hiddenScrollbar = {
  /* Hide scrollbar for: */
  msOverflowStyle: 'none' /* IE and Edge */,
  scrollbarWidth: 'none' /* Firefox */,

  /* Chrome, Safari and Opera */
  [`&::-webkit-scrollbar`]: {
    display: 'none',
  },
}

/* Animations */
export const bottomAppearAnimation = keyframes`
    from {
        transform: translateY(80%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`

export const levitateAnimation = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-50%);
  }

  100% {
    transform: translateY(0);
  }
`

export const rippleAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
`

export const bouncingAnimation = keyframes`
  to {
    opacity: 0.1;
    transform: translateY(-30%);
  }
`

export const textWrapAndDirectionStyles = {
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  unicodeBidi: 'plaintext',
  display: 'inline',
}
