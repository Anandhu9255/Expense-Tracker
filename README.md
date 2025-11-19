Server runs at http://localhost:5000 (or PORT).

### Authentication

### Register — POST /api/auth/register

Headers: Content-Type: application/json

### Example 1 — normal user

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

### Example 2 — another user

{
  "name": "Asha Nair",
  "email": "asha@example.com",
  "password": "StrongP@ssw0rd"
}


### Example 3 — quick test account

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test1234"
}

### Login — POST /api/auth/login

Headers: Content-Type: application/json
Body examples:

### Example 1

{
  "email": "john@example.com",
  "password": "password123"
}


### Example 2

{
  "email": "asha@example.com",
  "password": "StrongP@ssw0rd"
}


### Example 3 (invalid password — expected 401)

{
  "email": "john@example.com",
  "password": "wrongpassword"
}


Response (successful):

{
  "token": "<JWT_TOKEN>",
  "user": { "_id": "690ecbdbc02d1151c7ac6b74", "name": "John Doe", "email": "john@example.com" }
}


### Create Expense — POST /api/expenses

Headers: Content-Type: application/json, Authorization: Bearer <token>
Body examples:

### Example 1 — Food (single-day)

{
  "title": "Lunch",
  "amount": 15.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2025-11-01T12:00:00.000Z"
}

### Example 2 — Transport

{
  "title": "Bus Ticket",
  "amount": 2.50,
  "category": "Transportation",
  "description": "Bus fare home",
  "date": "2025-11-06T18:00:00.000Z"
}

### Example 3 — Rent (monthly)

{
  "title": "Monthly Rent",
  "amount": 450.00,
  "category": "Bills",
  "description": "Apartment rent for November",
  "date": "2025-11-01T00:00:00.000Z"
}

### Example 4 — Entertainment

{
  "title": "Movie Night",
  "amount": 12.00,
  "category": "Entertainment",
  "description": "Cinema ticket",
  "date": "2025-11-03T21:00:00.000Z"
}

### Get All Expenses — GET /api/expenses

Headers: Authorization: Bearer <token>
Examples:

Fetch all (no query)
### GET http://localhost:5000/api/expenses

Optional pagination/filter (if implemented):
### GET http://localhost:5000/api/expenses?page=1&limit=20

Response: array of expense objects.

### Get Single Expense — GET /api/expenses/:id

Headers: Authorization: Bearer <token>
Example:

### GET http://localhost:5000/api/expenses/690eceaeb253023f8ddc164f


Response: expense object or 404.

### Update Expense — PUT /api/expenses/:id

Headers: Content-Type: application/json, Authorization: Bearer <token>
Body examples (partial updates allowed):

## Example 1 — change amount

{
  "amount": 20.00
}

## Example 2 — update title & description

{
  "title": "Updated Lunch",
  "description": "Veg thali instead"
}

## Example 3 — change category

{
  "category": "Food"
}

## Example request:

### PUT http://localhost:5000/api/expenses/690eceaeb253023f8ddc164f

Response: updated expense object.

### Delete Expense — DELETE /api/expenses/:id

Headers: Authorization: Bearer <token>
Example:

### DELETE http://localhost:5000/api/expenses/690eceaeb253023f8ddc164f

### Expense Summary (monthly grouped) — GET /api/expenses/summary/:userId

## Example request:

### GET http://localhost:5000/api/expenses/summary/690ecbdbc02d1151c7ac6b74

### Example response:

{
  "userId": "690ecbdbc02d1151c7ac6b74",
  "total": 780.25,
  "monthlySummary": [
    {
      "month": "2025-10",
      "total": 450.50,
      "categories": { "Food": 250.00, "Transportation": 100.00, "Entertainment": 100.50 },
      "suggestion": "You're spending over 55.4% on Food. Try reducing it by 15% to save more."
    },
    {
      "month": "2025-11",
      "total": 329.75,
      "categories": { "Food": 200.00, "Bills": 79.75, "Transportation": 50.00 },
      "suggestion": "Good month — spending looks balanced."
    }
  ],
  "topCategory": "Food",
  "overallSuggestion": "Consider tracking small food expenses — they add up quickly!"
}

### GET /api/expenses/filter

This endpoint always uses the logged-in user (from JWT). It supports optional query params:

category — e.g. Food

minAmount — number

maxAmount — number

search — text (matches title or description, case-insensitive)

## Supported categories 
Food
Transportation
Entertainment
Bills
Shopping
Healthcare
Education
Other

## Project Structure
src/
├── config/
│   └── db.ts
├── controllers/
│   ├── authController.ts
│   ├── expenseController.ts
│   └── expenseSummaryController.ts
├── middleware/
│   ├── authMiddleware.ts
│   └── errorHandler.ts
├── models/
│   ├── userModel.ts
│   └── expenseModel.ts
├── routes/
│   ├── authRoutes.ts
│   └── expenseRoutes.ts
├── utils/
│   └── generateToken.ts
├── app.ts
└── server.ts
