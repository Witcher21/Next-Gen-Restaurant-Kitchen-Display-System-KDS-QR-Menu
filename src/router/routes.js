const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'landing', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/table/:tableId',
    component: () => import('layouts/CustomerLayout.vue'),
    children: [
      { path: '', redirect: (to) => ({ name: 'menu', params: { tableId: to.params.tableId } }) },
      { path: 'menu', name: 'menu', component: () => import('pages/customer/MenuPage.vue') },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('pages/customer/OrderTrackingPage.vue'),
      },
    ],
  },
  {
    path: '/kds',
    component: () => import('layouts/KDSLayout.vue'),
    children: [
      { path: '', name: 'kds', component: () => import('pages/kds/KitchenDisplayPage.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('pages/admin/DashboardPage.vue'),
      },
      {
        path: 'menu',
        name: 'admin-menu',
        component: () => import('pages/admin/MenuManagementPage.vue'),
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('pages/admin/OrdersPage.vue'),
      },
      {
        path: 'tables',
        name: 'admin-tables',
        component: () => import('pages/admin/TablesPage.vue'),
      },
      {
        path: 'inventory',
        name: 'admin-inventory',
        component: () => import('pages/admin/InventoryPage.vue'),
      },
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import('pages/admin/AnalyticsPage.vue'),
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('pages/admin/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/admin/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'admin-login', component: () => import('pages/admin/AdminLoginPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
