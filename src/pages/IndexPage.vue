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

      <div class="hero-grid">
        <!-- LEFT COLUMN: Typography & Login Flow -->
        <div class="hero-left animate-fade-in-up stagger-1">
          <div class="badge-pill q-mb-lg">
            <span class="dot pulse-dot"></span>
            Live Digital Menu Version 2.0
          </div>

          <h1 class="hero-title">
            The Future of <br />
            <span class="gradient-text">Fine Dining</span>
          </h1>

          <p class="hero-subtitle q-mb-xl">
            Experience our interactive digital menu. From kitchen to table, enjoy seamless ordering,
            immersive food previews, and real-time tracking.
          </p>

          <!-- Interactive Login Card -->
          <div class="glass-panel main-interaction-card">
            <transition name="fade-slide" mode="out-in">
              <!-- VIEW 1: Welcome -->
              <div v-if="!showTableSelection" class="view-welcome text-left" key="welcome">
                <h2 class="card-title">Welcome Guest</h2>
                <p class="card-subtitle q-mb-md">Choose how to get started.</p>

                <div class="row q-col-gutter-md align-items-center">
                  <div class="col-12 col-sm-6 flex">
                    <q-btn
                      class="btn-primary full-width shadow-glow"
                      rounded
                      unelevated
                      no-caps
                      size="lg"
                      @click="showTableSelection = true"
                    >
                      <q-icon name="table_restaurant" class="q-mr-sm" />
                      Select a Table
                    </q-btn>
                  </div>
                  <div class="col-12 col-sm-6 flex">
                    <q-input
                      v-model="recoveryId"
                      dark
                      outlined
                      rounded
                      dense
                      placeholder="SESSION ID (SD-XXXX)"
                      class="premium-input session-input full-width"
                      input-class="text-weight-bold text-uppercase text-tracking"
                      @keyup.enter="recoverSession"
                      maxlength="7"
                    >
                      <template v-slot:append v-if="recoveryId">
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
                  </div>
                </div>
                <p v-if="recoveryError" class="text-red-4 q-mt-sm text-caption">
                  {{ recoveryError }}
                </p>
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

        <!-- RIGHT COLUMN: Floating Device Mockups -->
        <div class="hero-right hide-on-mobile animate-fade-in-up stagger-3">
          <div class="mockup-container">
            <!-- Tablet Mockup floating -->
            <div class="mockup-tablet floating-1">
              <div class="mockup-screen">
                <video autoplay loop muted playsinline class="mockup-video">
                  <source
                    src="https://cdn.pixabay.com/video/2021/08/25/86400-593539050_tiny.mp4"
                    type="video/mp4"
                  />
                </video>
                <div class="mockup-ui">
                  <div class="mockup-header"></div>
                  <div class="mockup-hero"></div>
                  <div class="mockup-grid">
                    <div class="mockup-card"></div>
                    <div class="mockup-card"></div>
                    <div class="mockup-card"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phone Mockup floating (offset) -->
            <div class="mockup-phone floating-2">
              <div class="mockup-screen">
                <video autoplay loop muted playsinline class="mockup-video">
                  <source
                    src="https://cdn.pixabay.com/video/2019/11/08/28859-371406606_tiny.mp4"
                    type="video/mp4"
                  />
                </video>
                <div class="mockup-ui-phone">
                  <div class="mockup-header-phone"></div>
                  <div class="mockup-card-phone"></div>
                  <div class="mockup-card-phone"></div>
                </div>
              </div>
            </div>
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

/* Grid Layout */
.hero-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 40px;
}
@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 20px;
    align-items: center;
  }
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
  font-size: clamp(3.5rem, 5vw, 5.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 24px 0;
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
  max-width: 600px;
  @media (max-width: 900px) {
    margin: 0 auto;
  }
}
.card-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}
.card-subtitle {
  font-size: 0.95rem;
  color: #a3a3a3;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #ea580c, #f59e0b) !important;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 10px 0;
  height: 56px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(234, 88, 12, 0.4);
}
.shadow-glow {
  box-shadow: 0 8px 32px rgba(234, 88, 12, 0.25);
}

.premium-input {
  :deep(.q-field__control) {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    height: 56px;
  }
  :deep(.q-field__append) {
    margin-right: 4px;
    align-items: center;
  }
}
.text-tracking {
  letter-spacing: 2px;
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

/* Floating Mockups Area */
.mockup-container {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tablet */
.mockup-tablet {
  width: 420px;
  height: 310px;
  background: rgba(255, 255, 255, 0.05);
  border: 10px solid #1a1a1a;
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  position: absolute;
  right: 40px;
  top: 80px;
  transform: perspective(1000px) rotateY(-15deg) rotateX(10deg);
  overflow: hidden;
  z-index: 1;
}
/* Phone */
.mockup-phone {
  width: 180px;
  height: 360px;
  background: #111;
  border: 8px solid #262626;
  border-radius: 30px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 20px;
  bottom: 80px;
  transform: perspective(1000px) rotateY(-10deg) rotateX(5deg) translateZ(50px);
  overflow: hidden;
  z-index: 2;
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
  opacity: 0.6;
}

/* Fake UI overlays to make it look like our app running over the video */
.mockup-ui {
  position: absolute;
  inset: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mockup-header {
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(4px);
}
.mockup-hero {
  height: 80px;
  background: rgba(234, 88, 12, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(4px);
}
.mockup-grid {
  display: flex;
  gap: 12px;
}
.mockup-card {
  flex: 1;
  height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.mockup-ui-phone {
  position: absolute;
  inset: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mockup-header-phone {
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}
.mockup-card-phone {
  height: 100px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(8px);
}

/* Floating Animations */
.floating-1 {
  animation: float1 8s ease-in-out infinite;
}
.floating-2 {
  animation: float2 6s ease-in-out infinite;
  animation-delay: -2s;
}
@keyframes float1 {
  0%,
  100% {
    transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(0);
  }
  50% {
    transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(-20px);
  }
}
@keyframes float2 {
  0%,
  100% {
    transform: perspective(1000px) rotateY(-10deg) rotateX(5deg) translateZ(50px) translateY(0);
  }
  50% {
    transform: perspective(1000px) rotateY(-10deg) rotateX(5deg) translateZ(50px) translateY(-15px);
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
</style>
