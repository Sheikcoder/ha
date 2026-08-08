import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function TennisBall({ position = [0, 0, 0], scale = 1, animated = true }) {
  const groupRef = useRef()
  const glowRef = useRef()
  const trailRef = useRef()

  // Trail points
  const trailPositions = useMemo(() => {
    const pos = new Float32Array(30 * 3)
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!groupRef.current || !animated) return

    groupRef.current.rotation.x = t * 1.2
    groupRef.current.rotation.z = t * 0.8

    // Subtle floating
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.1

    if (glowRef.current) {
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 3) * 0.05
    }
  })

  return (
    <group position={position} scale={scale}>
      <group ref={groupRef}>
        {/* Main tennis ball */}
        <mesh castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#c8cc3c"
            roughness={0.85}
            metalness={0.05}
            emissive="#3a3c00"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Seam line 1 */}
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
          <torusGeometry args={[0.305, 0.006, 8, 64]} />
          <meshStandardMaterial 
            color="#e8e8e0" 
            roughness={0.6} 
            transparent 
            opacity={0.5} 
          />
        </mesh>

        {/* Seam line 2 */}
        <mesh rotation={[-Math.PI / 4, Math.PI / 3, -Math.PI / 6]}>
          <torusGeometry args={[0.305, 0.006, 8, 64]} />
          <meshStandardMaterial 
            color="#e8e8e0" 
            roughness={0.6} 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      </group>

      {/* Orange glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#B83A00"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Point light from ball */}
      <pointLight
        color="#B83A00"
        intensity={0.5}
        distance={3}
        decay={2}
      />
    </group>
  )
}
