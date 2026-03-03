import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  // ── Raw Materials ──
  const ingredients = ref([
    {
      id: 'chicken-patty',
      name: 'Chicken Patties',
      stock: 50,
      maxStock: 100,
      unit: 'pcs',
      minAlert: 10,
      category: 'Protein',
      lastRestocked: 'Today',
    },
    {
      id: 'beef-patty',
      name: 'Beef Patties',
      stock: 30,
      maxStock: 60,
      unit: 'pcs',
      minAlert: 8,
      category: 'Protein',
      lastRestocked: 'Yesterday',
    },
    {
      id: 'burger-bun',
      name: 'Burger Buns',
      stock: 100,
      maxStock: 200,
      unit: 'pcs',
      minAlert: 20,
      category: 'Grains',
      lastRestocked: 'Today',
    },
    {
      id: 'cheese-slice',
      name: 'Cheese Slices',
      stock: 40,
      maxStock: 80,
      unit: 'pcs',
      minAlert: 10,
      category: 'Dairy',
      lastRestocked: 'Today',
    },
    {
      id: 'lettuce',
      name: 'Lettuce',
      stock: 30,
      maxStock: 50,
      unit: 'pcs',
      minAlert: 8,
      category: 'Vegetables',
      lastRestocked: 'Today',
    },
    {
      id: 'chicken-breast',
      name: 'Chicken Breast',
      stock: 25,
      maxStock: 50,
      unit: 'kg',
      minAlert: 8,
      category: 'Protein',
      lastRestocked: 'Today',
    },
    {
      id: 'rice',
      name: 'Basmati Rice',
      stock: 40,
      maxStock: 100,
      unit: 'kg',
      minAlert: 15,
      category: 'Grains',
      lastRestocked: 'Yesterday',
    },
    {
      id: 'roti-dough',
      name: 'Roti Dough',
      stock: 20,
      maxStock: 40,
      unit: 'kg',
      minAlert: 8,
      category: 'Grains',
      lastRestocked: '2 days ago',
    },
    {
      id: 'cooking-oil',
      name: 'Cooking Oil',
      stock: 18,
      maxStock: 50,
      unit: 'l',
      minAlert: 10,
      category: 'Oil',
      lastRestocked: 'Today',
    },
    {
      id: 'prawns',
      name: 'Prawns',
      stock: 12,
      maxStock: 30,
      unit: 'kg',
      minAlert: 5,
      category: 'Seafood',
      lastRestocked: 'Yesterday',
    },
    {
      id: 'fish-fillet',
      name: 'Fish Fillet',
      stock: 10,
      maxStock: 25,
      unit: 'kg',
      minAlert: 5,
      category: 'Seafood',
      lastRestocked: '2 days ago',
    },
    {
      id: 'spaghetti',
      name: 'Spaghetti',
      stock: 20,
      maxStock: 40,
      unit: 'kg',
      minAlert: 8,
      category: 'Grains',
      lastRestocked: 'Today',
    },
    {
      id: 'pasta-sauce',
      name: 'Pasta Sauce',
      stock: 15,
      maxStock: 30,
      unit: 'l',
      minAlert: 5,
      category: 'Sauces',
      lastRestocked: 'Yesterday',
    },
    {
      id: 'coke',
      name: 'Coca-Cola',
      stock: 48,
      maxStock: 100,
      unit: 'pcs',
      minAlert: 15,
      category: 'Beverages',
      lastRestocked: 'Today',
    },
    {
      id: 'sprite',
      name: 'Sprite',
      stock: 36,
      maxStock: 80,
      unit: 'pcs',
      minAlert: 15,
      category: 'Beverages',
      lastRestocked: 'Today',
    },
    {
      id: 'lime',
      name: 'Fresh Lime',
      stock: 45,
      maxStock: 100,
      unit: 'pcs',
      minAlert: 15,
      category: 'Fruits',
      lastRestocked: 'Today',
    },
    {
      id: 'mango',
      name: 'Mango Pulp',
      stock: 10,
      maxStock: 30,
      unit: 'l',
      minAlert: 5,
      category: 'Fruits',
      lastRestocked: 'Yesterday',
    },
    {
      id: 'coconut',
      name: 'King Coconut',
      stock: 20,
      maxStock: 50,
      unit: 'pcs',
      minAlert: 8,
      category: 'Beverages',
      lastRestocked: 'Today',
    },
    {
      id: 'chocolate',
      name: 'Chocolate',
      stock: 8,
      maxStock: 20,
      unit: 'kg',
      minAlert: 4,
      category: 'Desserts',
      lastRestocked: '3 days ago',
    },
    {
      id: 'ice-cream',
      name: 'Ice Cream',
      stock: 15,
      maxStock: 30,
      unit: 'l',
      minAlert: 5,
      category: 'Desserts',
      lastRestocked: 'Yesterday',
    },
    {
      id: 'egg',
      name: 'Eggs',
      stock: 60,
      maxStock: 120,
      unit: 'pcs',
      minAlert: 20,
      category: 'Protein',
      lastRestocked: 'Today',
    },
    {
      id: 'bacon',
      name: 'Bacon',
      stock: 15,
      maxStock: 30,
      unit: 'pcs',
      minAlert: 5,
      category: 'Protein',
      lastRestocked: 'Yesterday',
    },
    {
      id: 'dhal',
      name: 'Dhal',
      stock: 10,
      maxStock: 30,
      unit: 'kg',
      minAlert: 5,
      category: 'Grains',
      lastRestocked: '2 days ago',
    },
    {
      id: 'coconut-milk',
      name: 'Coconut Milk',
      stock: 12,
      maxStock: 25,
      unit: 'l',
      minAlert: 5,
      category: 'Dairy',
      lastRestocked: 'Yesterday',
    },
  ])

  // ── Bill of Materials (BOM) — Maps menu item name → ingredients needed ──
  const bom = {
    'Crispy Chicken Wings': [
      { id: 'chicken-breast', qty: 0.3 },
      { id: 'cooking-oil', qty: 0.1 },
    ],
    'Spring Rolls': [
      { id: 'lettuce', qty: 1 },
      { id: 'cooking-oil', qty: 0.05 },
    ],
    'Fish Cutlets': [
      { id: 'fish-fillet', qty: 0.2 },
      { id: 'cooking-oil', qty: 0.05 },
    ],
    'Garlic Butter Prawns': [{ id: 'prawns', qty: 0.25 }],
    'Traditional Rice & Curry': [
      { id: 'rice', qty: 0.3 },
      { id: 'chicken-breast', qty: 0.15 },
      { id: 'dhal', qty: 0.05 },
      { id: 'coconut-milk', qty: 0.1 },
    ],
    'Chicken Biryani': [
      { id: 'rice', qty: 0.4 },
      { id: 'chicken-breast', qty: 0.2 },
    ],
    'Vegetable Fried Rice': [
      { id: 'rice', qty: 0.3 },
      { id: 'egg', qty: 1 },
      { id: 'cooking-oil', qty: 0.05 },
    ],
    'Egg Fried Rice': [
      { id: 'rice', qty: 0.3 },
      { id: 'egg', qty: 2 },
      { id: 'cooking-oil', qty: 0.05 },
    ],
    'Seafood Fried Rice': [
      { id: 'rice', qty: 0.3 },
      { id: 'prawns', qty: 0.15 },
      { id: 'fish-fillet', qty: 0.1 },
    ],
    'Chicken Kottu': [
      { id: 'roti-dough', qty: 0.3 },
      { id: 'chicken-breast', qty: 0.15 },
      { id: 'egg', qty: 1 },
    ],
    'Cheese Kottu': [
      { id: 'roti-dough', qty: 0.3 },
      { id: 'chicken-breast', qty: 0.15 },
      { id: 'cheese-slice', qty: 2 },
    ],
    'Vegetable Kottu': [
      { id: 'roti-dough', qty: 0.3 },
      { id: 'lettuce', qty: 1 },
    ],
    'Godamba Roti': [{ id: 'roti-dough', qty: 0.15 }],
    'Classic Cheese Burger': [
      { id: 'beef-patty', qty: 1 },
      { id: 'burger-bun', qty: 1 },
      { id: 'cheese-slice', qty: 1 },
      { id: 'lettuce', qty: 1 },
    ],
    'Crispy Chicken Burger': [
      { id: 'chicken-patty', qty: 1 },
      { id: 'burger-bun', qty: 1 },
      { id: 'lettuce', qty: 1 },
    ],
    'BBQ Bacon Burger': [
      { id: 'beef-patty', qty: 2 },
      { id: 'burger-bun', qty: 1 },
      { id: 'bacon', qty: 2 },
    ],
    'Veggie Burger': [
      { id: 'burger-bun', qty: 1 },
      { id: 'lettuce', qty: 2 },
    ],
    'Creamy Carbonara': [
      { id: 'spaghetti', qty: 0.2 },
      { id: 'bacon', qty: 2 },
      { id: 'egg', qty: 1 },
      { id: 'cheese-slice', qty: 1 },
    ],
    'Prawn Arrabiata': [
      { id: 'spaghetti', qty: 0.2 },
      { id: 'prawns', qty: 0.15 },
      { id: 'pasta-sauce', qty: 0.15 },
    ],
    'Penne Alfredo': [
      { id: 'spaghetti', qty: 0.2 },
      { id: 'chicken-breast', qty: 0.1 },
      { id: 'cheese-slice', qty: 1 },
    ],
    'Grilled Fish Steak': [{ id: 'fish-fillet', qty: 0.3 }],
    'Butter Crab': [{ id: 'prawns', qty: 0.4 }],
    'Devilled Prawns': [{ id: 'prawns', qty: 0.3 }],
    'Fresh Lime Juice': [{ id: 'lime', qty: 2 }],
    'Mango Smoothie': [
      { id: 'mango', qty: 0.2 },
      { id: 'ice-cream', qty: 0.1 },
    ],
    'Iced Coffee': [{ id: 'ice-cream', qty: 0.1 }],
    'King Coconut': [{ id: 'coconut', qty: 1 }],
    'Soft Drinks': [{ id: 'coke', qty: 1 }],
    'Chocolate Lava Cake': [
      { id: 'chocolate', qty: 0.15 },
      { id: 'egg', qty: 1 },
      { id: 'ice-cream', qty: 0.1 },
    ],
    Watalappam: [
      { id: 'coconut-milk', qty: 0.15 },
      { id: 'egg', qty: 2 },
    ],
    'Ice Cream Sundae': [
      { id: 'ice-cream', qty: 0.3 },
      { id: 'chocolate', qty: 0.05 },
    ],
    'Fresh Fruit Platter': [
      { id: 'mango', qty: 0.1 },
      { id: 'lime', qty: 1 },
    ],
  }

  // ── Computed ──
  const lowStockItems = computed(() => ingredients.value.filter((i) => i.stock <= i.minAlert))

  // Deduction log for audit trail
  const deductionLog = ref([])

  // ── Methods ──
  function getIngredient(id) {
    return ingredients.value.find((i) => i.id === id)
  }

  // Check if we CAN make a menu item (enough stock)
  function canMakeItem(itemName) {
    const recipe = bom[itemName]
    if (!recipe) return true // no BOM means unlimited
    return recipe.every((r) => {
      const ing = getIngredient(r.id)
      return ing && ing.stock >= r.qty
    })
  }

  // Deduct stock for an order item (quantity × BOM)
  function deductForItem(itemName, quantity = 1) {
    const recipe = bom[itemName]
    if (!recipe) return []

    const deductions = []
    recipe.forEach((r) => {
      const ing = getIngredient(r.id)
      if (ing) {
        const amount = r.qty * quantity
        const before = ing.stock
        ing.stock = Math.max(0, +(ing.stock - amount).toFixed(2))
        deductions.push({
          ingredient: ing.name,
          ingredientId: r.id,
          before,
          after: ing.stock,
          deducted: +(before - ing.stock).toFixed(2),
          unit: ing.unit,
        })
      }
    })

    // Log deduction
    deductionLog.value.unshift({
      itemName,
      quantity,
      deductions,
      timestamp: new Date(),
    })

    return deductions
  }

  // Deduct stock for entire order
  function deductForOrder(orderItems) {
    const allDeductions = []
    const alerts = []

    orderItems.forEach((item) => {
      const result = deductForItem(item.name, item.quantity)
      allDeductions.push(...result)

      // Check for low stock after deduction
      result.forEach((d) => {
        const ing = getIngredient(d.ingredientId)
        if (ing && ing.stock <= ing.minAlert) {
          alerts.push({
            type: ing.stock === 0 ? 'out_of_stock' : 'low_stock',
            ingredient: ing.name,
            stock: ing.stock,
            unit: ing.unit,
          })
        }
      })
    })

    return { deductions: allDeductions, alerts }
  }

  // Get items that would go out of stock
  function getOutOfStockMenuItems(menuItems) {
    return menuItems.filter((item) => !canMakeItem(item.name))
  }

  // Restock
  function restock(id, amount) {
    const ing = getIngredient(id)
    if (ing) {
      ing.stock = Math.min(ing.stock + amount, ing.maxStock)
      ing.lastRestocked = 'Just now'
      return ing
    }
    return null
  }

  function addIngredient(data) {
    ingredients.value.push({ ...data, id: data.id || data.name.toLowerCase().replace(/\s+/g, '-') })
  }

  function removeIngredient(id) {
    const idx = ingredients.value.findIndex((i) => i.id === id)
    if (idx >= 0) ingredients.value.splice(idx, 1)
  }

  return {
    ingredients,
    bom,
    lowStockItems,
    deductionLog,
    getIngredient,
    canMakeItem,
    deductForItem,
    deductForOrder,
    getOutOfStockMenuItems,
    restock,
    addIngredient,
    removeIngredient,
  }
})
