import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 200, color = '#B83A00', spread = 15, size = 0.02 }) {
  const mesh = useRef()

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = Math.random() * 0.003 + 0.001
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return [pos, vel]
  }, [count, spread])

  const sizes = useMemo(() => {
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * size + size * 0.5
    }
    return s
  }, [count, size])

  useFrame((state) => {
    if (!mesh.current) return
    const posArr = mesh.current.geometry.attributes.position.array
    const halfSpread = spread / 2

    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3]
      posArr[i * 3 + 1] += velocities[i * 3 + 1]
      posArr[i * 3 + 2] += velocities[i * 3 + 2]

      // Wrap around
      if (posArr[i * 3 + 1] > halfSpread) {
        posArr[i * 3 + 1] = -halfSpread
        posArr[i * 3] = (Math.random() - 0.5) * spread
        posArr[i * 3 + 2] = (Math.random() - 0.5) * spread
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
    mesh.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
