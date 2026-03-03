import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref([
    { id: 'all', name: 'All', icon: '✨' },
    { id: 'starters', name: 'Starters', icon: '🔥' },
    { id: 'rice-curry', name: 'Rice & Curry', icon: '🍛' },
    { id: 'kottu', name: 'Kottu & Roti', icon: '🥘' },
    { id: 'burgers', name: 'Burgers', icon: '🍔' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'seafood', name: 'Seafood', icon: '🦐' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
  ])

  const menuItems = ref([
    {
      id: 1,
      name: 'Crispy Chicken Wings',
      description: 'Golden fried wings with signature hot sauce (6 pcs)',
      price: 890,
      category: 'starters',
      emoji: '🍗',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #FF6B35, #F7C59F)',
    },
    {
      id: 2,
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls with sweet chili dip',
      price: 650,
      category: 'starters',
      emoji: '🥟',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #2EC4B6, #CBF3F0)',
    },
    {
      id: 3,
      name: 'Fish Cutlets',
      description: 'Traditional Sri Lankan fish cutlets with lime',
      price: 480,
      category: 'starters',
      emoji: '🐟',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #E07A5F, #F2CC8F)',
    },
    {
      id: 4,
      name: 'Garlic Butter Prawns',
      description: 'Sautéed prawns in rich garlic butter sauce',
      price: 1280,
      category: 'starters',
      emoji: '🦐',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #D62828, #F77F00)',
    },
    {
      id: 5,
      name: 'Traditional Rice & Curry',
      description: 'Rice with dhal, chicken curry, pol sambol & papadam',
      price: 780,
      category: 'rice-curry',
      emoji: '🍛',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #F4845F, #F7DC6F)',
    },
    {
      id: 6,
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with spiced chicken & raita',
      price: 950,
      category: 'rice-curry',
      emoji: '🍚',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #E76F51, #F4A261)',
    },
    {
      id: 7,
      name: 'Vegetable Fried Rice',
      description: 'Wok-fried rice with fresh vegetables & soy sauce',
      price: 680,
      category: 'rice-curry',
      emoji: '🥗',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #6A994E, #A7C957)',
    },
    {
      id: 8,
      name: 'Egg Fried Rice',
      description: 'Classic egg fried rice with aromatic spices',
      price: 750,
      category: 'rice-curry',
      emoji: '🥚',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #E9C46A, #F4A261)',
    },
    {
      id: 9,
      name: 'Seafood Fried Rice',
      description: 'Premium fried rice with prawns, squid & crab',
      price: 1100,
      category: 'rice-curry',
      emoji: '🦑',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #264653, #2A9D8F)',
    },
    {
      id: 10,
      name: 'Chicken Kottu',
      description: 'Chopped roti with chicken, egg & vegetables',
      price: 850,
      category: 'kottu',
      emoji: '🥘',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #BC6C25, #DDA15E)',
    },
    {
      id: 11,
      name: 'Cheese Kottu',
      description: 'Creamy cheese kottu with chicken & special sauce',
      price: 920,
      category: 'kottu',
      emoji: '🧀',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #F4A261, #E9C46A)',
    },
    {
      id: 12,
      name: 'Vegetable Kottu',
      description: 'Fresh vegetable kottu with aromatic spices',
      price: 650,
      category: 'kottu',
      emoji: '🥬',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #588157, #A3B18A)',
    },
    {
      id: 13,
      name: 'Godamba Roti',
      description: 'Flaky Sri Lankan flatbread with curry dip',
      price: 350,
      category: 'kottu',
      emoji: '🫓',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #B08968, #DDB892)',
    },
    {
      id: 14,
      name: 'Classic Cheese Burger',
      description: 'Beef patty with cheddar, lettuce, tomato & pickles',
      price: 780,
      category: 'burgers',
      emoji: '🍔',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #D62828, #FCBF49)',
    },
    {
      id: 15,
      name: 'Crispy Chicken Burger',
      description: 'Crispy fried chicken with coleslaw & mayo',
      price: 850,
      category: 'burgers',
      emoji: '🍗',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #F77F00, #FCBF49)',
    },
    {
      id: 16,
      name: 'BBQ Bacon Burger',
      description: 'Double patty with bacon, BBQ sauce & onion rings',
      price: 980,
      category: 'burgers',
      emoji: '🥓',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #6A040F, #D00000)',
    },
    {
      id: 17,
      name: 'Veggie Burger',
      description: 'Grilled veggie patty with avocado & sriracha',
      price: 680,
      category: 'burgers',
      emoji: '🥑',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #606C38, #FEFAE0)',
    },
    {
      id: 18,
      name: 'Creamy Carbonara',
      description: 'Spaghetti with bacon, egg, parmesan & black pepper',
      price: 980,
      category: 'pasta',
      emoji: '🍝',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #E9C46A, #FEFAE0)',
    },
    {
      id: 19,
      name: 'Prawn Arrabiata',
      description: 'Penne in spicy tomato sauce with sautéed prawns',
      price: 1180,
      category: 'pasta',
      emoji: '🦐',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #E63946, #F1FAEE)',
    },
    {
      id: 20,
      name: 'Penne Alfredo',
      description: 'Creamy alfredo sauce with grilled chicken',
      price: 880,
      category: 'pasta',
      emoji: '🧈',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #CDB4DB, #FFC8DD)',
    },
    {
      id: 21,
      name: 'Grilled Fish Steak',
      description: 'Fresh catch grilled with lemon herb butter',
      price: 1350,
      category: 'seafood',
      emoji: '🐟',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #0077B6, #90E0EF)',
    },
    {
      id: 22,
      name: 'Butter Crab',
      description: 'Whole crab in Sri Lankan butter sauce',
      price: 1850,
      category: 'seafood',
      emoji: '🦀',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #D62828, #F77F00)',
    },
    {
      id: 23,
      name: 'Devilled Prawns',
      description: 'Wok-fried prawns in spicy devilled sauce',
      price: 1450,
      category: 'seafood',
      emoji: '🌶️',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #DC2F02, #E85D04)',
    },
    {
      id: 24,
      name: 'Fresh Lime Juice',
      description: 'Freshly squeezed lime with mint',
      price: 350,
      category: 'beverages',
      emoji: '🍋',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #606C38, #FEFAE0)',
    },
    {
      id: 25,
      name: 'Mango Smoothie',
      description: 'Creamy mango smoothie with ice cream',
      price: 480,
      category: 'beverages',
      emoji: '🥭',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #F77F00, #FCBF49)',
    },
    {
      id: 26,
      name: 'Iced Coffee',
      description: 'Cold brew coffee with vanilla ice cream',
      price: 420,
      category: 'beverages',
      emoji: '☕',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #6F4E37, #C4A882)',
    },
    {
      id: 27,
      name: 'King Coconut',
      description: 'Fresh king coconut water served chilled',
      price: 280,
      category: 'beverages',
      emoji: '🥥',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #A3B18A, #DAD7CD)',
    },
    {
      id: 28,
      name: 'Soft Drinks',
      description: 'Coca-Cola, Sprite, Fanta, or Elephant House',
      price: 250,
      category: 'beverages',
      emoji: '🥤',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #E63946, #457B9D)',
    },
    {
      id: 29,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center & ice cream',
      price: 680,
      category: 'desserts',
      emoji: '🍫',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #3D1308, #8B4513)',
    },
    {
      id: 30,
      name: 'Watalappam',
      description: 'Traditional Sri Lankan coconut custard pudding',
      price: 450,
      category: 'desserts',
      emoji: '🍮',
      isAvailable: true,
      isPopular: true,
      gradient: 'linear-gradient(135deg, #B08968, #DDB892)',
    },
    {
      id: 31,
      name: 'Ice Cream Sundae',
      description: 'Triple scoop with chocolate sauce, nuts & cherry',
      price: 520,
      category: 'desserts',
      emoji: '🍨',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #CDB4DB, #FFC8DD)',
    },
    {
      id: 32,
      name: 'Fresh Fruit Platter',
      description: 'Seasonal tropical fruits beautifully arranged',
      price: 380,
      category: 'desserts',
      emoji: '🍉',
      isAvailable: true,
      isPopular: false,
      gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)',
    },
  ])

  const activeCategory = ref('all')
  const searchQuery = ref('')

  // For customer view (only available items)
  const filteredItems = computed(() => {
    let items = menuItems.value.filter((i) => i.isAvailable)
    if (activeCategory.value !== 'all') {
      items = items.filter((i) => i.category === activeCategory.value)
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
      )
    }
    return items
  })

  // For admin view (ALL items including unavailable)
  const allFilteredItems = computed(() => {
    let items = [...menuItems.value]
    if (activeCategory.value !== 'all') {
      items = items.filter((i) => i.category === activeCategory.value)
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
      )
    }
    return items
  })

  const popularItems = computed(() => menuItems.value.filter((i) => i.isPopular && i.isAvailable))

  function setCategory(id) {
    activeCategory.value = id
  }
  function setSearch(q) {
    searchQuery.value = q
  }

  // --- CRUD Operations ---
  let nextId = 33

  function addItem(item) {
    const gradients = [
      'linear-gradient(135deg, #FF6B35, #F7C59F)',
      'linear-gradient(135deg, #2EC4B6, #CBF3F0)',
      'linear-gradient(135deg, #E07A5F, #F2CC8F)',
      'linear-gradient(135deg, #D62828, #F77F00)',
      'linear-gradient(135deg, #F4845F, #F7DC6F)',
      'linear-gradient(135deg, #264653, #2A9D8F)',
      'linear-gradient(135deg, #BC6C25, #DDA15E)',
      'linear-gradient(135deg, #6A994E, #A7C957)',
    ]
    const newItem = {
      id: nextId++,
      name: item.name,
      description: item.description || '',
      price: Number(item.price) || 0,
      category: item.category || 'starters',
      emoji: item.emoji || '🍽️',
      isAvailable: true,
      isPopular: false,
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
    }
    menuItems.value.push(newItem)
    return newItem
  }

  function updateItem(id, updates) {
    const idx = menuItems.value.findIndex((i) => i.id === id)
    if (idx !== -1) {
      menuItems.value[idx] = { ...menuItems.value[idx], ...updates }
      return menuItems.value[idx]
    }
    return null
  }

  function removeItem(id) {
    const idx = menuItems.value.findIndex((i) => i.id === id)
    if (idx !== -1) {
      menuItems.value.splice(idx, 1)
      return true
    }
    return false
  }

  function toggleAvailability(id) {
    const item = menuItems.value.find((i) => i.id === id)
    if (item) {
      item.isAvailable = !item.isAvailable
      return item
    }
    return null
  }

  function togglePopular(id) {
    const item = menuItems.value.find((i) => i.id === id)
    if (item) {
      item.isPopular = !item.isPopular
      return item
    }
    return null
  }

  return {
    categories,
    menuItems,
    activeCategory,
    searchQuery,
    filteredItems,
    allFilteredItems,
    popularItems,
    setCategory,
    setSearch,
    addItem,
    updateItem,
    removeItem,
    toggleAvailability,
    togglePopular,
  }
})
