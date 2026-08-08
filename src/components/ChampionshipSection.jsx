import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from './Particles'
import HALogo3DMesh from './HALogoGeometry'

/* ---- Massive Stadium ---- */
function Stadium() {
  const tiers = useMemo(() => {
    const result = []
    for (let tier = 0; tier < 8; tier++) {
      const radius = 15 + tier * 3
      const height = -1 + tier * 1.2
      const segments = 32

      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        result.push({
          position: [x, height, z],
          rotation: [0, -angle + Math.PI / 2, 0],
          width: (Math.PI * 2 * radius) / segments * 0.95,
          height: 1.0 + tier * 0.1,
          tier
        })
      }
    }
    return result
  }, [])

  return (
    <group>
      {tiers.map((seat, i) => (
        <mesh key={i} position={seat.position} rotation={seat.rotation}>
          <boxGeometry args={[seat.width, seat.height, 2]} />
          <meshStandardMaterial
            color={`hsl(0, 0%, ${4 + seat.tier * 1.5}%)`}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ---- Stadium Floodlights ---- */
function StadiumFloodlights() {
  const lights = useMemo(() => {
    const result = []
    const count = 12
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 35
      result.push({
        pos: [Math.cos(angle) * radius, 15 + Math.random() * 5, Math.sin(angle) * radius],
        intensity: 0.2 + Math.random() * 0.2
      })
    }
    return result
  }, [])

  return (
    <group>
      {lights.map((light, i) => (
        <group key={i}>
          <mesh position={light.pos}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#fff5e0" transparent opacity={0.15} />
          </mesh>
          <pointLight
            position={light.pos}
            color="#fff5e0"
            intensity={light.intensity}
            distance={50}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}

/* ---- Tiny Player Walking Toward Court ---- */
function TinyPlayer() {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = 3 - state.clock.elapsedTime * 0.05
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02
    }
  })

  return (
    <group ref={ref} position={[0, -1.4, 3]} scale={0.6}>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.3, 0.45, 0.15]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      <mesh position={[-0.06, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.45, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      <mesh position={[0.06, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.45, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      <mesh position={[-0.2, 0.7, 0]}>
        <boxGeometry args={[0.06, 0.35, 0.06]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>
      <mesh position={[0.2, 0.65, -0.03]} rotation={[0.15, 0, -0.15]}>
        <boxGeometry args={[0.06, 0.35, 0.06]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>
      <mesh position={[0.25, 0.35, -0.08]} rotation={[0.3, 0, -0.1]}>
        <cylinderGeometry args={[0.01, 0.013, 0.3, 6]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </mesh>

      <pointLight position={[0, 1, -1.5]} color="#8A1E03" intensity={2} distance={4} decay={2} />
    </group>
  )
}

/* ---- Court Surface ---- */
function ChampionshipCourt() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a2818" roughness={0.75} metalness={0.05} />
    </mesh>
  )
}

/* ---- Rising Camera ---- */
function RisingCamera() {
  const { camera } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const progress = Math.min(t * 0.03, 1)
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

    camera.position.y = THREE.MathUtils.lerp(0, 12, ease)
    camera.position.z = THREE.MathUtils.lerp(-4, -15, ease)
    camera.position.x = Math.sin(t * 0.1) * 2

    camera.lookAt(0, -1, 3)
  })

  return null
}

export default function ChampionshipScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, -4], fov: 60 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.6 }}
    >
      <color attach="background" args={['#020101']} />
      <fog attach="fog" args={['#020101', 20, 60]} />

      <ambientLight intensity={0.06} />
      <directionalLight position={[0, 20, -10]} intensity={0.4} color="#fff5e0" />

      <RisingCamera />
      <ChampionshipCourt />
      <Stadium />
      <StadiumFloodlights />

      {/* Extruded 3D Giant HA Logo geometry hovering above stadium */}
      <HALogo3DMesh
        scale={4.5}
        depth={0.6}
        bevelThickness={0.08}
        bevelSize={0.08}
        color="#8A1E03"
        emissive="#5C1700"
        roughness={0.25}
        metalness={0.4}
        position={[0, 18, 22]}
        rotation={[0, 0, 0]}
      />

      <TinyPlayer />

      <Particles count={220} color="#8A1E03" spread={30} size={0.012} />
      <Particles count={120} color="#ffffff" spread={40} size={0.005} />
      <Particles count={70} color="#ff6a00" spread={25} size={0.009} />
    </Canvas>
  )
}
