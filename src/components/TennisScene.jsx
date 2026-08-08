import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import TennisBall from './TennisBall'
import Particles from './Particles'
import HALogo3DMesh from './HALogoGeometry'

/* ---- Tennis Court Ground (Vivid Tennis Green & Wet Reflections) ---- */
function Court() {
  return (
    <group>
      {/* Main court surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[40, 60]} />
        <meshStandardMaterial
          color="#1e4427"
          roughness={0.5}
          metalness={0.2}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Out of bounds court border area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.51, 0]}>
        <planeGeometry args={[60, 80]} />
        <meshStandardMaterial
          color="#1a2030"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Crisp White Court Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 0]}>
        <planeGeometry args={[0.08, 20]} />
        <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, -10]}>
        <planeGeometry args={[8, 0.08]} />
        <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 10]}>
        <planeGeometry args={[8, 0.08]} />
        <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, -1.48, 0]}>
        <planeGeometry args={[0.08, 20]} />
        <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, -1.48, 0]}>
        <planeGeometry args={[0.08, 20]} />
        <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, -3.5]}>
        <planeGeometry args={[6.4, 0.06]} />
        <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 3.5]}>
        <planeGeometry args={[6.4, 0.06]} />
        <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
      </mesh>

      {/* Net with white tape line */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[9, 1, 0.04]} />
        <meshStandardMaterial color="#2a2a2a" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[9.1, 0.06, 0.06]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[-4.5, -0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[4.5, -0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glossy wet court reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.47, 0]}>
        <planeGeometry args={[40, 60]} />
        <meshStandardMaterial
          color="#2a0804"
          transparent
          opacity={0.35}
          metalness={0.9}
          roughness={0.05}
        />
      </mesh>
    </group>
  )
}

/* ---- Bright Stadium Floodlights & Beams ---- */
function StadiumLights() {
  const lightsData = useMemo(() => [
    { pos: [-16, 15, -20], intensity: 2.0 },
    { pos: [16, 15, -20], intensity: 2.0 },
    { pos: [-16, 15, 20], intensity: 1.5 },
    { pos: [16, 15, 20], intensity: 1.5 },
    { pos: [0, 18, -15], intensity: 2.5 },
  ], [])

  return (
    <group>
      {lightsData.map((light, i) => (
        <group key={i} position={light.pos}>
          {/* Light pole */}
          <mesh>
            <cylinderGeometry args={[0.15, 0.22, 16, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Bright light fixture head */}
          <mesh position={[0, 7.5, 0]}>
            <boxGeometry args={[2.5, 0.6, 1.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Volumetric light flare halo */}
          <mesh position={[0, 7, 0]}>
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshBasicMaterial color="#fff5e0" transparent opacity={0.3} />
          </mesh>
          <pointLight color="#fff5e0" intensity={light.intensity} distance={55} decay={1.5} />
        </group>
      ))}
    </group>
  )
}

/* ---- Player Silhouette with Vibrant Rim Lighting ---- */
function PlayerSilhouette({ position = [0, -1.5, 5] }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.45, 0.7, 0.22]} />
        <meshStandardMaterial color="#1a1212" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#140e0e" roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.15, 8]} />
        <meshStandardMaterial color="#161010" roughness={0.8} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.32, 1.1, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color="#1a1212" roughness={0.8} />
      </mesh>
      <mesh position={[0.32, 1.15, -0.05]} rotation={[0.3, 0, -0.3]}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color="#1a1212" roughness={0.8} />
      </mesh>
      {/* Racket */}
      <mesh position={[0.42, 0.75, -0.15]} rotation={[0.5, 0, -0.2]}>
        <cylinderGeometry args={[0.015, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#e83a00" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.48, 0.45, -0.25]} rotation={[0.5, 0, -0.2]}>
        <torusGeometry args={[0.14, 0.012, 8, 24]} />
        <meshStandardMaterial color="#ff5500" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.48, 0.45, -0.25]} rotation={[0.5, 0, -0.2]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} side={THREE.DoubleSide} wireframe />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, 0.35, 0]}>
        <boxGeometry args={[0.13, 0.7, 0.13]} />
        <meshStandardMaterial color="#140e0e" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.35, 0]}>
        <boxGeometry args={[0.13, 0.7, 0.13]} />
        <meshStandardMaterial color="#140e0e" roughness={0.8} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.1, -0.02, 0.03]}>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
        <meshStandardMaterial color="#2a0800" roughness={0.5} />
      </mesh>
      <mesh position={[0.1, -0.02, 0.03]}>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
        <meshStandardMaterial color="#2a0800" roughness={0.5} />
      </mesh>

      {/* Vibrant Red/Orange Rim lights from behind */}
      <pointLight position={[0, 1.5, -1]} color="#ff3300" intensity={4} distance={6} decay={1.5} />
      <pointLight position={[0.6, 1, -0.8]} color="#ff7700" intensity={2} distance={5} decay={1.5} />
    </group>
  )
}

/* ---- Atmosphere & Fog ---- */
function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={['#1c0705', 10, 45]} />
      <color attach="background" args={['#140504']} />
    </>
  )
}

/* ---- Camera Animation ---- */
function CameraRig() {
  const { camera } = useThree()
  const initialPos = useRef({ x: 0, y: 0.5, z: -3 })
  const targetPos = useRef({ x: 0, y: 1.5, z: -5 })
  const progress = useRef(0)

  useFrame((state, delta) => {
    progress.current = Math.min(progress.current + delta * 0.08, 1)
    const t = progress.current
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    camera.position.x = THREE.MathUtils.lerp(initialPos.current.x, targetPos.current.x, ease) + Math.sin(state.clock.elapsedTime * 0.25) * 0.15
    camera.position.y = THREE.MathUtils.lerp(initialPos.current.y, targetPos.current.y, ease) + Math.sin(state.clock.elapsedTime * 0.2) * 0.08
    camera.position.z = THREE.MathUtils.lerp(initialPos.current.z, targetPos.current.z, ease)

    camera.lookAt(0, 0.8, 5)
  })

  return null
}

export default function TennisScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, -3], fov: 55, near: 0.1, far: 100 }}
      style={{ background: '#140504' }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.25
      }}
    >
      <Atmosphere />
      <CameraRig />

      {/* Bright Lights */}
      <ambientLight intensity={0.45} color="#ffe5d6" />
      <directionalLight position={[6, 12, -4]} intensity={1.5} color="#ffffff" castShadow />
      <spotLight position={[0, 12, 2]} angle={0.6} penumbra={0.8} intensity={3.0} color="#ff4500" castShadow />
      <pointLight position={[0, 4, 8]} color="#ff3300" intensity={3.5} distance={25} />
      <pointLight position={[-6, 3, 3]} color="#ff7700" intensity={2.0} distance={20} />

      <Court />
      <StadiumLights />

      {/* Bright 3D Extruded Official HA Logo Geometry behind player */}
      <HALogo3DMesh
        scale={1.9}
        depth={0.45}
        bevelThickness={0.06}
        bevelSize={0.06}
        color="#B83A00"
        emissive="#7A1F00"
        roughness={0.2}
        metalness={0.6}
        position={[0, 3.8, 9]}
        rotation={[0, 0, 0]}
      />

      <PlayerSilhouette position={[0, -1.5, 5]} />
      <TennisBall position={[-0.5, 0, 2]} scale={0.85} />

      {/* Atmospheric Particles */}
      <Particles count={220} color="#ff5500" spread={25} size={0.02} />
      <Particles count={110} color="#ffffff" spread={30} size={0.01} />
      <Particles count={60} color="#ffaa00" spread={20} size={0.015} />
    </Canvas>
  )
}
