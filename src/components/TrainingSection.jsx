import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from './Particles'

/* ---- Training Equipment Close-ups ---- */
function TrainingBall({ position }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.8
      ref.current.rotation.z = state.clock.elapsedTime * 0.5
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
    }
  })

  return (
    <mesh ref={ref} position={position} castShadow>
      <sphereGeometry args={[0.15, 24, 24]} />
      <meshStandardMaterial color="#c8cc3c" roughness={0.85} metalness={0.05} emissive="#3a3c00" emissiveIntensity={0.1} />
    </mesh>
  )
}

/* ---- Court Surface Detail ---- */
function CourtDetail() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1a2818" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <planeGeometry args={[0.04, 10]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, -0.49, 0]}>
        <planeGeometry args={[0.04, 10]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.49, 0]}>
        <planeGeometry args={[0.04, 10]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 3]}>
        <planeGeometry args={[4, 0.04]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

/* ---- Shoes on Court ---- */
function Shoes() {
  return (
    <group position={[0.5, -0.45, 1]}>
      {/* Left shoe */}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.25]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Right shoe */}
      <mesh position={[0.12, 0, 0.08]} rotation={[0, -0.05, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.25]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Shoe sole accent */}
      <mesh position={[-0.12, -0.025, 0]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={[0.13, 0.015, 0.26]} />
        <meshStandardMaterial color="#8B2500" roughness={0.6} />
      </mesh>
      <mesh position={[0.12, -0.025, 0.08]} rotation={[0, -0.05, 0]}>
        <boxGeometry args={[0.13, 0.015, 0.26]} />
        <meshStandardMaterial color="#8B2500" roughness={0.6} />
      </mesh>
    </group>
  )
}

/* ---- Racket on Ground ---- */
function RacketOnGround() {
  return (
    <group position={[-0.8, -0.42, 0.5]} rotation={[- Math.PI / 2, 0, 0.3]}>
      {/* Handle */}
      <mesh>
        <cylinderGeometry args={[0.018, 0.022, 0.4, 8]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Grip */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.022, 0.025, 0.15, 8]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[0.13, 0.012, 8, 24]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Strings */}
      <mesh position={[0, 0.32, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshBasicMaterial color="#555" transparent opacity={0.12} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ---- Camera pan low ---- */
function LowCameraPan() {
  const { camera } = useThree()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.x = Math.sin(t * 0.15) * 2
    camera.position.y = 0.3 + Math.sin(t * 0.1) * 0.15
    camera.position.z = Math.cos(t * 0.15) * 2 + 1
    camera.lookAt(0, -0.2, 0.5)
  })
  return null
}


export default function TrainingScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.3, 2], fov: 50 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.8 }}
    >
      <color attach="background" args={['#040202']} />
      <fog attach="fog" args={['#040202', 5, 15]} />

      <ambientLight intensity={0.1} />
      <spotLight position={[2, 5, 3]} angle={0.4} penumbra={0.8} intensity={0.8} color="#fff5e0" castShadow />
      <pointLight position={[-1, 1, 2]} color="#B83A00" intensity={1} distance={8} />

      <LowCameraPan />
      <CourtDetail />
      <TrainingBall position={[0.3, -0.3, 0]} />
      <TrainingBall position={[-0.5, -0.3, -0.5]} />
      <TrainingBall position={[0.8, -0.3, -0.8]} />
      <Shoes />
      <RacketOnGround />
      <Particles count={40} color="#B83A00" spread={6} size={0.01} />
    </Canvas>
  )
}
