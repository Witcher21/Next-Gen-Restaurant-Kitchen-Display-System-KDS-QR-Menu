<template>
  <q-page class="login-page">
    <!-- Animated background -->
    <div class="login-bg">
      <div class="bg-orb bg-orb--1"></div>
      <div class="bg-orb bg-orb--2"></div>
    </div>

    <div class="login-content">
      <!-- Logo -->
      <div class="logo-section animate-fade-in-up">
        <q-icon name="admin_panel_settings" size="56px" color="orange" />
        <h2 class="logo-text">
          <span class="gradient-text">SmartDine</span>
        </h2>
        <p class="logo-tagline">ADMIN ACCESS</p>
      </div>

      <!-- Login Card -->
      <div class="glass-card login-card animate-fade-in-up stagger-2">
        <div class="text-center q-mb-lg">
          <q-icon name="lock" size="28px" color="orange" />
          <h5
            class="text-weight-bold q-mt-sm q-mb-xs"
            style="font-family: 'Space Grotesk', sans-serif"
          >
            Admin Access
          </h5>
          <p class="text-grey-6" style="font-size: 0.8rem">
            Enter ID and PIN to Register or Log In
          </p>
        </div>

        <!-- Admin ID -->
        <q-input
          v-model="adminId"
          dark
          outlined
          rounded
          dense
          label="Admin ID"
          placeholder="e.g., ADMIN-001"
          class="q-mb-md login-input"
          @keyup.enter="$refs.pinInput.focus()"
        >
          <template v-slot:prepend><q-icon name="badge" color="orange" /></template>
        </q-input>

        <!-- PIN -->
        <q-input
          ref="pinInput"
          v-model="pin"
          dark
          outlined
          rounded
          dense
          label="PIN"
          type="password"
          placeholder="Enter 4-digit PIN"
          maxlength="4"
          class="q-mb-lg login-input"
          @keyup.enter="doLogin"
        >
          <template v-slot:prepend><q-icon name="pin" color="orange" /></template>
        </q-input>

        <!-- Error -->
        <p v-if="error" class="text-red text-center q-mb-md" style="font-size: 0.8rem">
          <q-icon name="error" class="q-mr-xs" /> {{ error }}
        </p>

        <!-- Login Button -->
        <q-btn
          class="login-btn full-width"
          rounded
          unelevated
          size="lg"
          no-caps
          :loading="loading"
          @click="doLogin"
        >
          <q-icon name="login" class="q-mr-sm" />
          <span class="text-weight-bold">Register / Log In</span>
        </q-btn>

        <!-- Quick PIN Login -->
        <q-separator dark class="q-my-lg" />
        <div class="text-center">
          <p class="text-grey-5" style="font-size: 0.8rem; font-weight: 600">Quick PIN Login</p>
          <div class="pin-grid q-mt-sm">
            <q-btn
              v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '→']"
              :key="n"
              flat
              rounded
              :class="[
                'pin-key',
                n === '→' ? 'pin-key--enter' : '',
                n === '⌫' ? 'pin-key--del' : '',
              ]"
              @click="handlePinKey(n)"
            >
              {{ n }}
            </q-btn>
          </div>
          <div class="pin-dots q-mt-md">
            <div
              v-for="i in 4"
              :key="i"
              class="pin-dot"
              :class="{ 'pin-dot--filled': quickPin.length >= i }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Back to customer -->
      <div class="text-center q-mt-lg animate-fade-in-up stagger-4">
        <q-btn
          flat
          no-caps
          rounded
          color="grey-5"
          label="← Back to Customer"
          :to="{ name: 'landing' }"
          size="sm"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminAuthStore } from 'stores/admin-auth-store'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const authStore = useAdminAuthStore()
const $q = useQuasar()

const adminId = ref('')
const pin = ref('')
const quickPin = ref('')
const error = ref('')
const loading = ref(false)

// Full login
function doLogin() {
  error.value = ''
  if (!adminId.value || !pin.value) {
    error.value = 'Please enter Admin ID and PIN'
    return
  }
  loading.value = true
  setTimeout(() => {
    const result = authStore.login(adminId.value, pin.value)
    loading.value = false
    if (result.success) {
      $q.notify({
        message: `Welcome, ${result.name}!`,
        caption: `Role: ${result.role}`,
        color: 'green',
        position: 'top',
        timeout: 3000,
        icon: 'verified_user',
      })
      // Redirect to intended page or admin dashboard
      const redirect = route.query.redirect || '/admin'
      router.push(redirect)
    } else {
      error.value = result.error
    }
  }, 800)
}

// Quick PIN pad
function handlePinKey(key) {
  if (key === '⌫') {
    quickPin.value = quickPin.value.slice(0, -1)
    return
  }
  if (key === '→') {
    if (quickPin.value.length === 4) {
      const result = authStore.quickLogin(quickPin.value)
      if (result.success) {
        $q.notify({
          message: `Welcome, ${result.name}!`,
          color: 'green',
          position: 'top',
          timeout: 2000,
          icon: 'verified_user',
        })
        const redirect = route.query.redirect || '/admin'
        router.push(redirect)
      } else {
        error.value = 'Invalid PIN'
        quickPin.value = ''
      }
    }
    return
  }
  if (quickPin.value.length < 4) {
    quickPin.value += String(key)
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c0a09;
  position: relative;
  overflow: hidden;
}
.login-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
  &--1 {
    width: 400px;
    height: 400px;
    background: #ea580c;
    top: -15%;
    right: -10%;
    animation: float 20s ease-in-out infinite;
  }
  &--2 {
    width: 300px;
    height: 300px;
    background: #ef4444;
    bottom: -10%;
    left: -10%;
    animation: float 25s ease-in-out infinite reverse;
  }
}
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -30px);
  }
  66% {
    transform: translate(-20px, 20px);
  }
}
.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}
.logo-section {
  text-align: center;
  margin-bottom: 24px;
}
.logo-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 8px 0 0;
}
.logo-tagline {
  color: #78716c;
  font-size: 0.85rem;
  letter-spacing: 6px;
  text-transform: uppercase;
  margin-top: 4px;
}
.login-card {
  padding: 32px;
}
.login-btn {
  background: linear-gradient(135deg, #ea580c, #f59e0b) !important;
  color: white;
  font-size: 1rem;
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.3);
  &:hover {
    box-shadow: 0 12px 32px rgba(234, 88, 12, 0.5);
    transform: translateY(-2px);
  }
  transition: all 0.3s ease;
}
.login-input {
  :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.04);
  }
}
.pin-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 240px;
  margin: 0 auto;
}
.pin-key {
  background: rgba(255, 255, 255, 0.06);
  color: #fafaf9;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: 'Space Grotesk', monospace;
  width: 60px;
  height: 48px;
  &:hover {
    background: rgba(234, 88, 12, 0.15);
  }
  &--enter {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }
  &--del {
    color: #ef4444;
  }
}
.pin-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.pin-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #44403c;
  background: transparent;
  transition: all 0.2s ease;
  &--filled {
    background: #ea580c;
    border-color: #ea580c;
  }
}
</style>
