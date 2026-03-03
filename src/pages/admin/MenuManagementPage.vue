<template>
  <q-page class="admin-page">
    <div class="page-padding">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h4 class="q-mb-xs text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
            Menu Management
          </h4>
          <p class="text-grey-6 q-mb-none">
            Manage your restaurant's menu items ({{ menuStore.menuItems.length }} items)
          </p>
        </div>
        <q-btn
          rounded
          unelevated
          color="orange-9"
          no-caps
          icon="add"
          label="Add Item"
          @click="openAddDialog"
        />
      </div>

      <!-- Category Filter -->
      <q-scroll-area style="height: 48px" class="q-mb-lg" :thumb-style="{ display: 'none' }">
        <div class="row no-wrap q-gutter-sm">
          <q-btn
            v-for="cat in menuStore.categories"
            :key="cat.id"
            :class="[
              'category-chip',
              { 'category-chip--active': menuStore.activeCategory === cat.id },
            ]"
            rounded
            unelevated
            no-caps
            dense
            @click="menuStore.setCategory(cat.id)"
          >
            <span class="q-mr-xs">{{ cat.icon }}</span> {{ cat.name }}
          </q-btn>
        </div>
      </q-scroll-area>

      <!-- Items Table -->
      <q-card dark flat class="glass-card">
        <q-table
          dark
          flat
          :rows="menuStore.allFilteredItems"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 15 }"
          class="admin-table"
        >
          <template v-slot:body-cell-item="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <div class="item-thumb" :style="{ background: props.row.gradient }">
                  {{ props.row.emoji }}
                </div>
                <div class="q-ml-md">
                  <div class="text-weight-bold">{{ props.row.name }}</div>
                  <div class="text-grey-6" style="font-size: 0.75rem">
                    {{ props.row.description }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-price="props">
            <q-td :props="props"
              ><span class="price-tag">Rs. {{ props.row.price.toLocaleString() }}</span></q-td
            >
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.isAvailable"
                color="green"
                :label="props.row.isAvailable ? 'Available' : 'Unavailable'"
                dense
                @update:model-value="menuStore.toggleAvailability(props.row.id)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-popular="props">
            <q-td :props="props">
              <q-badge
                v-if="props.row.isPopular"
                color="orange-9"
                rounded
                class="cursor-pointer"
                @click="menuStore.togglePopular(props.row.id)"
                >🔥 Popular</q-badge
              >
              <q-btn
                v-else
                flat
                dense
                no-caps
                size="xs"
                color="grey-6"
                label="Set Popular"
                @click="menuStore.togglePopular(props.row.id)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                size="sm"
                color="blue-4"
                class="q-mr-xs"
                @click="openEditDialog(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                size="sm"
                color="red-4"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- Add / Edit Dialog -->
      <q-dialog v-model="itemDialog" persistent>
        <q-card dark class="glass-card" style="min-width: 500px">
          <q-card-section class="row items-center">
            <div class="text-h6 text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
              {{ isEditing ? 'Edit Menu Item' : 'Add New Item' }}
            </div>
            <q-space />
            <q-btn flat round dense icon="close" color="grey-5" @click="itemDialog = false" />
          </q-card-section>

          <q-separator dark style="background: rgba(255, 255, 255, 0.06)" />

          <q-card-section class="q-gutter-md q-pt-lg">
            <q-input
              v-model="editItem.name"
              dark
              outlined
              dense
              label="Item Name *"
              :rules="[(v) => !!v || 'Name is required']"
            />
            <q-input
              v-model="editItem.description"
              dark
              outlined
              dense
              label="Description"
              type="textarea"
              rows="2"
            />
            <div class="row q-gutter-md">
              <q-input
                v-model.number="editItem.price"
                dark
                outlined
                dense
                label="Price (Rs.) *"
                type="number"
                class="col"
                :rules="[(v) => v > 0 || 'Price must be positive']"
              />
              <q-select
                v-model="editItem.category"
                dark
                outlined
                dense
                label="Category *"
                :options="categoryOptions"
                emit-value
                map-options
                class="col"
              />
            </div>
            <div class="row q-gutter-md">
              <q-input
                v-model="editItem.emoji"
                dark
                outlined
                dense
                label="Emoji Icon"
                class="col-4"
              />
              <div class="col row items-center q-gutter-sm">
                <q-toggle v-model="editItem.isPopular" dark color="orange" label="Popular item" />
                <q-toggle v-model="editItem.isAvailable" dark color="green" label="Available" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-px-lg q-pb-lg">
            <q-btn flat no-caps label="Cancel" color="grey-5" @click="itemDialog = false" />
            <q-btn
              rounded
              unelevated
              no-caps
              :label="isEditing ? 'Save Changes' : 'Add Item'"
              color="orange-9"
              icon="check"
              @click="saveItem"
              :disable="!editItem.name || !editItem.price"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Confirmation -->
      <q-dialog v-model="deleteDialog">
        <q-card dark class="glass-card" style="min-width: 400px">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Delete Item?</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <p class="text-grey-5">
              Are you sure you want to delete
              <strong class="text-white">{{ deleteTarget?.name }}</strong
              >? This action cannot be undone.
            </p>
          </q-card-section>
          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat no-caps label="Cancel" color="grey-5" @click="deleteDialog = false" />
            <q-btn
              rounded
              unelevated
              no-caps
              label="Delete"
              color="red"
              icon="delete"
              @click="doDelete"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMenuStore } from 'stores/menu-store'

const $q = useQuasar()
const menuStore = useMenuStore()

const itemDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)

const editItem = ref({
  name: '',
  description: '',
  price: 0,
  category: 'starters',
  emoji: '🍽️',
  isPopular: false,
  isAvailable: true,
})

const categoryOptions = menuStore.categories
  .filter((c) => c.id !== 'all')
  .map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))

const columns = [
  { name: 'item', label: 'Item', field: 'name', align: 'left', style: 'width: 40%' },
  { name: 'price', label: 'Price', field: 'price', align: 'left' },
  { name: 'status', label: 'Status', field: 'isAvailable', align: 'center' },
  { name: 'popular', label: 'Tag', field: 'isPopular', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'id', align: 'center' },
]

function openAddDialog() {
  isEditing.value = false
  editingId.value = null
  editItem.value = {
    name: '',
    description: '',
    price: 0,
    category: 'starters',
    emoji: '🍽️',
    isPopular: false,
    isAvailable: true,
  }
  itemDialog.value = true
}

function openEditDialog(row) {
  isEditing.value = true
  editingId.value = row.id
  editItem.value = {
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    emoji: row.emoji,
    isPopular: row.isPopular,
    isAvailable: row.isAvailable,
  }
  itemDialog.value = true
}

function saveItem() {
  if (!editItem.value.name || !editItem.value.price) return

  if (isEditing.value) {
    menuStore.updateItem(editingId.value, { ...editItem.value })
    $q.notify({
      type: 'positive',
      message: `"${editItem.value.name}" updated successfully`,
      icon: 'check_circle',
      position: 'top',
    })
  } else {
    menuStore.addItem({ ...editItem.value })
    $q.notify({
      type: 'positive',
      message: `"${editItem.value.name}" added to menu!`,
      icon: 'restaurant_menu',
      position: 'top',
    })
  }
  itemDialog.value = false
}

function confirmDelete(row) {
  deleteTarget.value = row
  deleteDialog.value = true
}

function doDelete() {
  if (deleteTarget.value) {
    menuStore.removeItem(deleteTarget.value.id)
    $q.notify({
      type: 'negative',
      message: `"${deleteTarget.value.name}" removed from menu`,
      icon: 'delete',
      position: 'top',
    })
    deleteDialog.value = false
    deleteTarget.value = null
  }
}
</script>

<style lang="scss" scoped>
.admin-page {
  background: #0c0a09;
  min-height: 100vh;
}

.category-chip {
  padding: 6px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  color: #a8a29e;
  white-space: nowrap;
  &--active {
    background: rgba(234, 88, 12, 0.2);
    color: #ea580c;
    border: 1px solid rgba(234, 88, 12, 0.3);
  }
}

.item-thumb {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.admin-table {
  background: transparent;
  :deep(th) {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #78716c;
    border-color: rgba(255, 255, 255, 0.06);
  }
  :deep(td) {
    border-color: rgba(255, 255, 255, 0.04);
  }
}
</style>
