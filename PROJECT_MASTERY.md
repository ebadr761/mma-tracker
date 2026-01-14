# MMA Tracker: Project Mastery Guide 🥊

This document is a comprehensive guide to understanding your **FightMetrics (MMA Tracker)** project. It breaks down *what* the system does, *how* it works under the hood, and *why* specific technologies were chosen. Use this to master your understanding of the codebase.

---

## 1. The Core Problem & Solution

**The Problem**: Combat sports athletes typically log training using generic notes (e.g., "Boxing - 1 hour"). This lacks data. It doesn't tell you if you're neglecting grappling, overtraining, or ready to peak for a fight.

**The Solution**: An "Intelligent Training Companion" that turns raw logs into actionable insights using Machine Learning.
- **You Input**: "90 mins of BJJ, Intensity 8/10".
- **System Outputs**: "You are at high risk of injury (ACWR > 1.5)" or "You haven't trained Striking in 2 weeks."

---

## 2. Technical Architecture (The "How")

The project uses a **Monorepo** structure, meaning both the Frontend and Backend live in the same repository but operate as distinct applications.

### 🧠 Backend (The Brain)
**Location**: `/backend-python`
**Stack**: Python 3.12, FastAPI, MongoDB

The backend is an API. It receives data from the frontend, processes it, and saves it.
- **FastAPI**: The web framework. It's "Async", meaning it can handle many requests at once without waiting for one to finish (high performance).
- **The ML Engine (`/app/ml/engine.py`)**: This is the secret sauce.
    - **Weakness Detection**: Uses **K-Means Clustering** (unsupervised learning) to group your training sessions. If one cluster (e.g., "Grappling") is empty, it alerts you.
    - **Burnout Prediction**: Uses **ACWR (Acute:Chronic Workload Ratio)**. It calculates a rolling average of your "Acute" load (last 7 days) vs "Chronic" load (last 28 days).
        - **Math**: `Load = Duration * Intensity`.
        - **Risk**: If `Acute / Chronic > 1.5`, injury risk spikes.

### 💻 Frontend (The Face)
**Location**: `/src`
**Stack**: React 18, TypeScript, Vite, TailwindCSS

The frontend is a Single Page Application (SPA). It runs in the user's browser.
- **Vite**: The build tool. It replaces the older "Create React App". It's extremely fast and supports modern features like "Hot Module Replacement" (instant updates when you save code).
- **TypeScript**: Adds "types" to JavaScript. Instead of just passing `data`, you pass `TrainingSession`. This prevents bugs like trying to multiply a text string.
- **Component Architecture**: The UI is built of small, reusable Lego blocks (Components).
    - `Dashboard.tsx`: The main container.
    - `StatsOverview.tsx`: The top row of cards (Total Hours, etc.).
    - `WorkoutCharts.tsx`: The graphs.
    - `InsightsWidget.tsx`: The AI suggestions box.

### ☁️ Infrastructure (The Glue)
**Tools**: Docker, GitHub Actions

- **Docker**: Packages your app into "Containers". A container has everything the app needs to run (Python, Node, libraries). This guarantees it runs the same on your laptop as it does on a server.
- **CI/CD (`.github/workflows`)**: An automation bot. Every time you push code to GitHub:
    1.  It spins up a virtual machine.
    2.  It installs dependencies.
    3.  It runs your tests (`npm test` and `pytest`).
    4.  If anything fails, it blocks the merge, preventing you from breaking the app.

---

## 3. Key Concepts to Remember

| Concept | Explanation | Where it lives |
| :--- | :--- | :--- |
| **API Endpoint** | A specific URL (e.g., `/api/workouts`) that performs an action (Get, Post). | `backend-python/app/routes/` |
| **Pydantic Model** | A blueprint that defines what data looks like. Ensures valid data enters the DB. | `backend-python/app/models/` |
| **Hook (React)** | A special function (e.g., `useState`, `useEffect`) that lets components "remember" things or fetch data. | `src/components/` |
| **State** | Data that changes over time (e.g., the list of workouts). When state changes, React updates the screen. | `src/components/Dashboard.tsx` |

---

## 4. Why This Stack?

- **Python** was chosen for the Backend because it matches the Machine Learning ecosystem (Scikit-Learn).
- **React/TypeScript** was chosen for the Frontend for its massive ecosystem and type safety.
- **FastAPI** bridges the gap, offering the speed of Go/Node.js with the simplicity of Python.

This project demonstrates **Full-Stack Competency**: it's not just a UI; it's an intelligent data pipeline.
