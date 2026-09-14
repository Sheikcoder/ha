import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import TennisBall from './TennisBall'
import { BRAND } from '../content/site'
import HAMark from './HAMark'
import { useTheme } from '../theme'

/* ---- Spinning ball with a silver halo ---- */
function LoadingBall() {
  const ball = useRef()
  const halo = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ball.current) {
      ball.current.rotation.x = t * 1.4
      ball.current.rotation.y = t * 0.9
      ball.current.position.y = Math.sin(t * 2) * 0.05
    }
    if (halo.current) {
      halo.current.rotation.z = -t * 0.35
      halo.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.6) * 0.25
    }
  })

  return (
    <group position={[0, 0.55, 0]}>
      <TennisBall ref={ball} radius={0.42} castShadow={false} />
      <mesh ref={halo}>
        <torusGeometry args={[0.72, 0.006, 8, 96]} />
        <meshBasicMaterial color="#8e1b31" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.003, 8, 96]} />
        <meshBasicMaterial color="#8e1b31" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function LoadingScene({ theme }) {
  const dark = theme === 'dark'
  return (
    <Canvas
      camera={{ position: [0, 0.2, 3], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={dark ? 0.35 : 0.9} />
      <directionalLight position={[3, 4, 3]} intensity={dark ? 2.2 : 2.8} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={dark ? 1.6 : 4} color="#8e1b31" distance={10} />
      <LoadingBall />
    </Canvas>
  )
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const duration = 2200
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
          setTimeout(() => onComplete && onComplete(), 800)
        }, 350)
      }
      setProgress(current)
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`} role="status" aria-label="Loading">
      <div className="loading-scene">
        <LoadingScene theme={theme} />
      </div>
      <div className="loading-content">
        <HAMark className="loading-logo" />
        <div className="loading-name">{BRAND.name}</div>
        <div className="loading-tagline">{BRAND.tagline}</div>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="loading-count" aria-hidden="true">{String(Math.round(Math.min(progress, 100))).padStart(3, '0')}</div>
        <div className="loading-phrase">{BRAND.phrase}</div>
      </div>
    </div>
  )
}
