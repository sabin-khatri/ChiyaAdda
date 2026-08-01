// API layer for Chiyaghar Web Platform
// Swappable backend connection layer

const USE_MOCK = true;

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitOrder = async (orderData) => {
  if (USE_MOCK) {
    await delay(800); // Simulate network latency
    const orderRef = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      orderRef,
      message: "Order placed successfully!",
      data: {
        ...orderData,
        id: orderRef,
        status: "Pending",
        createdAt: new Date().toISOString()
      }
    };
  } else {
    // Live backend implementation would go here:
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });
    // return await response.json();
    throw new Error("Live API backend not implemented yet.");
  }
};

export const getAvailableSlots = async (date) => {
  if (USE_MOCK) {
    await delay(600); // Simulate network latency
    // Return standard mock slots for booking
    return [
      { id: "slot-1", time: "11:00 AM", available: true },
      { id: "slot-2", time: "12:30 PM", available: true },
      { id: "slot-3", time: "02:00 PM", available: false },
      { id: "slot-4", time: "03:30 PM", available: true },
      { id: "slot-5", time: "05:00 PM", available: true },
      { id: "slot-6", time: "06:30 PM", available: true },
      { id: "slot-7", time: "08:00 PM", available: false }
    ];
  } else {
    // Live backend implementation:
    // const response = await fetch(`/api/slots?date=${date}`);
    // return await response.json();
    throw new Error("Live API backend not implemented yet.");
  }
};

export const submitTableBooking = async (bookingData) => {
  if (USE_MOCK) {
    await delay(800); // Simulate latency
    const bookingRef = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      bookingRef,
      message: "Table booked successfully!",
      data: {
        ...bookingData,
        id: bookingRef,
        status: "Confirmed",
        createdAt: new Date().toISOString()
      }
    };
  } else {
    // Live backend implementation:
    // const response = await fetch('/api/bookings', { ... });
    throw new Error("Live API backend not implemented yet.");
  }
};
