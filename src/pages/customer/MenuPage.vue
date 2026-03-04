<template>
  <q-page class="premium-menu-page">
    <!-- Hero Header containing Categories and Welcome -->
    <div class="menu-hero">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <div class="hero-content text-center animate-fade-in-down">
        <h1 class="hero-title">Exclusive Menu</h1>
        <p class="hero-subtitle">Crafted with passion, served with excellence.</p>

        <!-- Category Pill Bar -->
        <div class="category-scroll-wrapper q-mt-lg">
          <!-- Left Arrow -->
          <q-btn
            v-show="canScrollLeft"
            flat
            round
            dense
            icon="chevron_left"
            class="cat-arrow cat-arrow--left"
            @click="scrollCatsLeft"
          />

          <!-- Scrollable Track -->
          <div ref="catTrackRef" class="cat-track" @scroll="updateArrowVisibility">
            <q-btn
              v-for="cat in menuStore.categories"
              :key="cat.id"
              :class="['cat-pill', { 'cat-pill--active': menuStore.activeCategory === cat.id }]"
              rounded
              unelevated
              no-caps
              dense
              @click="menuStore.setCategory(cat.id)"
            >
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
            </q-btn>
          </div>

          <!-- Right Arrow -->
          <q-btn
            v-show="canScrollRight"
            flat
            round
            dense
            icon="chevron_right"
            class="cat-arrow cat-arrow--right"
            @click="scrollCatsRight"
          />
        </div>
      </div>
    </div>

    <!-- Main Content Container with negative margin pulling up into hero -->
    <div class="menu-container">
      <!-- Fire Popular Items Horizontal Swipe (Only on "All") -->
      <transition name="fade-slide">
        <div
          v-if="menuStore.activeCategory === 'all' && !menuStore.searchQuery"
          class="popular-section q-mb-xl"
        >
          <div class="section-header row items-center justify-between q-mx-md q-mb-md">
            <h2 class="section-title">
              <q-icon name="whatshot" color="orange" size="24px" class="q-mr-xs" /> Chef's Specials
            </h2>
            <q-btn
              flat
              round
              dense
              icon="arrow_forward"
              color="grey-5"
              @click="scrollPopularRight"
            />
          </div>

          <q-scroll-area
            ref="popularScrollRef"
            class="popular-scroll"
            :thumb-style="{ display: 'none' }"
            horizontal
          >
            <div class="popular-track">
              <!-- Inline Popular Card -->
              <div
                v-for="(item, i) in menuStore.popularItems"
                :key="item.id"
                class="pop-card animate-fade-in-right glass-card-dark"
                :style="`animation-delay: ${0.1 * (i % 6)}s`"
                @click="openDetail(item)"
              >
                <div class="pop-img" :style="{ background: item.gradient }">
                  <img :src="getImageUrl(item)" class="pop-img-element" loading="lazy" />
                  <div class="pop-overlay"></div>
                </div>
                <div class="pop-body">
                  <h3 class="pop-name">{{ item.name }}</h3>
                  <div class="pop-foot">
                    <span class="pop-price text-orange">Rs. {{ item.price.toLocaleString() }}</span>
                    <q-btn
                      round
                      dense
                      unelevated
                      size="sm"
                      icon="add"
                      class="pop-add"
                      @click.stop="addToCart(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-scroll-area>
        </div>
      </transition>

      <!-- The Main Grid -->
      <div class="grid-section q-px-md q-pb-xl">
        <div class="section-header q-mb-md">
          <h2 class="section-title text-capitalize">
            {{
              menuStore.activeCategory === 'all'
                ? 'Discover Everything'
                : menuStore.categories.find((c) => c.id === menuStore.activeCategory)?.name
            }}
            <q-badge rounded color="grey-8" class="q-ml-sm badge-count">{{
              menuStore.filteredItems.length
            }}</q-badge>
          </h2>
        </div>

        <div class="premium-grid">
          <MenuItemCard
            v-for="(item, i) in menuStore.filteredItems"
            :key="item.id"
            :item="item"
            :style="`animation-delay: ${(i % 8) * 0.05}s`"
            class="animate-fade-in-up"
            @add="addToCart(item)"
            @click="openDetail(item)"
          />
        </div>

        <!-- Empty State -->
        <div v-if="menuStore.filteredItems.length === 0" class="empty-state">
          <div class="empty-icon"><q-icon name="search_off" /></div>
          <h3 class="empty-text">No items found</h3>
          <p class="empty-sub">Try another category or search term.</p>
        </div>
      </div>
    </div>

    <!-- Cart Floating Action Button -->
    <q-page-sticky position="bottom-right" :offset="[24, 80]">
      <q-btn
        v-if="cartStore.totalItems > 0"
        fab
        icon="shopping_bag"
        color="orange-9"
        class="premium-cart-btn shadow-glow animate-bounce-in"
        @click="cartOpen = true"
      >
        <div class="cart-badge">{{ cartStore.totalItems }}</div>
      </q-btn>
    </q-page-sticky>

    <!-- Cart Drawer -->
    <CartDrawer v-model="cartOpen" />

    <!-- Premium Detail Dialog -->
    <q-dialog v-model="detailOpen" position="bottom" class="detail-modal">
      <q-card class="detail-card glass-panel-dark glass-blur">
        <div class="detail-header" :style="{ background: selectedItem?.gradient }">
          <img v-if="selectedItem" :src="getImageUrl(selectedItem)" class="detail-image-element" />
          <div class="detail-header-overlay"></div>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="btn-close shadow-soft"
            @click="detailOpen = false"
          />
        </div>

        <q-card-section class="detail-body q-pt-xl q-px-lg">
          <div class="row items-center justify-between q-mb-sm">
            <h2 class="detail-title">{{ selectedItem?.name }}</h2>
            <div class="detail-price">Rs. {{ selectedItem?.price?.toLocaleString() }}</div>
          </div>
          <p class="detail-desc q-mb-lg">{{ selectedItem?.description }}</p>

          <div class="detail-notes-section q-mb-md">
            <div class="notes-label q-mb-sm">
              <q-icon name="edit_note" color="grey-5" /> Special Instructions
            </div>
            <q-input
              v-model="itemNotes"
              type="textarea"
              dark
              outlined
              placeholder="E.g., extra spicy, no onions, allergies..."
              class="premium-notes-input"
              rows="3"
            />
          </div>
        </q-card-section>

        <q-card-actions class="detail-footer q-pa-lg">
          <q-btn
            class="btn-add-main full-width shadow-glow"
            rounded
            unelevated
            no-caps
            size="lg"
            @click="addToCartWithNotes"
          >
            <q-icon name="shopping_cart_checkout" class="q-mr-sm" />
            Add to Order
            <q-space />
            <span class="add-price">Rs. {{ selectedItem?.price?.toLocaleString() }}</span>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useMenuStore } from 'stores/menu-store'
import { useCartStore } from 'stores/cart-store'
import { useQuasar } from 'quasar'
import MenuItemCard from 'components/customer/MenuItemCard.vue'
import CartDrawer from 'components/customer/CartDrawer.vue'

const $q = useQuasar()
const menuStore = useMenuStore()
const cartStore = useCartStore()

const cartOpen = ref(false)
const detailOpen = ref(false)
const selectedItem = ref(null)
const itemNotes = ref('')
const popularScrollRef = ref(null)
const catTrackRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function updateArrowVisibility() {
  const el = catTrackRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 4
}

function scrollCatsLeft() {
  const el = catTrackRef.value
  if (!el) return
  el.scrollBy({ left: -200, behavior: 'smooth' })
}

function scrollCatsRight() {
  const el = catTrackRef.value
  if (!el) return
  el.scrollBy({ left: 200, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(() => updateArrowVisibility())
})

// High resolution fixed curated Unsplash foodie images matching categories
const imageMap = {
  starters: [
    'https://images.unsplash.com/photo-1600806443313-093a19db3f57?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628294895692-0b81b212f71f?q=80&w=800&auto=format&fit=crop',
  ],
  'rice-curry': [
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582222066060-e4b5d2da8803?q=80&w=800&auto=format&fit=crop',
  ],
  kottu: [
    'https://images.unsplash.com/photo-1626200230232-a5e1f0e21b7d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800&auto=format&fit=crop',
  ],
  burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594212693290-7170a44f33fd?q=80&w=800&auto=format&fit=crop',
  ],
  pasta: [
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop',
  ],
  seafood: [
    'https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622312684813-f42f2edab28d?q=80&w=800&auto=format&fit=crop',
  ],
  beverages: [
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop',
  ],
  desserts: [
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop',
  ],
}
const fallbackImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800&auto=format&fit=crop',
]

function getImageUrl(item) {
  if (!item) return fallbackImages[0]
  const images = imageMap[item.category] || fallbackImages
  return images[item.id % images.length]
}

function openDetail(item) {
  selectedItem.value = item
  itemNotes.value = ''
  detailOpen.value = true
}

function scrollPopularRight() {
  if (popularScrollRef.value) {
    const info = popularScrollRef.value.getScrollPosition()
    popularScrollRef.value.setScrollPosition('horizontal', info + 200, 300)
  }
}

function addToCart(item) {
  cartStore.addItem(item)
  const imgHtml = `<img src="${getImageUrl(item)}" style="width:40px; height:40px; border-radius:8px; object-fit:cover; box-shadow:0 4px 8px rgba(0,0,0,0.5);" />`
  $q.notify({
    message: `<div style="display:flex; align-items:center; gap:12px">${imgHtml} <div><div style="font-weight:700">${item.name}</div><div style="font-size:12px;opacity:0.8; color:#a3a3a3">Added to cart seamlessly</div></div></div>`,
    html: true,
    color: 'dark',
    position: 'top',
    timeout: 2000,
    classes: 'glass-toast border-positive',
  })
}

function addToCartWithNotes() {
  cartStore.addItem(selectedItem.value, itemNotes.value)
  const imgHtml = `<img src="${getImageUrl(selectedItem.value)}" style="width:40px; height:40px; border-radius:8px; object-fit:cover; box-shadow:0 4px 8px rgba(0,0,0,0.5);" />`
  $q.notify({
    message: `<div style="display:flex; align-items:center; gap:12px">${imgHtml} <div><div style="font-weight:700">${selectedItem.value.name}</div><div style="font-size:12px;opacity:0.8; color:#a3a3a3">Added with special instructions</div></div></div>`,
    html: true,
    color: 'dark',
    position: 'top',
    timeout: 2000,
    classes: 'glass-toast border-positive',
  })
  detailOpen.value = false
}
</script>

<style lang="scss" scoped>
/* Page Layout */
.premium-menu-page {
  background: #050505;
  min-height: 100vh;
  color: #fff;
  font-family: 'Inter', sans-serif;
  padding-bottom: 100px;
}

/* Hero Section */
.menu-hero {
  position: relative;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 40px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1934&auto=format&fit=crop')
    center/cover no-repeat;
  filter: brightness(0.2) contrast(1.1) saturate(1.2);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(5, 5, 5, 0.2) 0%, #050505 100%);
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 20px;
}
.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #fff, #a3a3a3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: 1rem;
  color: #a3a3a3;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Categories */
.category-scroll-wrapper {
  width: 100%;
  max-width: 900px;
  margin: 24px auto 0;
  display: flex;
  align-items: center;
  position: relative;
  gap: 4px;
}
.cat-arrow {
  color: rgba(255, 255, 255, 0.85) !important;
  background: rgba(0, 0, 0, 0.45) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 36px;
  height: 36px;
  min-width: 36px;
  flex-shrink: 0;
  z-index: 5;
  transition: all 0.25s ease;
  &:hover {
    background: rgba(234, 88, 12, 0.6) !important;
    border-color: rgba(234, 88, 12, 0.5);
    transform: scale(1.08);
  }
}
.cat-track {
  display: flex;
  gap: 10px;
  padding: 4px 8px;
  align-items: center;
  overflow-x: auto;
  scroll-behavior: smooth;
  flex: 1;
  min-width: 0;
  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.cat-pill {
  height: 44px;
  padding: 0 20px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  color: #a3a3a3;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &--active {
    background: #ea580c !important;
    color: #fff;
    box-shadow: 0 8px 20px rgba(234, 88, 12, 0.4);
    border-color: #ea580c;
  }
  &:hover:not(.cat-pill--active) {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
    color: #e5e5e5;
  }
}

/* Sections */
.menu-container {
  max-width: 1300px;
  margin: -20px auto 0;
  position: relative;
  z-index: 10;
}
.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f5f5f5;
  margin: 0;
  display: flex;
  align-items: center;
}

/* Popular Swiper */
.popular-scroll {
  height: 230px;
  width: 100%;
}
.popular-track {
  display: flex;
  gap: 16px;
  padding: 0 16px 20px;
  height: 100%;
  align-items: flex-start;
}
.pop-card {
  width: 160px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  background: rgba(20, 20, 20, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.6);
    border-color: rgba(234, 88, 12, 0.3);
    .pop-img-element {
      transform: scale(1.1);
    }
  }
}
.pop-img {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #111;
}
.pop-img-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: transform 0.5s ease;
  filter: saturate(1.1) contrast(1.1);
}
.pop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  z-index: 2;
}
.pop-body {
  padding: 12px;
  position: relative;
  z-index: 3;
}
.pop-name {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}
.pop-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pop-price {
  font-weight: 700;
  font-size: 0.85rem;
}
.pop-add {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff;
  width: 28px;
  height: 28px;
}

/* Grid */
.premium-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}
.badge-count {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  margin: 0 16px;
}
.empty-icon {
  font-size: 64px;
  color: rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}
.empty-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #a3a3a3;
}
.empty-sub {
  color: #525252;
  margin: 0;
}

/* FAB */
.premium-cart-btn {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #ea580c, #f59e0b) !important;
  color: #fff;
  .q-icon {
    font-size: 28px;
  }
}
.shadow-glow {
  box-shadow: 0 10px 30px rgba(234, 88, 12, 0.4);
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
  border: 2px solid #050505;
}

/* Modal Detail View */
.detail-modal {
  :deep(.q-dialog__inner) {
    padding: 0;
    @media (min-width: 600px) {
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.detail-card {
  width: 100%;
  max-width: 500px;
  border-radius: 28px 28px 0 0;
  background: #121212;
  overflow: hidden;
  box-shadow: 0 -20px 40px rgba(0, 0, 0, 0.5);
  @media (min-width: 600px) {
    border-radius: 28px;
    max-height: 90vh;
  }
}
.detail-header {
  height: 260px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
}
.detail-image-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  filter: saturate(1.1);
  transition: transform 5s ease-out;
  transform: scale(1.05);
}
.detail-card:hover .detail-image-element {
  transform: scale(1);
}
.detail-header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #121212 0%, transparent 100%);
}
.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.4) !important;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  z-index: 10;
}
.detail-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.detail-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ea580c;
}
.detail-desc {
  font-size: 0.95rem;
  color: #a3a3a3;
  line-height: 1.6;
}
.notes-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #d4d4d4;
}
.premium-notes-input {
  :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
  }
}

.detail-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
}
.btn-add-main {
  background: linear-gradient(135deg, #ea580c, #f59e0b) !important;
  color: white;
  height: 60px;
  font-weight: 700;
  font-size: 1.1rem;
  .add-price {
    background: rgba(0, 0, 0, 0.2);
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 0.9rem;
  }
}

/* Utility / Anim Classes */
.glass-panel-dark {
  background: rgba(15, 15, 15, 0.8) !important;
}
.glass-blur {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.shadow-soft {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}
.animate-fade-in-right {
  animation: fadeInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}
.animate-pop {
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
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
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<style lang="scss">
/* Global notification toast */
.glass-toast {
  background: rgba(20, 20, 20, 0.8) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', sans-serif;
}
.border-positive {
  border-left: 4px solid #22c55e !important;
}
</style>
