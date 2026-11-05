# KRIYETA â€” Jewellery Pawn (Girvi) Management System

A beginner-friendly MERN stack skeleton to manage jewellery loan records.

---

## Folder Structure

```
KRIYETA/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ db.js             â† MongoDB connection
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ Customer.js       â† Customer schema
â”‚   â”‚   â””â”€â”€ Loan.js           â† Loan schema
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ customerController.js
â”‚   â”‚   â””â”€â”€ loanController.js
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ customerRoutes.js
â”‚   â”‚   â””â”€â”€ loanRoutes.js
â”‚   â”œâ”€â”€ .env                  â† Environment variables
â”‚   â”œâ”€â”€ server.js             â† Express entry point
â”‚   â””â”€â”€ package.json
â”‚
â””â”€â”€ frontend/
    â”œâ”€â”€ src/
    â”‚   â”œâ”€â”€ pages/
    â”‚   â”‚   â”œâ”€â”€ AddLoan.jsx   â† Form to add a loan
    â”‚   â”‚   â””â”€â”€ LoanList.jsx  â† Table showing all loans
    â”‚   â”œâ”€â”€ App.jsx           â† Root component + navigation
    â”‚   â””â”€â”€ main.jsx          â† React entry point
    â”œâ”€â”€ index.html
    â”œâ”€â”€ vite.config.js
    â””â”€â”€ package.json
```

---

## Setup & Running

### Step 1 â€” Backend

```bash
cd backend
npm install
npm run dev    # uses nodemon for auto-restart
```

> Make sure MongoDB is running locally, or update `MONGO_URI` in `.env` with your Atlas connection string.

### Step 2 â€” Frontend

```bash
cd frontend
npm install
npm run dev    # starts Vite dev server on http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| POST   | /api/customers   | Create a new customer |
| POST   | /api/loans       | Create a new loan     |
| GET    | /api/loans       | Get all loans         |

---

## What to Build Next (Step by Step)

1. **Customer dropdown** â€” Replace the Customer ID text field with a `<select>` that auto-loads from `GET /api/customers`
2. **Interest calculator** â€” Add a function: `interest = (amount Ã— interestRate Ã— months) / 100`
3. **Image upload** â€” Add `multer` to the backend and `<input type="file">` to the form
4. **Close loan** â€” Add a `PATCH /api/loans/:id` endpoint to update status to `"closed"`
5. **SMS alerts** â€” Integrate Twilio or Fast2SMS for payment reminders
6. **Deployment** â€” Deploy backend to Render, frontend to Vercel, DB to MongoDB Atlas

## Clerk authentication setup

The frontend uses ClerkJS. Configure `CLERK_PUBLISHABLE_KEY` in `backend/.env` (see `backend/.env.example`). The frontend retrieves this public key from `/api/config/clerk`. The Express API verifies Clerk session tokens with `@clerk/express`.

Add the Secret Key from the same Clerk application to `backend/.env`:

```ini
CLERK_SECRET_KEY=sk_test_...
```

Keep the Secret Key private and never put it in frontend files. In Clerk, allow the Vite frontend origin, usually `http://localhost:5173`. Start backend and frontend in separate terminals with `npm run dev` in each folder.

The old `/api/auth/login` and `/api/auth/register` endpoints remain available, but the frontend login now uses Clerk. Customer and loan endpoints require a valid Clerk session.

