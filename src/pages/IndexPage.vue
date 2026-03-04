<template>
  <q-page class="premium-landing">
    <!-- Immersive Animated Gradient Background -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="glass-overlay"></div>
    </div>

    <!-- Main Content Layout -->
    <div class="container relative-position" style="z-index: 10">
      <!-- Header / Nav -->
      <header class="landing-header shadow-soft animate-fade-in-down">
        <div class="logo">
          <q-icon name="restaurant_menu" color="orange" size="28px" class="q-mr-sm" />
          <span class="logo-text">Smart<span class="text-orange">Dine</span></span>
        </div>
        <div class="header-actions">
          <q-btn
            flat
            no-caps
            color="grey-3"
            label="KDS Status"
            class="header-link"
            :to="{ name: 'kds' }"
          />
          <q-btn
            flat
            no-caps
            color="grey-3"
            label="Admin Portal"
            class="header-link"
            :to="{ name: 'admin-dashboard' }"
          />
        </div>
      </header>

      <div class="hero-showcase">
        <!-- Floating Device: Phone (LEFT side) -->
        <div class="showcase-device showcase-phone hide-on-mobile">
          <div class="mockup-phone mockup-entrance-phone">
            <div class="mockup-screen">
              <video autoplay loop muted playsinline class="mockup-video">
                <source src="/videos/food.mp4" type="video/mp4" />
              </video>
              <div class="mockup-screen-overlay"></div>
              <div class="mockup-brand-badge mockup-brand-badge--sm">
                <span class="brand-dot"></span>
                MENU
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Device: Tablet (RIGHT side) -->
        <div class="showcase-device showcase-tablet hide-on-mobile">
          <div class="mockup-tablet mockup-entrance-tablet">
            <div class="mockup-screen">
              <video autoplay loop muted playsinline class="mockup-video">
                <source src="/videos/kitchen.mp4" type="video/mp4" />
              </video>
              <div class="mockup-screen-overlay"></div>
              <div class="mockup-brand-badge">
                <span class="brand-dot"></span>
                LIVE KITCHEN
              </div>
            </div>
          </div>
        </div>

        <!-- CENTER: Main Content -->
        <div class="hero-content">
          <div class="badge-pill q-mb-md hero-reveal hero-reveal-1">
            <span class="dot pulse-dot"></span>
            Live Digital Menu Version 2.0
          </div>

          <h1 class="hero-title hero-reveal hero-reveal-2">
            The Future of <br />
            <span class="gradient-text">Fine Dining</span>
          </h1>

          <p class="hero-subtitle q-mb-lg hero-reveal hero-reveal-3">
            Experience our interactive digital menu. From kitchen to table, enjoy seamless ordering,
            immersive food previews, and real-time tracking.
          </p>

          <!-- Interactive Login Card -->
          <div class="glass-panel main-interaction-card hero-reveal hero-reveal-4">
            <transition name="fade-slide" mode="out-in">
              <!-- VIEW 1: Welcome -->
              <div v-if="!showTableSelection" class="view-welcome" key="welcome">
                <div class="welcome-header q-mb-lg">
                  <div class="welcome-eyebrow">Scan or Enter to Continue</div>
                  <h2 class="card-title">
                    Welcome, <span class="text-gradient-orange">Guest</span> 👋
                  </h2>
                  <p class="card-subtitle">Choose how you'd like to get started below.</p>
                </div>

                <div class="action-block q-mb-sm">
                  <div class="action-label">Sit down at a table</div>
                  <q-btn
                    class="btn-primary full-width shadow-glow"
                    rounded
                    unelevated
                    no-caps
                    size="lg"
                    @click="showTableSelection = true"
                  >
                    <q-icon name="table_restaurant" size="20px" class="q-mr-sm" />
                    Select a Table
                    <q-icon name="arrow_forward" size="16px" class="q-ml-sm" />
                  </q-btn>
                </div>

                <div class="or-divider q-my-md">
                  <span class="or-line"></span>
                  <span class="or-text">or</span>
                  <span class="or-line"></span>
                </div>

                <div class="action-block">
                  <div class="action-label">Resume an existing session</div>
                  <q-input
                    v-model="recoveryId"
                    dark
                    outlined
                    rounded
                    placeholder="Enter Session ID  (SD-XXXX)"
                    class="premium-input full-width"
                    input-class="text-weight-bold text-uppercase session-id-input"
                    @keyup.enter="recoverSession"
                    maxlength="7"
                  >
                    <template #prepend>
                      <q-icon name="vpn_key" color="grey-6" size="18px" />
                    </template>
                    <template v-if="recoveryId" #append>
                      <q-btn
                        flat
                        round
                        dense
                        icon="arrow_forward"
                        color="orange"
                        @click="recoverSession"
                      />
                    </template>
                  </q-input>
                  <p v-if="recoveryError" class="recovery-error q-mt-xs">
                    <q-icon name="error_outline" size="14px" class="q-mr-xs" />
                    {{ recoveryError }}
                  </p>
                </div>
              </div>

              <!-- VIEW 2: Table Selection -->
              <div v-else class="view-tables" key="tables">
                <div class="row items-center justify-between q-mb-md">
                  <q-btn
                    flat
                    round
                    dense
                    icon="keyboard_backspace"
                    color="grey-4"
                    @click="showTableSelection = false"
                  />
                  <h3 class="card-title q-mb-none" style="font-size: 1.25rem">Select Table</h3>
                  <div style="width: 32px"></div>
                </div>
                <div class="table-legend q-mb-md text-left">
                  <span class="q-mr-md"><span class="dot bg-green"></span> Available</span>
                  <span><span class="dot bg-orange"></span> Occupied</span>
                </div>
                <div class="table-grid q-mb-md">
                  <div
                    v-for="table in tableStore.tables"
                    :key="table.number"
                    class="table-card"
                    :class="[
                      table.status === 'available' ? 'table-card--free' : 'table-card--taken',
                      selectedTable === table.number ? 'table-card--selected' : '',
                    ]"
                    @click="
                      table.status === 'available' &&
                      ((selectedTable = table.number), (selectedCapacity = table.capacity))
                    "
                  >
                    <div class="t-num">{{ table.number }}</div>
                  </div>
                </div>
                <q-slide-transition>
                  <div v-if="selectedTable" class="selected-action">
                    <q-btn
                      class="btn-primary full-width shadow-glow"
                      rounded
                      unelevated
                      no-caps
                      size="lg"
                      @click="confirmTableSelection"
                    >
                      Start Ordering (Table {{ selectedTable }})
                      <q-icon name="arrow_forward" class="q-ml-sm" />
                    </q-btn>
                  </div>
                </q-slide-transition>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from 'stores/cart-store'
import { useTableStore } from 'stores/table-store'
import { useCustomerSessionStore } from 'stores/customer-session-store'
import { useQuasar } from 'quasar'

const router = useRouter()
const cartStore = useCartStore()
const tableStore = useTableStore()
const sessionStore = useCustomerSessionStore()
const $q = useQuasar()

const showTableSelection = ref(false)
const selectedTable = ref(null)
const selectedCapacity = ref(0)
const recoveryId = ref('')
const recoveryError = ref('')

onMounted(() => {
  const restored = sessionStore.tryAutoRestore()
  if (restored && sessionStore.isActive) {
    // Ensuring zIndex won't clash by setting it on dialog or confirming .container fixed its z-index
    $q.dialog({
      title: '👋 Welcome back!',
      message: `Your session <strong style="color:#ea580c; word-break: break-all;">${sessionStore.sessionId}</strong> for Table ${sessionStore.tableNumber} is active.`,
      dark: true,
      html: true,
      persistent: true,
      class: 'glass-toast',
      ok: { label: 'Continue', color: 'orange', rounded: true, unelevated: true, noCaps: true },
      cancel: { label: 'New Session', flat: true, color: 'grey-5', noCaps: true },
    })
      .onOk(() => {
        cartStore.setTable(sessionStore.tableNumber)
        router.push({ name: 'menu', params: { tableId: sessionStore.tableNumber } })
      })
      .onCancel(() => {
        sessionStore.clearAutoRestore()
        sessionStore.endSession()
      })
  }
})

function confirmTableSelection() {
  if (!selectedTable.value) return
  const sessionId = sessionStore.startSession(selectedTable.value)
  cartStore.setTable(selectedTable.value)

  $q.dialog({
    title: 'Your Digital Pass',
    message: `<div style="text-align:center;">
      <div style="font-size: 1.8rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif; color: #ea580c; margin: 20px 0; letter-spacing: 2px; word-break: break-all;">${sessionId}</div>
      <p style="color: #a8a29e; font-size: 0.9rem; line-height:1.5;">Keep this ID safe. You can use it to resume your session if you close the browser.</p>
    </div>`,
    dark: true,
    html: true,
    persistent: true,
    class: 'glass-toast',
    ok: {
      label: 'Enter Menu',
      color: 'orange',
      rounded: true,
      unelevated: true,
      noCaps: true,
      size: 'lg',
    },
  }).onOk(() => {
    router.push({ name: 'menu', params: { tableId: selectedTable.value } })
  })
}

function recoverSession() {
  recoveryError.value = ''
  const id = recoveryId.value.toUpperCase().trim()
  if (!id || id.length < 5) {
    recoveryError.value = 'Invalid session format'
    return
  }
  const recovered = sessionStore.recoverSession(id)
  if (recovered) {
    cartStore.setTable(sessionStore.tableNumber)
    router.push({ name: 'menu', params: { tableId: sessionStore.tableNumber } })
  } else {
    recoveryError.value = 'Session not found or expired.'
  }
}
</script>

<style lang="scss" scoped>
/* Core Layout */
.premium-landing {
  min-height: 100vh;
  background-color: #050505;
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden; /* Stop horizontal scroll */
  overflow-y: auto; /* Allow scrolling on smaller screens */
}

/* Animated Gradient Mesh Background */
.animated-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #050505;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  animation: moveBlob 20s infinite alternate cubic-bezier(0.5, 0, 0.5, 1);
}
.blob-1 {
  width: 50vw;
  height: 50vw;
  background: #ea580c;
  top: -10%;
  left: -10%;
}
.blob-2 {
  width: 40vw;
  height: 40vw;
  background: #f59e0b;
  bottom: -20%;
  right: -10%;
  animation-delay: -5s;
}
.blob-3 {
  width: 35vw;
  height: 35vw;
  background: #4f46e5;
  top: 40%;
  left: 40%;
  animation-delay: -10s;
}
@keyframes moveBlob {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(100px, -100px) scale(1.2);
  }
}
.glass-overlay {
  position: absolute;
  inset: 0;
  background: rgba(5, 5, 5, 0.3);
  backdrop-filter: blur(80px);
  -webkit-backdrop-filter: blur(80px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 5%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.landing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.logo {
  display: flex;
  align-items: center;
}
.logo-text {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: -0.5px;
}

/* Hero Showcase - Centered content with floating devices */
.hero-showcase {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px 0;
}

/* Center content column */
.hero-content {
  text-align: center;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 520px;
  width: 100%;
  position: relative;
}

/* Floating showcase devices - fixed positioned on viewport sides */
.showcase-device {
  position: fixed;
  z-index: 8;
}
.showcase-phone {
  left: 2vw;
  top: 50%;
  transform: translateY(-50%);
}
.showcase-tablet {
  right: 2vw;
  top: 50%;
  transform: translateY(-50%);
}
@media (max-width: 1400px) {
  .showcase-phone {
    left: 1vw;
  }
  .showcase-tablet {
    right: 1vw;
  }
}
@media (max-width: 1100px) {
  .showcase-device {
    opacity: 0.6;
  }
  .showcase-phone {
    left: -40px;
  }
  .showcase-tablet {
    right: -40px;
  }
}
@media (max-width: 900px) {
  .hide-on-mobile {
    display: none;
  }
  .table-legend {
    justify-content: center;
  }
  .view-welcome {
    text-align: center;
  }
}

/* Typography */
.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #e5e5e5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.pulse-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 4.5vw, 4.2rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 16px 0;
  letter-spacing: -1.5px;
}
.gradient-text {
  background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  color: #a3a3a3;
  line-height: 1.7;
  max-width: 520px;
  margin: 0;
  @media (max-width: 900px) {
    margin: 0 auto 32px auto;
  }
}

/* Glass Panel Form */
.glass-panel {
  background: rgba(20, 20, 20, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
  max-width: 480px;
  width: 100%;
  @media (max-width: 900px) {
    margin: 0 auto;
  }
}
/* Welcome Card Elements */
.view-welcome {
  text-align: left;
}
.welcome-header {
  border-left: 3px solid #ea580c;
  padding-left: 16px;
}
.welcome-eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #ea580c;
  margin-bottom: 8px;
}
.card-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.1;
  letter-spacing: -0.5px;
}
.text-gradient-orange {
  background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.card-subtitle {
  font-size: 0.95rem;
  color: #737373;
  margin: 0;
  line-height: 1.5;
}

/* Action Blocks */
.action-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.action-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #525252;
}

/* OR Divider */
.or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
}
.or-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
}
.or-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #404040;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #ea580c, #f59e0b) !important;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  height: 56px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(234, 88, 12, 0.45);
}
.shadow-glow {
  box-shadow: 0 8px 32px rgba(234, 88, 12, 0.25);
}

/* Session Input */
.premium-input {
  :deep(.q-field__control) {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    height: 56px;
    transition: border-color 0.3s;
  }
  :deep(.q-field__control:hover) {
    border-color: rgba(234, 88, 12, 0.4);
  }
  :deep(.q-field__control.q-field__control--focused) {
    border-color: rgba(234, 88, 12, 0.7) !important;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15);
  }
  :deep(.q-field__prepend) {
    padding-left: 16px;
  }
  :deep(.q-field__append) {
    margin-right: 4px;
    align-items: center;
  }
}
.session-id-input {
  letter-spacing: 3px;
  font-size: 1rem;
  font-family: 'Space Grotesk', monospace;
}
.recovery-error {
  font-size: 0.8rem;
  color: #f87171;
  display: flex;
  align-items: center;
  margin: 0;
}

/* Tables */
.table-legend {
  display: flex;
  font-size: 0.8rem;
  color: #a3a3a3;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.table-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 480px) {
  .table-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.table-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &--free:hover {
    border-color: rgba(34, 197, 94, 0.4);
    transform: translateY(-2px);
  }
  &--taken {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &--selected {
    border-color: #ea580c !important;
    background: rgba(234, 88, 12, 0.15);
  }

  .t-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: #fff;
  }
}

/* Floating Mockups */

/* Tablet - shown on the RIGHT */
.mockup-tablet {
  width: 380px;
  height: 280px;
  background: rgba(255, 255, 255, 0.05);
  border: 8px solid #1a1a1a;
  border-radius: 18px;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(234, 88, 12, 0.08);
  transform: perspective(1200px) rotateY(-20deg) rotateX(5deg);
  overflow: hidden;
}
/* Phone - shown on the LEFT */
.mockup-phone {
  width: 210px;
  height: 420px;
  background: #111;
  border: 8px solid #262626;
  border-radius: 32px;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(234, 88, 12, 0.08);
  transform: perspective(1200px) rotateY(20deg) rotateX(5deg);
  overflow: hidden;
}

.mockup-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}
.mockup-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  filter: saturate(1.15) contrast(1.05);
}

/* Clean gradient overlay at the bottom of each screen */
.mockup-screen-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0) 80%,
    rgba(0, 0, 0, 0.25) 100%
  );
  z-index: 2;
  pointer-events: none;
}

/* Small brand badge on the mockup screens */
.mockup-brand-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 3;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  padding: 6px 14px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #e5e5e5;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mockup-brand-badge--sm {
  padding: 4px 10px;
  font-size: 0.5rem;
  bottom: 10px;
  left: 10px;
}
.brand-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
  animation: pulse 2s infinite;
}

/* Entrance + Floating Animations */

/* Tablet: slides in from RIGHT side */
.mockup-entrance-tablet {
  animation:
    tabletEntrance 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0s both,
    floatTablet 8s ease-in-out 1.6s infinite;
}

/* Phone: slides in from LEFT side */
.mockup-entrance-phone {
  animation:
    phoneEntrance 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both,
    floatPhone 6s ease-in-out 1.8s infinite;
}

@keyframes tabletEntrance {
  0% {
    opacity: 0;
    transform: perspective(1200px) rotateY(-20deg) rotateX(5deg) translateX(250px) scale(0.7);
    filter: blur(12px);
  }
  100% {
    opacity: 1;
    transform: perspective(1200px) rotateY(-20deg) rotateX(5deg) translateX(0) scale(1);
    filter: blur(0px);
  }
}

@keyframes phoneEntrance {
  0% {
    opacity: 0;
    transform: perspective(1200px) rotateY(20deg) rotateX(5deg) translateX(-250px) scale(0.7);
    filter: blur(12px);
  }
  100% {
    opacity: 1;
    transform: perspective(1200px) rotateY(20deg) rotateX(5deg) translateX(0) scale(1);
    filter: blur(0px);
  }
}

@keyframes floatTablet {
  0%,
  100% {
    transform: perspective(1200px) rotateY(-20deg) rotateX(5deg) translateY(0);
  }
  50% {
    transform: perspective(1200px) rotateY(-20deg) rotateX(5deg) translateY(-15px);
  }
}
@keyframes floatPhone {
  0%,
  100% {
    transform: perspective(1200px) rotateY(20deg) rotateX(5deg) translateY(0);
  }
  50% {
    transform: perspective(1200px) rotateY(20deg) rotateX(5deg) translateY(-12px);
  }
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.animate-fade-in-down {
  animation: fadeInDown 0.6s ease both;
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease both;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hero content staggered reveal - appears AFTER device mockups */
.hero-reveal {
  opacity: 0;
  animation: heroReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }
}
.hero-reveal-1 {
  animation-delay: 1.2s;
} /* Badge pill */
.hero-reveal-2 {
  animation-delay: 1.5s;
} /* Title */
.hero-reveal-3 {
  animation-delay: 1.8s;
} /* Subtitle */
.hero-reveal-4 {
  animation-delay: 2.1s;
} /* Welcome card */
</style>
