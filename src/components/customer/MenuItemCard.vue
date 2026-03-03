<template>
  <q-card class="premium-item-card" dark flat @click="$emit('click')">
    <div class="card-img-wrapper">
      <!-- Premium CSS Background Mesh while loading -->
      <div v-if="!imageLoaded" class="card-placeholder" :style="{ background: item.gradient }">
        <span class="card-emoji">{{ item.emoji }}</span>
      </div>

      <!-- Actual Food Image -->
      <img
        :src="imageUrl"
        class="card-img-element"
        :class="{ 'img-loaded': imageLoaded }"
        @load="imageLoaded = true"
        loading="lazy"
        alt="food"
      />

      <div class="card-overlay"></div>

      <div v-if="item.isPopular" class="badge-glass popular-badge">
        <q-icon name="local_fire_department" color="orange" size="12px" class="q-mr-xs" /> Popular
      </div>
    </div>

    <q-card-section class="card-body">
      <div class="name-row justify-between items-start no-wrap q-mb-xs">
        <div class="card-name">{{ item.name }}</div>
      </div>
      <div class="card-desc">{{ item.description }}</div>

      <div class="action-row q-mt-md">
        <div class="price-val">Rs. {{ item.price.toLocaleString() }}</div>
        <q-btn
          round
          dense
          unelevated
          icon="add"
          class="add-btn shadow-soft"
          @click.stop="$emit('add')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ item: { type: Object, required: true } })
defineEmits(['add', 'click'])

const imageLoaded = ref(false)

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

const imageUrl = computed(() => {
  const images = imageMap[props.item.category] || fallbackImages
  return images[props.item.id % images.length]
})
</script>

<style lang="scss" scoped>
.premium-item-card {
  background: rgba(20, 20, 20, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    border-color: rgba(234, 88, 12, 0.3);
    background: rgba(30, 30, 30, 0.5);

    .card-img-element {
      transform: scale(1.1) rotate(1deg);
    }
    .card-emoji {
      transform: scale(1.2);
    }
    .add-btn {
      background: #ea580c !important;
      color: #fff;
      transform: scale(1.1);
      box-shadow: 0 0 16px rgba(234, 88, 12, 0.6);
    }
  }
}

.card-img-wrapper {
  height: 160px;
  position: relative;
  overflow: hidden;
  background: #111;
}

.card-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.card-emoji {
  font-size: 64px;
  opacity: 0.8;
  transition: transform 0.4s;
}

.card-img-element {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition:
    transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.4s;
  z-index: 2;
  filter: saturate(1.1) contrast(1.1);
}
.img-loaded {
  opacity: 1;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 100%
  );
  z-index: 3;
  pointer-events: none;
}

.badge-glass {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 4;
}

.card-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fafaf9;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 0.8rem;
  color: #a3a3a3;
  margin-top: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
}

.price-val {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: #ea580c;
  background: rgba(234, 88, 12, 0.1);
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid rgba(234, 88, 12, 0.2);
}

.add-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fafaf9;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 36px;
  height: 36px;
}
.shadow-soft {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
