/* ------------------------------------------------------------
   Rally physics for the hero "ball tracker".
   Pure JavaScript — no Three.js dependency — so it stays easy to
   reason about and to test.

   Units are metres. Court is centred on the origin, net along X
   at z = 0, baselines at z = ±11.885.
   ------------------------------------------------------------ */

export const COURT = {
  halfLength: 11.885,
  singlesHalfWidth: 4.115,
  doublesHalfWidth: 5.485,
  serviceLine: 6.4,
  netHeight: 0.914,
  netPostX: 6.4
}

export const GRAVITY = 9.81

const rand = (min, max) => min + Math.random() * (max - min)

/* Velocity needed to travel from `from` to land at `to` (y = landY) in `time` seconds */
export function launchVelocity(from, to, landY, time) {
  return {
    x: (to.x - from.x) / time,
    y: (landY - from.y + 0.5 * GRAVITY * time * time) / time,
    z: (to.z - from.z) / time
  }
}

/* Creates the initial rally state — a serve from the near baseline */
export function createRally(radius = 0.16) {
  const state = {
    radius,
    pos: { x: 0, y: 0, z: 0 },
    vel: { x: 0, y: 0, z: 0 },
    dir: -1,            // -1 → ball travels towards negative z
    bounces: 0,
    shot: 0,            // shot index within the current point
    totalShots: 0,
    hitPlane: 0,        // |z| at which the receiver hits the ball back
    events: [],         // 'bounce' | 'hit' | 'serve' with positions — consumed by the renderer
    resetTimer: 0,      // > 0 while waiting to restart a point
    airborne: true
  }
  serve(state, 1)
  return state
}

export function serve(state, side = 1) {
  const r = state.radius
  // Server stands just behind the baseline, ball tossed high
  state.pos = { x: side * rand(0.4, 1.6), y: rand(2.4, 2.8), z: side * (COURT.halfLength + rand(0.4, 1.0)) }
  state.dir = -side
  // Target the service box on the other side
  const target = { x: -side * rand(-3.4, 3.4) * 0.5 + rand(-1.2, 1.2), z: state.dir * rand(3.6, 6.0) }
  const time = rand(0.55, 0.7)
  state.vel = launchVelocity(state.pos, target, r, time)
  state.bounces = 0
  state.shot = 0
  state.hitPlane = rand(10.2, 12.8)
  state.airborne = true
  state.events.push({ type: 'serve', pos: { ...state.pos } })
}

export function returnShot(state) {
  const r = state.radius
  // Ball is hit back towards the other side from where it currently is
  state.dir = -state.dir
  const deep = rand(0, 1) < 0.65
  const target = {
    x: rand(-3.4, 3.4),
    z: state.dir * (deep ? rand(7.5, 10.8) : rand(3.5, 7.0))
  }
  const time = rand(0.7, 1.0)
  const v = launchVelocity(state.pos, target, r, time)
  // Keep the shot over the net with a small margin if needed
  const tNet = Math.abs(state.pos.z / (v.z || 0.0001))
  const yAtNet = state.pos.y + v.y * tNet - 0.5 * GRAVITY * tNet * tNet
  if (yAtNet < COURT.netHeight + 0.25) {
    v.y += (COURT.netHeight + 0.25 - yAtNet) / tNet
  }
  state.vel = v
  state.bounces = 0
  state.shot += 1
  state.totalShots += 1
  state.hitPlane = rand(10.2, 12.8)
  state.events.push({ type: 'hit', pos: { ...state.pos } })
}

/* Advance the simulation by dt seconds */
export function stepRally(state, dt) {
  const r = state.radius

  if (state.resetTimer > 0) {
    state.resetTimer -= dt
    if (state.resetTimer <= 0) {
      state.resetTimer = 0
      serve(state, Math.random() < 0.5 ? 1 : -1)
    }
    return state
  }

  const p = state.pos
  const v = state.vel

  v.y -= GRAVITY * dt
  p.x += v.x * dt
  p.y += v.y * dt
  p.z += v.z * dt

  // Bounce
  if (p.y < r && v.y < 0) {
    p.y = r
    v.y = -v.y * 0.72
    v.x *= 0.86
    v.z *= 0.86
    state.bounces += 1
    state.events.push({ type: 'bounce', pos: { ...p } })

    // Second bounce → point over
    if (state.bounces >= 2) {
      state.airborne = false
      state.resetTimer = 1.1
      state.events.push({ type: 'point', pos: { ...p } })
      return state
    }
  }

  // Receiver hits the ball back once it has bounced and reached the hitting zone
  const reachedHitZone = Math.abs(p.z) >= state.hitPlane && Math.sign(p.z) === state.dir
  if (state.bounces >= 1 && reachedHitZone && v.y < 1.5) {
    // Long rallies end naturally to reset the camera framing
    if (state.shot >= 6 && Math.random() < 0.35) {
      state.airborne = false
      state.resetTimer = 0.9
      state.events.push({ type: 'point', pos: { ...p } })
    } else {
      returnShot(state)
    }
  }

  // Safety net: ball flew out — restart
  if (Math.abs(p.z) > COURT.halfLength + 4 || Math.abs(p.x) > 9 || p.y > 9) {
    state.airborne = false
    state.resetTimer = 0.6
    state.events.push({ type: 'point', pos: { ...p } })
  }

  return state
}

/* Predicts the ball path for `seconds` ahead (used for the tracker's dotted line) */
export function predictPath(state, seconds = 1.2, steps = 48, out = []) {
  const r = state.radius
  const dt = seconds / steps
  let { x, y, z } = state.pos
  let vx = state.vel.x, vy = state.vel.y, vz = state.vel.z
  out.length = 0
  if (!state.airborne) return out
  for (let i = 0; i < steps; i++) {
    vy -= GRAVITY * dt
    x += vx * dt
    y += vy * dt
    z += vz * dt
    if (y < r && vy < 0) {
      y = r
      vy = -vy * 0.72
      vx *= 0.86
      vz *= 0.86
    }
    out.push(x, y, z)
  }
  return out
}

export function speedKmh(state) {
  const v = state.vel
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 3.6
}
