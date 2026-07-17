import { useMediaQuery, useTheme } from '@mui/material'
import { memo, useEffect, useRef } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import * as THREE from 'three'

import { countries } from '../countries'

// Countries with Freedom Tool case studies, by ISO A3 code
const HIGHLIGHTED_COUNTRIES = new Set(['FRA', 'GEO', 'IRN', 'RUS'])

const HIGHLIGHT_COLOR = new THREE.Color('#57CA71')
const BASE_COLOR = new THREE.Color('#000000')
const BASE_OPACITY = 0.56
// One full gray -> green -> gray pulse takes ~2π / WAVE_SPEED seconds
const WAVE_SPEED = 1.2
// Phase offset between countries, so the pulse rolls through them as a wave
const WAVE_PHASE_STEP = Math.PI / 2

// three-globe binds the rendered mesh to each feature under this key
type HexPolygonFeature = (typeof countries.features)[number] & {
  __threeObjHexPolygon?: THREE.Mesh<THREE.BufferGeometry, THREE.MeshLambertMaterial>
}

const WorldGlobe = () => {
  const { palette, breakpoints } = useTheme()
  const isMdUp = useMediaQuery(breakpoints.up('md'))
  const globeRef = useRef<GlobeMethods>()

  useEffect(() => {
    const highlightedFeatures = countries.features.filter(feature =>
      HIGHLIGHTED_COUNTRIES.has(feature.properties.ADM0_A3),
    ) as HexPolygonFeature[]

    const initGlobe = () => {
      if (!globeRef.current || !globeRef.current.controls) {
        requestAnimationFrame(initGlobe)
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

        const time = performance.now() / 1000
        highlightedFeatures.forEach((feature, index) => {
          const material = feature.__threeObjHexPolygon?.material
          if (!material) return

          const wave = (Math.sin(time * WAVE_SPEED - index * WAVE_PHASE_STEP) + 1) / 2
          material.color.lerpColors(BASE_COLOR, HIGHLIGHT_COLOR, wave)
          material.opacity = BASE_OPACITY + (1 - BASE_OPACITY) * wave
          material.transparent = true
        })

        controls.update()
      }

      animate()
    }

    initGlobe()
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
          color: 0xffffff,
          emissive: 0xffffff,
          shininess: 0,
          flatShading: false,
        })
      }
      backgroundColor={palette.background.paper}
      showAtmosphere={false}
    />
  )
}

export default memo(WorldGlobe)
