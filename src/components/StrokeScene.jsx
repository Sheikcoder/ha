import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from './Particles'

/* ---- Player performing a stroke (side/back view) ---- */
function StrokingPlayer() {
  const groupRef = useRef()
  const racketArmRef = useRef()
  const racketRef = useRef()
  const ballRef = useRef()
  const trailRef = useRef()
  const impactParticlesRef = useRef()
  const hasHit = useRef(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const swingCycle = (t % 4) / 4 // 0 to 1 over 4 seconds

    if (groupRef.current) {
      groupRef.current.rotation.y = -0.5 + Math.sin(t * 0.1) * 0.05 // Angled - showing back/side
    }

    // Swing animation
    if (racketArmRef.current) {
      if (swingCycle < 0.3) {
        // Wind up
        const p = swingCycle / 0.3
        racketArmRef.current.rotation.z = THREE.MathUtils.lerp(-0.3, -1.2, p)
        racketArmRef.current.rotation.x = THREE.MathUtils.lerp(0.2, 0.8, p)
        hasHit.current = false
      } else if (swingCycle < 0.5) {
        // Strike
        const p = (swingCycle - 0.3) / 0.2
        const ease = 1 - Math.pow(1 - p, 3)
        racketArmRef.current.rotation.z = THREE.MathUtils.lerp(-1.2, 0.5, ease)
        racketArmRef.current.rotation.x = THREE.MathUtils.lerp(0.8, -0.3, ease)

        if (p > 0.6 && !hasHit.current) {
          hasHit.current = true
        }
      } else {
        // Follow through & reset
        const p = (swingCycle - 0.5) / 0.5
        racketArmRef.current.rotation.z = THREE.MathUtils.lerp(0.5, -0.3, p)
        racketArmRef.current.rotation.x = THREE.MathUtils.lerp(-0.3, 0.2, p)
      }
    }

    // Ball animation
    if (ballRef.current) {
      if (swingCycle < 0.4) {
        // Ball approaching
        const p = swingCycle / 0.4
        ballRef.current.position.set(
          THREE.MathUtils.lerp(3, 0.5, p),
          THREE.MathUtils.lerp(0.8, 0.5, p),
          THREE.MathUtils.lerp(-2, 0, p)
        )
        ballRef.current.visible = true
        ballRef.current.scale.setScalar(1)
      } else if (swingCycle < 0.5) {
        // Impact moment
        ballRef.current.position.set(0.5, 0.5, 0)
      } else {
        // Ball flying away
        const p = (swingCycle - 0.5) / 0.5
        ballRef.current.position.set(
          THREE.MathUtils.lerp(0.5, -8, p * p),
          THREE.MathUtils.lerp(0.5, 2, p),
          THREE.MathUtils.lerp(0, -5, p * p)
        )
        if (p > 0.8) ballRef.current.visible = false
      }
      ballRef.current.rotation.x = t * 5
      ballRef.current.rotation.y = t * 3
    }

    // Impact particles
    if (impactParticlesRef.current) {
      const showImpact = swingCycle > 0.42 && swingCycle < 0.65
      impactParticlesRef.current.visible = showImpact
      if (showImpact) {
        const p = (swingCycle - 0.42) / 0.23
        impactParticlesRef.current.scale.setScalar(1 + p * 3)
        impactParticlesRef.current.children.forEach(child => {
          if (child.material) {
            child.material.opacity = (1 - p) * 0.8
          }
        })
      }
    }

    // Light trail
    if (trailRef.current) {
      const showTrail = swingCycle > 0.35 && swingCycle < 0.6
      trailRef.current.visible = showTrail
      if (showTrail) {
        const p = (swingCycle - 0.35) / 0.25
        trailRef.current.material.opacity = (1 - p) * 0.4
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Body - torso */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.12, 8]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.28, 1, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.09, 0.5, 0.09]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>
      {/* Right arm + racket (animated) */}
      <group ref={racketArmRef} position={[0.28, 1.15, 0]} rotation={[0.2, 0, -0.3]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.09, 0.35, 0.09]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
        </mesh>
        {/* Forearm + racket */}
        <group position={[0, -0.35, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
          </mesh>
          {/* Racket handle */}
          <mesh ref={racketRef} position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.014, 0.018, 0.35, 8]} />
            <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Racket head */}
          <mesh position={[0, -0.55, 0]}>
            <torusGeometry args={[0.12, 0.01, 8, 24]} />
            <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <circleGeometry args={[0.11, 16]} />
            <meshBasicMaterial color="#555" transparent opacity={0.1} wireframe side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
      {/* Legs */}
      <mesh position={[-0.09, 0.3, 0.02]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[0.11, 0.6, 0.11]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      <mesh position={[0.09, 0.28, -0.03]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.11, 0.6, 0.11]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.09, -0.02, 0.05]}>
        <boxGeometry args={[0.1, 0.05, 0.18]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.8} />
      </mesh>
      <mesh position={[0.09, -0.02, 0.02]}>
        <boxGeometry args={[0.1, 0.05, 0.18]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.8} />
      </mesh>

      {/* Rim lighting */}
      <pointLight position={[0, 1.3, -1.5]} color="#B83A00" intensity={3} distance={5} decay={2} />
      <pointLight position={[1, 0.8, -1]} color="#ff6a00" intensity={1} distance={4} decay={2} />

      {/* Tennis ball */}
      <mesh ref={ballRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#c8cc3c" roughness={0.85} emissive="#3a3c00" emissiveIntensity={0.2} />
      </mesh>

      {/* Light trail arc */}
      <mesh ref={trailRef} position={[0.3, 0.6, 0]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.8, 0.02, 4, 32, Math.PI * 0.6]} />
        <meshBasicMaterial color="#B83A00" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Impact particles */}
      <group ref={impactParticlesRef} position={[0.5, 0.5, 0]} visible={false}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.15, Math.sin(angle) * 0.15, 0]}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshBasicMaterial color="#ff8c00" transparent opacity={0.8} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

/* ---- Court ---- */
function StrokeCourt() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a2818" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]}>
        <planeGeometry args={[0.04, 15]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

function StrokeCamera() {
  const { camera } = useThree()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.x = -2 + Math.sin(t * 0.15) * 0.5
    camera.position.y = 0.8 + Math.sin(t * 0.1) * 0.2
    camera.position.z = 3 + Math.sin(t * 0.12) * 0.3
    camera.lookAt(0, 0.3, 0)
  })
  return null
}

export default function StrokeScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [-2, 0.8, 3], fov: 50 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.7 }}
    >
      <color attach="background" args={['#030101']} />
      <fog attach="fog" args={['#030101', 8, 20]} />

      <ambientLight intensity={0.06} />
      <spotLight position={[3, 8, 5]} angle={0.3} penumbra={0.8} intensity={0.6} color="#fff5e0" castShadow />
      <pointLight position={[-2, 3, -2]} color="#B83A00" intensity={1.5} distance={12} />

      <StrokeCamera />
      <StrokeCourt />
      <StrokingPlayer />
      <Particles count={60} color="#B83A00" spread={10} size={0.01} />
    </Canvas>
  )
}
