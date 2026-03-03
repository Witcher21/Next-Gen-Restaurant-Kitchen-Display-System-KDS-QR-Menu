export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    // Join KDS room (Kitchen Display System)
    socket.on('joinKDS', () => {
      socket.join('kds')
      console.log(`👨‍🍳 KDS display joined: ${socket.id}`)
    })

    // Join table room (Customer order tracking)
    socket.on('joinTable', (tableNumber) => {
      socket.join(`table-${tableNumber}`)
      console.log(`🪑 Table ${tableNumber} joined: ${socket.id}`)
    })

    // Emit newOrder: Customer order place kalama server eken KDS ekata yawana event eka
    socket.on('newOrder', (order) => {
      console.log(`🆕 New order from Table ${order.tableNumber}: ${order.orderId || order.id}`)
      io.to('kds').emit('newOrder', order)
    })

    // Listen updateOrderStatus: Chef KDS eken order eka "Done" kalama server ekata ena event eka
    socket.on('updateOrderStatus', ({ orderId, status }) => {
      console.log(`📋 Order ${orderId} → ${status}`)

      // Broadcast to all KDS screens
      io.to('kds').emit('orderStatusChanged', { orderId, status })

      // Emit statusChanged: Server eken customer ge phone ekata order eke thathwaya yawana event eka
      socket.broadcast.emit('statusChanged', { orderId, status })
    })

    // Admin updates menu - broadcast to all connected clients
    socket.on('menuUpdate', (data) => {
      console.log(`📝 Menu updated: ${data.action}`)
      socket.broadcast.emit('menuUpdated', data)
    })

    // Inventory low stock alert from admin
    socket.on('lowStockAlert', (data) => {
      console.log(`⚠️ Low stock alert: ${data.ingredientName} (${data.stockLevel} ${data.unit})`)
      io.emit('lowStockAlert', data)
    })

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`)
    })
  })
}
