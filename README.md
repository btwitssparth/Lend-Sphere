# Lend-Sphere
<div align="center">

<br />

# 🌐 Lend-Sphere

### *The peer-to-peer rental marketplace that turns idle gear into income.*

<br />

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Hosting-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Live%20%26%20Deployed-brightgreen?style=flat-square)](https://lend-sphere.vercel.app)

<br />

[**Live Demo →**](https://lend-sphere.vercel.app) &nbsp;·&nbsp; [**Report a Bug**](https://github.com/yourusername/lend-sphere/issues) &nbsp;·&nbsp; [**Request a Feature**](https://github.com/yourusername/lend-sphere/issues)

<br />

</div>

---

<img width="1768" height="832" alt="image" src="https://github.com/user-attachments/assets/d974d3a1-524a-411a-863c-b9dd6b241e59" />


---

## 📌 About the Project

Most people own equipment they barely use — a camera that sits in a drawer, tools that gather dust, fitness gear collecting cobwebs. Meanwhile, others nearby need exactly those things for a day or a week. **Lend-Sphere bridges that gap.**

It is a fully deployed, full-stack peer-to-peer rental marketplace that connects local **Renters** (people who need gear) with **Lenders** (people who want to monetize their idle assets). The platform handles everything from listing and discovery to booking, real-time communication, dispute resolution, and AI-powered support — making the rental experience seamless for both sides of every transaction.

> Built as a final-year capstone project, Lend-Sphere represents a production-grade application implementing best practices in REST API design, secure authentication, real-time features, and modern frontend architecture.

---

## ✨ Key Features

-   **🔄 Role-Based P2P Engine** — Dual user flows for Renters and Lenders. Users can switch roles on the fly. Lenders get a dedicated dashboard to approve, reject, and manage incoming rental requests with full lifecycle tracking (`Pending → Approved → Active → Completed`).

-   **📦 Advanced Product Management** — Lenders can create rich listings with dynamic categories, GPS-based location pinning, per-day pricing, inventory quantity, and up to 5 concurrent multi-image uploads — all hosted on Cloudinary with zero loading delay.

-   **📅 Smart Booking & Calendar System** — Interactive date-range picker with real-time unavailability blocking. Conflict detection prevents double-booking across multi-unit inventory. Rental requests generate automatic email notifications to lenders via Resend.

-   **🔐 Secure Authentication & Identity Verification** — JWT-based auth (Access + Refresh token rotation) with bcrypt-hashed passwords. Google OAuth2 support via both ID token and access token strategies. Renters must upload a Government ID (stored on Cloudinary) before they can rent any item.

-   **⚖️ Dispute Resolution System** — Lenders can file formal damage claims with photographic evidence. Renters can submit counter-responses with their own proof images. An Admin console manages all cases and applies an automated Trust Score system (+/- points on resolution).

-   **🤖 AI Support Chatbot** — Integrated Google Gemini-powered support assistant trained on platform-specific knowledge (pricing, policies, how-to guides). Falls back gracefully across multiple model versions.

-   **💬 Real-Time Chat** — Per-rental Socket.IO chat rooms that auto-lock on `Pending`/`Completed` rentals. Features optimistic message rendering, reconnection handling, and a typing indicator.

-   **🗺️ Interactive Map View** — Leaflet.js-powered product map with geospatial queries (`$near`, `2dsphere` index). Toggle between grid and map view, with themed dark/light tiles.

-   **🌙 True Dark Mode** — OLED-friendly manual dark/light theme toggle built with Tailwind CSS v4 custom variants. Persisted in `localStorage` with OS-preference detection as a fallback.

-   **💖 Wishlist & Public Profiles** — Users can save items to a wishlist, view public lender profiles with their full listings and aggregated ratings, and edit their own bio and display name.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **React 19** (Vite) | Core UI framework with fast HMR |
| **Tailwind CSS v4** | Utility-first styling with custom dark mode variant |
| **Framer Motion** | Page transitions, micro-interactions, and modal animations |
| **React Router DOM v7** | Client-side routing and protected routes |
| **Socket.IO Client** | Real-time bidirectional chat |
| **React Leaflet + Leaflet.js** | Interactive geospatial product map |
| **Recharts** | Revenue charts on the Lender Dashboard |
| **React DatePicker** | Booking calendar with unavailable date exclusion |
| **Axios** | HTTP client with interceptors for token refresh |
| **Context API** | Global state for Auth and Theme |

### Backend

| Technology | Purpose |
| :--- | :--- |
| **Node.js + Express.js** | REST API server |
| **MongoDB + Mongoose** | Primary database with geospatial indexing |
| **Socket.IO** | WebSocket server for real-time chat rooms |
| **JWT** | Stateless access + refresh token authentication |
| **bcrypt** | Secure password hashing |
| **Cloudinary + Multer** | Cloud image storage and file upload middleware |
| **Google Auth Library** | Dual-strategy Google OAuth2 (ID token + access token) |
| **Gemini AI (Google)** | AI-powered support chatbot backend |
| **Resend** | Transactional email notifications |

---

## 🚀 Getting Started

Follow these steps to run Lend-Sphere locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v20 or higher recommended)
-   [MongoDB](https://www.mongodb.com/try/download/community) (local instance) or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
-   A [Cloudinary](https://cloudinary.com/) account (free tier is sufficient)
-   A [Google Cloud Console](https://console.cloud.google.com/) project with OAuth 2.0 credentials

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/lend-sphere.git
cd lend-sphere
```

**2. Install Backend dependencies**

```bash
cd backend
npm install
```

**3. Install Frontend dependencies**

```bash
cd ../frontend
npm install
```

**4. Configure environment variables**

Refer to the [Environment Variables](#️-environment-variables) section below to create your `.env` files.

**5. Run the development servers**

Open two separate terminal windows:

```bash
# Terminal 1 — Start the Backend (from /backend)
npm run dev

# Terminal 2 — Start the Frontend (from /frontend)
npm run dev
```

The frontend will be available at **`http://localhost:5173`** and the backend API at **`http://localhost:8000`**.

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)

Create a file named `.env` in the `/backend` directory and populate it with the following variables:

```env
# ── Server ────────────────────────────────────────────────
PORT=8000
NODE_ENV=development

# ── Database ──────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

# ── JSON Web Tokens ───────────────────────────────────────
ACCESS_TOKEN_SECRET=your_super_secret_access_key_here
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_here
REFRESH_TOKEN_EXPIRY=7d

# ── Cloudinary (Image Hosting) ────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Google OAuth ──────────────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# ── Google Gemini AI ──────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Resend (Email Notifications) ──────────────────────────
RESEND_API_KEY=re_your_resend_api_key

# ── CORS ──────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`/frontend/.env`)

Create a file named `.env` in the `/frontend` directory:

```env
# ── API Base URL ──────────────────────────────────────────
VITE_API_URL=http://localhost:8000/api/v1

# ── Google OAuth Client ID ────────────────────────────────
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

> [!WARNING]
> Never commit your `.env` files to version control. Both `/backend/.env` and `/frontend/.env` are already included in `.gitignore`.

---



## 🗂️ Project Structure

```
lend-sphere/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handler logic (User, Product, Rental, Dispute, etc.)
│   │   ├── models/           # Mongoose schemas (User, Product, Rental, Dispute, Review, Message)
│   │   ├── routes/           # Express route definitions
│   │   ├── middlewares/      # JWT auth, Admin auth, Multer file upload
│   │   ├── utils/            # ApiError, ApiResponse, Cloudinary, sendEmail, token helpers
│   │   ├── db/               # MongoDB connection logic
│   │   └── socket.js         # Socket.IO initialization and room management
│   └── app.js                # Express app entry point with CORS, middleware, and routes
│
└── frontend/
    └── src/
        ├── api/              # Axios API call modules (products, rentals, users, dispute, etc.)
        ├── components/       # Reusable UI components (Navbar, Footer, Modals, ChatBox)
        │   ├── Auth/         # Login, Register, Social Auth forms and layout
        │   ├── Chat/         # Real-time ChatBox component
        │   └── Ui/           # Base UI primitives (Button, Input)
        ├── Context/          # AuthContext and ThemeContext (global state)
        ├── pages/            # Route-level page components
        └── services/         # Auth service (register, login, logout, getCurrentUser)
```

---

## 🔌 API Overview

The backend exposes a RESTful API under the `/api/v1` prefix. Here is a high-level summary of the available route groups:

| Route Group | Base Path | Description |
| :--- | :--- | :--- |
| **Users** | `/api/v1/users` | Register, login, logout, Google OAuth, refresh token, profile, wishlist, identity upload |
| **Products** | `/api/v1/products` | CRUD for listings, geospatial search, category filtering, my listings |
| **Rentals** | `/api/v1/rentals` | Request rentals, fetch unavailable dates, update status, view renter/lender requests |
| **Messages** | `/api/v1/messages` | Send and retrieve per-rental chat messages |
| **Reviews** | `/api/v1/reviews` | Submit and fetch product reviews |
| **Disputes** | `/api/v1/disputes` | Create disputes, fetch by rental, submit defendant responses |
| **Admin** | `/api/v1/admin` | View all disputes, process with Resolved/Rejected verdict + trust score adjustment |
| **Chat (AI)** | `/api/v1/chat` | Proxy to Google Gemini for the AI support chatbot |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

```
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📬 Contact

***Parth Jain* — Bsc.IT Graduate(2026)


[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/parth-jain-8200aa270)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/btwitssparth)
[![Email](https://img.shields.io/badge/Email-parth.jainworks@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:parth.jainworks@gmail.com)

**Project Link:** [https://github.com/btwitssparth/lend-sphere](https://github.com/btwitssparth/lend-sphere)

---

<div align="center">

Made with ❤️ in Mumbai &nbsp;·&nbsp; Built to impress, designed to ship.

<br />

⭐ **If you found this project useful, please consider giving it a star!** ⭐

</div>
