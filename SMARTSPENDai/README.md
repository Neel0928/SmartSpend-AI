# SMARTSPENDai 🤖💸

SMARTSPENDai is an intelligent, AI-powered personal finance and budgeting application designed to help users track their spending, manage budgets, and achieve their financial goals. Built with a modern tech stack, it leverages Google's Gemini AI to provide actionable financial insights.

## ✨ Features

*   **Intelligent Dashboard:** Overview of your finances with visual charts and analytics.
*   **Transaction Management:** Easily add, categorize, and track your daily expenses and income.
*   **Budgeting & Goals:** Set monthly budgets and track your progress towards financial goals.
*   **AI Financial Insights:** Powered by **Google Gemini**, receive personalized recommendations, spending analysis, and actionable insights to improve your financial health.
*   **Secure Authentication:** User authentication powered by Firebase.
*   **Responsive UI:** A beautiful, responsive frontend built with React, Vite, and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React 19, Vite
*   **Styling:** Tailwind CSS 4
*   **Routing:** React Router v7
*   **Charts:** Recharts
*   **Icons:** Lucide React
*   **Authentication:** Firebase
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB & Mongoose
*   **AI Integration:** Google GenAI (Gemini)
*   **Authentication:** Firebase Admin SDK
*   **File Uploads:** Multer

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (Atlas or Local)
*   Firebase Account
*   Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/SMARTSPENDai.git
    cd SMARTSPENDai
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory (use `.env.example` as a reference).
    *   Add your MongoDB connection string, Firebase Admin credentials, and Gemini API key.
    *   Start the development server:
        ```bash
        npm run dev
        ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```
    *   Create a `.env` file in the `frontend` directory.
    *   Add your Firebase client config variables.
    *   Start the Vite development server:
        ```bash
        npm run dev
        ```

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
