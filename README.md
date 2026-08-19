# ☕ Brew & Bean

Brew & Bean is a full-stack coffee shop management web application that allows customers to browse the menu, manage their cart, place orders, make table reservations, and manage their accounts.

The project was built to demonstrate frontend, backend, REST API, database, and authentication concepts in a practical application.

## 🚀 Features

- User registration and login
- Password hashing and secure authentication flow
- Coffee menu browsing
- Add items to cart
- Increase, decrease, and remove cart items
- Checkout and order placement
- Payment at counter using cash or card
- Table number and special instructions for orders
- Order history
- Table reservations
- Automatic customer detail autofill for logged-in users
- Profile dropdown with user information
- Logout functionality
- PostgreSQL database integration
- RESTful APIs using Node.js and Express

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST APIs
- CORS

### Database
- PostgreSQL

### Development Tools
- Git
- GitHub
- VS Code

## 🔗 Project Links

**Live Demo:** 
https://brew-and-bean-1.onrender.com

**GitHub Repository:**  
https://github.com/YOUR-USERNAME/brew-and-bean

## 📡 REST API

The application uses RESTful APIs to communicate between the frontend, backend, and PostgreSQL database.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate a user |
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders/:userId` | Retrieve a user's orders |
| POST | `/api/reservations` | Create a table reservation |

## 🗄️ Database

PostgreSQL is used to store application data including:

- User accounts
- Orders
- Order items
- Reservations

The backend uses parameterized SQL queries for database operations.

## 🔐 Authentication

Users can create an account and log in using their email and password.

After successful login, the application stores the logged-in user's basic information locally and uses the user ID when communicating with backend APIs.

## 📂 Project Structure

```text
brew-and-bean/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── index.html
├── menu.html
├── cart.html
├── checkout.html
├── orders.html
├── reservations.html
├── login.html
├── register.html
│
├── script.js
├── style.css
│
└── images/
