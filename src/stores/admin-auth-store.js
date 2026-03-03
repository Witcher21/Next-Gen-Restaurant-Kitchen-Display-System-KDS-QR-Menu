/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║           SmartDine Admin Authentication                 ║
 * ║    Login · Persistent Session · Role-Based Access        ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Admin must log in to access KDS + Admin Panel.
 * Admin ID saved in localStorage — stays logged in forever.
 * Customers can NEVER see KDS/Admin nav icons unless admin is logged in.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const isLoggedIn = ref(false)
  const adminId = ref(null)
  const adminName = ref(null)
  const loginTime = ref(null)

  // Load registered admins from localStorage
  const registeredAdmins = ref([])
  function loadRegisteredAdmins() {
    try {
      const saved = localStorage.getItem('smartdine_registered_admins')
      if (saved) {
        registeredAdmins.value = JSON.parse(saved)
      }
    } catch {
      registeredAdmins.value = []
    }
  }
  loadRegisteredAdmins()

  function saveRegisteredAdmins() {
    localStorage.setItem('smartdine_registered_admins', JSON.stringify(registeredAdmins.value))
  }

  // ── Login or Signup ──
  function login(id, pin) {
    let account = registeredAdmins.value.find((a) => a.id.toUpperCase() === id.toUpperCase())

    if (account) {
      if (account.pin !== pin) return { success: false, error: 'Incorrect PIN for this ID' }
    } else {
      // Sign up new admin
      account = { id: id.toUpperCase(), name: 'Admin ' + id, pin, role: 'admin' }
      // Check if PIN is already used
      if (registeredAdmins.value.some((a) => a.pin === pin)) {
        return { success: false, error: 'This PIN is already used by another Admin' }
      }
      registeredAdmins.value.push(account)
      saveRegisteredAdmins()
    }

    isLoggedIn.value = true
    adminId.value = account.id
    adminName.value = account.name
    loginTime.value = new Date().toISOString()
    saveToStorage()
    return { success: true, name: account.name, role: account.role }
  }

  function quickLogin(pin) {
    const account = registeredAdmins.value.find((a) => a.pin === pin)
    if (account) {
      isLoggedIn.value = true
      adminId.value = account.id
      adminName.value = account.name
      loginTime.value = new Date().toISOString()
      saveToStorage()
      return { success: true, name: account.name, role: account.role }
    }
    return { success: false, error: 'Invalid PIN' }
  }

  // ── Logout ──
  function logout() {
    isLoggedIn.value = false
    adminId.value = null
    adminName.value = null
    loginTime.value = null
    localStorage.removeItem('smartdine_admin_session')
  }

  // ── Persistence ──
  function saveToStorage() {
    localStorage.setItem(
      'smartdine_admin_session',
      JSON.stringify({
        isLoggedIn: true,
        adminId: adminId.value,
        adminName: adminName.value,
        loginTime: loginTime.value,
      }),
    )
  }

  // ── Auto-restore from localStorage ──
  function tryAutoRestore() {
    try {
      const saved = JSON.parse(localStorage.getItem('smartdine_admin_session'))
      if (saved && saved.isLoggedIn) {
        isLoggedIn.value = true
        adminId.value = saved.adminId
        adminName.value = saved.adminName
        loginTime.value = saved.loginTime
        return true
      }
    } catch {
      /* ignore */
    }
    return false
  }

  const sessionInfo = computed(() => ({
    loggedIn: isLoggedIn.value,
    id: adminId.value,
    name: adminName.value,
    since: loginTime.value,
  }))

  return {
    isLoggedIn,
    adminId,
    adminName,
    loginTime,
    registeredAdmins,
    sessionInfo,
    login,
    quickLogin,
    logout,
    tryAutoRestore,
  }
})
