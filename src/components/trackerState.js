/* Shared between the 3D scene (writer) and the DOM HUD (reader).
   Kept in its own tiny module so Hero.jsx can import it without
   pulling the Three.js bundle into the initial page load. */
export const trackerState = {
  x: 0.5, y: 0.5,       // ball position as screen fractions
  visible: false,
  speed: 0,             // km/h (smoothed)
  shot: 0,
  phase: 'serve',       // 'serve' | 'rally' | 'point'
  bounces: 0,
  // commands from the HUD → scene
  replay: false,
  slowMo: false
}
