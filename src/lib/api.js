// API boundary for orders and table bookings. Mock mode keeps the frontend usable
// while the backend is being built; configure VITE_USE_MOCK_API=false to connect it.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }
  return payload
}

const postJson = (path, data) => requestJson(path, {
  method: 'POST',
  body: JSON.stringify(data),
})

export const submitOrder = async (orderData) => {
  if (!USE_MOCK) return postJson('/api/orders', orderData)

  await delay(800)
  const orderRef = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
  return {
    success: true,
    orderRef,
    message: 'Order placed successfully!',
    data: {
      ...orderData,
      id: orderRef,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    },
  }
}

export const getAvailableSlots = async (date) => {
  if (!USE_MOCK) {
    return requestJson(`/api/slots?date=${encodeURIComponent(date)}`)
  }

  await delay(600)
  return [
    { id: 'slot-1', time: '11:00 AM', available: true },
    { id: 'slot-2', time: '12:30 PM', available: true },
    { id: 'slot-3', time: '02:00 PM', available: false },
    { id: 'slot-4', time: '03:30 PM', available: true },
    { id: 'slot-5', time: '05:00 PM', available: true },
    { id: 'slot-6', time: '06:30 PM', available: true },
    { id: 'slot-7', time: '08:00 PM', available: false },
  ]
}

export const submitTableBooking = async (bookingData) => {
  if (!USE_MOCK) return postJson('/api/bookings', bookingData)

  await delay(800)
  const bookingRef = `RES-${Math.floor(1000 + Math.random() * 9000)}`
  return {
    success: true,
    bookingRef,
    message: 'Table booked successfully!',
    data: {
      ...bookingData,
      id: bookingRef,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    },
  }
}
