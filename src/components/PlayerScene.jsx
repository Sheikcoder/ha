import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from './Particles'

/* ---- Lone Player on Court ---- */
function LonePlayer() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[0, -1.2, 3]}>
      {/* Torso */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.35, 0.55, 0.18]} />
        <meshStandardMaterial color="#1a1212" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#140e0e" roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#161010" roughness={0.8} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.25, 0.9, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.08, 0.45, 0.08]} />
        <meshStandardMaterial color="#1a1212" roughness={0.8} />
      </mesh>
      <mesh position={[0.25, 0.85, -0.05]} rotation={[0.2, 0, -0.2]}>
        <boxGeometry args={[0.08, 0.45, 0.08]} />
        <meshStandardMaterial color="#1a1212" roughness={0.8} />
      </mesh>
      {/* Racket */}
      <mesh position={[0.32, 0.5, -0.12]} rotation={[0.4, 0, -0.15]}>
        <cylinderGeometry args={[0.012, 0.016, 0.35, 8]} />
        <meshStandardMaterial color="#ff4500" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.37, 0.22, -0.2]} rotation={[0.4, 0, -0.15]}>
        <torusGeometry args={[0.11, 0.01, 8, 20]} />
        <meshStandardMaterial color="#ff5500" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.08, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color="#140e0e" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color="#140e0e" roughness={0.8} />
      </mesh>

      {/* Rim lighting */}
      <pointLight position={[0, 1.2, -1.5]} color="#ff4500" intensity={3.5} distance={6} decay={1.5} />
      <pointLight position={[-0.8, 0.8, -1]} color="#ffaa00" intensity={2} distance={5} decay={1.5} />
    </group>
  )
}

/* ---- Stadium Seats ---- */
function StadiumSeats() {
  const rows = 7
  const seats = []

  for (let r = 0; r < rows; r++) {
    const y = -0.5 + r * 0.45
    const z = -8 - r * 1.5
    const width = 18 + r * 3
    seats.push(
      <mesh key={`seat-${r}`} position={[0, y, z]}>
        <boxGeometry args={[width, 0.35, 1.3]} />
        <meshStandardMaterial color={`hsl(10, 30%, ${12 + r * 3}%)`} roughness={0.7} />
      </mesh>
    )
  }

  return <group>{seats}</group>
}

/* ---- Court Surface ---- */
function SimpleCourt() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#1e4427" roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, 0]}>
        <planeGeometry args={[0.06, 18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -9]}>
        <planeGeometry args={[7, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, 9]}>
        <planeGeometry args={[7, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function SlowOrbit({ radius = 6, height = 2, speed = 0.1, lookAt = [0, 0.5, 3] }) {
  const { camera } = useThree()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    camera.position.x = Math.sin(t) * radius
    camera.position.z = Math.cos(t) * radius - 2
    camera.position.y = height + Math.sin(t * 0.5) * 0.3
    camera.lookAt(lookAt[0], lookAt[1], lookAt[2])
  })

  return null
}

export default function PlayerScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 2, -6], fov: 50 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <color attach="background" args={['#180605']} />
      <fog attach="fog" args={['#180605', 10, 35]} />

      <ambientLight intensity={0.4} color="#ffd8cb" />
      <directionalLight position={[5, 10, -3]} intensity={1.2} color="#ffffff" />
      <spotLight position={[0, 14, -8]} angle={0.4} penumbra={0.9} intensity={2.5} color="#ff4500" />

      <SlowOrbit radius={5} height={1.8} speed={0.08} lookAt={[0, 0.6, 3]} />

      <SimpleCourt />
      <StadiumSeats />
      <LonePlayer />

      <Particles count={140} color="#ff5500" spread={18} size={0.015} />
      <Particles count={80} color="#ffffff" spread={25} size={0.008} />
    </Canvas>
  )
}
