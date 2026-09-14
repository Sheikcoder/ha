import { useMemo, forwardRef } from 'react'
import * as THREE from 'three'

/* ------------------------------------------------------------
   Realistic tennis ball
   - felt-like core (high roughness, subtle emissive lift)
   - real seam curve (two-lobe tennis seam) as a tube
   - soft "fuzz" halo using a fresnel shader on a slightly larger shell
   ------------------------------------------------------------ */

export const BALL_COLOR = '#d6de3c'
export const SEAM_COLOR = '#f4f4ee'

/* Tennis seam curve on a unit sphere */
function seamPoints(segments = 220, radius = 1) {
  const pts = []
  const a = 0.8, b = 0.2, c = 0.75
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const v = new THREE.Vector3(
      a * Math.cos(t) + b * Math.cos(3 * t),
      a * Math.sin(t) - b * Math.sin(3 * t),
      c * Math.sin(2 * t)
    ).normalize().multiplyScalar(radius)
    pts.push(v)
  }
  return pts
}

const fuzzVertex = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fuzzFragment = /* glsl */`
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
    float alpha = pow(fresnel, 3.0) * uStrength;
    gl_FragColor = vec4(uColor, alpha);
  }
`

const TennisBall = forwardRef(function TennisBall(
  { radius = 0.11, fuzz = 0.55, castShadow = true, ...props },
  ref
) {
  const seamGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(seamPoints(220, radius * 1.004), true)
    return new THREE.TubeGeometry(curve, 260, radius * 0.055, 8, true)
  }, [radius])

  const fuzzUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#eef58a') },
    uStrength: { value: fuzz }
  }), [fuzz])

  return (
    <group ref={ref} {...props}>
      {/* Felt core */}
      <mesh castShadow={castShadow}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={BALL_COLOR}
          roughness={0.96}
          metalness={0}
          emissive="#5a5f12"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Seam */}
      <mesh geometry={seamGeometry} castShadow={false}>
        <meshStandardMaterial color={SEAM_COLOR} roughness={0.7} metalness={0} />
      </mesh>

      {/* Fuzz halo */}
      <mesh scale={1.07}>
        <sphereGeometry args={[radius, 32, 32]} />
        <shaderMaterial
          vertexShader={fuzzVertex}
          fragmentShader={fuzzFragment}
          uniforms={fuzzUniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  )
})

export default TennisBall
