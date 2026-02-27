# Smart Lighting Dashboard

A full-stack smart lighting monitoring and control dashboard built using **React**, **Node.js**, **Express**, and **MySQL**.

This project simulates IoT lighting sensors, stores readings in a database, and displays real-time status in a web dashboard.

---

## Features

- Simulated sensor data (brightness, motion, power state)
- MySQL database for persistent storage
- REST API built with Node.js and Express
- React dashboard with auto-refresh
- Latest room status cards
- Manual ON/OFF control per room
- End-to-end data flow (UI → API → DB → UI)

---

## Tech Stack

**Frontend**
- React (Vite)
- Axios

**Backend**
- Node.js
- Express
- MySQL
- mysql2

**Database**
- MySQL

---

## System Architecture

1. Backend simulates sensor readings and stores them in MySQL
2. REST API exposes endpoints to read and control data
3. React frontend fetches data from API
4. Dashboard auto-refreshes every few seconds

---

## API Endpoints

- `GET /api/health` – backend health check
- `GET /api/rooms` – list of rooms
- `POST /api/simulate` – generate simulated sensor readings
- `GET /api/readings` – recent sensor readings
- `GET /api/readings/latest` – latest reading per room
- `POST /api/rooms/:id/toggle` – toggle light ON/OFF

---

## How to Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
---

## Why This Project

Built to demonstrate:

- Full-stack development skills
- API design and database integration
- Real-time style dashboards
- Clean project structure
- Ability to explain system architecture clearly

---

## Author

Built by **Duggineni Srujana**
