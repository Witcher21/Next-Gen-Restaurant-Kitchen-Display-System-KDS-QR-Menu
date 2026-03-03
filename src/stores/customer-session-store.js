/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         SmartDine Customer Session Manager               ║
 * ║   Unique ID · Session Recovery · Order Isolation         ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Every customer gets a unique session ID (e.g. SD-K7X3).
 * Phone off → come back → enter ID → resume session.
 * Each customer only sees THEIR orders.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCustomerSessionStore = defineStore('customerSession', () => {
  const sessionId = ref(null)
  const tableNumber = ref(null)
  const isActive = ref(false)
  const createdAt = ref(null)

  // ── Generate unique customer ID ──
  // Format: SD-XXXX (e.g. SD-K7X3)
  function generateId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No confusing 0/O/1/I
    let id = 'SD-'
    for (let i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  // ── Start new session ──
  function startSession(table) {
    sessionId.value = generateId()
    tableNumber.value = table
    isActive.value = true
    createdAt.value = new Date().toISOString()

    // Save to localStorage for recovery
    saveToStorage()

    return sessionId.value
  }

  // ── Recover session by ID ──
  function recoverSession(id) {
    const savedSessions = getAllSavedSessions()
    const session = savedSessions.find((s) => s.sessionId === id.toUpperCase())
    if (session) {
      sessionId.value = session.sessionId
      tableNumber.value = session.tableNumber
      isActive.value = true
      createdAt.value = session.createdAt
      return true
    }
    return false
  }

  // ── End session ──
  function endSession() {
    // Keep in localStorage for potential recovery, but mark as ended
    const savedSessions = getAllSavedSessions()
    const idx = savedSessions.findIndex((s) => s.sessionId === sessionId.value)
    if (idx !== -1) {
      savedSessions[idx].ended = true
      localStorage.setItem('smartdine_sessions', JSON.stringify(savedSessions))
    }
    sessionId.value = null
    tableNumber.value = null
    isActive.value = false
    createdAt.value = null
  }

  // ── Storage helpers ──
  function saveToStorage() {
    const savedSessions = getAllSavedSessions()
    // Avoid duplicates
    const existing = savedSessions.findIndex((s) => s.sessionId === sessionId.value)
    const sessionData = {
      sessionId: sessionId.value,
      tableNumber: tableNumber.value,
      createdAt: createdAt.value,
      ended: false,
    }
    if (existing !== -1) {
      savedSessions[existing] = sessionData
    } else {
      savedSessions.push(sessionData)
    }
    // Keep max 50 sessions
    if (savedSessions.length > 50) savedSessions.shift()
    localStorage.setItem('smartdine_sessions', JSON.stringify(savedSessions))
    // Also save "current" for auto-restore
    localStorage.setItem('smartdine_current_session', sessionId.value)
  }

  function getAllSavedSessions() {
    try {
      return JSON.parse(localStorage.getItem('smartdine_sessions') || '[]')
    } catch {
      return []
    }
  }

  // ── Try auto-restore from localStorage ──
  function tryAutoRestore() {
    const currentId = localStorage.getItem('smartdine_current_session')
    if (currentId) {
      return recoverSession(currentId)
    }
    return false
  }

  // ── Clear current session from auto-restore ──
  function clearAutoRestore() {
    localStorage.removeItem('smartdine_current_session')
  }

  const sessionInfo = computed(() => ({
    id: sessionId.value,
    table: tableNumber.value,
    active: isActive.value,
    since: createdAt.value,
  }))

  return {
    sessionId,
    tableNumber,
    isActive,
    createdAt,
    sessionInfo,
    generateId,
    startSession,
    recoverSession,
    endSession,
    tryAutoRestore,
    clearAutoRestore,
    getAllSavedSessions,
  }
})
