import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ---- Constructs 100% Exact Extruded 3D HA Logo Geometry ---- */
export function useHALogoShapes() {
  return useMemo(() => {
    // Convert the 4 official logo SVG paths into Three.js Shapes
    // Center point is (250, 300), scale normalized so height ~ 3 units

    // 1. Left vertical bar
    const p1 = new THREE.Shape()
    p1.moveTo((160 - 250) / 100, (300 - 85) / 100)
    p1.lineTo((195 - 250) / 100, (300 - 85) / 100)
    p1.lineTo((195 - 250) / 100, (300 - 505) / 100)
    p1.lineTo((160 - 250) / 100, (300 - 535) / 100)
    p1.closePath()

    // 2. Middle vertical bar
    const p2 = new THREE.Shape()
    p2.moveTo((240 - 250) / 100, (300 - 95) / 100)
    p2.lineTo((275 - 250) / 100, (300 - 95) / 100)
    p2.lineTo((275 - 250) / 100, (300 - 420) / 100)
    p2.lineTo((240 - 250) / 100, (300 - 470) / 100)
    p2.closePath()

    // 3. Horizontal crossbar with curved wing
    const p3 = new THREE.Shape()
    p3.moveTo((115 - 250) / 100, (300 - 265) / 100)
    p3.bezierCurveTo(
      (105 - 250) / 100, (300 - 265) / 100,
      (105 - 250) / 100, (300 - 240) / 100,
      (120 - 250) / 100, (300 - 240) / 100
    )
    p3.lineTo((335 - 250) / 100, (300 - 240) / 100)
    p3.lineTo((335 - 250) / 100, (300 - 272) / 100)
    p3.lineTo((120 - 250) / 100, (300 - 272) / 100)
    p3.bezierCurveTo(
      (110 - 250) / 100, (300 - 272) / 100,
      (108 - 250) / 100, (300 - 268) / 100,
      (115 - 250) / 100, (300 - 265) / 100
    )
    p3.closePath()

    // 4. Right crescent arch (A)
    const p4 = new THREE.Shape()
    p4.moveTo((240 - 250) / 100, (300 - 95) / 100)
    p4.bezierCurveTo(
      (335 - 250) / 100, (300 - 95) / 100,
      (405 - 250) / 100, (300 - 160) / 100,
      (405 - 250) / 100, (300 - 265) / 100
    )
    p4.bezierCurveTo(
      (405 - 250) / 100, (300 - 345) / 100,
      (375 - 250) / 100, (300 - 395) / 100,
      (370 - 250) / 100, (300 - 415) / 100
    )
    p4.bezierCurveTo(
      (365 - 250) / 100, (300 - 390) / 100,
      (370 - 250) / 100, (300 - 345) / 100,
      (370 - 250) / 100, (300 - 265) / 100
    )
    p4.bezierCurveTo(
      (370 - 250) / 100, (300 - 185) / 100,
      (320 - 250) / 100, (300 - 132) / 100,
      (240 - 250) / 100, (300 - 132) / 100
    )
    p4.closePath()

    return [p1, p2, p3, p4]
  }, [])
}

export default function HALogo3DMesh({
  scale = 1,
  depth = 0.25,
  bevelThickness = 0.03,
  bevelSize = 0.03,
  color = '#6e0f1f',
  emissive = '#3d0812',
  roughness = 0.35,
  metalness = 0.35,
  animated = true,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) {
  const shapes = useHALogoShapes()
  const groupRef = useRef()

  const extrudeSettings = useMemo(() => ({
    depth,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize,
    bevelThickness
  }), [depth, bevelThickness, bevelSize])

  useFrame((state) => {
    if (groupRef.current && animated) {
      const t = state.clock.elapsedTime
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.5) * 0.12
      groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.04
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {shapes.map((shape, idx) => (
        <mesh key={idx} castShadow receiveShadow>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.35}
            roughness={roughness}
            metalness={metalness}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}

      {/* Soft burgundy rim light from inside the mark */}
      <pointLight color="#8e1b31" intensity={4} distance={6} decay={2} position={[0, 0, depth + 0.4]} />
    </group>
  )
}
