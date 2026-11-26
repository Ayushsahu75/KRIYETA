# KRIYETA

**Jewellery Pawn (Girvi) Management System**

KRIYETA is a web app for jewellery businesses to manage customers, gold-backed loan records, pledged items, interest estimates, and settlements from one dashboard. It is being actively developed, with AI-assisted workflows and additional business features planned.

> **Project status:** Core customer and loan workflows are in progress. Items in the roadmap are planned and are not represented as current features.

## What it does

- View a dashboard with loan totals, active/settled counts, and estimated interest.
- Register and browse customers.
- Create loan records with jewellery type, weight, purity, loan terms, and an optional photo.
- Browse loan records by customer. Records with the same normalized name or phone number are grouped together; selecting a customer shows their loan cards.
- See each loan's start date, principal, monthly interest rate, current interest estimate, and total payable.
- Settle and close an active loan while recording the amount received.
- Sign in with email and password or Google OAuth.

Interest shown in the app is an estimate calculated from the loan amount, monthly rate, and elapsed time. Confirm settlement amounts with the customer before closing a loan.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Lucide React |
| Authentication UI | Google OAuth (`@react-oauth/google`) |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication/API protection | JWT and bcrypt |
| Jewellery photo upload | Multer; files are stored locally during development |

## Repository structure

```text
KRIYETA/
├── backend/
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Auth, customer, and loan logic
│   ├── middleware/          # JWT protection and image upload
│   ├── models/              # User, Customer, and Loan schemas
│   ├── routes/              # Express API routes
│   ├── uploads/             # Locally uploaded images
│   ├── server.js            # Express entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Shared UI and protected-route components
    │   ├── pages/           # Dashboard, loans, customers, and auth screens
    │   ├── App.jsx          # App layout and routes
    │   ├── main.jsx         # React entry point
    │   └── styles.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Run locally

### Requirements

- Node.js and npm
- A MongoDB database, either local or MongoDB Atlas
- A Google OAuth client ID for Google sign-in

### 1. Configure the backend

Copy `backend/.env.example` to `backend/.env` and set your values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Install dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:5000` by default.

### 2. Start the frontend

There is no separate frontend environment file. Vite reads `VITE_GOOGLE_CLIENT_ID` from `backend/.env`; set it to the same Google OAuth client ID as `GOOGLE_CLIENT_ID`. Vite only exposes variables prefixed with `VITE_` to browser code, so keep secrets such as `JWT_SECRET` unprefixed. Add `http://localhost:3000` as an authorized JavaScript origin in the Google Cloud OAuth client settings.

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

Never commit `.env` files, passwords, OAuth secrets, or production credentials. The frontend currently calls the local API at `http://localhost:5000`; configure a production API URL and the backend's allowed CORS origins before deploying.

## API overview

Customer and loan routes require a bearer token. Authentication routes are public.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register with email and password |
| POST | `/api/auth/login` | Sign in with email and password |
| POST | `/api/auth/google` | Sign in with a Google credential |
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create a customer |
| PUT | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer, if allowed |
| GET | `/api/loans` | List loans with current interest estimates |
| GET | `/api/loans/stats` | Get dashboard loan statistics |
| POST | `/api/loans` | Create a loan; accepts multipart form data and an optional `image` |
| PUT | `/api/loans/:id/close` | Close a loan; accepts `paidAmount` in JSON |

## Roadmap

KRIYETA is expected to grow beyond the current customer and loan workflows. Planned work includes:

- **AI-assisted record search:** ask questions in natural language to find relevant customer or loan records.
- **AI summaries and insights:** summarize portfolio activity and highlight records that may need attention.
- **Document assistance:** explore OCR to extract details from uploaded documents, with a person reviewing and confirming extracted data before it is saved.
- **Business features:** printable loan receipts, reports and exports, payment reminders, audit history, and staff roles.
- **Mobile access:** improve the responsive experience and explore an installable PWA.
- **Production readiness:** configurable API URLs, hosted image storage, database backups, and deployment documentation.

AI features are future plans, not currently available. Any future AI workflow should respect customer-data privacy and keep important financial actions under human review.

## Deployment notes

The app is currently configured for local development. A production setup will need a hosted MongoDB database, an HTTPS backend, a frontend configured with the deployed API URL, appropriate CORS settings, and persistent/object storage for uploaded images. Do not rely on the local `backend/uploads` directory for production file storage.
