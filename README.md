# SMARTSPENDai 🤖💸

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Website-success?style=for-the-badge&logo=netlify)](https://smartspend-ai-finance.netlify.app)
[![Backend](https://img.shields.io/badge/API-Render-informational?style=for-the-badge&logo=render)](https://smartspend-ai-1.onrender.com)

SMARTSPENDai is an intelligent, AI-powered personal finance and budgeting application designed to help users track their spending, manage budgets, and achieve their financial goals. Built with a modern full-stack architecture, it leverages **Google's Gemini AI** to provide actionable, personalized financial insights.

## ✨ Features

*   **Intelligent Dashboard:** Comprehensive overview of your finances with dynamic visual charts and analytics.
*   **Transaction Management:** Easily add, categorize, and track your daily expenses and income.
*   **Budgeting & Goals:** Set monthly budgets and track your progress towards financial goals.
*   **AI Financial Insights:** Powered by **Google Gemini**, receive personalized recommendations, spending analysis, and actionable insights to improve your financial health.
*   **Secure Authentication:** User authentication and Google Sign-In powered by Firebase.
*   **Responsive UI:** A beautiful, responsive frontend built with React, Vite, and Tailwind CSS.

## 🚀 Live Demo

The application is fully deployed and live!

*   **Frontend (Netlify):** [https://smartspend-ai-finance.netlify.app](https://smartspend-ai-finance.netlify.app)
*   **Backend API (Render):** [https://smartspend-ai-1.onrender.com](https://smartspend-ai-1.onrender.com)

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React 19, Vite
*   **Styling:** Tailwind CSS 4
*   **Routing:** React Router v7
*   **Charts:** Recharts
*   **Authentication:** Firebase Auth

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB & Mongoose
*   **AI Integration:** Google GenAI (Gemini)
*   **Authentication:** Firebase Admin SDK

## ⚙️ Local Development Setup

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (Atlas or Local)
*   Firebase Account
*   Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Neel0928/SmartSpend-AI.git
cd SmartSpend-AI
```

### 2. Backend Setup
```bash
cd backend
npm install
```
*   Create a `.env` file in the `backend` directory using `.env.example` as a template.
*   Add your `MONGODB_URI`, `FIREBASE_SERVICE_ACCOUNT` (JSON string), and `GEMINI_API_KEY`.
*   Start the development server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
*   Create a `.env` file in the `frontend` directory using `.env.example` as a template.
*   Add your Firebase client config variables (`VITE_FIREBASE_API_KEY`, etc.).
*   Start the Vite development server:
    ```bash
    npm run dev
    ```

## 🌍 Deployment Guide

This project is configured for cloud deployment:
1. **Database:** MongoDB Atlas
2. **Backend:** Render (Web Service). Requires all backend `.env` variables.
3. **Frontend:** Netlify. Requires `VITE_API_URL` pointing to the Render backend, plus all Firebase client keys.

## 📂 Project Structure

```text
SMARTSPENDai/
├── backend/               # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers (AI, Analytics, Budget, Goals, etc.)
│   │   ├── models/        # Mongoose database models
│   │   ├── routes/        # Express API routes
│   │   ├── services/      # Business logic & AI integration (Gemini Service)
│   │   └── server.js      # Entry point
│   └── package.json
└── frontend/              # React + Vite frontend
    ├── src/               # React components, pages, and hooks
    ├── public/            # Static assets
    ├── vite.config.js     # Vite configuration
    └── package.json
```

## 📝 License

This project is licensed under the ISC License.
