# Mahalaxmi Lawn and Garden (महालक्ष्मी लॉन ॲण्ड गार्डन)

A full-stack web application and business management portal for **Mahalaxmi Lawn and Garden**, providing professional landscaping, lawn maintenance, drip irrigation, and plant nursery services.

---

## 🌿 Features

- **Public Portfolio & Landing Page**:
  - Showcases services (Lawn Maintenance, Landscape Design, Soil Analysis, Drip Irrigation, etc.).
  - Before & After transformations gallery with interactive lightbox.
  - Video showcase with YouTube modal playback.
  - Responsive design with smooth animations powered by AOS.
- **Bilingual Internationalization (i18n)**:
  - Instant runtime language toggle between **Marathi (मराठी)** and **English**.
  - Built natively with reactive Angular Signals without page reloads.
- **Lead Capture & WhatsApp Integration**:
  - Customer inquiries are saved directly to MongoDB.
  - Generates pre-formatted WhatsApp chat links (`wa.me`) directly to the business owner.
  - Floating WhatsApp and quick-inquiry contact triggers.
- **Admin Dashboard**:
  - Secure JWT authentication with route guards.
  - Real-time customer inquiry status management (`Pending` -> `Reviewed` -> `Contacted`).
  - Image gallery management: Upload Before & After transformations and single showcase photos directly to Cloudinary.
  - Site visitor analytics tracking (Total all-time visits and today's visits).
  - Dynamic settings management (e.g. YouTube promo video link).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 21 (Standalone Components, Signals, Modern Control Flow)
- **Styling**: Modern CSS3 Custom Properties, Neumorphic Cards, AOS (Animate on Scroll)
- **Routing**: Angular Router with anchor scrolling and scroll restoration
- **Notifications**: `ng-angular-popup`

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB Atlas with Mongoose ODM
- **Media Storage**: Cloudinary with Multer Storage
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Security**: CORS origin controls, file upload restrictions

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas connection URI
- Cloudinary account credentials

---

### 1. Backend Setup

1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:4200

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

---

## 📁 Project Structure

```
MahalaxmiLawnAndGarden/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Route logic (Auth, Inquiry, Stats)
│   │   ├── middleware/      # JWT protection & Cloudinary uploads
│   │   ├── models/          # Schemas (Admin, Gallery, Inquiry, Settings, Visit)
│   │   ├── routes/          # Express API route endpoints
│   │   └── app.js           # Server entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Home, Gallery, Admin, Login, Modals
    │   │   ├── guards/      # Auth guard for Admin portal
    │   │   ├── services/    # API, Auth, Modal, Translation
    │   │   └── app.routes.ts# Angular client routes
    │   ├── environments/    # Environment configurations
    │   └── styles.css       # Global design tokens
    └── angular.json
```

---

## 🔒 License
This project is proprietary and built for Mahalaxmi Lawn & Garden. All rights reserved.

