# 🛒 E-Commerce Backend API

This project is a backend API for an e-commerce platform, built with **Node.js**, **Express**, **TypeScript**, and **Sequelize**. It supports user authentication, product and category management, order processing, and Stripe integration for payments.

---

## 📁 Project Structure

```
ecommerce-backend/
├── server.ts                   # Entry point
├── package.json
├── tsconfig.json
└── src/
    ├── config/                 # DB connection config
    ├── middleware/            # Auth middleware
    ├── models/                # Sequelize models
    ├── routes/                # API routes
    ├── types/                 # TypeScript types
    └── utils/                 # Helper functions
```

---

## 🧠 Features

- User Registration & Login with JWT
- Role-based authentication
- CRUD operations for:
  - Categories
  - Products
  - Orders & Order Items
- Email confirmation using Nodemailer
- Stripe Checkout & Webhook integration
- Sequelize ORM with MySQL

---

## 📬 API Endpoints (base path: `/api`)

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Users
- `GET /users` (admin)
- `GET /users/:id`
- `DELETE /users/:id`

### Products
- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

### Categories
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

### Orders
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`

### Checkout
- `POST /checkout/create-session`

### Webhooks
- `POST /webhooks` (for Stripe events)

---

## 🛠 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **MySQL** + **Sequelize**
- **JWT** for auth
- **Stripe** for payments
- **Nodemailer** for emails

---

## 📌 Scripts

| Script       | Description            |
|--------------|------------------------|
| `npm run dev`| Run with ts-node       |
| `npm run build` | Compile to JS      |
| `npm start`  | Run compiled server    |

---

## 👨‍💻 Author

- Alexsander Souza  
- [Portfolio](https://alexsandersportfolio.netlify.app/)  
- [GitHub](https://github.com/alesk1v9)
