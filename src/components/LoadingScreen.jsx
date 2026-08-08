import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ---- Floating Particles in Loading ---- */
function LoadingParticles({ count = 40 }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05
      mesh.current.rotation.x = state.clock.elapsedTime * 0.03
    }
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
        size={0.02}
        color="#B83A00"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ---- Rotating Tennis Ball in Loading ---- */
function LoadingBall() {
  const mesh = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.5
      mesh.current.rotation.y = t * 0.8
      mesh.current.scale.setScalar(0.8 + Math.sin(t * 2) * 0.05)
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.2 + Math.sin(t * 2) * 0.1)
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 3) * 0.05
    }
  })

  return (
    <group>
      {/* Tennis ball */}
      <mesh ref={mesh}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#c8cc3c"
          roughness={0.8}
          metalness={0.1}
          emissive="#4a4c00"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Seam lines */}
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[0.41, 0.008, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 6]}>
        <torusGeometry args={[0.41, 0.008, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#B83A00" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

/* ---- Loading 3D Scene ---- */
function LoadingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color="#B83A00" />
      <pointLight position={[-2, -1, 1]} intensity={0.5} color="#ffffff" />
      <LoadingBall />
      <LoadingParticles />
    </Canvas>
  )
}

/* ---- Main Loading Screen Component ---- */
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const duration = 2500
    const interval = 30
    let current = 0
    const step = (100 / duration) * interval

    const timer = setInterval(() => {
      current += step + Math.random() * step * 0.5
      if (current >= 100) {
        current = 100
        clearInterval(timer)
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 800)
        }, 400)
      }
      setProgress(current)
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`} role="status" aria-label="Loading">
      <div style={{ position: 'absolute', inset: 0 }}>
        <LoadingScene />
      </div>
      <div className="loading-content">
        <img
          src="/ha-logo.png"
          alt="HA Logo"
          className="loading-logo"
        />
        <div className="loading-name">HANIF ABDULLAH</div>
        <div className="loading-tagline">COMING SOON</div>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}
