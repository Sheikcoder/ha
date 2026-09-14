import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import HALogo3DMesh from './HALogoGeometry'
import TennisBall from './TennisBall'
import { useVisibleFrameloop, lowPower } from '../perf'

/* ------------------------------------------------------------
   Small 3D piece for every inner-page header: the HA mark with a
   tennis ball orbiting it on a silver ring. Transparent canvas,
   mouse parallax, very light on the GPU.
   ------------------------------------------------------------ */

function Env() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = tex
    if ('environmentIntensity' in scene) scene.environmentIntensity = 0.7
    pmrem.dispose()
    return () => { scene.environment = null; tex.dispose() }
  }, [gl, scene])
  return null
}

function Orbit({ variant = 0 }) {
  const group = useRef()
  const ball = useRef()
  const ring = useRef()
  const trail = useRef([])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime + variant * 2.1
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.5 + Math.sin(t * 0.25) * 0.15, 0.04)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.3, 0.04)
    }
    if (ball.current) {
      const a = t * 1.1
      const R = 2.3
      ball.current.position.set(Math.cos(a) * R, Math.sin(a * 2) * 0.35, Math.sin(a) * R)
      ball.current.rotation.x += delta * 6
      ball.current.rotation.z += delta * 3
    }
    if (ring.current) ring.current.rotation.z = t * 0.12
  })

  return (
    <group ref={group} position={[1.3, -0.1, 0]}>
      <HALogo3DMesh
        scale={0.78}
        depth={0.3}
        bevelThickness={0.04}
        bevelSize={0.04}
        color="#7c1326"
        emissive="#3d0812"
        roughness={0.22}
        metalness={0.75}
        animated={true}
      />
      {/* orbit ring */}
      <group ref={ring} rotation={[Math.PI / 2 + 0.25, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.3, 0.012, 8, 160]} />
          <meshStandardMaterial color="#e6e7ea" metalness={1} roughness={0.15} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.75, 0.006, 8, 160]} />
          <meshStandardMaterial color="#e6e7ea" metalness={1} roughness={0.2} transparent opacity={0.5} />
        </mesh>
      </group>
      <group rotation={[0.25, 0, 0]}>
        <TennisBall ref={ball} radius={0.22} castShadow={false} />
      </group>
    </group>
  )
}

export default function HeaderScene({ variant = 0 }) {
  const hostRef = useRef(null)
  const frameloop = useVisibleFrameloop(hostRef)
  return (
    <div className="header-scene" aria-hidden="true" ref={hostRef}>
      <Canvas
        dpr={lowPower ? 1 : [1, 1.5]}
        frameloop={frameloop}
        camera={{ position: [0, 0.3, 9.8], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        style={{ background: 'transparent' }}
      >
        <Env />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-6, -2, 2]} intensity={0.9} color="#ffd9e0" />
        <pointLight position={[0, 2, 3]} intensity={18} distance={12} color="#ffffff" />
        <Orbit variant={variant} />
        <Sparkles count={lowPower ? 20 : 45} scale={[9, 5, 4]} size={1.8} speed={0.3} opacity={0.5} color="#ffffff" />
      </Canvas>
    </div>
  )
}
