import { useMediaQuery, useTheme } from '@mui/material'
import { memo, useEffect, useRef } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import * as THREE from 'three'

import { countries } from '../countries'

// Countries with Freedom Tool case studies, by ISO A3 code
const HIGHLIGHTED_COUNTRIES = new Set(['FRA', 'GEO', 'IRN', 'RUS'])

type GeoFeature = {
  properties: { ADM0_A3: string }
  geometry: { type: string; coordinates: unknown }
}

// The bundled map data draws Crimea inside Russia's borders. Reassign its
// polygon to Ukraine before rendering, so country highlights never claim it.
const CRIMEA_BBOX = { minLng: 31.5, maxLng: 37.5, minLat: 43.5, maxLat: 46.5 }

const globeFeatures = (() => {
  const features = (countries.features as unknown as GeoFeature[]).map(feature => ({
    ...feature,
    geometry: { ...feature.geometry },
  }))

  const rus = features.find(f => f.properties.ADM0_A3 === 'RUS')
  const ukr = features.find(f => f.properties.ADM0_A3 === 'UKR')
  if (!rus || !ukr) return features as unknown as typeof countries.features

  const isCrimea = (polygon: number[][][]) => {
    const ring = polygon[0]
    const lng = ring.reduce((sum, point) => sum + point[0], 0) / ring.length
    const lat = ring.reduce((sum, point) => sum + point[1], 0) / ring.length
    return (
      lng > CRIMEA_BBOX.minLng &&
      lng < CRIMEA_BBOX.maxLng &&
      lat > CRIMEA_BBOX.minLat &&
      lat < CRIMEA_BBOX.maxLat
    )
  }

  const rusPolygons = rus.geometry.coordinates as number[][][][]
  const crimeaPolygons = rusPolygons.filter(isCrimea)
  rus.geometry.coordinates = rusPolygons.filter(polygon => !isCrimea(polygon))

  if (crimeaPolygons.length) {
    const ukrPolygons =
      ukr.geometry.type === 'MultiPolygon'
        ? (ukr.geometry.coordinates as number[][][][])
        : [ukr.geometry.coordinates as number[][][]]
    ukr.geometry.type = 'MultiPolygon'
    ukr.geometry.coordinates = [...ukrPolygons, ...crimeaPolygons]
  }

  return features as unknown as typeof countries.features
})()

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
    const highlightedFeatures = globeFeatures.filter(feature =>
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
      hexPolygonsData={globeFeatures}
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
