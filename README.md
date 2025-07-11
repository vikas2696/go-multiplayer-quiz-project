# 🚀 The Surface Quiz – Multiplayer Quiz Web App

**The Surface Quiz** is a real-time multiplayer quiz application designed for fun and fast learning. Built with a **Golang backend** and a **React frontend**, it supports multiple users playing in quiz rooms simultaneously, thanks to WebSocket-powered real-time communication.

---

## 🌐 Live Demo

- **Frontend (GitHub Pages):** [https://vikas2696.github.io/go-multiplayer-quiz-project].
- **Backend (Railway):** Hosted on [Railway.app](https://railway.app)

---

## 🧠 Key Features

- 🔐 User Sign-Up and Login with token-based authentication
- 🧑‍🤝‍🧑 Join and create multiplayer quiz rooms
- 🔄 Real-time communication using **WebSockets**
- 📊 PostgreSQL database for user and quiz data
- 🔁 Backend hosted on **Railway**, frontend on **GitHub Pages**

---

## ⚙️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React, Material UI, Framer Motion |
| Backend   | Go (Golang), Gin, WebSockets |
| Database  | PostgreSQL |
| Hosting   | Railway (backend), GitHub Pages (frontend) |

---

## 🛠 Backend Architecture

The Go backend is responsible for:

- Managing user accounts and sessions
- Creating and managing quiz rooms
- Maintaining real-time communication using WebSockets
- Persisting data with PostgreSQL
- Secure and fast API endpoints for all frontend interactions

### WebSocket Flow:

- When users join a quiz room, a WebSocket connection is established.
- Questions and answers are synced in real-time across all users in the room.
- Room state (joined users, scores, etc.) is handled server-side.

---
