# Expense Tracker

A simple full-stack Expense Tracker application built using the MERN stack.

## Features

- Add new expenses
- View all expenses
- Edit expenses
- Delete expenses
- Select expense category
- Calculate total expenses
- Responsive UI
- Glassmorphism design
- Hover effects

## Tech Stack

### Frontend

- React
- Tailwind CSS
- Axios
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create expense |
| GET | `/api/expenses` | Get all expenses |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

## Project Structure

```text
expense-tracker
├── backend
│   ├── models
│   ├── routes
│   ├── db.js
│   └── server.js
│
├── frontend
│   └── src
│
├── .gitignore
├── package.json
└── README.md

How to Run
Backend
cd backend
npm install
node server.js

Backend runs on:
http://localhost:5000

Frontend
Open another terminal:
cd frontend
npm install
npm run dev