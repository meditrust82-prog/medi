# Meditrust Nepal

Full-stack medical equipment eCommerce platform.

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js + Express + MongoDB (Mongoose) |
| Frontend | Vite + React 18 + Tailwind CSS + React Router |
| Images | Cloudinary (no local storage) |
| Auth | JWT via httpOnly cookies + refresh tokens |
| Payments | Khalti webhook integration |
| Deploy | Railway (backend) + Vercel (frontend) |

## Folder Structure

```
meditrust-nepal/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app setup
│   │   ├── server.js               # Entry point
│   │   ├── config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── validateEnv.js      # Env validation
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   └── RefreshToken.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── order.controller.js
│   │   │   └── webhook.controller.js
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx                # Vite entry point
│   │   ├── App.jsx                 # Routes & layout
│   │   ├── api.js                  # Axios client (httpOnly cookies)
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── CompareContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── WhatsAppContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
└── package.json
```

## Local Setup

### 1. Install dependencies
```bash
# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure backend
```bash
cp backend/.env.example backend/.env
# Fill in:
# - MONGO_URI=mongodb+srv://...
# - JWT_SECRET=your-secret-key
# - CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET
# - KHALTI_SECRET_KEY
# - ALLOWED_ORIGINS=http://localhost:5000,https://yourdomain.com
```

### 3. Configure frontend
```bash
cp frontend/.env.example frontend/.env
# Set VITE_API_URL=http://localhost:5050/api/v1
```

### 4. Run backend (port 5050)
```bash
cd backend
npm run dev
# or: npm start (production)
```

### 5. Run frontend (port 5000) in another terminal
```bash
cd frontend
npm run dev
# Visit http://localhost:5000
```

## Deployment

### Backend → Railway
1. Create Railway project → Connect GitHub repo → Select root directory: `backend/`
2. Railway detects Node.js, sets `PORT=5050` automatically
3. Set environment variables:
   - `MONGO_URI` — MongoDB Atlas connection
   - `JWT_SECRET` — Secure random string
   - `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
   - `KHALTI_SECRET_KEY` — Khalti API key
   - `ALLOWED_ORIGINS` — Comma-separated: `https://yourdomain.com`
4. Railway auto-deploys on git push

### Frontend → Vercel
1. New Project → Import Git repository → Root directory: `frontend/`
2. Vercel auto-detects Vite + React
3. Set environment variable:
   - `VITE_API_URL=https://your-backend-on-railway.up.railway.app/api/v1`
4. Deploy → Auto-redeploys on git push
5. `vercel.json` handles SPA fallback routing

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/products` | — | List products |
| GET | `/api/products/:slug` | — | Product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/orders` | JWT | Place order |
| GET | `/api/orders/my` | JWT | My orders |
| GET | `/api/orders/:id` | JWT | Order detail |
| GET | `/api/orders` | Admin | All orders |
| PATCH | `/api/orders/:id/status` | Admin | Update status |
