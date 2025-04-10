import { useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useRef } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import * as THREE from 'three'

import { useUiState } from '@/store'

import { countries } from '../countries'

const WorldGlobe = () => {
  const { isDarkMode } = useUiState()
  const { palette, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  // MutableRefObject<GlobeMethods | undefined> | undefined
  const globeRef = useRef<GlobeMethods | undefined>(undefined)

  useEffect(() => {
    const waitForGlobe = () => {
      if (!globeRef.current || !globeRef.current.controls) {
        requestAnimationFrame(waitForGlobe)
        return
      }

      const controls = globeRef.current.controls()
      controls.autoRotate = true
      controls.autoRotateSpeed = -0.75

      controls.maxDistance = 250
      controls.minDistance = 250

      globeRef.current.scene().rotation.x = 0.2
      globeRef.current.scene().rotation.y = 0.2

      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
      }

      animate()
    }

    waitForGlobe()
  }, [])

  return (
    <Globe
      ref={globeRef}
      hexPolygonsData={countries.features}
      hexPolygonResolution={3}
      hexPolygonMargin={0.4}
      hexPolygonUseDots={true}
      waitForGlobeReady
      width={isMdUp ? 500 : 300}
      height={isMdUp ? 500 : 300}
      hexPolygonColor={() => palette.text.secondary}
      animateIn={false}
      globeMaterial={
        new THREE.MeshPhongMaterial({
          color: isDarkMode ? 0x272827 : 0xffffff,
          emissive: isDarkMode ? 0x272827 : 0xffffff,
          shininess: 0,
          flatShading: true,
        })
      }
      backgroundColor={palette.background.paper}
      showAtmosphere={false}
    />
  )
}

export default WorldGlobe
