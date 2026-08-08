import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import HALogo3DMesh from './HALogoGeometry'
import Particles from './Particles'

function Interactive3DLogo() {
  const containerRef = useRef()

  useFrame((state) => {
    if (containerRef.current) {
      // Subtle mouse tracking tilt
      const mouseX = state.pointer.x * 0.4
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
        color="#8A1E03"
        emissive="#4d0c00"
        roughness={0.25}
        metalness={0.5}
        animated={true}
      />
    </group>
  )
}

export default function Logo3D({ height = '450px' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Lights */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
        <pointLight position={[-3, 2, 3]} color="#B83A00" intensity={2} distance={12} />
        <pointLight position={[3, -2, 2]} color="#ff6a00" intensity={1.5} distance={10} />
        <spotLight position={[0, 6, 2]} angle={0.5} penumbra={0.9} intensity={2} color="#ff3300" />

        <Interactive3DLogo />

        {/* Ambient atmospheric particle sparkle */}
        <Particles count={90} color="#B83A00" spread={8} size={0.015} />
        <Particles count={40} color="#ffffff" spread={10} size={0.008} />
      </Canvas>
    </div>
  )
}
