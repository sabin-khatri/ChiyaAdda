# ☕ Chiya-Ghar Web Application

Welcome to the **Chiya-Ghar** frontend project! This is a modern, beautifully animated, and highly responsive web application built for an authentic Nepali tea shop.

## ✨ Key Features

- **Consolidated Brand Identity**: High-fidelity custom theme configured under the `chiya` namespace with vibrant, youth-focused brand colors (Orange, Pink, Yellow, Teal, Cream, Ink) and retro "pop" drop-shadow styles.
- **Poppins & Inter Typography**: Crisp Poppins headings and highly legible Inter body fonts loaded dynamically.
- **Centralized Static & Mock Content**: All menu items and static website copy are externalized into dedicated, maintainable data structures (`mockMenu.js` and `siteContent.js`).
- **Standardized Framer Motion Library**: Reusable motion variants (`fadeUp`, `cardHover`, `drawerSlide`, `springScale`) that respect browser reduced motion settings (`useReducedMotion`).
- **3-Step Checkout Flow**: Guest-first ordering funnel: Cart review ➔ Delivery/Pickup information and fees ➔ Order Confirmation screen with custom checkmark animation.
- **Table Booking Flow**: Seamless reservation form with guest size, date, real-time mock slot queries, and instant booking reference codes.
- **State-of-the-Art State Store**: Centralized Zustand store managing live cart quantities, active options, delivery preferences, calculated ETAs, and subtotal dynamics.
- **Mock Network API Layer**: A robust `api.js` client layer with a customizable network latency delay simulator, allowing instant swapping from mock sandbox endpoints to a live production database.
- **Interactive Tea Customizer**: Custom variations like Temperature (Hot/Iced), Sugar Level (0-100%), and Milk Type (Regular, Oat, Almond) grouped dynamically.
- **Admin Dashboard & Management**: collapsable desktop/mobile responsive dashboard layout showcasing real-time synced tables and mock orders management.

## 🛠️ Technologies Used

- **React.js** - UI Library
- **Vite** - Build Tool & Development Server
- **Tailwind CSS (v4)** - Utility-first styling and theme configuration
- **Framer Motion** - Powerful declarative animations
- **Zustand** - Fast and scalable global state management
- **React Router Dom** - Client-side routing
- **Lucide React** - Clean and consistent SVG icons

## 🚀 How to Run Locally

1. **Install Dependencies**  
   Open your terminal in the project directory and run:
   ```bash
   npm install
   ```

2. **Start the Development Server**  
   Run the following command to start the application:
   ```bash
   npm run dev
   ```

3. **View the Application**  
   Open your browser and navigate to `http://localhost:5173`.

4. **Access Admin Portal**  
   To view the Admin Dashboard, navigate to `/admin/login`.  
   *(Demo Credentials: Username: `admin` | Password: `admin123`)*

