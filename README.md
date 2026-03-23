<div align="center">

#  MDB RESTROCAFE

### *"Love at First Bite"*

A full-stack food ordering web app inspired by Swiggy & Zomato —
built with React, Node.js, Express, MongoDB & Cloudinary.

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-orange?style=for-the-badge)](https://mdb-restrocafe.onrender.com)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-Live-green?style=for-the-badge)](https://mdb-restrocafe-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛒 Cart Drawer | Swiggy-style slide-in cart |
| 🌙 Dark Mode | Full dark/light theme toggle |
| 📦 Order Tracking | Real-time 6-step live tracking (polls every 15s) |
| 🎟️ Coupons | Discount coupon system at checkout |
| 🖼️ Gallery | Photo gallery with lightbox viewer |
| 📊 Admin Dashboard | Charts, stats, order & menu management |
| ☁️ Image Upload | Cloudinary-powered image hosting |
| 🔐 Auth | JWT-based login & registration |
| 💀 Skeleton Loaders | Smooth loading states |
| 🎞️ Animations | Framer Motion page transitions |
| 📱 Responsive | Mobile-first design |

---

## 🛠️ Tech Stack

**Frontend**
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?logo=framer&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white)

**Backend**
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Upload-3448C5?logo=cloudinary&logoColor=white)

---

## 🌐 Live Demo

> 🔗 **App:** [https://mdb-restrocafe.onrender.com](https://mdb-restrocafe.onrender.com)
> 
> 🔗 **API:** [https://mdb-restrocafe-backend.onrender.com](https://mdb-restrocafe-backend.onrender.com)

**Demo Admin Login:**
```
Email:    admin@mdbrestrocafe.com
Password: admin123
```

> ⚠️ Hosted on Render free tier — first load may take ~30 seconds to wake up.

---

## 📁 Project Structure

```
mdb-restrocafe/
│
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary config
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   ├── couponController.js
│   │   ├── galleryController.js
│   │   └── riderController.js
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │   ├── Coupon.js
│   │   ├── Gallery.js
│   │   └── Rider.js
│   ├── routes/                 # Express routes
│   ├── seed.js                 # DB seeder (admin + sample menu)
│   └── server.js               # Entry point
│
└── frontend/
    └── src/
        ├── components/         # Navbar, CartDrawer, FoodCard, Skeletons
        ├── context/            # Auth, Cart, Theme contexts
        ├── hooks/              # Custom React hooks
        ├── pages/              # All route pages
        │   └── admin/          # Admin panel pages
        └── services/
            └── api.js          # Axios instance + cache layer
```

---

## 🌐 Pages

| Route | Page |
|---|---|
| `/` | Home — hero, categories, featured items |
| `/menu` | Full menu with search & filters |
| `/gallery` | Photo gallery with lightbox |
| `/checkout` | Cart checkout with coupon |
| `/orders` | User order history |
| `/orders/:id` | Live order tracking |
| `/login` | User login |
| `/register` | User registration |
| `/admin` | Admin dashboard with charts |
| `/admin/menu` | Add / edit / delete food items |
| `/admin/orders` | View & update order status |
| `/admin/gallery` | Upload & delete gallery images |
| `/admin/coupons` | Create & manage coupons |

---

## 🔑 API Reference

<details>
<summary><b>Auth</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

</details>

<details>
<summary><b>Foods</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/foods` | Get all foods (`?category=&search=&isVeg=`) |
| GET | `/api/foods/featured` | Get featured items |
| POST | `/api/foods` | Add food *(admin)* |
| PUT | `/api/foods/:id` | Update food *(admin)* |
| DELETE | `/api/foods/:id` | Delete food *(admin)* |
| PATCH | `/api/foods/:id/toggle` | Toggle availability *(admin)* |

</details>

<details>
<summary><b>Orders</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | User's orders |
| GET | `/api/orders/:id` | Single order |
| GET | `/api/orders/admin/all` | All orders *(admin)* |
| GET | `/api/orders/admin/stats` | Dashboard stats *(admin)* |
| PATCH | `/api/orders/:id/status` | Update status *(admin)* |

</details>

<details>
<summary><b>Gallery & Coupons</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/gallery` | Get all images |
| POST | `/api/gallery` | Upload image *(admin)* |
| DELETE | `/api/gallery/:id` | Delete image *(admin)* |
| POST | `/api/coupons/apply` | Apply coupon |
| GET | `/api/coupons` | List coupons *(admin)* |
| POST | `/api/coupons` | Create coupon *(admin)* |
| DELETE | `/api/coupons/:id` | Delete coupon *(admin)* |

</details>

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/Akash-18c/mdb-restrocafe.git
cd mdb-restrocafe
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mdb-restrocafe
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

```bash
node seed.js      # seed admin + sample menu
npm run dev       # start backend
```

### 3. Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start         # start frontend
```

- Frontend → http://localhost:3000
- Backend → http://localhost:5000

---

## ☁️ Deployment (Render)

| Service | Type | Root Dir | Build Command | Start Command |
|---|---|---|---|---|
| Backend | Web Service | `backend` | `npm install` | `npm start` |
| Frontend | Static Site | `frontend` | `npm install && npm run build` | — |

**Backend env vars on Render:** same as `.env` above + `FRONTEND_URL=https://your-frontend.onrender.com`

**Frontend env vars on Render:** `REACT_APP_API_URL=https://your-backend.onrender.com/api`

---

## 📄 License

MIT © 2026 MDB RestroCafe

---

<div align="center">
  Made with ❤️ and lots of 🍜
</div>
