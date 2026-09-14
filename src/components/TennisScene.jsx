import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import TennisBall from './TennisBall'
import HALogo3DMesh from './HALogoGeometry'
import { COURT, createRally, stepRally, predictPath, speedKmh, serve } from './rallyPhysics'
import { trackerState } from './trackerState'
import { audio } from '../audio'
import { lowPower, reducedMotion as prefersReducedMotion } from '../perf'

/* ============================================================
   HERO — 3D BALL TRACKER
   Broadcast-style court view with a physically simulated rally,
   a glowing comet trail, predicted-path dots, bounce impact marks
   and a screen-space tracking reticle (rendered by Hero.jsx).
   ============================================================ */

/* Two arena looks — "dark" (charcoal night session) and "wine" (white day session) */
export const PALETTES = {
  dark: {
    burgundy: '#6e0f1f',
    burgundyDeep: '#3d0812',
    burgundyLight: '#8e1b31',
    court: '#4a0b19',
    surround: '#1c1c20',
    stand: (i) => `hsl(240, 4%, ${9 + (i % 9) * 1.1}%)`,
    silver: '#c9cbd1',
    lines: '#f2f2f4',
    bg: '#131316',
    fog: [30, 80],
    hemi: ['#34343c', '#08080a', 0.9],
    ambient: 0.3,
    key: 2.1,
    envIntensity: 0.4,
    trailGlow: '#b8314d',
    exposure: 1.15
  },
  wine: {
    burgundy: '#6e0f1f',
    burgundyDeep: '#5a0c1c',
    burgundyLight: '#8e1b31',
    court: '#6a1024',
    surround: '#d6d7dc',
    stand: (i) => `hsl(220, 6%, ${74 + (i % 9) * 1.5}%)`,
    silver: '#8a8c94',
    lines: '#ffffff',
    bg: '#eef0f3',
    fog: [40, 110],
    hemi: ['#ffffff', '#c9cbd1', 1.1],
    ambient: 0.6,
    key: 2.6,
    envIntensity: 0.8,
    trailGlow: '#8e1b31',
    exposure: 1.05
  }
}

const BALL_RADIUS = 0.19
const TIME_SCALE = 0.72   // slight slow-motion for a cinematic feel
const TRAIL_LENGTH = 64


/* ------------------------------------------------------------ helpers */

function makeGlowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.12)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeNetTexture() {
  const w = 256, h = 64
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(220,222,228,0.9)'
  ctx.lineWidth = 1
  for (let x = 0; x <= w; x += 8) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  for (let y = 0; y <= h; y += 8) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 1)
  return tex
}

const ribbonVertex = /* glsl */`
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const ribbonFragment = /* glsl */`
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
  }
`

/* ------------------------------------------------------------ Court */

function CourtLines({ color = '#f2f2f4' }) {
  const lines = useMemo(() => {
    const L = COURT.halfLength, S = COURT.singlesHalfWidth, D = COURT.doublesHalfWidth, SL = COURT.serviceLine
    const w = 0.08
    const items = [
      // baselines
      { pos: [0, 0, L], size: [D * 2 + w, w] },
      { pos: [0, 0, -L], size: [D * 2 + w, w] },
      // doubles sidelines
      { pos: [D, 0, 0], size: [w, L * 2] },
      { pos: [-D, 0, 0], size: [w, L * 2] },
      // singles sidelines
      { pos: [S, 0, 0], size: [w, L * 2] },
      { pos: [-S, 0, 0], size: [w, L * 2] },
      // service lines
      { pos: [0, 0, SL], size: [S * 2, w] },
      { pos: [0, 0, -SL], size: [S * 2, w] },
      // centre service line
      { pos: [0, 0, 0], size: [w, SL * 2] },
      // centre marks
      { pos: [0, 0, L - 0.2], size: [w, 0.4] },
      { pos: [0, 0, -L + 0.2], size: [w, 0.4] }
    ]
    return items
  }, [])

  return (
    <group position={[0, 0.006, 0]}>
      {lines.map((l, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={l.pos}>
          <planeGeometry args={l.size} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Net() {
  const netTexture = useMemo(() => makeNetTexture(), [])
  const X = COURT.netPostX
  const H = 1.0
  return (
    <group>
      {/* Mesh */}
      <mesh position={[0, H / 2, 0]}>
        <planeGeometry args={[X * 2, H]} />
        <meshBasicMaterial map={netTexture} transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Top tape */}
      <mesh position={[0, H, 0]}>
        <boxGeometry args={[X * 2, 0.07, 0.04]} />
        <meshStandardMaterial color="#f4f4f6" roughness={0.5} />
      </mesh>
      {/* Centre strap */}
      <mesh position={[0, H / 2, 0.01]}>
        <boxGeometry args={[0.06, H, 0.02]} />
        <meshStandardMaterial color="#f4f4f6" roughness={0.6} />
      </mesh>
      {/* Posts */}
      {[X, -X].map((x) => (
        <mesh key={x} position={[x, H / 2 + 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, H + 0.1, 16]} />
          <meshStandardMaterial color="#c9cbd1" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

function Court({ P }) {
  const D = COURT.doublesHalfWidth, L = COURT.halfLength
  return (
    <group>
      {/* Surround — charcoal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[70, 90]} />
        <meshStandardMaterial color={P.surround} roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Playing surface — deep burgundy, lightly glossy so the trail reflects */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[D * 2 + 2.4, L * 2 + 4.0]} />
        <meshStandardMaterial color={P.burgundyDeep} roughness={0.38} metalness={0.2} envMapIntensity={0.7} />
      </mesh>

      {/* Inner court — slightly lighter burgundy to lift the lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <planeGeometry args={[D * 2, L * 2]} />
        <meshStandardMaterial color={P.court} roughness={0.4} metalness={0.18} envMapIntensity={0.7} />
      </mesh>

      <CourtLines color={P.lines} />
      <Net />
    </group>
  )
}

/* ------------------------------------------------------------ Stadium */

function Stadium({ P }) {
  const standMaterials = useMemo(
    () => Array.from({ length: 9 }, (_, i) => new THREE.MeshStandardMaterial({ color: P.stand(i), roughness: 0.95 })),
    [P]
  )
  const tiers = useMemo(() => {
    const result = []
    const rows = 9
    for (let r = 0; r < rows; r++) {
      const y = 0.3 + r * 0.55
      const side = 16 + r * 1.7
      const end = 19 + r * 1.7
      result.push({ pos: [0, y, -end], size: [side * 2 + 1.7, 0.55, 1.7] })
      result.push({ pos: [0, y, end], size: [side * 2 + 1.7, 0.55, 1.7] })
      result.push({ pos: [-side, y, 0], size: [1.7, 0.55, end * 2 - 1.7] })
      result.push({ pos: [side, y, 0], size: [1.7, 0.55, end * 2 - 1.7] })
    }
    return result
  }, [])


  return (
    <group>
      {tiers.map((t, i) => (
        <mesh key={i} position={t.pos} material={standMaterials[i % 9]}>
          <boxGeometry args={t.size} />
        </mesh>
      ))}

    </group>
  )
}

/* ------------------------------------------------------------ Environment map (no network needed) */

function SceneEnvironment({ intensity = 0.35 }) {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const envScene = new RoomEnvironment()
    const texture = pmrem.fromScene(envScene, 0.04).texture
    scene.environment = texture
    if ('environmentIntensity' in scene) scene.environmentIntensity = intensity
    pmrem.dispose()
    return () => {
      scene.environment = null
      texture.dispose()
    }
  }, [gl, scene, intensity])
  return null
}

/* ------------------------------------------------------------ Rally: ball, trail, prediction, impacts */

function Rally({ P }) {
  const { camera } = useThree()
  const rally = useMemo(() => createRally(BALL_RADIUS), [])
  const ballRef = useRef()
  const ballGroupRef = useRef()
  const glowRef = useRef()
  const lightRef = useRef()

  const glowTexture = useMemo(() => makeGlowTexture(), [])

  /* --- Trail ribbons (inner bright core + outer soft glow) --- */
  const history = useRef([])   // ring of pooled THREE.Vector3
  const vectorPool = useMemo(() => Array.from({ length: TRAIL_LENGTH + 2 }, () => new THREE.Vector3()), [])
  const poolIndex = useRef(0)
  const makeRibbon = () => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(TRAIL_LENGTH * 2 * 3)
    const alphas = new Float32Array(TRAIL_LENGTH * 2)
    const indices = []
    for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3
      indices.push(a, b, c, b, d, c)
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
    geometry.setIndex(indices)
    geometry.setDrawRange(0, 0)
    return geometry
  }
  const coreGeometry = useMemo(makeRibbon, [])
  const glowGeometry = useMemo(makeRibbon, [])

  const coreMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: ribbonVertex,
    fragmentShader: ribbonFragment,
    uniforms: { uColor: { value: new THREE.Color('#ffffff') }, uOpacity: { value: 0.95 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  }), [])
  const glowMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: ribbonVertex,
    fragmentShader: ribbonFragment,
    uniforms: { uColor: { value: new THREE.Color(P.trailGlow) }, uOpacity: { value: 0.42 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  }), [P])

  /* --- Predicted path dots --- */
  const PREDICT_STEPS = 48
  const predictGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PREDICT_STEPS * 3), 3))
    g.setDrawRange(0, 0)
    return g
  }, [])
  const predictBuffer = useRef([])

  /* --- Bounce impact marks (pool) --- */
  const MARKS = 4
  const marks = useRef(Array.from({ length: MARKS }, () => ({ active: false, t: 0, pos: new THREE.Vector3() })))
  const ringRefs = useRef([])
  const ellipseRefs = useRef([])
  const markIndex = useRef(0)

  /* --- Dust burst on bounce --- */
  const DUST = 36
  const dust = useRef({ active: false, t: 0, vel: new Float32Array(DUST * 3), origin: new THREE.Vector3() })
  const dustGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DUST * 3), 3))
    return g
  }, [])
  const dustRef = useRef()

  /* --- Racket-hit flash (sprite) --- */
  const flash = useRef({ active: false, t: 0 })
  const flashRef = useRef()

  const tmpA = useMemo(() => new THREE.Vector3(), [])
  const tmpB = useMemo(() => new THREE.Vector3(), [])
  const tmpC = useMemo(() => new THREE.Vector3(), [])
  const spinAxis = useMemo(() => new THREE.Vector3(), [])
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const projected = useMemo(() => new THREE.Vector3(), [])
  const smoothedSpeed = useRef(0)

  const reducedMotion = prefersReducedMotion

  const updateRibbon = (geometry, width, power) => {
    const pts = history.current
    const n = pts.length
    const pos = geometry.attributes.position.array
    const alp = geometry.attributes.aAlpha.array
    if (n < 2) {
      geometry.setDrawRange(0, 0)
      return
    }
    for (let i = 0; i < n; i++) {
      const p = pts[i]
      const next = pts[Math.min(i + 1, n - 1)]
      const prev = pts[Math.max(i - 1, 0)]
      tmpA.subVectors(next, prev)               // travel direction
      tmpB.subVectors(camera.position, p)        // towards camera
      tmpC.crossVectors(tmpA, tmpB)
      if (tmpC.lengthSq() < 1e-8) tmpC.set(1, 0, 0)
      tmpC.normalize()
      const f = i / (n - 1)
      const w = width * Math.pow(f, power) + 0.004
      pos[i * 6 + 0] = p.x + tmpC.x * w
      pos[i * 6 + 1] = p.y + tmpC.y * w
      pos[i * 6 + 2] = p.z + tmpC.z * w
      pos[i * 6 + 3] = p.x - tmpC.x * w
      pos[i * 6 + 4] = p.y - tmpC.y * w
      pos[i * 6 + 5] = p.z - tmpC.z * w
      const a = Math.pow(f, 1.6)
      alp[i * 2] = a
      alp[i * 2 + 1] = a
    }
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.aAlpha.needsUpdate = true
    geometry.setDrawRange(0, (n - 1) * 6)
  }

  useFrame((state, delta) => {
    if (trackerState.replay) {
      trackerState.replay = false
      history.current.length = 0
      rally.resetTimer = 0
      serve(rally, Math.random() < 0.5 ? 1 : -1)
    }
    const speedScale = trackerState.slowMo ? 0.28 : (reducedMotion ? 0.45 : TIME_SCALE)
    const dt = Math.min(delta, 0.05) * speedScale
    stepRally(rally, dt)

    /* Consume physics events */
    for (const ev of rally.events) {
      if (ev.type === 'bounce') {
        const m = marks.current[markIndex.current]
        markIndex.current = (markIndex.current + 1) % MARKS
        m.active = true
        m.t = 0
        m.pos.set(ev.pos.x, 0.012, ev.pos.z)
        const d = dust.current
        d.active = true
        d.t = 0
        d.origin.set(ev.pos.x, 0.03, ev.pos.z)
        const arr = dustGeometry.attributes.position.array
        for (let i = 0; i < DUST; i++) {
          const ang = Math.random() * Math.PI * 2
          const sp = 0.6 + Math.random() * 1.6
          d.vel[i * 3] = Math.cos(ang) * sp
          d.vel[i * 3 + 1] = 0.8 + Math.random() * 1.8
          d.vel[i * 3 + 2] = Math.sin(ang) * sp
          arr[i * 3] = d.origin.x
          arr[i * 3 + 1] = d.origin.y
          arr[i * 3 + 2] = d.origin.z
        }
        dustGeometry.attributes.position.needsUpdate = true
        trackerState.phase = 'rally'
        audio.bounce(ev.pos.x / 6, 0.7 + Math.min(0.3, Math.abs(rally.vel.z) / 60))
      } else if (ev.type === 'hit') {
        flash.current.active = true
        flash.current.t = 0
        if (flashRef.current) flashRef.current.position.set(ev.pos.x, ev.pos.y, ev.pos.z)
        audio.hit(ev.pos.x / 6, 0.85)
      } else if (ev.type === 'serve') {
        history.current.length = 0
        trackerState.phase = 'serve'
        audio.hit(ev.pos.x / 6, 1)
      } else if (ev.type === 'point') {
        trackerState.phase = 'point'
      }
    }
    rally.events.length = 0

    /* Ball transform + spin */
    const p = rally.pos
    if (ballGroupRef.current) {
      ballGroupRef.current.position.set(p.x, p.y, p.z)
      ballGroupRef.current.visible = rally.airborne
    }
    if (ballRef.current && rally.airborne) {
      tmpA.set(rally.vel.x, rally.vel.y, rally.vel.z)
      const speed = tmpA.length()
      if (speed > 0.01) {
        spinAxis.crossVectors(up, tmpA).normalize()
        ballRef.current.rotateOnWorldAxis(spinAxis, (speed / BALL_RADIUS) * 0.55 * dt)
      }
    }
    if (glowRef.current) {
      glowRef.current.position.set(p.x, p.y, p.z)
      glowRef.current.visible = rally.airborne
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 9) * 0.08
      glowRef.current.scale.setScalar(BALL_RADIUS * 6 * pulse)
    }
    if (lightRef.current) {
      lightRef.current.position.set(p.x, p.y + 0.2, p.z)
      lightRef.current.intensity = rally.airborne ? 6 : 0
    }

    /* Trail history */
    if (rally.airborne) {
      const h = history.current
      const v = vectorPool[poolIndex.current]
      poolIndex.current = (poolIndex.current + 1) % vectorPool.length
      v.set(p.x, p.y, p.z)
      h.push(v)
      if (h.length > TRAIL_LENGTH) h.shift()
    } else if (history.current.length) {
      history.current.shift()
      if (history.current.length) history.current.shift()
    }
    updateRibbon(coreGeometry, 0.05, 1.2)
    updateRibbon(glowGeometry, 0.3, 1.0)

    /* Prediction dots */
    const pred = predictPath(rally, 1.1, PREDICT_STEPS, predictBuffer.current)
    const parr = predictGeometry.attributes.position.array
    const count = pred.length / 3
    for (let i = 0; i < pred.length; i++) parr[i] = pred[i]
    predictGeometry.attributes.position.needsUpdate = true
    predictGeometry.setDrawRange(0, count)

    /* Impact marks */
    marks.current.forEach((m, i) => {
      const ring = ringRefs.current[i]
      const ell = ellipseRefs.current[i]
      if (!ring || !ell) return
      if (!m.active) { ring.visible = false; ell.visible = false; return }
      m.t += dt
      const life = 1.1
      const q = Math.min(m.t / life, 1)
      ring.visible = q < 1
      ring.position.copy(m.pos)
      const s = 0.25 + q * 1.6
      ring.scale.set(s, s, s)
      ring.material.opacity = (1 - q) * 0.9
      // lingering ellipse mark
      const linger = 7
      const e = Math.min(m.t / linger, 1)
      ell.visible = e < 1
      ell.position.copy(m.pos)
      ell.material.opacity = (1 - e) * 0.7
      if (e >= 1) m.active = false
    })

    /* Dust */
    const d = dust.current
    if (dustRef.current) {
      dustRef.current.visible = d.active
      if (d.active) {
        d.t += dt
        const life = 0.75
        const q = d.t / life
        const arr = dustGeometry.attributes.position.array
        for (let i = 0; i < DUST; i++) {
          d.vel[i * 3 + 1] -= 4.5 * dt
          arr[i * 3] += d.vel[i * 3] * dt
          arr[i * 3 + 1] = Math.max(0.01, arr[i * 3 + 1] + d.vel[i * 3 + 1] * dt)
          arr[i * 3 + 2] += d.vel[i * 3 + 2] * dt
        }
        dustGeometry.attributes.position.needsUpdate = true
        dustRef.current.material.opacity = Math.max(0, (1 - q)) * 0.8
        if (q >= 1) d.active = false
      }
    }

    /* Hit flash */
    if (flashRef.current) {
      const f = flash.current
      flashRef.current.visible = f.active
      if (f.active) {
        f.t += dt
        const q = f.t / 0.32
        const s = 0.4 + q * 1.8
        flashRef.current.scale.set(s, s, 1)
        flashRef.current.material.opacity = Math.max(0, 1 - q)
        if (q >= 1) f.active = false
      }
    }

    /* Screen-space tracker data for the DOM HUD */
    projected.set(p.x, p.y, p.z).project(camera)
    const onScreen = rally.airborne && projected.z < 1 && Math.abs(projected.x) < 1.05 && Math.abs(projected.y) < 1.05
    trackerState.visible = onScreen
    trackerState.x = (projected.x + 1) / 2
    trackerState.y = (1 - projected.y) / 2
    const targetSpeed = rally.airborne ? speedKmh(rally) : 0
    smoothedSpeed.current += (targetSpeed - smoothedSpeed.current) * Math.min(1, dt * 8)
    trackerState.speed = smoothedSpeed.current
    trackerState.shot = rally.totalShots
    trackerState.bounces = rally.bounces
  })

  return (
    <group>
      {/* Ball */}
      <group ref={ballGroupRef}>
        <TennisBall ref={ballRef} radius={BALL_RADIUS} fuzz={0.5} />
      </group>

      {/* Soft glow sprite around the ball */}
      <sprite ref={glowRef}>
        <spriteMaterial map={glowTexture} color="#ffffff" transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* The ball lights the court around it */}
      <pointLight ref={lightRef} color="#ffe9a8" intensity={6} distance={5} decay={2} />

      {/* Trail */}
      <mesh geometry={glowGeometry} material={glowMaterial} frustumCulled={false} />
      <mesh geometry={coreGeometry} material={coreMaterial} frustumCulled={false} />

      {/* Predicted path */}
      <points geometry={predictGeometry} frustumCulled={false}>
        <pointsMaterial color={P.silver} size={3} sizeAttenuation={false} transparent opacity={0.75} depthWrite={false} toneMapped={false} />
      </points>

      {/* Impact marks */}
      {marks.current.map((_, i) => (
        <group key={i}>
          <mesh ref={(el) => (ringRefs.current[i] = el)} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
            <ringGeometry args={[0.42, 0.5, 48]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={(el) => (ellipseRefs.current[i] = el)} rotation={[-Math.PI / 2, 0, 0]} scale={[0.34, 0.24, 1]} visible={false}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial color={P.silver} transparent opacity={0.7} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Dust burst */}
      <points ref={dustRef} geometry={dustGeometry} visible={false} frustumCulled={false}>
        <pointsMaterial color="#e8e6dc" size={2.5} sizeAttenuation={false} transparent opacity={0.8} depthWrite={false} />
      </points>

      {/* Racket-hit flash */}
      <sprite ref={flashRef} visible={false}>
        <spriteMaterial map={glowTexture} color="#ffffff" transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  )
}

/* ------------------------------------------------------------ Camera */

function CameraRig() {
  const { camera, size } = useThree()
  const intro = useRef(0)
  const lookTarget = useRef(new THREE.Vector3(0, 0.6, -1))
  const tmp = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const portrait = size.width < size.height
    // Broadcast angle — further back on portrait screens
    const base = portrait ? { x: -6, y: 9, z: 30 } : { x: -12, y: 6.5, z: 22 }
    const introStart = portrait ? { x: 0, y: 22, z: 40 } : { x: 3, y: 18, z: 36 }

    intro.current = Math.min(intro.current + delta / 4.2, 1)
    const t = intro.current
    const ease = 1 - Math.pow(1 - t, 3)

    const px = state.pointer.x
    const py = state.pointer.y
    const drift = state.clock.elapsedTime * 0.18

    camera.position.x = THREE.MathUtils.lerp(introStart.x, base.x, ease) + px * 0.9 + Math.sin(drift) * 0.25
    camera.position.y = THREE.MathUtils.lerp(introStart.y, base.y, ease) + py * 0.45 + Math.sin(drift * 0.7) * 0.12
    camera.position.z = THREE.MathUtils.lerp(introStart.z, base.z, ease)

    // Gentle broadcast-style pan following the ball
    const b = trackerState.visible
    tmp.current.set(0, 0.5, -1)
    if (b) {
      // trackerState only holds screen coords, so bias the pan with the pointer + subtle drift
      tmp.current.x += (trackerState.x - 0.5) * 3.5
    }
    lookTarget.current.lerp(tmp.current, 0.03)
    camera.lookAt(lookTarget.current)

    const targetFov = portrait ? 60 : 40
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * 0.08
      camera.updateProjectionMatrix()
    }
  })

  return null
}

/* ------------------------------------------------------------ Scene */

export default function TennisScene({ theme = 'wine', frameloop = 'always' }) {
  const P = PALETTES[theme] || PALETTES.wine
  // adaptive pixel ratio: starts sharp, steps down if the GPU can't keep 60fps
  const [dpr, setDpr] = useState(lowPower ? 1 : 1.5)

  return (
    <Canvas
      shadows={lowPower ? false : 'percentage'}
      dpr={dpr}
      frameloop={frameloop}
      camera={{ position: [3, 18, 36], fov: 40, near: 0.1, far: 160 }}
      style={{ background: P.bg }}
      gl={{
        antialias: !lowPower,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: P.exposure,
        powerPreference: 'high-performance',
        stencil: false
      }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(lowPower ? 1 : 1.5)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <color attach="background" args={[P.bg]} />
      <fog attach="fog" args={[P.bg, P.fog[0], P.fog[1]]} />

      <SceneEnvironment intensity={P.envIntensity} />
      <CameraRig />

      {/* Lighting — kept lean: one shadow-casting key, one fill, sky light, one stadium spot */}
      <hemisphereLight args={P.hemi} />
      <ambientLight intensity={P.ambient} color="#ffffff" />
      <directionalLight
        position={[9, 16, 7]}
        intensity={P.key}
        color="#fff6ea"
        castShadow={!lowPower}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0006}
      />
      <directionalLight position={[-10, 12, -8]} intensity={0.8} color="#dfe3ff" />
      <spotLight position={[-19, 16, 26]} angle={0.6} penumbra={0.9} intensity={240} distance={70} decay={1.6} color="#fff3e0" />

      <Court P={P} />
      <Stadium P={P} />

      {/* Signature HA mark above the far end of the court */}
      <HALogo3DMesh
        scale={2.1}
        depth={0.5}
        bevelThickness={0.06}
        bevelSize={0.06}
        color={P.burgundy}
        emissive={P.burgundyDeep}
        roughness={0.28}
        metalness={0.55}
        position={[0, 6.2, -27]}
        rotation={[0, 0, 0]}
      />

      <Rally P={P} />

      {/* Dust in the floodlights */}
      <Sparkles count={lowPower ? 40 : 90} scale={[26, 9, 34]} position={[0, 4, 0]} size={1.6} speed={0.25} opacity={theme === 'dark' ? 0.35 : 0.2} color={theme === 'dark' ? '#c9cbd1' : '#8e1b31'} />
    </Canvas>
  )
}
