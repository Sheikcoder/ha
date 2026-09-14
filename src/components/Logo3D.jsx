import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import HALogo3DMesh from './HALogoGeometry'
import { useTheme } from '../theme'

/* ---- Environment map without any network requests ---- */
function LogoEnvironment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = texture
    if ('environmentIntensity' in scene) scene.environmentIntensity = 0.6
    pmrem.dispose()
    return () => {
      scene.environment = null
      texture.dispose()
    }
  }, [gl, scene])
  return null
}

function InteractiveLogo({ dark }) {
  const containerRef = useRef()

  useFrame((state) => {
    if (containerRef.current) {
      const mouseX = state.pointer.x * 0.45
      const mouseY = state.pointer.y * 0.3
      containerRef.current.rotation.y = THREE.MathUtils.lerp(containerRef.current.rotation.y, mouseX, 0.05)
      containerRef.current.rotation.x = THREE.MathUtils.lerp(containerRef.current.rotation.x, -mouseY, 0.05)
    }
  })

  return (
    <group ref={containerRef}>
      <HALogo3DMesh
        scale={0.95}
        depth={0.3}
        bevelThickness={0.04}
        bevelSize={0.04}
        color="#6e0f1f"
        emissive="#3d0812"
        roughness={0.25}
        metalness={0.7}
        animated={true}
      />
      {/* Silver halo ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]} position={[0, -0.2, -0.4]}>
        <torusGeometry args={[2.4, 0.012, 8, 128]} />
        <meshStandardMaterial color={dark ? '#c9cbd1' : '#6e0f1f'} metalness={dark ? 1 : 0.6} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function Logo3D({ height = '420px', transparent = true }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return (
    <div className="logo3d" style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        key={theme}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{ antialias: true, alpha: transparent, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
        style={{ background: 'transparent' }}
      >
        {!transparent && <color attach="background" args={['#0b0b0d']} />}
        <LogoEnvironment />
        <ambientLight intensity={dark ? 0.3 : 0.7} />
        <directionalLight position={[4, 6, 5]} intensity={dark ? 2.4 : 3} color="#ffffff" />
        <directionalLight position={[-5, -2, 3]} intensity={0.8} color="#c9cbd1" />
        <pointLight position={[-3, 2, 3]} color="#8e1b31" intensity={dark ? 30 : 12} distance={14} />
        <InteractiveLogo dark={dark} />
      </Canvas>
    </div>
  )
}
