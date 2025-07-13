# ShopOne

ShopOne is a Node.js-based e-commerce backend API built with Express and MongoDB. It provides endpoints for user authentication, product and category management, cart operations, order processing, and PayPal payment integration. The project uses JWT for authentication and supports admin/user roles.

---

## Features

- **User Authentication:** Register and login endpoints with JWT-based authentication.
- **Product Management:** Add, update, delete, and list products (admin only).
- **Category Management:** Add, update, and delete categories (admin only).
- **Cart Operations:** Add to cart, view cart, remove items, and clear cart (authenticated users).
- **Order Processing:** Checkout and order management for users.
- **PayPal Integration:** Initiate and process payments using PayPal.
- **Admin Panel:** Admin endpoints for managing users and products.
- **File Uploads:** Supports product image uploads using Multer.
- **Validation:** Uses Joi for request validation.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT
- **Payments:** PayPal REST SDK
- **File Uploads:** Multer
- **Validation:** Joi

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)
- PayPal developer account (for API credentials)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd shopOne
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**

   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and provide the following variables:

   ```env
   DATABASE_URL=<your-mongodb-connection-string>
   PAYPAL_MODE=sandbox
   PAYPAL_CLIENT_ID=<your-paypal-client-id>
   PAYPAL_CLIENT_SECRET=<your-paypal-client-secret>
   JWT_SECRET=<your-jwt-secret>
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` by default.

---

## Important API Endpoints

### Auth

- `POST /api/register` — Register a new user
- `POST /api/login` — Login and receive JWT

### Products (Admin)

- `POST /api/product/add` — Add product
- `GET /api/product-list` — List all products

### Cart (User)

- `POST /api/add-to-cart` — Add item to cart
- `GET /api/cart-list` — View cart

### Orders & Payments

- `POST /api/pay` — Initiate PayPal payment
- `GET /api/payment/cancel` — Handle payment cancellation

### Admin

- `GET /api/admin/users` — List all users

---

## Folder Structure

```
src/
  config/         # Database and PayPal configuration
  controllers/    # Route handlers
  middleware/     # Auth and upload middleware
  models/         # Mongoose models
  routes/         # API route definitions
  services/       # Business logic (e.g., PayPal)
  utils/          # Helper functions
  validations/    # Joi validation schemas
  server.js       # Entry point
```

---

## License

This project is licensed under the ISC License. 