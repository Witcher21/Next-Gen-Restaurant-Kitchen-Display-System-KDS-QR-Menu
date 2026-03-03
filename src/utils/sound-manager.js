/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         SmartDine Sound Notification Manager            ║
 * ║  Generates real-time audio alerts using Web Audio API   ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * No external sound files needed — generates tones programmatically.
 */

let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

/**
 * Play a pleasant "ting!" chime for new orders
 * Two-tone bell sound: C5 → E5
 */
export function playNewOrderSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // First tone (C5 = 523 Hz)
    playTone(ctx, 523.25, now, 0.15, 0.35)
    // Second tone (E5 = 659 Hz) — slightly delayed
    playTone(ctx, 659.25, now + 0.15, 0.2, 0.3)
    // Third tone (G5 = 783 Hz) — pleasant resolution
    playTone(ctx, 783.99, now + 0.3, 0.25, 0.25)
  } catch (e) {
    console.warn('Sound notification failed:', e)
  }
}

/**
 * Play a quick "ding" for status updates (cooking started, ready)
 */
export function playStatusSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    playTone(ctx, 880, now, 0.1, 0.2)
    playTone(ctx, 1046.5, now + 0.1, 0.15, 0.15)
  } catch (e) {
    console.warn('Sound notification failed:', e)
  }
}

/**
 * Play a "ready!" celebratory sound
 */
export function playReadySound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    playTone(ctx, 523.25, now, 0.1, 0.3)
    playTone(ctx, 659.25, now + 0.1, 0.1, 0.3)
    playTone(ctx, 783.99, now + 0.2, 0.1, 0.3)
    playTone(ctx, 1046.5, now + 0.3, 0.3, 0.25)
  } catch (e) {
    console.warn('Sound notification failed:', e)
  }
}

/**
 * Play a subtle warning beep for low stock
 */
export function playWarningSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    playTone(ctx, 440, now, 0.15, 0.3)
    playTone(ctx, 349.23, now + 0.2, 0.2, 0.25)
  } catch (e) {
    console.warn('Sound notification failed:', e)
  }
}

/**
 * Core tone generator
 */
function playTone(ctx, frequency, startTime, duration, volume = 0.3) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startTime)

  // Smooth envelope: attack → sustain → decay
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02) // quick attack
  gainNode.gain.setValueAtTime(volume, startTime + duration * 0.6) // sustain
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration) // smooth decay

  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.05)
}
